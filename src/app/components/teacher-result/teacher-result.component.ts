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
  studentsNotTested: string[] = [];
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private resultService: ResultService,
    private classroomService: ClassroomService,
  ) {}

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('testId')!;
    this.fetchTestResults();
    this.isLoading = false;
    this.findStudentsNotTested();
  }

  fetchTestResults() {
    this.results = this.resultService.getResults(this.testId);
  }

  viewStudentResult(studentId: string) {
    this.router.navigate([`/student-result/${this.testId}`], { queryParams: { studentId } });
  }

  exportCSV() {
    let csvContent = "Student Name,Score,Total,Percentage\n";
    this.results.forEach((result) => {
      const percentage = ((result.score / result.total)).toFixed(2);
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
    this.router.navigate(['/classroom', this.testId, 'tests']);
  }

  private findStudentsNotTested() {
    const classroomId = this.route.snapshot.queryParamMap.get('classroomId')!;
    const studentsInClassroom = this.classroomService.getStudentsInClassroom(classroomId);
    const studentsWithResults = this.results.map(result => result.studentId);
    this.studentsNotTested = studentsInClassroom.filter(studentId => !studentsWithResults.includes(studentId));
  }
  
}