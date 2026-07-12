import { Injectable } from '@angular/core';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else {
      console.warn(`[Analytics] gtag no disponible, evento no enviado: ${eventName}`);
    }
  }

  trackLogin(email: string): void {
    this.trackEvent('login', {
      method: 'app',
      user_email: email,
    });
  }

  trackSearch(searchTerm: string): void {
    this.trackEvent('search_items', {
      search_term: searchTerm,
    });
  }

  trackRefresh(): void {
    this.trackEvent('refresh_items');
  }
}
