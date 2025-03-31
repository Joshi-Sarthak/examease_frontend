import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AppComponent } from './app/app.component';
import { OcrService } from './services/ocr.service';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      ReactiveFormsModule,
      MatInputModule,
      MatButtonModule,
      MatCardModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatIconModule
    ),
    OcrService,
  ]
}).catch(err => console.error(err));
