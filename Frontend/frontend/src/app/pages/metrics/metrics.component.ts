
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { Metrics, Video } from '../../core/models';
import { formatNumber, formatDate } from '../../core/utils';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <p class="eyebrow">PERFORMANCE TRACKING</p>
        <h1>Reel Metrics</h1>
        <p class="muted">Add or update the Instagram metrics for each Reel.</p>
      </div>
    </div>

    <div class="empty-state panel" *ngIf="videos.length === 0">
      <h3>No Reels found</h3>
      <p>Upload a Reel first to start tracking its performance.</p>
    </div>

    <div class="video-metrics-list">
      <section class="panel metrics-card" *ngFor="let video of videos">

        <div class="metrics-card-header">
          <div>
            <h2>{{ video.title }}</h2>
            <p class="muted">{{ formatDate(video.created_at) }}</p>
          </div>

          <span class="engagement-pill">
            {{ video.engagement_rate }}% engagement
          </span>
        </div>

        <form (ngSubmit)="save(video)">

          <div class="metrics-input-grid">

            <div>
              <label>Views</label>
              <input
                type="number"
                min="0"
                [(ngModel)]="video.metrics.views"
                [name]="'views' + video.id">
            </div>

            <div>
              <label>Likes</label>
              <input
                type="number"
                min="0"
                [(ngModel)]="video.metrics.likes"
                [name]="'likes' + video.id">
            </div>

            <div>
              <label>Comments</label>
              <input
                type="number"
                min="0"
                [(ngModel)]="video.metrics.comments"
                [name]="'comments' + video.id">
            </div>

            <div>
              <label>Shares</label>
              <input
                type="number"
                min="0"
                [(ngModel)]="video.metrics.shares"
                [name]="'shares' + video.id">
            </div>

            <div>
              <label>Saves</label>
              <input
                type="number"
                min="0"
                [(ngModel)]="video.metrics.saves"
                [name]="'saves' + video.id">
            </div>

            <div>
              <label>Reach</label>
              <input
                type="number"
                min="0"
                [(ngModel)]="video.metrics.reach"
                [name]="'reach' + video.id">
            </div>

            <div>
              <label>Followers gained</label>
              <input
                type="number"
                min="0"
                [(ngModel)]="video.metrics.followers_gained"
                [name]="'followers' + video.id">
            </div>

          </div>

          <div class="metrics-card-footer">
            <span class="success-message" *ngIf="savedId === video.id">
              Metrics saved!
            </span>

            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="savingId === video.id">

              {{ savingId === video.id ? 'Saving...' : 'Save metrics' }}

            </button>
          </div>

        </form>
      </section>
    </div>
  `
})
export class MetricsComponent implements OnInit {
  videos: Video[] = [];

  savingId = '';
  savedId = '';

  formatNumber = formatNumber;
  formatDate = formatDate;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadVideos();
  }

  loadVideos(): void {
    this.api.listVideos().subscribe({
      next: data => {
        this.videos = data.map(video => ({
          ...video,
          metrics: {
            ...video.metrics,
            views: video.metrics?.views ?? 0,
            likes: video.metrics?.likes ?? 0,
            comments: video.metrics?.comments ?? 0,
            shares: video.metrics?.shares ?? 0,
            saves: video.metrics?.saves ?? 0,
            reach: video.metrics?.reach ?? 0,
            followers_gained: video.metrics?.followers_gained ?? 0
          }
        }));
      },
      error: error => {
        console.error('Could not load videos:', error);
      }
    });
  }

  save(video: Video): void {
    this.savingId = video.id;
    this.savedId = '';

    const metrics: Metrics = {
      views: Number(video.metrics.views) || 0,
      likes: Number(video.metrics.likes) || 0,
      comments: Number(video.metrics.comments) || 0,
      shares: Number(video.metrics.shares) || 0,
      saves: Number(video.metrics.saves) || 0,
      reach: Number(video.metrics.reach) || 0,
      followers_gained: Number(video.metrics.followers_gained) || 0
    };

    this.api.saveMetrics(video.id, metrics).subscribe({
      next: updated => {
        this.savingId = '';
        this.savedId = video.id;

        Object.assign(video, updated);

        // Ensure metrics remain initialized after the API response.
        video.metrics = {
          views: updated.metrics?.views ?? metrics.views,
          likes: updated.metrics?.likes ?? metrics.likes,
          comments: updated.metrics?.comments ?? metrics.comments,
          shares: updated.metrics?.shares ?? metrics.shares,
          saves: updated.metrics?.saves ?? metrics.saves,
          reach: updated.metrics?.reach ?? metrics.reach,
          followers_gained:
            updated.metrics?.followers_gained ?? metrics.followers_gained
        };
      },
      error: error => {
        this.savingId = '';
        console.error('Could not save metrics:', error);
        alert('Could not save metrics. Please try again.');
      }
    });
  }
}
