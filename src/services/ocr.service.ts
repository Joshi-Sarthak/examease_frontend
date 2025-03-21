import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  private Tesseract: any;

  constructor() {}

  async extractTextFromImage(file: File): Promise<string> {
    try {
      // Dynamically import Tesseract.js when needed
      const { recognize } = await import('tesseract.js');

      const { data } = await recognize(file, 'eng', {
        logger: (m: { status: string; progress: number }) => {
          console.log(m);
        }
      });

      return data.text;
    } catch (error) {
      console.error('Failed to process OCR:', error);
      throw error;
    }
  }
}
