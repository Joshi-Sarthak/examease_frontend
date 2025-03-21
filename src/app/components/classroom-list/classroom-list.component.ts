import { Component } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ClassroomData } from '../../../models/classroom.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classroom-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classroom-list.component.html',
  styleUrls: ['./classroom-list.component.css']
  
})
export class ClassroomListComponent {
  classrooms: ClassroomData[] = [];
  classroomName: string = '';
  classroomCode: string = '';

  showCreatePrompt: boolean = false;
  showJoinPrompt: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.classrooms = this.localStorageService.getClassrooms();
  }

  toggleCreatePrompt(): void {
    this.showCreatePrompt = true;
  }

  toggleJoinPrompt(): void {
    this.showJoinPrompt = true;
  }

  createClassroom(): void {
    if (!this.classroomName.trim()) {
      alert("Enter a valid classroom name!");
      return;
    }

    const classroom: ClassroomData = {
      classroomId: Date.now().toString(),
      classroomName: this.classroomName,
      classroomCode: Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: new Date(),
    };

    this.localStorageService.saveClassroom(classroom);
    this.classrooms.push(classroom);
    this.classroomName = '';
    this.showCreatePrompt = false;
  }

  joinClassroom(): void {
    const classroom = this.localStorageService.getClassroomByCode(this.classroomCode);
    if (classroom) {
      alert('Joined Successfully!');
      this.showJoinPrompt = false;
      this.classroomCode = '';
      this.router.navigate(['/test-list', classroom.classroomId]);
    } else {
      alert('Invalid Code!');
    }
  }

  cancelCreate(): void {
    this.showCreatePrompt = false;
    this.classroomName = '';
  }

  cancelJoin(): void {
    this.showJoinPrompt = false;
    this.classroomCode = '';
  }

  openClassroom(classroomId: string): void {
    this.router.navigate(['/test-list', classroomId]);
  }

  goToMcqTest(): void {
    this.router.navigate(['/mcq-test']);
  }
  
}