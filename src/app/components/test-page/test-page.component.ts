import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
}

@Component({
  selector: 'app-mcq-test',
  templateUrl: './test-page.component.html',
  imports: [CommonModule],
  styleUrls: ['./test-page.component.css']
})
export class McqTestComponent implements OnInit {
  questions: Question[] = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: 2
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: 1
    },
    {
      question: "Who wrote 'Hamlet'?",
      options: ["Shakespeare", "Charles Dickens", "J.K. Rowling", "Hemingway"],
      correctAnswer: 0
    },
    {
      question: "What is 5 + 7?",
      options: ["10", "11", "12", "13"],
      correctAnswer: 2
    }
  ];

  currentQuestionIndex: number = 0;
  timeLeft: number = 300; // 5 minutes
  timer: any;
score: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.submitTest(); // Auto-submit when timer ends
      }
    }, 1000);
  }

  selectAnswer(questionIndex: number, optionIndex: number) {
    this.questions[questionIndex].selectedAnswer = optionIndex;
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex = index;
  }

  submitTest() {
    clearInterval(this.timer);
    let correctCount = this.questions.filter(q => q.selectedAnswer === q.correctAnswer).length;
    
    // Navigate to result page with score and total questions
    this.router.navigate(['/result-page', { score: correctCount, total: this.questions.length }]);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
