import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../../../services/test.service';
import { TestData } from '../../../models/test.model';
import { QuestionData } from '../../../models/question.model';
import { CommonModule } from '@angular/common';

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
export class TestDetailsComponent {
  testForm: FormGroup;
  classroomId: string = '';
  testId: string = '';
  questions: QuestionData[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
  ) {
    // 1) Read route parameters
    this.classroomId = this.route.snapshot.paramMap.get('classroomId') || '';
    this.testId = this.route.snapshot.paramMap.get('testId') || '';

    // 2) Initialize form
    this.testForm = this.fb.group({
      testName: ['', Validators.required],
      startFrom: ['', Validators.required],
      deadlineTime: ['', Validators.required],
      testTime: [60, [Validators.required, Validators.min(1)]],
    });

    // 3) Get state data from QuestionBuilder (if any)
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras.state as { questions?: QuestionData[] } | undefined;
    console.log('[TestDetails] State data from router:', stateData);

    // 4) Attempt to load existing test from TestService
    const existingTest = this.testService.getTest(this.testId, this.classroomId);
    console.log('[TestDetails] Existing test from TestService:', existingTest);

    if (existingTest) {
      // 5a) Use existing test data (including questions)
      this.testForm.patchValue(existingTest);
      this.questions = existingTest.questions || [];
      console.log('[TestDetails] Loaded questions from TestService:', this.questions);
    } else if (stateData?.questions) {
      // 5b) If no existing test but we have router state data, use that
      this.questions = stateData.questions;
      console.log('[TestDetails] Loaded questions from router state:', this.questions);
    }

    // 6) Final check: questions array
    console.log('[TestDetails] Final questions array after constructor:', this.questions);
  }

  saveTest(): void {
    if (this.testForm.invalid) {
      console.warn('[TestDetails] Form invalid, cannot save test.');
      return;
    }

    // 7) Build final test object
    const test: TestData = {
      ...this.testForm.value,
      testId: this.testId || new Date().getTime().toString(),
      questions: this.questions,
      postedAt: new Date(),
      result: 0,
      classroomId: this.classroomId,
    };

    console.log('[TestDetails] Saving test to TestService:', test);

    // 8) Save the test in TestService
    this.testService.saveTest(test);
    alert('Test Saved!');

    // 10) Navigate back to the test list for this classroom
    this.router.navigate(['/test-list', this.classroomId]);
  }
}
