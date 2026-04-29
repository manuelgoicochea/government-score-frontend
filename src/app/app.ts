import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreForm } from './components/score-calculator/score-form/score-form';
import { CountriesDashboard } from './components/countries/countries-dashboard/countries-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ScoreForm, CountriesDashboard],
  templateUrl: './app.html',
})
export class App {
  activeTab: 'calculator' | 'countries' = 'calculator';

  setTab(tab: 'calculator' | 'countries') {
    this.activeTab = tab;
  }
}