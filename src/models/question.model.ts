import { OptionData } from '../models/option.model';

export interface QuestionData {
    questionId: string;
    questionText: string;
    questionNumber: number;
    correctOptionIndex: number;
    options: OptionData[];
}