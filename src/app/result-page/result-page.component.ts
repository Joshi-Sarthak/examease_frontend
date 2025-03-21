import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.css']
})
export class ResultPageComponent {
  score: number = 0;
  totalQuestions: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.score = Number(this.route.snapshot.paramMap.get('score')) || 0;
    this.totalQuestions = Number(this.route.snapshot.paramMap.get('total')) || 0;
  }

  goBackToTest(): void {
    this.router.navigate(['/test-page']); // Navigate back to test page
  }
}
