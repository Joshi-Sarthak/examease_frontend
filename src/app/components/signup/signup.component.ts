import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({ 
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],  // ✅ Required for ngModel
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup(): void {
    this.errorMessage = '';

    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    if (this.authService.isUsernameTaken(this.username)) {
      this.errorMessage = 'Username is already taken!';
      return;
    }

    if (this.authService.isEmailTaken(this.email)) {
      this.errorMessage = 'Email is already registered!';
      return;
    }

    this.authService.register(this.username, this.email, this.password);
    alert('Signup successful! Please login.');
    this.router.navigate(['/login']);
  }
}
