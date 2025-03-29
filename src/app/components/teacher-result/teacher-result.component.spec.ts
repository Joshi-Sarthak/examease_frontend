import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherResultComponent } from './teacher-result.component';

describe('TeacherResultComponent', () => {
  let component: TeacherResultComponent;
  let fixture: ComponentFixture<TeacherResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
