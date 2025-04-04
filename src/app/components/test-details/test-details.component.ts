import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../../../services/test.service';
import { TestData } from '../../../models/test.model';
import { QuestionData } from '../../../models/question.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserData } from '../../../models/user.model';


@Component({
  selector: 'app-test-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.css']
})
export class TestDetailsComponent implements OnInit {
  testForm: FormGroup;
  classroomId: string = '';
  testId: string = '';
  questions: QuestionData[] = [];
  existingTest: TestData | null = null;
  user: UserData | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private authService: AuthService
  ) {
    this.classroomId = this.route.snapshot.paramMap.get('classroomId') || '';
    this.testId = this.route.snapshot.paramMap.get('testId') || '';

    this.testForm = this.fb.group({
      testName: ['', Validators.required],
      startFrom: ['', Validators.required],
      deadlineTime: ['', Validators.required],
      testTime: [60, [Validators.required, Validators.min(1)]],
    });

    this.loadTestData();
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        if (!this.user) {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => console.error('Error fetching user:', err)
    });
  }

  private loadTestData(): void {
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras.state as { questions?: QuestionData[] } | undefined;

    this.existingTest = this.testService.getTest();

    if (this.existingTest) {
      this.testForm.patchValue(this.existingTest);
      this.questions = this.existingTest.questions || [];
      console.log('[TestDetails] Loaded questions from TestService:', this.questions);
    }

    if (stateData?.questions) {
      console.log('[TestDetails] Merging new questions:', stateData.questions);
      this.questions = stateData.questions;
    }
  }

  saveTest(): void {
    if (this.testForm.invalid) {
      console.warn('[TestDetails] Form invalid, cannot save test.');
      return;
    }
    
    if (!this.existingTest) {
      this.testService.saveTest(
        this.testForm.value.testName,
        this.questions,
        this.testForm.value.startFrom,
        this.testForm.value.deadlineTime,
        this.testForm.value.testTime,
        this.classroomId,
        this.user?.userId!
      ).subscribe({
        next: (response) => console.log("Test saved successfully:", response),
        error: (err) => console.error("Error saving test:", err),
      }); 
    }  else {
      this.testService.updateTest(
        this.testId,
        this.testForm.value.testName,
        this.questions,
        this.testForm.value.startFrom,
        this.testForm.value.deadlineTime,
        this.testForm.value.testTime,
        this.classroomId,
        this.user?.userId!
      ).subscribe({
        next: (response) => console.log("Test saved successfully:", response),
        error: (err) => console.error("Error saving test:", err),
      }); 
    }

    this.router.navigate(['/test-list', this.classroomId]);
  }
}