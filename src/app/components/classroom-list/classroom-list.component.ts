import { Component } from '@angular/core';
import { ClassroomService } from '../../../services/classroom.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ClassroomData } from '../../../models/classroom.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classroom-list',
  standalone: true,
  templateUrl: './classroom-list.component.html',
  styleUrls: ['./classroom-list.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ClassroomListComponent {
  classrooms: ClassroomData[] = [];
  classroomName: string = '';
  classroomCode: string = '';
  user: any = null;

  showCreatePrompt: boolean = false;
  showJoinPrompt: boolean = false;

  constructor(
    private classroomService: ClassroomService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe((user) => {
      this.user = user;
      if (!this.user) {
        this.router.navigate(['/login']);
      } else {
        this.loadUserClassrooms();
      }
    });
  }

  /** Load classrooms related to the logged-in user */
  loadUserClassrooms(): void {
    this.classrooms = this.classroomService.getUserClassrooms(this.user.userId);
  }

  toggleCreatePrompt(): void {
    this.showCreatePrompt = !this.showCreatePrompt;
  }

  toggleJoinPrompt(): void {
    this.showJoinPrompt = !this.showJoinPrompt;
  }

  cancelCreate(): void {
    this.showCreatePrompt = false;
    this.classroomName = '';
  }

  cancelJoin(): void {
    this.showJoinPrompt = false;
    this.classroomCode = '';
  }

  createClassroom(): void {
    if (!this.classroomName.trim()) {
      alert('Enter a valid classroom name!');
      return;
    }

    const classroomId = Date.now().toString();
    this.classroomService.createClassroom(classroomId, this.classroomName, this.user.userId);
    this.loadUserClassrooms();

    this.classroomName = '';
    this.showCreatePrompt = false;
  }

  joinClassroom(): void {
    if (!this.classroomCode.trim()) {
      alert('Enter a valid classroom code!');
      return;
    }

    const classroom = this.classroomService.joinClassroom(this.classroomCode, this.user.userId);
    if (classroom) {
      alert('Joined Successfully!');
      this.loadUserClassrooms();
      this.showJoinPrompt = false;
      this.classroomCode = '';
      this.router.navigate(['/test-list', classroom.classroomId]);
    } else {
      alert('Invalid Code!');
    }
  }

  openClassroom(classroomId: string): void {
    this.router.navigate(['/test-list', classroomId]);
  }
}
