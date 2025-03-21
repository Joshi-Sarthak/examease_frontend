import { Component, ChangeDetectorRef, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { McqTestComponent } from './mcq-test/mcq-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet
],
  template: `
      <div class="content">
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
    `
  ],
})
export class AppComponent implements AfterViewInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private cdRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener("click", (event) => {
        console.log("Clicked:", event.target);
        this.cdRef.detectChanges();
      });
    }
  }
}