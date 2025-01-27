import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { helloIsomorphic } from '@monorepo-ng-nest/isomorphic';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit {
  readonly messageFromLib = helloIsomorphic();
  messageFromApi = 'loading...';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{ message: string }>('http://localhost:3000/hello')
      .subscribe({
        next: (response) => {
          this.messageFromApi = response.message;
        },
        error: (error) => {
          console.error('Error fetching message:', error);
          this.messageFromApi = 'Error loading message from API';
        }
      });
  }
}
