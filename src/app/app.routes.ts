import { Routes } from '@angular/router';
import { ClassroomListComponent } from './components/classroom-list/classroom-list.component';
import { TestListComponent } from './components/test-list/test-list.component';
import { QuestionBuilderComponent } from './components/question-builder/question-builder.component';
import { TestDetailsComponent } from './components/test-details/test-details.component';
import { AttemptTestComponent } from './components/attempt-test/attempt-test.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { StudentResultComponent } from './components/student-result/student-result.component';
import { TeacherResultComponent } from './components/teacher-result/teacher-result.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'classroom-list', component: ClassroomListComponent },
  { path: 'test-list/:classroomId', component: TestListComponent },
  { path: 'question-builder/:classroomId', component: QuestionBuilderComponent },
  { path: 'question-builder/:classroomId/:testId', component: QuestionBuilderComponent },
  { path: 'test-details/:classroomId/:testId', component: TestDetailsComponent },
  { path: 'attempt-test/:classroomId/:testId', component: AttemptTestComponent },
  { path: 'student-result/:testId', component: StudentResultComponent },
  { path: 'teacher-result/:testId', component: TeacherResultComponent },
  { path: '**', redirectTo: 'login' },
];
