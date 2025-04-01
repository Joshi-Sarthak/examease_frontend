import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  name: string = 'John Doe';
  email: string = 'johndoe@example.com';
  

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  saveProfile() {
    alert('Profile saved successfully!');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
