import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-ideas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <p class="eyebrow">AI CONTENT STUDIO</p>
        <h1>Content Ideas</h1>
        <p class="muted">Generate ideas, hooks and scripts for your next Reel.</p>
      </div>
    </div>

    <section class="panel form-panel">
      <label>What topic do you want ideas for?</label>

      <textarea
        [(ngModel)]="topic"
        name="topic"
        rows="3"
        placeholder="Example: Real estate investment in Calicut">
      </textarea>

      <div class="button-row">
        <button
          class="btn btn-primary"
          (click)="generateIdeas()"
          [disabled]="loading || !topic.trim()">

          {{ loading ? 'Generating...' : '✧ Generate 10 ideas' }}

        </button>

        <button
          class="btn btn-secondary"
          (click)="generateContent()"
          [disabled]="contentLoading || !topic.trim()">

          {{ contentLoading ? 'Writing...' : 'Write a Reel script' }}

        </button>
      </div>

      <p class="error-message" *ngIf="error">{{ error }}</p>
    </section>

    <section class="ideas-grid" *ngIf="ideas.length">

      <article class="panel idea-card" *ngFor="let idea of ideas; let i = index">

        <span class="idea-number">IDEA {{ i + 1 }}</span>

        <h3>{{ idea.title }}</h3>

        <div class="idea-part">
          <small>HOOK</small>
          <p>{{ idea.hook }}</p>
        </div>

        <div class="idea-part">
          <small>CONCEPT</small>
          <p>{{ idea.concept }}</p>
        </div>

        <div class="idea-part">
          <small>FORMAT</small>
          <p>{{ idea.format }}</p>
        </div>

        <div class="idea-part">
          <small>CALL TO ACTION</small>
          <p>{{ idea.cta }}</p>
        </div>

      </article>

    </section>

    <section class="panel result-panel" *ngIf="script">

      <div class="section-heading">
        <div>
          <p class="eyebrow">GENERATED SCRIPT</p>
          <h2>Your Reel content</h2>
        </div>
      </div>

      <div class="idea-part">
        <small>REEL SCRIPT</small>
        <p class="generated-text">{{ script.reel_script }}</p>
      </div>

      <div class="idea-part">
        <small>CAPTION</small>
        <p class="generated-text">{{ script.caption }}</p>
      </div>

      <div class="idea-part">
        <small>HOOKS</small>
        <ul>
          <li *ngFor="let hook of script.hooks">{{ hook }}</li>
        </ul>
      </div>

      <div class="idea-part">
        <small>CALL TO ACTION</small>
        <p>{{ script.cta }}</p>
      </div>

      <div class="idea-part">
        <small>HASHTAGS</small>
        <p>{{ script.hashtags?.join(' ') }}</p>
      </div>

    </section>
  `
})
export class IdeasComponent {
  topic = '';

  loading = false;
  contentLoading = false;

  error = '';

  ideas: any[] = [];
  script: any = null;

  constructor(private api: ApiService) {}

  generateIdeas(): void {
    if (!this.topic.trim()) return;

    this.loading = true;
    this.error = '';
    this.ideas = [];

    this.api.ideas(this.topic).subscribe({
      next: response => {
        this.loading = false;
        this.ideas = response.result?.ideas || [];
      },
      error: err => {
        this.loading = false;
        this.error =
          err.error?.detail || 'Could not generate ideas.';
      }
    });
  }

  generateContent(): void {
    if (!this.topic.trim()) return;

    this.contentLoading = true;
    this.error = '';
    this.script = null;

    this.api.content(this.topic).subscribe({
      next: response => {
        this.contentLoading = false;
        this.script = response.result;
      },
      error: err => {
        this.contentLoading = false;
        this.error =
          err.error?.detail || 'Could not generate content.';
      }
    });
  }
}