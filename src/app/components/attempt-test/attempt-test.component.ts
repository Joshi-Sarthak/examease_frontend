import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestData } from '../../../models/test.model';
import { TestService } from '../../../services/test.service';
import { CharCodePipe } from '../pipes/char-code.pipe';

@Component({
  selector: 'app-attempt-test',
  standalone: true,
  imports: [CommonModule, CharCodePipe],
  templateUrl: './attempt-test.component.html',
  styleUrls: ['./attempt-test.component.css']
}) 
export class AttemptTestComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private testService = inject(TestService);

  classroomId: string = '';
  testId: string = '';
  testData!: TestData;
  selectedOptions: (number | null)[] = [];
  currentQuestionIndex = 0;
  remainingTimeInSeconds = 0;
  timer: any;

  ngOnInit(): void {
    this.classroomId = this.route.snapshot.paramMap.get('classroomId') || '';
    this.testId = this.route.snapshot.paramMap.get('testId') || '';

    const test = this.testService.getTest(this.testId, this.classroomId);
    if (!test) {
      alert('Test not found!');
      this.router.navigate(['/test-list', this.classroomId]);
      return;
    }

    this.testData = test;
    this.selectedOptions = new Array(test.questions.length).fill(null);
    this.remainingTimeInSeconds = test.testTime * 60;
    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.remainingTimeInSeconds > 0) {
        this.remainingTimeInSeconds--;
      } else {
        clearInterval(this.timer);
        this.submitTest(true);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  selectOption(optionIndex: number) {
    this.selectedOptions[this.currentQuestionIndex] = optionIndex;
  }

  navigateToQuestion(index: number) {
    if (index >= 0 && index < this.testData.questions.length) {
      this.currentQuestionIndex = index;
    }
  }

  getQuestionStatus(index: number): string {
    if (this.currentQuestionIndex === index) return 'current';
    if (this.selectedOptions[index] !== null) return 'answered';
    return 'unanswered';
  }

  submitTest(timeUp = false) {
    if (!timeUp && !confirm('Are you sure you want to submit the test?')) return;

    let correctAnswers = 0;
    this.testData.questions.forEach((question, i) => {
      if (question.correctOptionIndex === this.selectedOptions[i]) {
        correctAnswers++;
      }
    });

    const result = Math.round((correctAnswers / this.testData.questions.length) * 100);
    this.testData.result = result;

    this.testService.saveTest(this.testData);
    alert(`Test Submitted! Your score is ${result}%`);
    this.router.navigate(['/test-list', this.classroomId]);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
