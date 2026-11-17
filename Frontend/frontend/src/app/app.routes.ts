import { Routes } from '@angular/router';

import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UploadComponent } from './pages/upload/upload.component';
import { MetricsComponent } from './pages/metrics/metrics.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';
import { IdeasComponent } from './pages/ideas/ideas.component';
import { HistoryComponent } from './pages/history/history.component';

import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'upload',
        component: UploadComponent
      },
      {
        path: 'metrics',
        component: MetricsComponent
      },
      {
        path: 'analysis',
        component: AnalysisComponent
      },
      {
        path: 'ideas',
        component: IdeasComponent
      },
      {
        path: 'history',
        component: HistoryComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];