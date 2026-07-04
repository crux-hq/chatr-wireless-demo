import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../lib/mock/plan-details.ts');

const PLAN_CODE_TO_ID = {
  '5157': '1gb',
  '5158': '25gb',
  '5173': '35gb',
  '5178': '80gb',
  '4014': '40gb',
  '5156': 'talk-text-basic',
  '618': '400min',
};

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

function extractPlans(html) {
  const m = html.match(/<script[^>]*type="application\/json"[^>]*>(.*?)<\/script>/s);
  if (!m) throw new Error('no json');
  let json = m[1];
  if (json.charCodeAt(0) === 0xfeff) json = json.slice(1);
  const data = JSON.parse(json);
  for (const key of Object.keys(data)) {
    if (key.startsWith('ts_') && Array.isArray(data[key]) && data[key][0]?.plans) {
      return data[key];
    }
  }
  throw new Error('no plans in page');
}

function stripMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanPromo(text) {
  if (!text) return undefined;
  const cleaned = stripMarkdown(text);
  if (!cleaned || cleaned === 'null' || cleaned.includes('null')) return undefined;
  if (/offer valid|offre valide|jusqu'au|until \w+ \d/i.test(cleaned)) return cleaned;
  return undefined;
}

function findPlan(categories, code) {
  return categories.flatMap((c) => c.plans).find((p) => p.planCode === code);
}

const enCategories = extractPlans(await fetch('https://www.chatrwireless.com/plans'));
const frCategories = extractPlans(await fetch('https://www.chatrwireless.com/fr/forfaits'));

const records = {};

for (const [code, id] of Object.entries(PLAN_CODE_TO_ID)) {
  const enPlan = findPlan(enCategories, code);
  const frPlan = findPlan(frCategories, code);
  if (!enPlan) continue;

  const details = enPlan.details.map((item, index) => ({
    titleEn: item.title.trim(),
    titleFr: frPlan?.details[index]?.title.trim() ?? item.title.trim(),
    textEn: stripMarkdown(item.text),
    textFr: stripMarkdown(frPlan?.details[index]?.text ?? item.text),
  }));

  records[id] = {
    details,
    promoEn: cleanPromo(enPlan.planMainFeature2Text),
    promoFr: cleanPromo(frPlan?.planMainFeature2Text),
  };
}

// Align 1 GB demo plan copy with advertised total data.
if (records['1gb']) {
  const dataItem = records['1gb'].details.find((d) => d.titleEn.toLowerCase().includes('data'));
  if (dataItem) {
    dataItem.titleEn = '1 GB of data at 4G speeds';
    dataItem.titleFr = '1 Go de données à une vitesse de 4 G';
    dataItem.textEn =
      'Get 1 GB of data at 4G speeds up to 150Mbps. Usage follows the Data Management Policy. After using up your data allowance, you can still use data at a slower speed until your next anniversary date.';
    dataItem.textFr =
      "Obtenez 1 Go de données à une vitesse de 4 G pouvant atteindre 150 Mbps. L'utilisation est assujettie à la Politique de gestion des données. Après avoir utilisé toutes les données de votre forfait, vous pouvez continuer à utiliser des données à une vitesse réduite jusqu'à votre prochaine date anniversaire.";
  }
}

if (records['40gb']) {
  const dataItem = records['40gb'].details.find((d) => d.titleEn.toLowerCase().includes('40gb'));
  if (dataItem) {
    dataItem.textFr =
      "Obtenez 40 Go de données à une vitesse de 4 G pouvant atteindre 150 Mbps. L'utilisation est assujettie à la Politique de gestion des données. Après avoir utilisé toutes les données de votre forfait, vous pouvez continuer à utiliser des données à une vitesse réduite jusqu'à votre prochaine date anniversaire.";
  }
}

if (records['400min']) {
  const textItem = records['400min'].details.find((d) => d.titleEn.toLowerCase().includes('text'));
  if (textItem) {
    textItem.titleFr = '400 textos au Canada';
    textItem.textFr =
      'Envoyez et recevez 400 messages texte vers des mobiles au Canada. Les textos à tarification supplémentaire comme les alertes internationales et textos relatifs au contenu et aux promotions sont exclus.';
  }
}

const file = `// Generated from chatrwireless.com plan data. Run: node scripts/generate-plan-details.mjs

export type PlanDetailItem = {
  titleEn: string;
  titleFr: string;
  textEn: string;
  textFr: string;
};

export type PlanDetailContent = {
  details: PlanDetailItem[];
  promoEn?: string;
  promoFr?: string;
};

export const PLAN_DETAILS: Record<string, PlanDetailContent> = ${JSON.stringify(records, null, 2)};

export function getPlanDetailContent(planId: string): PlanDetailContent | undefined {
  return PLAN_DETAILS[planId];
}
`;

fs.writeFileSync(outPath, file);
console.log('Wrote', outPath, Object.keys(records).length, 'plans');
