import { OptionData } from '../models/option.model';

export interface QuestionData {
    questionId: string;
    questionText: string;
    questionNumber: number;
    correctOptionIndex: number;
    testId: string;
    options: OptionData[];
}