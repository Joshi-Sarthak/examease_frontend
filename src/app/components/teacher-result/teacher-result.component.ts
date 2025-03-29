import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResultService } from '../../../services/result.service';
import { ClassroomService } from '../../../services/classroom.service';

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

  totalStudents: number = 0;
  studentsAttempted: number = 0;
  studentsNotAttempted: number = 0;
  classAverage: number = 0;
  highestScore: number = 0;
  lowestScore: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private resultService: ResultService,
    private classroomService: ClassroomService,
  ) {}

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('testId')!;
    this.fetchTestResults();
    this.findStudentsNotTested();
    this.calculateStats();
    this.isLoading = false;
  }

  fetchTestResults() {
    this.results = this.resultService.getResults(this.testId);
  }

  calculateStats() {
    if (this.results.length === 0) return;

    const scores = this.results.map(r => r.score);
    const totals = this.results.map(r => r.total);
    
    this.studentsAttempted = this.results.length;
    this.totalStudents = this.studentsInClassroom.length;
    this.studentsNotAttempted = this.totalStudents - this.studentsAttempted;

    const totalScores = scores.reduce((acc, val) => acc + val, 0);
    const totalMax = totals.reduce((acc, val) => acc + val, 0);

    this.classAverage = totalMax > 0 ? (totalScores / totalMax) * 100 : 0;
    this.highestScore = Math.max(...scores);
    this.lowestScore = Math.min(...scores);
  }

  viewStudentResult(studentId: string) {
    this.router.navigate([`/student-result/${this.testId}`], { queryParams: { studentId } });
  }

  exportCSV() {
    let csvContent = "Student Name,Score,Total,Percentage\n";
    this.results.forEach((result) => {
      const percentage = ((result.score / result.total) * 100).toFixed(2);
      csvContent += `${result.studentName},${result.score},${result.total},${percentage}%\n`;
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
    this.router.navigate(['/test-list', this.testId, 'tests']);
  }

  private findStudentsNotTested() {
    const classroomId = this.route.snapshot.queryParamMap.get('classroomId')!;
    this.studentsInClassroom = this.classroomService.getStudentsInClassroom(classroomId);
    const studentsWithResults = this.results.map(result => result.studentId);
    this.studentsNotTested = this.studentsInClassroom.filter(studentId => !studentsWithResults.includes(studentId));
  }
}
