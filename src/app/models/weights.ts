export interface Weights {
  economy: number;      // 0-100
  efficiency: number;   // 0-100
  transparency: number; // 0-100
  trust: number;        // 0-100
}

export const DEFAULT_WEIGHTS: Weights = {
  economy: 40,
  efficiency: 20,
  transparency: 20,
  trust: 20,
};

export const WEIGHT_PRESETS: { name: string; weights: Weights }[] = [
  {
    name: 'Default',
    weights: { economy: 40, efficiency: 20, transparency: 20, trust: 20 },
  },
  {
    name: 'Anti-Corruption Focus',
    weights: { economy: 20, efficiency: 15, transparency: 50, trust: 15 },
  },
  {
    name: 'Economic Focus',
    weights: { economy: 60, efficiency: 20, transparency: 10, trust: 10 },
  },
  {
    name: 'Social Trust Focus',
    weights: { economy: 20, efficiency: 15, transparency: 25, trust: 40 },
  },
];