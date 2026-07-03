import { colors } from '@/lib/theme/colors';

export type CoverageZoneType = 'nation-wide' | 'extended' | 'in-zone';

export type CoverageZone = {
  id: string;
  type: CoverageZoneType;
  nameEn: string;
  nameFr: string;
  /** Polygon ring as [lat, lng] pairs */
  ring: [number, number][];
};

export type CoverageSearchResult = {
  id: string;
  labelEn: string;
  labelFr: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  postalPrefixes: string[];
  nationWide: boolean;
  extended: boolean;
  inZone: boolean;
};

/** Simplified mock coverage polygons approximating Rogers/chatr network reach */
export const COVERAGE_ZONES: CoverageZone[] = [
  {
    id: 'gta-nation',
    type: 'nation-wide',
    nameEn: 'Greater Toronto Area',
    nameFr: 'Grand Toronto',
    ring: [
      [43.58, -79.75],
      [43.58, -79.05],
      [43.95, -79.05],
      [43.95, -79.75],
    ],
  },
  {
    id: 'gta-inzone',
    type: 'in-zone',
    nameEn: 'Toronto in-zone data area',
    nameFr: 'Zone de données Toronto',
    ring: [
      [43.63, -79.48],
      [43.63, -79.32],
      [43.7, -79.32],
      [43.7, -79.48],
    ],
  },
  {
    id: 'southern-ontario',
    type: 'nation-wide',
    nameEn: 'Southern Ontario corridor',
    nameFr: 'Corridor du sud de l\'Ontario',
    ring: [
      [42.25, -83.1],
      [42.25, -74.5],
      [45.5, -74.5],
      [45.5, -83.1],
    ],
  },
  {
    id: 'ottawa-nation',
    type: 'nation-wide',
    nameEn: 'Ottawa region',
    nameFr: 'Région d\'Ottawa',
    ring: [
      [45.25, -76.05],
      [45.25, -75.45],
      [45.55, -75.45],
      [45.55, -76.05],
    ],
  },
  {
    id: 'montreal-nation',
    type: 'nation-wide',
    nameEn: 'Greater Montreal',
    nameFr: 'Grand Montréal',
    ring: [
      [45.4, -73.95],
      [45.4, -73.45],
      [45.65, -73.45],
      [45.65, -73.95],
    ],
  },
  {
    id: 'quebec-extended',
    type: 'extended',
    nameEn: 'Quebec extended coverage',
    nameFr: 'Couverture étendue du Québec',
    ring: [
      [46.5, -74.5],
      [46.5, -70.5],
      [49.5, -70.5],
      [49.5, -74.5],
    ],
  },
  {
    id: 'vancouver-nation',
    type: 'nation-wide',
    nameEn: 'Metro Vancouver',
    nameFr: 'Vancouver métropolitain',
    ring: [
      [49.15, -123.25],
      [49.15, -122.75],
      [49.35, -122.75],
      [49.35, -123.25],
    ],
  },
  {
    id: 'bc-extended',
    type: 'extended',
    nameEn: 'BC extended coverage',
    nameFr: 'Couverture étendue de la C.-B.',
    ring: [
      [49.0, -125.5],
      [49.0, -119.5],
      [53.5, -119.5],
      [53.5, -125.5],
    ],
  },
  {
    id: 'calgary-edmonton',
    type: 'nation-wide',
    nameEn: 'Calgary–Edmonton corridor',
    nameFr: 'Corridor Calgary–Edmonton',
    ring: [
      [51.0, -114.35],
      [51.0, -113.35],
      [53.7, -113.35],
      [53.7, -114.35],
    ],
  },
  {
    id: 'prairies-extended',
    type: 'extended',
    nameEn: 'Prairies extended coverage',
    nameFr: 'Couverture étendue des Prairies',
    ring: [
      [49.0, -110.5],
      [49.0, -101.5],
      [54.5, -101.5],
      [54.5, -110.5],
    ],
  },
  {
    id: 'winnipeg-nation',
    type: 'nation-wide',
    nameEn: 'Winnipeg region',
    nameFr: 'Région de Winnipeg',
    ring: [
      [49.75, -97.35],
      [49.75, -96.95],
      [49.95, -96.95],
      [49.95, -97.35],
    ],
  },
  {
    id: 'maritimes-extended',
    type: 'extended',
    nameEn: 'Atlantic Canada extended',
    nameFr: 'Couverture étendue du Canada atlantique',
    ring: [
      [43.5, -66.5],
      [43.5, -59.5],
      [47.5, -59.5],
      [47.5, -66.5],
    ],
  },
  {
    id: 'halifax-nation',
    type: 'nation-wide',
    nameEn: 'Halifax region',
    nameFr: 'Région d\'Halifax',
    ring: [
      [44.55, -63.75],
      [44.55, -63.45],
      [44.75, -63.45],
      [44.75, -63.75],
    ],
  },
];

