
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthResponse, User } from './models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(this.getSavedUser());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getSavedUser(): User | null {
    const saved = localStorage.getItem('growthlens_user');

    if (!saved) return null;

    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }

  get token(): string | null {
    return localStorage.getItem('growthlens_token');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  register(
    name: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/api/auth/register`,
      { name, email, password }
    ).pipe(
      tap(response => this.saveSession(response))
    );
  }

  login(
    email: string,
    password: string
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/api/auth/login`,
      { email, password }
    ).pipe(
      tap(response => this.saveSession(response))
    );
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem(
      'growthlens_token',
      response.access_token
    );

    localStorage.setItem(
      'growthlens_user',
      JSON.stringify(response.user)
    );

    this.currentUser.set(response.user);
  }

  logout(): void {
    localStorage.removeItem('growthlens_token');
    localStorage.removeItem('growthlens_user');

    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
