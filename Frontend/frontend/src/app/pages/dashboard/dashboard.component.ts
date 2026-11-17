import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { Summary, Video } from '../../core/models';
import { ChartComponent } from '../../shared/chart.component';
import { formatNumber, formatDate } from '../../core/utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ChartComponent],
  template: `
    <div class="page-header">
      <div>
        <p class="eyebrow">OVERVIEW</p>
        <h1>Dashboard</h1>
        <p class="muted">Your Instagram content performance at a glance.</p>
      </div>

      <a routerLink="/upload" class="btn btn-primary">
        + Upload Reel
      </a>
    </div>

    <div class="stats-grid" *ngIf="summary">

      <div class="stat-card">
        <span class="stat-label">Total Reels</span>
        <strong>{{ formatNumber(summary.videos) }}</strong>
        <small>Uploaded videos</small>
      </div>

      <div class="stat-card">
        <span class="stat-label">Total Views</span>
        <strong>{{ formatNumber(summary.views) }}</strong>
        <small>Across your Reels</small>
      </div>

      <div class="stat-card">
        <span class="stat-label">Total Likes</span>
        <strong>{{ formatNumber(summary.likes) }}</strong>
        <small>Audience interactions</small>
      </div>

      <div class="stat-card">
        <span class="stat-label">Engagement Rate</span>
        <strong>{{ summary.engagement_rate }}%</strong>
        <small>Overall engagement</small>
      </div>

      <div class="stat-card">
        <span class="stat-label">Total Reach</span>
        <strong>{{ formatNumber(summary.reach) }}</strong>
        <small>Accounts reached</small>
      </div>

      <div class="stat-card">
        <span class="stat-label">Followers Gained</span>
        <strong>{{ formatNumber(summary.followers_gained) }}</strong>
        <small>From your Reels</small>
      </div>

    </div>

    <div class="content-grid">
      <section class="panel chart-panel">
        <div class="section-heading">
          <div>
            <h2>Content performance</h2>
            <p class="muted">Views across your uploaded Reels</p>
          </div>
        </div>

        <app-chart
          [labels]="chartLabels"
          [values]="chartValues"
          label="Views"
          type="bar">
        </app-chart>
      </section>

      <section class="panel">
        <div class="section-heading">
          <div>
            <h2>Recent Reels</h2>
            <p class="muted">Your latest uploads</p>
          </div>

          <a routerLink="/metrics" class="text-link">View all</a>
        </div>

        <div *ngIf="videos.length === 0" class="empty-state">
          <p>No Reels uploaded yet.</p>
          <a routerLink="/upload" class="text-link">Upload your first Reel</a>
        </div>

        <div class="recent-list">
          <div class="recent-item" *ngFor="let video of videos.slice(0, 5)">
            <div class="video-icon">▶</div>

            <div class="recent-info">
              <strong>{{ video.title }}</strong>
              <small>{{ formatDate(video.created_at) }}</small>
            </div>

            <div class="recent-views">
              {{ formatNumber(video.metrics.views) }} views
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="quick-actions">
      <a routerLink="/analysis" class="quick-action">
        <span>✧</span>
        <div>
          <strong>Analyse your content</strong>
          <small>Understand what's working and what isn't.</small>
        </div>
      </a>

      <a routerLink="/ideas" class="quick-action">
        <span>✳</span>
        <div>
          <strong>Generate content ideas</strong>
          <small>Find your next Reel idea with AI.</small>
        </div>
      </a>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  summary: Summary | null = null;
  videos: Video[] = [];

  chartLabels: string[] = [];
  chartValues: number[] = [];

  formatNumber = formatNumber;
  formatDate = formatDate;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.api.summary().subscribe({
      next: data => this.summary = data
    });

    this.api.listVideos().subscribe({
      next: data => {
        this.videos = data;

        const recent = [...data].reverse().slice(-7);

        this.chartLabels = recent.map(v => v.title);
        this.chartValues = recent.map(v => v.metrics.views);
      }
    });
  }
}