export const COVERAGE_SEARCH_RESULTS: CoverageSearchResult[] = [
  {
    id: 'toronto',
    labelEn: 'Toronto, ON',
    labelFr: 'Toronto, ON',
    city: 'Toronto',
    province: 'ON',
    lat: 43.6532,
    lng: -79.3832,
    postalPrefixes: ['M5H', 'M5B', 'M4W', 'M6G', 'M1P'],
    nationWide: true,
    extended: true,
    inZone: true,
  },
  {
    id: 'ottawa',
    labelEn: 'Ottawa, ON',
    labelFr: 'Ottawa, ON',
    city: 'Ottawa',
    province: 'ON',
    lat: 45.4215,
    lng: -75.6972,
    postalPrefixes: ['K1N', 'K1P', 'K2P'],
    nationWide: true,
    extended: true,
    inZone: false,
  },
  {
    id: 'montreal',
    labelEn: 'Montreal, QC',
    labelFr: 'Montréal, QC',
    city: 'Montreal',
    province: 'QC',
    lat: 45.5017,
    lng: -73.5673,
    postalPrefixes: ['H3B', 'H2W', 'H2X'],
    nationWide: true,
    extended: true,
    inZone: false,
  },
  {
    id: 'vancouver',
    labelEn: 'Vancouver, BC',
    labelFr: 'Vancouver, C.-B.',
    city: 'Vancouver',
    province: 'BC',
    lat: 49.2827,
    lng: -123.1207,
    postalPrefixes: ['V6B', 'V6Z', 'V5K'],
    nationWide: true,
    extended: true,
    inZone: false,
  },
  {
    id: 'calgary',
    labelEn: 'Calgary, AB',
    labelFr: 'Calgary, AB',
    city: 'Calgary',
    province: 'AB',
    lat: 51.0447,
    lng: -114.0719,
    postalPrefixes: ['T2P', 'T2H', 'T3H'],
    nationWide: true,
    extended: true,
    inZone: false,
  },
  {
    id: 'winnipeg',
    labelEn: 'Winnipeg, MB',
    labelFr: 'Winnipeg, MB',
    city: 'Winnipeg',
    province: 'MB',
    lat: 49.8951,
    lng: -97.1384,
    postalPrefixes: ['R3C', 'R3G', 'R2H'],
    nationWide: true,
    extended: true,
    inZone: false,
  },
  {
    id: 'halifax',
    labelEn: 'Halifax, NS',
    labelFr: 'Halifax, N.-É.',
    city: 'Halifax',
    province: 'NS',
    lat: 44.6488,
    lng: -63.5752,
    postalPrefixes: ['B3H', 'B3J', 'B3S'],
    nationWide: true,
    extended: true,
    inZone: false,
  },
  {
    id: 'yellowknife',
    labelEn: 'Yellowknife, NT',
    labelFr: 'Yellowknife, T.N.-O.',
    city: 'Yellowknife',
    province: 'NT',
    lat: 62.454,
    lng: -114.3718,
    postalPrefixes: ['X1A'],
    nationWide: false,
    extended: false,
    inZone: false,
  },
];

export type CoverageLayerFilter = 'all' | CoverageZoneType;

export const CANADA_COVERAGE_REGION = {
  latitude: 56,
  longitude: -96,
  latitudeDelta: 28,
  longitudeDelta: 42,
};

export const COVERAGE_LAYER_STYLES: Record<
  CoverageZoneType,
  { fill: string; fillOpacity: number; stroke: string; strokeWidth: number }
> = {
  'nation-wide': {
    fill: colors.primary,
    fillOpacity: 0.42,
    stroke: colors.primaryDark,
    strokeWidth: 1.5,
  },
  extended: {
    fill: colors.primaryLight,
    fillOpacity: 0.28,
    stroke: colors.primary,
    strokeWidth: 1,
  },
  'in-zone': {
    fill: colors.warning,
    fillOpacity: 0.38,
    stroke: colors.accentDark,
    strokeWidth: 1.5,
  },
};

export function filterZonesByLayer<T extends { type: CoverageZoneType }>(
  zones: T[],
  filter: CoverageLayerFilter,
): T[] {
  if (filter === 'all') return zones;
  return zones.filter((zone) => zone.type === filter);
}

export function searchCoverageLocations(
  results: CoverageSearchResult[],
  query: string,
): CoverageSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return results.filter((result) => {
    const haystack = [
      result.labelEn,
      result.labelFr,
      result.city,
      result.province,
      ...result.postalPrefixes,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q) || result.postalPrefixes.some((p) => p.toLowerCase().startsWith(q));
  });
}

export function getLocationRegion(lat: number, lng: number) {
  return {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
  };
}

export function getFilterLabelKey(filter: CoverageLayerFilter): string {
  if (filter === 'all') return 'coverage.filterAll';
  if (filter === 'nation-wide') return 'coverage.filterNationWide';
  if (filter === 'extended') return 'coverage.filterExtended';
  return 'coverage.filterInZone';
}
