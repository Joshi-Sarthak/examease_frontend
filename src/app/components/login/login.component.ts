import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName: string = '';
  classroomCode: string = '';
  role: 'teacher' | 'student' | null = null;

  constructor(private router: Router, private localStorageService: LocalStorageService) {}

  login(): void {
    if (!this.userName || !this.role) {
      alert('Please enter your name and select a role.');
      return;
    }

    if (this.role === 'teacher') {
      const classroomId = `class_${Date.now()}`;
      const classroomName = `Classroom_${Math.floor(Math.random() * 1000)}`; // Generate a random name
      this.localStorageService.createClassroom(classroomId, classroomName, this.userName);
      this.router.navigate(['/classroom', classroomId]); // Navigate teacher to their new classroom
    } else if (this.role === 'student') {
      if (!this.classroomCode) {
        alert('Please enter a classroom code.');
        return;
      }

      const classroom = this.localStorageService.getClassroomByCode(this.classroomCode);
      if (!classroom) {
        alert('Classroom not found!');
        return;
      }

      this.localStorageService.joinClassroom(this.classroomCode, this.userName);
      this.router.navigate(['/classroom', this.classroomCode]); // Navigate student to the classroom
    }
  }
}
