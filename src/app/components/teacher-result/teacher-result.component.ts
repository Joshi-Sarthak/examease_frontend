import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestService } from '../../../services/test.service';
import { ClassroomService } from '../../../services/classroom.service';
import { ClassroomData } from '../../../models/classroom.model';
import { TestData } from '../../../models/test.model';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Result } from '../../../models/test.model';
import test from 'node:test';

@Component({
  selector: 'app-teacher-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-result.component.html',
  styleUrls: ['./teacher-result.component.css'],
})
export class TeacherResultComponent implements OnInit {
  testId!: string;
  results: Result[] = [];
  studentsInClassroom: string[] = [];
  studentsNotTested: string[] = [];
  isLoading: boolean = true;
  classroomId: string = '';
  classroom: ClassroomData | null = null;
  test: TestData | null = null;
  private routerSubscription!: Subscription;

  totalStudents: number = 0;
  studentsAttempted: number = 0;
  studentsNotAttempted: number = 0;
  classAverage: number = 0;
  highestScore: number = 0;
  lowestScore: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private testService: TestService,
    private classroomService: ClassroomService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (!event.url.includes('/teacher-result')) {
          // this.classroomService.setClassroom(null);
        }
      }
    });

    this.authService.getUser().subscribe((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      } else if (this.classroom?.teacherId !== user.userId) {
        console.log('User is not the teacher of this classroom', this.classroom?.teacherId, user.userId);
        // this.router.navigate(['/classroom-list']);
      }
    });

    console.log('TeacherResultComponent initialized');

    this.classroom = this.classroomService.getClassroom();
    if (!this.classroom) {
      this.route.paramMap.subscribe((params) => {
        this.classroomId = params.get('classroomId') || '';

        if (this.classroomId) {
          this.classroom = this.classroomService.getClassroomById(this.classroomId);
        }

        // if still classroom is null, show Error 404 classroom Not found
      });
    }

    this.test = this.testService.getTest();
    console.log('Test:', this.test);
    if (!this.test) {
      this.route.paramMap.subscribe((params) => {
        this.testId = this.route.snapshot.paramMap.get('testId')!;

        if (this.testId) {
          this.test = this.testService.getTestById(this.testId);
        }

        // if still classroom is null, show Error 404 classroom Not found
      });
    }

    this.testId = this.route.snapshot.paramMap.get('testId')!;
    this.fetchTestResults();
  }

  fetchTestResults() {
    this.results = this.test?.result || [];
    this.findStudentsNotTested();
    this.calculateStats();
    this.isLoading = false;
  }

  calculateStats() {
    if (this.results.length === 0) return;

    const correctAnswerCounts = this.results.map(r => r.result);

    this.studentsAttempted = this.results.length;
    this.totalStudents = this.studentsInClassroom.length;
    this.studentsNotAttempted = this.totalStudents - this.studentsAttempted;

    const totalCorrectAnswers = correctAnswerCounts.reduce((acc, val) => acc + val, 0);

    this.classAverage = this.studentsAttempted > 0 ? totalCorrectAnswers / this.studentsAttempted : 0;
    this.highestScore = Math.max(...correctAnswerCounts);
    this.lowestScore = Math.min(...correctAnswerCounts);
  }

  viewStudentResult(studentId: string) {
    this.router.navigate([`/student-result/${this.testId}`], { queryParams: { studentId } });
  }

  exportCSV() {
    let csvContent = "Student Name,Correct Answers\n";
    this.results.forEach((result) => {
      csvContent += `${result.studentId},${result.result}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test_results_${this.testId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  goBack() {
    const classroomId = this.route.snapshot.queryParamMap.get('classroomId')!;
    this.router.navigate(['/test-list', classroomId]);
  }

  private findStudentsNotTested() {
    this.studentsInClassroom = this.classroom?.students || []; 
    console.log('Students in classroom:', this.studentsInClassroom);
    const studentsWithResults = this.results.map(result => result.studentId);
    this.studentsNotTested = this.studentsInClassroom.filter(studentId => !studentsWithResults.includes(studentId));
  }
}
