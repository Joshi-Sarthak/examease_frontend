import { Injectable } from '@angular/core';
import { TestResult } from '../models/test-result.model';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private storageKey = 'results_';

  constructor() {}

  saveResult(testResult: TestResult) {
    const results = this.getResults(testResult.testId);
    results.push(testResult);
    localStorage.setItem(this.storageKey + testResult.testId, JSON.stringify(results));
  }

  getResults(testId: string): TestResult[] {
    const storedResults = localStorage.getItem(this.storageKey + testId);
    return storedResults ? JSON.parse(storedResults) : [];
  }
}
