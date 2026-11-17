import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from '../../core/api.service';
import { HistoryItem } from '../../core/models';
import { formatDate } from '../../core/utils';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <p class="eyebrow">YOUR WORKSPACE</p>
        <h1>History</h1>
        <p class="muted">Your previous AI analyses and generated content.</p>
      </div>
    </div>

    <div class="empty-state panel" *ngIf="items.length === 0">
      <h3>No history yet</h3>
      <p>Your generated analyses and content will appear here.</p>
    </div>

    <div class="history-list">

      <article class="panel history-card" *ngFor="let item of items">

        <div class="history-info">
          <span class="history-type">{{ item.type }}</span>

          <h3>
            {{ item.video_title || item.topic || 'Untitled result' }}
          </h3>

          <small>{{ formatDate(item.created_at) }}</small>
        </div>

        <button
          class="btn btn-danger-outline"
          (click)="deleteItem(item.id)">

          Delete

        </button>

      </article>

    </div>
  `
})
export class HistoryComponent implements OnInit {
  items: HistoryItem[] = [];

  formatDate = formatDate;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.api.history().subscribe({
      next: data => this.items = data
    });
  }

  deleteItem(id: string): void {
    if (!confirm('Delete this history item?')) return;

    this.api.deleteHistory(id).subscribe({
      next: () => {
        this.items = this.items.filter(item => item.id !== id);
      },
      error: () => alert('Could not delete this item.')
    });
  }
}