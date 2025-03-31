import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ClassroomService } from '../../../services/classroom.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    private classroomService: ClassroomService,
    private authService: AuthService,
    private router: Router
  ) {}
  menuOpen: boolean = false;  // ✅ Define menu state

  toggleMenu() {  
    this.menuOpen = !this.menuOpen;  // ✅ Toggle state
  }

  logout() {
    console.log("Logging out...");
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
//944857