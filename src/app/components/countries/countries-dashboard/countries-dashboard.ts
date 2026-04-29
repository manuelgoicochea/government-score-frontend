import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, LastSync } from '../../../services/api';
import { CountryScore } from '../../../models/country';

@Component({
  selector: 'app-countries-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './countries-dashboard.html',
})
export class CountriesDashboard implements OnInit {
  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  countries: CountryScore[] = [];
  filtered:  CountryScore[] = [];
  selected:  CountryScore | null = null;
  loading    = false;
  error:     string | null = null;
  lastSync:  LastSync | null = null;
  searchQuery = '';
  sortBy: 'score' | 'name' = 'score';
  sortDir: 'asc' | 'desc'  = 'desc';

  async ngOnInit() {
    await Promise.all([this.loadData(), this.loadLastSync()]);
  }

  async loadData() {
    this.loading = true;
    this.error   = null;
    this.cdr.detectChanges();
    try {
      this.countries = await this.api.getCountries();
      this.applyFilters();
    } catch (e: any) {
      this.error = 'Could not load countries. Make sure the backend is running.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadLastSync() {
    try {
      this.lastSync = await this.api.getLastSync();
      this.cdr.detectChanges();
    } catch {}
  }

  applyFilters() {
    let data = [...this.countries];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      data = data.filter(c => c.name.toLowerCase().includes(q));
    }
    data.sort((a, b) => {
      const va = this.sortBy === 'score' ? a.score : a.name;
      const vb = this.sortBy === 'score' ? b.score : b.name;
      if (va < vb) return this.sortDir === 'asc' ? -1 : 1;
      if (va > vb) return this.sortDir === 'asc' ?  1 : -1;
      return 0;
    });
    this.filtered = data;
  }

  toggleSort(col: 'score' | 'name') {
    if (this.sortBy === col) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy  = col;
      this.sortDir = col === 'score' ? 'desc' : 'asc';
    }
    this.applyFilters();
  }

  selectCountry(c: CountryScore) {
    this.selected = this.selected?.code === c.code ? null : c;
    this.cdr.detectChanges();
  }

  formatSync(iso: string | null): string {
    if (!iso) return 'Never';
    const d = new Date(iso);
    return d.toLocaleDateString('en', { year:'numeric', month:'long', day:'numeric',
                                        hour:'2-digit', minute:'2-digit' });
  }

  // ── Stats ─────────────────────────────────────────────
  get avgScore(): number {
    if (!this.countries.length) return 0;
    return Math.round(this.countries.reduce((s, c) => s + c.score, 0) / this.countries.length);
  }
  get bestCountry():  CountryScore | null {
    return this.countries.reduce((b, c) => !b || c.score > b.score ? c : b, null as CountryScore | null);
  }
  get worstCountry(): CountryScore | null {
    return this.countries.reduce((w, c) => !w || c.score < w.score ? c : w, null as CountryScore | null);
  }
  get goodCount():  number { return this.countries.filter(c => c.classification === 'Good').length; }
  get modCount():   number { return this.countries.filter(c => c.classification === 'Moderate').length; }
  get critCount():  number { return this.countries.filter(c => c.classification === 'Critical').length; }

  // ── UI helpers ────────────────────────────────────────
  classColor(cls: string): string {
    return cls === 'Good' ? '#22c55e' : cls === 'Moderate' ? '#f59e0b' : '#ef4444';
  }
  classBadge(cls: string): string {
    return cls === 'Good'
      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
      : cls === 'Moderate'
      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
      : 'bg-red-500/10 text-red-400 border border-red-500/30';
  }
  barColor(dim: string): string {
    const m: Record<string,string> = {
      economy:'#3b82f6', efficiency:'#8b5cf6',
      transparency:'#f59e0b', trust:'#22c55e'
    };
    return m[dim] || '#6366f1';
  }
  breakdownEntries(b: any) {
    return [
      { key:'economy',      label:'Economy',      value: b.economy },
      { key:'efficiency',   label:'Efficiency',   value: b.efficiency },
      { key:'transparency', label:'Transparency', value: b.transparency },
      { key:'trust',        label:'Trust',        value: b.trust },
    ];
  }
}