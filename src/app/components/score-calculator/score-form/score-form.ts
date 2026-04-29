import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoringService } from '../../../services/scoring';
import { ScoreInput, ScoreResult } from '../../../models/score';
import { Weights, DEFAULT_WEIGHTS, WEIGHT_PRESETS } from '../../../models/weights';

@Component({
  selector: 'app-score-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './score-form.html',
})
export class ScoreForm {
  constructor(private scoring: ScoringService) {}

  // ── Indicadores actuales ──────────────────────────────
  input: ScoreInput = {
    inflation_rate: 3.5,
    unemployment_rate: 6.2,
    gdp_growth: 2.8,
    budget_execution: 78,
    corruption_risk_index: 45,
    public_trust: 52,
  };

  // ── Pesos ─────────────────────────────────────────────
  weights: Weights = { ...DEFAULT_WEIGHTS };
  presets = WEIGHT_PRESETS;
  selectedPreset = 'Default';

  // ── Resultados ────────────────────────────────────────
  result: ScoreResult | null = null;

  // ── Simulador ─────────────────────────────────────────
  simulatorOpen = false;
  simInput: ScoreInput = { ...this.input };
  simResult: ScoreResult | null = null;

  // ── Calcular score principal ──────────────────────────
  calculate() {
    this.result = this.scoring.calculate(this.input, this.weights);
    this.simInput = { ...this.input };
    this.simResult = { ...this.result };
  }

  // ── Simular what-if ───────────────────────────────────
  simulate() {
    if (!this.result) return;
    this.simResult = this.scoring.calculate(this.simInput, this.weights);
  }

  get delta(): number {
    if (!this.result || !this.simResult) return 0;
    return this.simResult.score - this.result.score;
  }

  toggleSimulator() {
    this.simulatorOpen = !this.simulatorOpen;
    if (this.simulatorOpen && this.result) {
      this.simInput = { ...this.input };
      this.simResult = { ...this.result };
    }
  }

  // ── Pesos ─────────────────────────────────────────────
  applyPreset(name: string) {
    const preset = this.presets.find(p => p.name === name);
    if (preset) {
      this.weights = { ...preset.weights };
      this.selectedPreset = name;
      if (this.result) this.calculate();
    }
  }

  adjustWeight(changed: keyof Weights, value: number) {
    const others = (['economy','efficiency','transparency','trust'] as (keyof Weights)[])
      .filter(k => k !== changed);
    const remaining = 100 - value;
    const currentOthersTotal = others.reduce((s, k) => s + this.weights[k], 0);

    this.weights[changed] = value;

    if (currentOthersTotal === 0) {
      const share = remaining / others.length;
      others.forEach(k => this.weights[k] = Math.round(share));
    } else {
      others.forEach(k => {
        this.weights[k] = Math.round((this.weights[k] / currentOthersTotal) * remaining);
      });
    }

    // Fix rounding drift
    const total = Object.values(this.weights).reduce((s, v) => s + v, 0);
    if (total !== 100) this.weights[others[0]] += 100 - total;

    this.selectedPreset = 'Custom';
    if (this.result) this.calculate();
  }

  // ── Helpers UI ────────────────────────────────────────
  classColor(cls: string): string {
    return cls === 'Good' ? '#22c55e' : cls === 'Moderate' ? '#f59e0b' : '#ef4444';
  }

  classBg(cls: string): string {
    return cls === 'Good'
      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
      : cls === 'Moderate'
      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
      : 'bg-red-500/10 text-red-400 border border-red-500/30';
  }

  barColor(dim: string): string {
    const map: Record<string, string> = {
      economy: '#3b82f6',
      efficiency: '#8b5cf6',
      transparency: '#f59e0b',
      trust: '#22c55e',
    };
    return map[dim] || '#6366f1';
  }

  breakdownEntries(breakdown: any): { key: string; label: string; value: number }[] {
    return [
      { key: 'economy',      label: 'Economy',      value: breakdown.economy },
      { key: 'efficiency',   label: 'Efficiency',   value: breakdown.efficiency },
      { key: 'transparency', label: 'Transparency', value: breakdown.transparency },
      { key: 'trust',        label: 'Trust',        value: breakdown.trust },
    ];
  }
}