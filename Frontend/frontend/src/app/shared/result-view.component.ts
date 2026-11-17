import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalysisResult } from '../core/models';

@Component({
  selector: 'app-result-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="result-view" *ngIf="result">

      <div class="score-card">
        <div>
          <p class="muted">Overall performance score</p>
          <h2>{{ result.overall_score || 0 }}/100</h2>
        </div>

        <div class="score-track">
          <div
            class="score-fill"
            [style.width.%]="result.overall_score || 0">
          </div>
        </div>
      </div>

      <section class="result-section">
        <h3>Performance summary</h3>
        <p>{{ result.performance_summary }}</p>
      </section>

      <div class="result-grid">
        <section class="result-section">
          <h3>What worked</h3>
          <ul>
            <li *ngFor="let item of result.what_worked">
              {{ item }}
            </li>
          </ul>
        </section>

        <section class="result-section">
          <h3>What didn't work</h3>
          <ul>
            <li *ngFor="let item of result.what_didnt_work">
              {{ item }}
            </li>
          </ul>
        </section>

        <section class="result-section">
          <h3>Audience insights</h3>
          <ul>
            <li *ngFor="let item of result.audience_insights">
              {{ item }}
            </li>
          </ul>
        </section>

        <section class="result-section">
          <h3>Improvements</h3>
          <ul>
            <li *ngFor="let item of result.improvements">
              {{ item }}
            </li>
          </ul>
        </section>
      </div>

      <section class="result-section">
        <h3>Hook analysis</h3>
        <p>{{ result.hook_analysis }}</p>
      </section>

      <section class="result-section">
        <h3>Content strategy</h3>
        <p>{{ result.content_strategy }}</p>
      </section>

      <section class="result-section">
        <h3>Next steps</h3>
        <ul>
          <li *ngFor="let item of result.next_steps">
            {{ item }}
          </li>
        </ul>
      </section>

    </div>
  `
})
export class ResultViewComponent {
  @Input() result!: AnalysisResult;
}