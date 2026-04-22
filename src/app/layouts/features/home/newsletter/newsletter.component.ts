import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-newsletter',
  imports: [],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css',
})
export class NewsletterComponent {
  readonly email = signal('');
  readonly isSubscribed = signal(false);

  subscribe(): void {
    if (!this.email().trim()) return;
    this.isSubscribed.set(true);
    this.email.set('');
  }
}
