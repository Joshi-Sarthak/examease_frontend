import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClassroomService } from '../../../services/classroom.service';
import { TestService } from '../../../services/test.service';
import { AuthService } from '../../../services/auth.service';
import { ResultService } from '../../../services/result.service';
import { TestData } from '../../../models/test.model';
import { TestResult } from '../../../models/test-result.model';
import { ClassroomData } from '../../../models/classroom.model';
import { stat } from 'node:fs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css'],
})
export class TestListComponent {
  classroomId: string = '';
  classroom: ClassroomData | null = null;
  tests: TestData[] = [];
  userRole: 'teacher' | 'student' | null = null;
  studentResults: { [testId: string]: TestResult | null } = {};
  dropdownOpen: { [key: string]: boolean } = {};
  currentUserId: string = '';
  showNotFoundError: boolean = false;
  private routerSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classroomService: ClassroomService,
    private testService: TestService,
    private resultService: ResultService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.classroom = this.classroomService.getClassroom();

    if (!this.classroom) {
      this.route.paramMap.subscribe((params) => {
        this.classroomId = params.get('classroomId') || '';

        if (this.classroomId) {
          this.classroom = this.classroomService.getClassroomById(this.classroomId);
        }

        if (!this.classroom) {
          this.showNotFoundError = true;
        } else {
          this.loadUserData();
        }
      });
    } else {
      this.loadUserData();
    }
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (!event.url.includes('/test-list')) {
          console.log('Navigating away from test-list, clearing classroom data');
          this.classroomService.setClassroom(null);
        }
      }
    });
  }

  private loadUserData(): void {
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
    this.tests = this.testService.getTests(this.classroom!.classroomId);
    this.userRole = this.classroom?.teacherId === userId ? 'teacher' : 'student';

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

  isTestActive(startTime: Date, deadlineTime: Date): boolean {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const deadline = new Date(deadlineTime).getTime();
    
    return now >= start && now <= deadline;
  }
  
  
  navigateToQuestionBuilder(): void {
    if (this.userRole === 'teacher') {
      this.router.navigate(['/question-builder', this.classroom!.classroomId]);
    }
  }

  startTest(testId: string): void {
    this.router.navigate(['/attempt-test', this.classroom!.classroomId, testId]);
  }

  deleteTest(testId: string): void {
    if (this.userRole === 'teacher') {
      this.testService.deleteTest(this.classroom!.classroomId, testId);
      this.tests = this.testService.getTests(this.classroom!.classroomId);
    }
  }

  editTest(testId: string): void {
    this.router.navigate(['/question-builder', this.classroom!.classroomId, testId]);
  }

  viewResults(testId: string): void {
    if (this.userRole === 'teacher') {
      console.log('View results clicked', this.classroom!.classroomId);
      this.router.navigate(['/teacher-result', testId], {
        state: { classroom: this.classroom }
      });
    }
  }

  toggleDropdown(testId: string, event: Event): void {
    event.stopPropagation();
    this.dropdownOpen[testId] = !this.dropdownOpen[testId];
  }
}
