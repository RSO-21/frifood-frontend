import { Component, inject, signal } from '@angular/core';

import { MockDataService } from './services/mock';
import { Navbar } from './navbar/navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  protected readonly title = signal('FriFood');
  // private readonly MockDataService = inject(MockDataService);

  // ngOnInit() {
  //   this.MockDataService.seedDatabase().subscribe((result) => {
  //     console.log('Database seeded with mock data:', result);
  //   });
  // }
}
