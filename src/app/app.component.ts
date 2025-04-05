import {
  Component,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  RouterOutlet,
  RouterLink,
  Router,
  NavigationEnd,
} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="content">
      <app-navbar *ngIf="showNavbar"></app-navbar>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .app-container {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      .nav-link {
        cursor: pointer;
        margin: 10px;
        padding: 10px;
        display: inline-block;
        text-decoration: underline;
        color: blue;
      }
    `,
  ],
})
export class AppComponent implements AfterViewInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  showNavbar: boolean = true;

  constructor(
    private cdRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showNavbar = !['/login', '/signup'].includes(
          event.urlAfterRedirects
        );
      });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', (event) => {
        this.cdRef.detectChanges();
      });
    }
  }
}
