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
  classroomName = '';
  classroomCode = '';
  dropdownOpen: string | null = null;
  user: any = null;

  showCreatePrompt = false;
  showJoinPrompt = false;

  constructor(
    private classroomService: ClassroomService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        if (!this.user) {
          this.router.navigate(['/login']);
        } else {
          this.loadUserClassrooms();
        }
      },
      error: (err) => console.error('Error fetching user:', err)
    });
  }

  loadUserClassrooms(): void {
    this.classroomService.getUserClassrooms(this.user.userId).subscribe({
      next: (classrooms) => (this.classrooms = classrooms),
      error: (err) => console.error('Error fetching classrooms:', err)
    });
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

    this.classroomService.createClassroom(this.classroomName, this.user.userId, this.user.fullName).subscribe({
      next: (classroom) => {
        if (classroom) {
          this.classrooms.push(classroom);
          this.cancelCreate();
        }
      },
      error: (err) => {
        alert('Error creating classroom');
        console.error('Error:', err);
      }
    });
  }

  joinClassroom(): void {
    if (!this.classroomCode.trim()) {
      alert('Enter a valid classroom code!');
      return;
    }

    this.classroomService.joinClassroom(this.user.userId, this.classroomCode).subscribe({
      next: (classroom) => {
        if (classroom) {
          alert('Joined Successfully!');
          this.classrooms.push(classroom);
          this.cancelJoin();
          this.router.navigate(['/test-list', classroom.classroomId]);
        }
      },
      error: (err) => {
        alert(err);
      }
    });
  }

  openClassroom(classroom: ClassroomData): void {
    this.classroomService.setClassroom(classroom);
    this.router.navigate(['/test-list', classroom.classroomId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  copyClassroomCode(classroomCode: string): void {
    navigator.clipboard.writeText(classroomCode).then(() => {
      alert('Classroom code copied to clipboard!');
    });
  }

  confirmDeleteClassroom(classroomId: string): void {
    if (confirm('Are you sure you want to delete this classroom? This action cannot be undone.')) {
      this.classroomService.deleteClassroom(this.user.userId, classroomId).subscribe({
        next: () => (this.classrooms = this.classrooms.filter((c) => c.classroomId !== classroomId)),
        error: (err) => console.error('Error deleting classroom:', err)
      });
    }
  }

  leaveClassroom(classroomId: string): void {
    if (confirm('Are you sure you want to leave this classroom?')) {
      this.classroomService.leaveClassroom(this.user.userId, classroomId).subscribe({
        next: () => (this.classrooms = this.classrooms.filter((c) => c.classroomId !== classroomId)),
        error: (err) => console.error('Error leaving classroom:', err)
      });
    }
  }

  toggleDropdown(classroomId: string): void {
    this.dropdownOpen = this.dropdownOpen === classroomId ? null : classroomId;
  }

  closeDropdown(): void {
    this.dropdownOpen = null;
  }

  closeDropdownOnClickOutside(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.relative')) {
      this.closeDropdown();
    }
  }
}
