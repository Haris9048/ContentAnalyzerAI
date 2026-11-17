import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { formatFileSize } from '../../core/utils';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <p class="eyebrow">CONTENT LIBRARY</p>
        <h1>Upload a Reel</h1>
        <p class="muted">Add a video and its details to your workspace.</p>
      </div>
    </div>

    <section class="panel form-panel">

      <form (ngSubmit)="upload()">

        <label>Reel title</label>
        <input
          [(ngModel)]="title"
          name="title"
          placeholder="Example: 5 mistakes new creators make"
          required>

        <label>Creator notes</label>
        <textarea
          [(ngModel)]="notes"
          name="notes"
          rows="5"
          placeholder="Describe the Reel, its hook, format, topic and anything important for the AI analysis.">
        </textarea>

        <label>Video file</label>

        <div class="upload-drop">
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/x-msvideo"
            (change)="onFileSelected($event)">

          <div class="upload-icon">↑</div>
          <strong>{{ file?.name || 'Choose your video' }}</strong>

          <small>
            MP4, MOV or AVI. Maximum size: 100 MB.
          </small>

          <small *ngIf="file">
            {{ formatFileSize(file.size) }}
          </small>
        </div>

        <p class="error-message" *ngIf="error">{{ error }}</p>
        <p class="success-message" *ngIf="success">{{ success }}</p>

        <button
          class="btn btn-primary"
          [disabled]="loading || !file || !title.trim()">

          {{ loading ? 'Uploading...' : 'Upload Reel' }}

        </button>

      </form>
    </section>
  `
})
export class UploadComponent {
  title = '';
  notes = '';

  file: File | null = null;

  loading = false;
  error = '';
  success = '';

  formatFileSize = formatFileSize;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selected = input.files?.[0];

    this.error = '';

    if (!selected) {
      this.file = null;
      return;
    }

    const allowed = [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo'
    ];

    if (!allowed.includes(selected.type)) {
      this.error = 'Please choose an MP4, MOV or AVI video.';
      this.file = null;
      return;
    }

    if (selected.size > 100 * 1024 * 1024) {
      this.error = 'The video must be smaller than 100 MB.';
      this.file = null;
      return;
    }

    this.file = selected;
  }

  upload(): void {
    if (!this.file || !this.title.trim()) return;

    this.loading = true;
    this.error = '';

    this.api.uploadVideo(
      this.title,
      this.notes,
      this.file
    ).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Video uploaded successfully!';

        setTimeout(() => {
          this.router.navigate(['/metrics']);
        }, 800);
      },
      error: err => {
        this.loading = false;
        this.error =
          err.error?.detail || 'Upload failed. Please try again.';
      }
    });
  }
}