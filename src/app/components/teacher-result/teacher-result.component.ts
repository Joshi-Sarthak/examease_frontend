import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestService } from '../../../services/test.service';
import { ClassroomService } from '../../../services/classroom.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { ClassroomData } from '../../../models/classroom.model';
import { TestData } from '../../../models/test.model';

@Component({
  selector: 'app-teacher-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-result.component.html',
  styleUrls: ['./teacher-result.component.css'],
})
export class TeacherResultComponent implements OnInit {
  testId!: string;
  results: any[] = [];
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
    this.classroom = this.classroomService.getClassroom();

    this.authService.getUser().subscribe((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      } else if (this.classroom?.teacherId !== user.userId) {
        this.router.navigate(['/classroom-list']);
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.classroomId = params.get('classroomId') || '';
      this.testId = params.get('testId') || '';

      if (this.classroomId) {
        this.classroomService.getClassroomById(this.classroomId).subscribe((classroomData) => {
          this.classroom = classroomData;
          this.fetchTestResults();
        });
      }

      if (this.testId) {
        this.testService.getTestById(this.testId).subscribe(test => {
          this.test = test;
          this.fetchTestResults();
        });
      }
    });

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (!(event.url.includes('/teacher-result') && event.url.includes(this.testId) && event.url.includes(this.classroomId))) {
          if (!(event.url.includes('/test-list') && event.url.includes(this.classroomId))) {
            // Optional cleanup logic here
          }
        }
      }
    });
  }

  fetchTestResults() {
    if (this.testId) {
      this.testService.getDetailedTestResults(this.testId).subscribe({
        next: (results) => {
          this.results = results;
          this.findStudentsNotTested();
          this.calculateStats();
          this.isLoading = false;
          console.log('Test results:', this.results);
        },
        error: (err) => {
          console.error('Error fetching test results:', err);
          this.isLoading = false;
        },
      });
    }
  }

  calculateStats() {
    if (this.results.length === 0) return;

    const scores = this.results.map(r => r.score);

    this.studentsAttempted = this.results.length;
    this.totalStudents = this.studentsInClassroom.length;
    this.studentsNotAttempted = this.totalStudents - this.studentsAttempted;

    const totalCorrectAnswers = scores.reduce((acc, val) => acc + val, 0);
    this.classAverage = this.studentsAttempted > 0 ? totalCorrectAnswers / this.studentsAttempted : 0;
    this.highestScore = Math.max(...scores);
    this.lowestScore = Math.min(...scores);
  }

  viewStudentResult(studentId: string) {
    this.router.navigate([`/student-result/${this.testId}`], { queryParams: { studentId } });
  }

  exportCSV() {
    let csvContent = "Student Name,Score,Total Questions,Percentage\n";
    this.results.forEach((result) => {
      csvContent += `${result.studentName},${result.score},${result.totalQuestions},${result.percentage}%\n`;
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
    this.router.navigate(['/test-list', this.classroomId]);
  }

  private findStudentsNotTested() {
    this.studentsInClassroom = this.classroom?.students || []; 
    const studentsWithResults = this.results.map(result => result.studentName);
    this.studentsNotTested = this.studentsInClassroom.filter(student => !studentsWithResults.includes(student));
  }
}
