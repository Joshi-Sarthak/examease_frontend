import { Routes } from '@angular/router';
import { ClassroomListComponent } from './components/classroom-list/classroom-list.component';
import { TestListComponent } from './components/test-list/test-list.component';
import { QuestionBuilderComponent } from './components/question-builder/question-builder.component';
import { TestDetailsComponent } from './components/test-details/test-details.component';
import { McqTestComponent } from './components/test-page/test-page.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'classroom-list', pathMatch: 'full' }, // Default route
  { path: 'classroom-list', component: ClassroomListComponent },
  { path: 'test-list/:classroomId', component: TestListComponent },
  { path: 'login', component: LoginComponent},
  // New Test => /question-builder/:classroomId
  // Edit Test => /question-builder/:classroomId/:testId
  { path: 'question-builder/:classroomId', component: QuestionBuilderComponent },
  { path: 'question-builder/:classroomId/:testId', component: QuestionBuilderComponent },

  // Test Details => /test-details/:classroomId/:testId
  { path: 'test-details/:classroomId/:testId', component: TestDetailsComponent },

  { path : 'test', component: McqTestComponent},

  { path: '**', redirectTo: 'classroom-list' } // Fallback for unknown routes
];
