import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { Video, AnalysisResult } from '../../core/models';
import { ResultViewComponent } from '../../shared/result-view.component';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ResultViewComponent
  ],
  template: `
    <div class="page-header">
      <div>
        <p class="eyebrow">AI INSIGHTS</p>
        <h1>Reel Analysis</h1>
        <p class="muted">Understand what's working and how to improve.</p>
      </div>
    </div>

    <section class="panel form-panel">

      <label>Select a Reel</label>

      <select [(ngModel)]="selectedId" name="video">
        <option value="">Choose a Reel</option>

        <option
          *ngFor="let video of videos"
          [value]="video.id">

          {{ video.title }}

        </option>
      </select>

      <p class="muted small-note">
        Add your Reel metrics in the Metrics page before analysing it.
      </p>

      <p class="error-message" *ngIf="error">{{ error }}</p>

      <button
        class="btn btn-primary"
        (click)="analyse()"
        [disabled]="loading || !selectedId">

        {{ loading ? 'Analysing...' : '✧ Analyse with Gemini AI' }}

      </button>

    </section>

    <section class="panel result-panel" *ngIf="result">
      <div class="section-heading">
        <div>
          <p class="eyebrow">AI REPORT</p>
          <h2>{{ selectedTitle }}</h2>
        </div>
      </div>

      <app-result-view [result]="result" />
    </section>
  `
})
export class AnalysisComponent implements OnInit {
  videos: Video[] = [];

  selectedId = '';
  selectedTitle = '';

  loading = false;
  error = '';

  result: AnalysisResult | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.listVideos().subscribe({
      next: data => this.videos = data
    });
  }

  analyse(): void {
    if (!this.selectedId) return;

    this.loading = true;
    this.error = '';
    this.result = null;

    const selected = this.videos.find(
      video => video.id === this.selectedId
    );

    this.selectedTitle = selected?.title || '';

    this.api.analyze(this.selectedId).subscribe({
      next: response => {
        this.loading = false;
        this.result = response.result;
      },
      error: err => {
        this.loading = false;
        this.error =
          err.error?.detail || 'Analysis failed. Please try again.';
      }
    });
  }
}