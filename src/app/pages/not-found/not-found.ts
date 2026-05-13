import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="not-found__content">
        <span class="not-found__code">404</span>
        <h2 class="not-found__title">Page Not Found</h2>
        <p class="not-found__message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a routerLink="/" class="not-found__link">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </a>
      </div>
    </div>
  `,
  styleUrl: './not-found.scss',
})
export class NotFoundComponent {}
