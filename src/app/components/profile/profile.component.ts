import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { UserData } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserData | null = null;
  name: string = '';
  username: string = '';
  email: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (user) => {
        if (!user) {
          this.router.navigate(['/login']);
          return;
        }
        this.user = user;
        this.name = user.fullName;
        this.username = user.username;
        this.email = user.email;
      },
      error: (err) => console.error('Error fetching user:', err)
    });
  }

  saveProfile(): void {
    if (!this.user) return;

    const updates = {
      fullName: this.name,
      username: this.username
    };

    this.userService.editUser(this.user.userId, updates).subscribe({
      next: () => alert('Profile updated successfully!'),
      error: (err) => console.error('Error updating profile:', err)
    });
  }

  deleteAccount(): void {
    if (!this.user) return;

    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;

    this.userService.deleteUser(this.user.userId).subscribe({
      next: () => {
        alert('Account deleted successfully.');
        this.authService.logout();
        this.router.navigate(['/register']);
      },
      error: (err) => console.error('Error deleting account:', err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}