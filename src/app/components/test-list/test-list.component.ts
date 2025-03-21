import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TestData } from '../../../models/test.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent {
startTest(arg0: string) {
throw new Error('Method not implemented.');
}
deleteTest(arg0: string) {
throw new Error('Method not implemented.');
}
  classroomId: string = '';
  tests: TestData[] = [];
  dropdownOpen: { [testId: string]: boolean } = {};
  userRole: 'teacher' | 'student' | null = null; // Store user role

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.classroomId = this.route.snapshot.paramMap.get('classroomId') || '';
    this.tests = this.localStorageService.getTestsForClassroom(this.classroomId);
    this.userRole = this.localStorageService.getUserRole(this.classroomId); // Get user role
  }

  goBack(): void {
    this.router.navigate(['/classroom-list']);
  }

  navigateToQuestionBuilder(): void {
    if (this.userRole === 'teacher') {
      this.router.navigate(['/question-builder', this.classroomId]);
    }
  }

  toggleDropdown(testId: string, event: Event): void {
    event.stopPropagation();
    this.dropdownOpen[testId] = !this.dropdownOpen[testId];
  }

  editTest(testId: string): void {
    if (this.userRole === 'teacher') {
      this.router.navigate(['/question-builder', this.classroomId, testId]);
    }
  }
}
