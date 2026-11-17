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
      `${this.apiUrl}/videos`,
      formData
    );
  }

  listVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(
      `${this.apiUrl}/videos`
    );
  }

  saveMetrics(
    id: string,
    metrics: Metrics
  ): Observable<Video> {
    return this.http.put<Video>(
      `${this.apiUrl}/videos/${id}/metrics`,
      metrics
    );
  }

  deleteVideo(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/videos/${id}`
    );
  }

  summary(): Observable<Summary> {
    return this.http.get<Summary>(
      `${this.apiUrl}/analytics/summary`
    );
  }

  analyze(id: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/ai/analyze/${id}`,
      {}
    );
  }

  ideas(topic: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/ai/ideas`,
      { topic }
    );
  }

  content(topic: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/ai/content`,
      { topic }
    );
  }

  history(): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(
      `${this.apiUrl}/history`
    );
  }

  deleteHistory(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/history/${id}`
    );
  }
}