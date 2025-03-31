import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClassroomService } from '../../../services/classroom.service';
import { TestService } from '../../../services/test.service';
import { AuthService } from '../../../services/auth.service';
import { TestData, Result } from '../../../models/test.model';
import { ClassroomData } from '../../../models/classroom.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css'],
})
export class TestListComponent {
  classroomId: string = '';
  classroom: ClassroomData | null = null;
  tests: TestData[] = [];
  userRole: 'teacher' | 'student' | null = null;
  studentResults: { [testId: string]: Result | null } = {};
  dropdownOpen: { [key: string]: boolean } = {};
  currentUserId: string = '';
  showNotFoundError: boolean = false;
  private routerSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classroomService: ClassroomService,
    private testService: TestService,
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

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!event.url.includes('/test-list/' + this.classroomId) && !event.url.includes('/teacher-result')) {
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
    this.tests = this.testService.getTestsForClassroom(this.classroom!.classroomId);
    this.userRole = this.classroom?.teacherId === userId ? 'teacher' : 'student';

    if (this.userRole === 'student') {
      this.tests.forEach((test) => {
        const resultsArray = Array.isArray(test.result) ? test.result : [];
        const result = resultsArray.filter((r) => r.studentId === userId);
        this.studentResults[test.testId] = result.length > 0 ? result[0] : null;
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
      this.tests = this.tests.filter(test => test.testId !== testId);
    }
  }  

  editTest(test: TestData): void {
    this.testService.setTest(test);
    this.router.navigate(['/question-builder', this.classroom!.classroomId, test.testId]);
  }

  viewResults(test: TestData): void {
    if (this.userRole === 'teacher') {
      this.classroomService.setClassroom(this.classroom!);
      this.testService.setTest(test);
      this.router.navigate(['/teacher-result', test.testId], {
        queryParams: { classroomId: this.classroom!.classroomId },
      });
    }
  }

  toggleDropdown(testId: string, event: Event): void {
    event.stopPropagation();
    this.dropdownOpen[testId] = !this.dropdownOpen[testId];
  }
}
