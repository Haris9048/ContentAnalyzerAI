import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  template: `
    <div class="app-shell">

      <aside class="sidebar">
        <div class="brand">
          <div class="brand-icon">G</div>
          <span>GrowthLens</span>
        </div>

        <nav>
          <p class="nav-label">WORKSPACE</p>

          <a routerLink="/" routerLinkActive="active"
             [routerLinkActiveOptions]="{exact: true}">
            <span>▦</span> Dashboard
          </a>

          <a routerLink="/upload" routerLinkActive="active">
            <span>↑</span> Upload Reel
          </a>

          <a routerLink="/metrics" routerLinkActive="active">
            <span>◷</span> Metrics
          </a>

          <a routerLink="/analysis" routerLinkActive="active">
            <span>✧</span> AI Analysis
          </a>

          <a routerLink="/ideas" routerLinkActive="active">
            <span>✳</span> Content Ideas
          </a>

          <a routerLink="/history" routerLinkActive="active">
            <span>↻</span> History
          </a>
        </nav>

        <div class="sidebar-bottom">
          <div class="user-info">
            <div class="avatar">
              {{ auth.currentUser()?.name?.charAt(0) || 'U' }}
            </div>

            <div class="user-text">
              <strong>{{ auth.currentUser()?.name }}</strong>
              <small>{{ auth.currentUser()?.email }}</small>
            </div>
          </div>

          <button class="logout-btn" (click)="auth.logout()">
            Log out
          </button>
        </div>
      </aside>

      <main class="main-area">
        <header class="topbar">
          <div>
            <span class="topbar-title">Instagram Growth Analyser</span>
          </div>

          <span class="status-pill">● Workspace</span>
        </header>

        <div class="page-content">
          <router-outlet />
        </div>
      </main>

    </div>
  `
})
export class LayoutComponent {
  constructor(public auth: AuthService) {}
}