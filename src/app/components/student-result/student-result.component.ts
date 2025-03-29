import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-result',
  imports: [CommonModule],
  templateUrl: './student-result.component.html',
  styleUrls: ['./student-result.component.css']
})
export class StudentResultComponent implements OnInit {
  testId!: string;
  studentId!: string;
  result: any;
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('testId')!;
    this.studentId = localStorage.getItem('studentId') || '';

    this.fetchStudentResult();
  }

  fetchStudentResult() {
    this.http.get(`https://your-api.com/result/${this.studentId}/${this.testId}`).subscribe(
      (data) => {
        this.result = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching result', error);
        this.isLoading = false;
      }
    );
  }

  goBack() {
    this.router.navigate(['/classroom', this.result.classroomId, 'tests']);
  }
}
