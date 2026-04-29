export interface CountryRawData {
  inflation_rate: number;
  unemployment_rate: number;
  gdp_growth: number;
  budget_execution: number;
  corruption_risk_index: number;
  public_trust: number;
  year: number;
  sources: {
    inflation: string;
    unemployment: string;
    gdp: string;
    corruption: string;
  };
}

export interface CountryScore {
  code: string;         // ISO 3166-1 alpha-2 (PE, CL, BR...)
  name: string;
  flag: string;         // emoji flag
  score: number;
  classification: 'Good' | 'Moderate' | 'Critical';
  breakdown: {
    economy: number;
    efficiency: number;
    transparency: number;
    trust: number;
  };
  raw_data: CountryRawData;
  last_updated: string;
}

export const LATAM_COUNTRIES: { code: string; name: string; flag: string }[] = [
  { code: 'PE', name: 'Peru',      flag: '🇵🇪' },
  { code: 'CL', name: 'Chile',     flag: '🇨🇱' },
  { code: 'BR', name: 'Brazil',    flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CO', name: 'Colombia',  flag: '🇨🇴' },
  { code: 'MX', name: 'Mexico',    flag: '🇲🇽' },
  { code: 'EC', name: 'Ecuador',   flag: '🇪🇨' },
  { code: 'BO', name: 'Bolivia',   flag: '🇧🇴' },
  { code: 'PY', name: 'Paraguay',  flag: '🇵🇾' },
  { code: 'UY', name: 'Uruguay',   flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'CR', name: 'Costa Rica',flag: '🇨🇷' },
];