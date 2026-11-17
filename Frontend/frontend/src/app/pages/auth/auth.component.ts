import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">

        <div class="brand auth-brand">
          <div class="brand-icon">G</div>
          <span>GrowthLens</span>
        </div>

        <h1>{{ isRegister ? 'Create your account' : 'Welcome back' }}</h1>
        <p class="muted">
          {{ isRegister
            ? 'Start understanding your Instagram growth.'
            : 'Log in to your GrowthLens workspace.' }}
        </p>

        <form (ngSubmit)="submit()">

          <label *ngIf="isRegister">Name</label>
          <input
            *ngIf="isRegister"
            [(ngModel)]="name"
            name="name"
            placeholder="Your name"
            required
            minlength="2">

          <label>Email</label>
          <input
            type="email"
            [(ngModel)]="email"
            name="email"
            placeholder="you@example.com"
            required>

          <label>Password</label>
          <input
            type="password"
            [(ngModel)]="password"
            name="password"
            placeholder="At least 6 characters"
            required
            minlength="6">

          <p class="error-message" *ngIf="error">
            {{ error }}
          </p>

          <button class="btn btn-primary full-width" [disabled]="loading">
            {{ loading
              ? 'Please wait...'
              : (isRegister ? 'Create account' : 'Log in') }}
          </button>

        </form>

        <p class="auth-switch">
          {{ isRegister ? 'Already have an account?' : "Don't have an account?" }}

          <button type="button" (click)="toggleMode()">
            {{ isRegister ? 'Log in' : 'Create account' }}
          </button>
        </p>

      </div>
    </div>
  `
})
export class AuthComponent {
  isRegister = false;
  loading = false;

  name = '';
  email = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    if (this.auth.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  toggleMode(): void {
    this.isRegister = !this.isRegister;
    this.error = '';
  }

  submit(): void {
    this.error = '';
    this.loading = true;

    const request = this.isRegister
      ? this.auth.register(this.name, this.email, this.password)
      : this.auth.login(this.email, this.password);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: err => {
        this.loading = false;
        this.error =
          err.error?.detail || 'Something went wrong. Please try again.';
      }
    });
  }
}