import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TestData } from '../../../models/test.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent {
  classroomId: string = '';
  tests: TestData[] = [];
  dropdownOpen: { [testId: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.classroomId = this.route.snapshot.paramMap.get('classroomId') || '';
    this.tests = this.localStorageService.getTestsForClassroom(this.classroomId);
  }

  goBack(): void {
    this.router.navigate(['/classroom-list']);
  }

  navigateToQuestionBuilder(): void {
    this.router.navigate(['/question-builder', this.classroomId]);
  }

  toggleDropdown(testId: string, event: Event): void {
    event.stopPropagation();
    this.dropdownOpen[testId] = !this.dropdownOpen[testId];
  }

  editTest(testId: string): void {
    this.router.navigate(['/question-builder', this.classroomId, testId]);
  }
}
