import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
}

@Component({
  selector: 'app-mcq-test',
  templateUrl: './test-page.component.html',
  imports : [CommonModule],
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
  score: number | null = null;
  timeLeft: number = 300; // 5 minutes
  timer: any;

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
    let correctCount = 0;
    this.questions.forEach(q => {
      if (q.selectedAnswer === q.correctAnswer) {
        correctCount++;
      }
    });
    this.score = correctCount;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
