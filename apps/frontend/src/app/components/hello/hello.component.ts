import { Component } from '@angular/core';
import { helloIsomorphic } from '@monorepo-ng-nest/isomorphic';

@Component({
  selector: 'app-hello',
  standalone: true,
  templateUrl: './hello.component.html',
  styleUrl: './hello.component.scss'
})
export class HelloComponent {
  readonly message = helloIsomorphic();
}
