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
  existingTest: TestData | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
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

    console.log('[TestDetails] Final questions array after loading:', this.questions);
  }

  saveTest(): void {
    if (this.testForm.invalid) {
      console.warn('[TestDetails] Form invalid, cannot save test.');
      return;
    }

    const test: TestData = {
      ...this.testForm.value,
      testId: this.testId || new Date().getTime().toString(),
      questions: this.questions,
      postedAt: new Date(),
      classroomId: this.classroomId,
      result: this.existingTest?.result || [],
    };

    console.log('[TestDetails] Saving test to TestService:', test);

    this.testService.saveTest(test);

    this.router.navigate(['/test-list', this.classroomId]);
  }
}