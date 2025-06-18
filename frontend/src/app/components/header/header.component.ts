import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentRoute = signal("")

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentRoute.set(this.router.url)
  }
}
