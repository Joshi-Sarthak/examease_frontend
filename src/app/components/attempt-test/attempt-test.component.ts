import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestData, Result } from '../../../models/test.model';
import { TestService } from '../../../services/test.service';
import { CharCodePipe } from '../pipes/char-code.pipe';
import { AuthService } from '../../../services/auth.service';

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
  private authService = inject(AuthService);

  user: any = null;
  classroomId: string = '';
  testId: string = '';
  test!: TestData;
  selectedOptions: (number | null)[] = [];
  currentQuestionIndex = 0;
  remainingTimeInSeconds = 0;
  timer: any;

  ngOnInit(): void {
    this.authService.getUser().subscribe((user) => {
      this.user = user;
      if (!this.user) {
        this.router.navigate(['/login']);
      }
    });

    this.classroomId = this.route.snapshot.paramMap.get('classroomId') || '';
    this.testId = this.route.snapshot.paramMap.get('testId') || '';

    this.test = this.testService.getTest()!;
    
    if (!this.test) {
      this.testService.getTestById(this.testId).subscribe(test => {
        if (test) {
          this.test = test;
        } else {
          console.error('Test not found');
        }
      }, error => {
        console.error('Error fetching test:', error);
      });
      
      if (!this.test) {
        alert('Test not found!');
        this.router.navigate(['/test-list', this.classroomId]);
        return;
      }
    }

    this.selectedOptions = new Array(this.test.questions.length).fill(null);
    this.remainingTimeInSeconds = this.test.testTime * 60;
    this.startTimer();
  }

  startTimer(): void {
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

  selectOption(optionIndex: number): void {
    this.selectedOptions[this.currentQuestionIndex] = optionIndex;
  }

  navigateToQuestion(index: number): void {
    if (index >= 0 && index < this.test.questions.length) {
      this.currentQuestionIndex = index;
    }
  }

  getQuestionStatus(index: number): string {
    if (this.currentQuestionIndex === index) return 'current';
    if (this.selectedOptions[index] !== null) return 'answered';
    return 'unanswered';
  }

  submitTest(timeUp = false): void {
    if (!timeUp && !confirm('Are you sure you want to submit the test?')) return;
  
    let correctAnswers = 0;
    this.test.questions.forEach((question, i) => {
      if (question.correctOptionIndex === this.selectedOptions[i]) {
        correctAnswers++;
      }
    });
  
    this.testService.saveResult(this.testId, this.user.userId, correctAnswers).subscribe({
      next: () => {
        alert('Test submitted successfully!');
      },
      error: (err) => {
        alert(err);
      }
    });
  
    alert(`Test Submitted! You got ${correctAnswers} out of ${this.test.questions.length} correct.`);
    this.router.navigate(['/test-list', this.classroomId]);
  }
  

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
