import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CountryScore } from '../models/country';
import { environment } from '../../environments/environment';

export interface LastSync {
  last_sync:         string | null;
  countries_updated: number | null;
  status:            string | null;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async getCountries(): Promise<CountryScore[]> {
    const data: any[] = await firstValueFrom(
      this.http.get<any[]>(`${this.baseUrl}/api/countries`)
    );
    return data.map(c => this.mapCountry(c));
  }

  async getCountry(code: string): Promise<CountryScore> {
    const data: any = await firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/api/countries/${code}`)
    );
    return this.mapCountry(data);
  }

  async getLastSync(): Promise<LastSync> {
    return firstValueFrom(
      this.http.get<LastSync>(`${this.baseUrl}/api/countries/last-sync`)
    );
  }

  private mapCountry(c: any): CountryScore {
    return {
      code:           c.code,
      name:           c.name,
      flag:           c.flag,
      score:          c.score,
      classification: c.classification,
      breakdown: {
        economy:      c.economy_score,
        efficiency:   c.efficiency_score,
        transparency: c.transparency_score,
        trust:        c.trust_score,
      },
      raw_data: {
        inflation_rate:        c.raw_data?.inflation_rate,
        unemployment_rate:     c.raw_data?.unemployment_rate,
        gdp_growth:            c.raw_data?.gdp_growth,
        budget_execution:      c.raw_data?.budget_execution,
        corruption_risk_index: c.raw_data?.corruption_risk_index,
        public_trust:          c.raw_data?.public_trust,
        year: c.raw_data?.gdp_year ?? c.raw_data?.inflation_year ?? 2024,
        sources: {
          inflation:   c.raw_data?.inflation_source   ?? 'World Bank',
          unemployment:c.raw_data?.unemployment_source?? 'World Bank',
          gdp:         c.raw_data?.gdp_source         ?? 'World Bank',
          corruption:  c.raw_data?.corruption_source  ?? 'Transparency International',
        },
      },
      last_updated: c.calculated_at,
    };
  }
}