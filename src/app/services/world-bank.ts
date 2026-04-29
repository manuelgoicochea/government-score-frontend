import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// World Bank indicator codes
const WB = {
  inflation:    'FP.CPI.TOTL.ZG',
  unemployment: 'SL.UEM.TOTL.ZS',
  gdp_growth:   'NY.GDP.MKTP.KD.ZG',
};

// Transparency International CPI 2023 (0=most corrupt, 100=least corrupt)
// We invert it: corruption_risk = 100 - CPI
const CPI_2023: Record<string, number> = {
  PE: 33, CL: 73, BR: 36, AR: 37, CO: 39,
  MX: 31, EC: 34, BO: 31, PY: 24, UY: 73,
  VE: 13, CR: 54,
};

// Public trust from Latinobarometro 2023 (approximate %)
const TRUST_2023: Record<string, number> = {
  PE: 16, CL: 22, BR: 28, AR: 24, CO: 21,
  MX: 32, EC: 25, BO: 30, PY: 23, UY: 45,
  VE: 18, CR: 42,
};

// Budget execution approximate % (CEPAL / national reports 2023)
const BUDGET_2023: Record<string, number> = {
  PE: 72, CL: 91, BR: 85, AR: 68, CO: 78,
  MX: 82, EC: 74, BO: 76, PY: 71, UY: 88,
  VE: 45, CR: 83,
};

@Injectable({ providedIn: 'root' })
export class WorldBankService {
  constructor(private http: HttpClient) {}

  async getIndicator(countryCode: string, indicator: string): Promise<number | null> {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&mrv=1&per_page=1`;
    try {
      const res: any = await firstValueFrom(this.http.get(url));
      const value = res?.[1]?.[0]?.value;
      return value !== null && value !== undefined ? parseFloat(value.toFixed(2)) : null;
    } catch {
      return null;
    }
  }

  async getCountryData(code: string): Promise<{
    inflation: number;
    unemployment: number;
    gdp_growth: number;
    budget_execution: number;
    corruption_risk: number;
    public_trust: number;
  }> {
    const [inflation, unemployment, gdp] = await Promise.all([
      this.getIndicator(code, WB.inflation),
      this.getIndicator(code, WB.unemployment),
      this.getIndicator(code, WB.gdp_growth),
    ]);

    const cpi = CPI_2023[code] ?? 50;

    return {
      inflation:        inflation    ?? 5,
      unemployment:     unemployment ?? 8,
      gdp_growth:       gdp          ?? 2,
      budget_execution: BUDGET_2023[code] ?? 75,
      corruption_risk:  100 - cpi,
      public_trust:     TRUST_2023[code] ?? 30,
    };
  }
}