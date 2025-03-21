import { QuestionData } from '../models/question.model';

export interface TestData {
  testId: string;
  testName: string;
  questions: QuestionData[];
  postedAt: Date;
  startFrom: Date;
  deadlineTime: Date;
  testTime: number;
  result: number;
  classroomId?: string;
}