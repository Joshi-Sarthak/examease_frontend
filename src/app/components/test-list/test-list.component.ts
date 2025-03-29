import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClassroomService } from '../../../services/classroom.service';
import { TestService } from '../../../services/test.service';
import { AuthService } from '../../../services/auth.service';
import { ResultService } from '../../../services/result.service';
import { TestData } from '../../../models/test.model';
import { TestResult } from '../../../models/test-result.model';

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css'],
})
export class TestListComponent {
  classroomId: string = '';
  tests: TestData[] = [];
  userRole: 'teacher' | 'student' | null = null;
  studentResults: { [testId: string]: TestResult | null } = {};
  dropdownOpen: { [key: string]: boolean } = {};
  currentUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classroomService: ClassroomService,
    private testService: TestService,
    private resultService: ResultService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.classroomId = this.route.snapshot.paramMap.get('classroomId') || '';
    this.authService.getUser().subscribe((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.currentUserId = user.userId;
        this.loadData(user.userId);
      }
    });
  }

  private loadData(userId: string): void {
    this.tests = this.testService.getTests(this.classroomId);
    const classroom = this.classroomService.getClassroomById(this.classroomId);
    this.userRole = classroom?.teacherId === userId ? 'teacher' : 'student';

    if (this.userRole === 'student') {
      this.tests.forEach((test) => {
        const result = this.resultService.getResults(test.testId).find(r => r.studentId === userId);
        this.studentResults[test.testId] = result || null;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/classroom-list']);
  }

  navigateToQuestionBuilder(): void {
    if (this.userRole === 'teacher') {
      this.router.navigate(['/question-builder', this.classroomId]);
    }
  }

  startTest(testId: string): void {
    this.router.navigate(['/attempt-test', this.classroomId, testId]);
  }

  deleteTest(testId: string): void {
    if (this.userRole === 'teacher') {
      this.testService.deleteTest(this.classroomId, testId);
      this.tests = this.testService.getTests(this.classroomId);
    }
  }

  editTest(testId: string): void {
    this.router.navigate(['/question-builder', this.classroomId, testId]);
  }

  viewResults(testId: string): void {
    if (this.userRole === 'teacher') {
      console.log('View results clicked', this.classroomId);
      this.router.navigate(['/teacher-result', testId], {
        queryParams: { classroomId: this.classroomId },
      });
    }
  }

  toggleDropdown(testId: string, event: Event): void {
    event.stopPropagation();
    this.dropdownOpen[testId] = !this.dropdownOpen[testId];
  }
}
