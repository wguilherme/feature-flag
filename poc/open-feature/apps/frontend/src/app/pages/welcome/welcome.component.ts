import { Component } from '@angular/core';
import { HelloComponent } from '../../components/hello/hello.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [HelloComponent],
  template: `
    <div class="welcome-container">
      <h1>Welcome to Feature Flag</h1>
      <app-hello></app-hello>
    </div>
  `,
  styles: [`
    .welcome-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
    }
  `]
})
export class WelcomeComponent {}
