import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { OcrService } from '../../../services/ocr.service';
import { OptionData } from '../../../models/option.model';
import { QuestionData } from '../../../models/question.model';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-builder',
  standalone: true,
  imports: [
    CommonModule,
    ImageCropperComponent,
    NgIf,
    NgFor,
    FormsModule
  ],
  templateUrl: './question-builder.component.html',
  styleUrls: ['./question-builder.component.css']
})
export class QuestionBuilderComponent implements OnInit {
  questions: QuestionData[] = [];
  currentQuestionIndex = 0;
  isEditTest = false;
  classroomId: string = '';
  testId: string = '';

  selectedFile: File | null = null;
  imageChangedEvent: string | null = null;
  croppedArea: { x1: number; y1: number; width: number; height: number } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private ocrService: OcrService
  ) {}

  ngOnInit(): void {
    this.classroomId = this.route.snapshot.paramMap.get('classroomId') || '';

    const testIdParam = this.route.snapshot.paramMap.get('testId');
    if (testIdParam) {
      this.testId = testIdParam;
      this.isEditTest = true;
      const existingTest = this.localStorageService.getTest(this.testId, this.classroomId);
      if (existingTest && existingTest.questions && existingTest.questions.length > 0) {
        this.questions = existingTest.questions;
      }
      if (this.questions.length === 0) {
        this.addNewQuestion();
      }
    } else {
      this.testId = new Date().getTime().toString();
      this.isEditTest = false;
      this.addNewQuestion();
    }
  }

  get currentQuestion(): QuestionData {
    return this.questions[this.currentQuestionIndex];
  }

  navigateToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  addNewQuestion(): void {
    const newQuestion: QuestionData = {
      questionId: new Date().getTime().toString(),
      questionText: '',
      questionNumber: this.questions.length + 1,
      correctOptionIndex: -1,
      testId: this.testId,
      options: []
    };
    this.questions.push(newQuestion);
    this.currentQuestionIndex = this.questions.length - 1;
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imageChangedEvent = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onImageCropped(event: ImageCroppedEvent): void {
    if (event.cropperPosition) {
      this.croppedArea = {
        x1: event.cropperPosition.x1,
        y1: event.cropperPosition.y1,
        width: event.cropperPosition.x2 - event.cropperPosition.x1,
        height: event.cropperPosition.y2 - event.cropperPosition.y1,
      };
    }
  }

  async extractTextFromSelectedArea(field: 'question' | 'option', optionIndex: number = -1): Promise<void> {
    if (!this.selectedFile || !this.croppedArea) {
      this.updateTextField(field, optionIndex, 'No image or selected area found.');
      return;
    }
    try {
      const croppedImageFile = await this.createCroppedImage();
      const text = await this.ocrService.extractTextFromImage(croppedImageFile);
      this.updateTextField(field, optionIndex, text.trim() || 'No text extracted from the selected area.');
    } catch (error: unknown) {
      this.updateTextField(field, optionIndex, 'OCR error: Unable to extract text.');
      console.error('OCR error:', error);
    }
  }

  private async createCroppedImage(): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const image = new Image();
      image.onload = () => {
        if (!context || !this.croppedArea) {
          reject('Canvas context or cropped area not found.');
          return;
        }
        canvas.width = this.croppedArea.width;
        canvas.height = this.croppedArea.height;
        context.drawImage(
          image,
          this.croppedArea.x1,
          this.croppedArea.y1,
          this.croppedArea.width,
          this.croppedArea.height,
          0,
          0,
          this.croppedArea.width,
          this.croppedArea.height
        );
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], 'cropped_image.png', { type: 'image/png' }));
          } else {
            reject('Failed to create image blob.');
          }
        }, 'image/png');
      };
      image.onerror = () => reject('Failed to load image.');
      image.src = URL.createObjectURL(this.selectedFile!);
    });
  }

  private updateTextField(field: 'question' | 'option', optionIndex: number, text: string): void {
    if (field === 'question') {
      this.currentQuestion.questionText = text;
    } else if (field === 'option' && optionIndex !== -1) {
      this.currentQuestion.options[optionIndex].optionText = text;
    }
  }

  addOption(): void {
    const newOption: OptionData = {
      optionId: new Date().getTime().toString(),
      optionText: '',
      optionNumber: this.currentQuestion.options.length + 1,
      questionId: this.currentQuestion.questionId
    };
    this.currentQuestion.options.push(newOption);
  }

  removeOption(index: number): void {
    this.currentQuestion.options.splice(index, 1);
  }

  setCorrectOption(index: number): void {
    this.currentQuestion.correctOptionIndex = index;
  }

  goBack(): void {
    this.router.navigate(['/test-list', this.classroomId]);
  }

  saveTest(): void {
    this.router.navigate(['/test-details', this.classroomId, this.testId], {
      state: { questions: this.questions }
    });
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imageChangedEvent = null;
    this.croppedArea = null;
  }
}