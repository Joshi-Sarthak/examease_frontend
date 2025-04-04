export interface OptionData {
  optionId: string;
  optionText: string;
  optionNumber: number;
}

export interface QuestionData {
  questionId: string;
  questionText: string;
  questionNumber: number;
  correctOptionIndex: number;
  options: OptionData[];
}

export interface Result {
  studentId: string;
  result: number;
}

export interface TestData {
  testId: string;
  testName: string;
  questions: QuestionData[];
  postedAt: Date;
  startFrom: Date;
  deadlineTime: Date;
  testTime: number;
  result: Result[]
  classroomId?: string;
}