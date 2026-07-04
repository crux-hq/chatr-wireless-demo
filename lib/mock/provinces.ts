export type ProvinceCode =
  | 'AB'
  | 'BC'
  | 'MB'
  | 'NB'
  | 'NL'
  | 'NS'
  | 'ON'
  | 'PE'
  | 'QC'
  | 'SK';

export type CanadianProvince = {
  code: ProvinceCode;
  nameEn: string;
  nameFr: string;
};

export const CANADIAN_PROVINCES: CanadianProvince[] = [
  { code: 'AB', nameEn: 'Alberta', nameFr: 'Alberta' },
  { code: 'BC', nameEn: 'British Columbia', nameFr: 'Colombie-Britannique' },
  { code: 'MB', nameEn: 'Manitoba', nameFr: 'Manitoba' },
  { code: 'NB', nameEn: 'New Brunswick', nameFr: 'Nouveau-Brunswick' },
  { code: 'NL', nameEn: 'Newfoundland and Labrador', nameFr: 'Terre-Neuve-et-Labrador' },
  { code: 'NS', nameEn: 'Nova Scotia', nameFr: 'Nouvelle-Écosse' },
  { code: 'ON', nameEn: 'Ontario', nameFr: 'Ontario' },
  { code: 'PE', nameEn: 'Prince Edward Island', nameFr: 'Île-du-Prince-Édouard' },
  { code: 'QC', nameEn: 'Quebec', nameFr: 'Québec' },
  { code: 'SK', nameEn: 'Saskatchewan', nameFr: 'Saskatchewan' },
];

export const DEFAULT_PROVINCE_CODE: ProvinceCode = 'ON';

export function getProvinceByCode(code: string): CanadianProvince | undefined {
  return CANADIAN_PROVINCES.find((province) => province.code === code);
}

export function getProvinceName(code: string, locale: 'en' | 'fr'): string {
  const province = getProvinceByCode(code);
  if (!province) return code;
  return locale === 'fr' ? province.nameFr : province.nameEn;
}
