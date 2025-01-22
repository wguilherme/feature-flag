import { Route } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: WelcomeComponent
  }
];
