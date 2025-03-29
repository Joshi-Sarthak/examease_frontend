import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-result',
  imports: [CommonModule],
  templateUrl: './teacher-result.component.html',
  styleUrls: ['./teacher-result.component.css']
})
export class TeacherResultComponent implements OnInit {
  testId!: string;
  results: any[] = [];
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('testId')!;
    this.fetchTestResults();
  }

  fetchTestResults() {
    this.http.get(`https://your-api.com/results/${this.testId}`).subscribe(
      (data: any) => {
        this.results = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching results', error);
        this.isLoading = false;
      }
    );
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
    a.download = 'test_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  goBack() {
    this.router.navigate(['/classroom', this.testId, 'tests']);
  }
}
