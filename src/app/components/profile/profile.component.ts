import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  name: string = 'John Doe';
  email: string = 'johndoe@example.com';
  role: string = 'Student'; // Change based on user role
  profilePicture: string = 'https://via.placeholder.com/100';

  saveProfile() {
    alert('Profile saved successfully!');
  }
}
