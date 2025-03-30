import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResultService } from '../../../services/result.service';
import { TestResult } from '../../../models/test-result.model';

@Component({
  selector: 'app-student-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-result.component.html',
  styleUrls: ['./student-result.component.css'],
})
export class StudentResultComponent implements OnInit {
  testId!: string;
  studentId!: string;
  result: TestResult | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  classroomId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resultService: ResultService
  ) {}

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('testId')!;
    this.studentId = this.route.snapshot.queryParamMap.get('studentId') || localStorage.getItem('studentId') || '';
    this.classroomId = this.route.snapshot.queryParamMap.get('classroomId') || '';
    this.fetchStudentResult();
    this.fetchStudentResult();
  }

  fetchStudentResult() {
    this.result = this.getResultFromLocalStorage();
    this.isLoading = false;

    if (!this.result) {
      this.errorMessage = 'No result found for this test.';
    }
  }

  getResultFromLocalStorage(): TestResult | null {
    const results = this.resultService.getResults(this.testId);
    return results.find((r) => r.studentId === this.studentId) || null;
  }

  goBack() {
    this.router.navigate(['/test-list', this.classroomId]);
  }
}
