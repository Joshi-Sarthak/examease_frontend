import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuOpen: boolean = false;  // ✅ Define menu state

  toggleMenu() {  
    this.menuOpen = !this.menuOpen;  // ✅ Toggle state
  }

  logout() {
    console.log("Logging out...");
    // ✅ Add real logout logic here
  }
}
