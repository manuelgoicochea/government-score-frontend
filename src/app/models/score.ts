export interface ScoreInput {
  inflation_rate: number;
  unemployment_rate: number;
  gdp_growth: number;
  budget_execution: number;
  corruption_risk_index: number;
  public_trust: number;
}

export interface ScoreBreakdown {
  economy: number;
  efficiency: number;
  transparency: number;
  trust: number;
}

export interface ScoreResult {
  score: number;
  classification: 'Good' | 'Moderate' | 'Critical';
  breakdown: ScoreBreakdown;
  explanation: string;
}

export interface SimulatorResult {
  current: ScoreResult;
  simulated: ScoreResult;
  delta: number;
}