import { Injectable } from '@angular/core';
import { ScoreInput, ScoreResult, ScoreBreakdown } from '../models/score';
import { Weights, DEFAULT_WEIGHTS } from '../models/weights';

const RANGES = {
  inflation:    [0, 30],
  unemployment: [0, 30],
  gdp_growth:   [-5, 15],
  budget:       [0, 100],
  corruption:   [0, 100],
  trust:        [0, 100],
};

@Injectable({ providedIn: 'root' })
export class ScoringService {

  private norm(val: number, lo: number, hi: number): number {
    return Math.max(0, Math.min(100, (val - lo) / (hi - lo) * 100));
  }

  calculate(inp: ScoreInput, weights: Weights = DEFAULT_WEIGHTS): ScoreResult {
    const nInflation    = 100 - this.norm(inp.inflation_rate,        ...RANGES.inflation as [number,number]);
    const nUnemployment = 100 - this.norm(inp.unemployment_rate,     ...RANGES.unemployment as [number,number]);
    const nGdp          =       this.norm(inp.gdp_growth,            ...RANGES.gdp_growth as [number,number]);
    const nBudget       =       this.norm(inp.budget_execution,      ...RANGES.budget as [number,number]);
    const nCorruption   = 100 - this.norm(inp.corruption_risk_index, ...RANGES.corruption as [number,number]);
    const nTrust        =       this.norm(inp.public_trust,          ...RANGES.trust as [number,number]);

    const economy      = (nInflation + nUnemployment + nGdp) / 3;
    const efficiency   = nBudget;
    const transparency = nCorruption;
    const trust        = nTrust;

    const w = {
      economy:      weights.economy      / 100,
      efficiency:   weights.efficiency   / 100,
      transparency: weights.transparency / 100,
      trust:        weights.trust        / 100,
    };

    const score = Math.round(
      economy      * w.economy      +
      efficiency   * w.efficiency   +
      transparency * w.transparency +
      trust        * w.trust
    );

    const classification =
      score >= 70 ? 'Good' :
      score >= 40 ? 'Moderate' : 'Critical';

    const breakdown: ScoreBreakdown = {
      economy:      Math.round(economy),
      efficiency:   Math.round(efficiency),
      transparency: Math.round(transparency),
      trust:        Math.round(trust),
    };

    return {
      score,
      classification: classification as 'Good' | 'Moderate' | 'Critical',
      breakdown,
      explanation: this.explain(score, classification, breakdown, inp),
    };
  }

  private explain(score: number, cls: string, b: ScoreBreakdown, inp: ScoreInput): string {
    const dims = [
      ['economic performance', b.economy],
      ['budget efficiency', b.efficiency],
      ['corruption control', b.transparency],
      ['public trust', b.trust],
    ].sort((a, b) => (a[1] as number) - (b[1] as number));

    const worst = dims[0], best = dims[dims.length - 1];

    const intro: Record<string, string> = {
      Good:     `Strong score of ${score}/100.`,
      Moderate: `Moderate score of ${score}/100 — mixed results.`,
      Critical: `Critical score of ${score}/100 — urgent attention needed.`,
    };

    const mid = `Strongest: ${best[0]} (${best[1]}/100). Main concern: ${worst[0]} (${worst[1]}/100).`;

    let extra = '';
    if (inp.inflation_rate > 10)          extra = ' High inflation is severely dragging the economic component.';
    else if (inp.gdp_growth < 0)          extra = ' Negative GDP growth is weighing on overall performance.';
    else if (inp.corruption_risk_index > 70) extra = ' High corruption risk is limiting the transparency score.';

    return `${intro[cls]} ${mid}${extra}`;
  }
}