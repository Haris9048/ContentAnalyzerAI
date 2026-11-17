
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Video,
  Metrics,
  Summary,
  HistoryItem
} from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // =========================
  // AUTHENTICATION
  // =========================

  login(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/auth/login`,
      data
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/auth/register`,
      data
    );
  }

  // =========================
  // VIDEO MANAGEMENT
  // =========================

  uploadVideo(
    title: string,
    notes: string,
    file: File
  ): Observable<Video> {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('notes', notes);
    formData.append('file', file);

    return this.http.post<Video>(
      `${this.apiUrl}/api/videos`,
      formData
    );
  }

  listVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(
      `${this.apiUrl}/api/videos`
    );
  }

  saveMetrics(
    id: string,
    metrics: Metrics
  ): Observable<Video> {
    return this.http.put<Video>(
      `${this.apiUrl}/api/videos/${id}/metrics`,
      metrics
    );
  }

  deleteVideo(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/videos/${id}`
    );
  }

  // =========================
  // ANALYTICS
  // =========================

  summary(): Observable<Summary> {
    return this.http.get<Summary>(
      `${this.apiUrl}/api/analytics/summary`
    );
  }

  // =========================
  // AI FEATURES
  // =========================

  analyze(id: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/ai/analyze/${id}`,
      {}
    );
  }

  ideas(topic: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/ai/ideas`,
      { topic }
    );
  }

  content(topic: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/ai/content`,
      { topic }
    );
  }

  // =========================
  // HISTORY
  // =========================

  history(): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(
      `${this.apiUrl}/api/history`
    );
  }

  deleteHistory(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/history/${id}`
    );
  }
}
