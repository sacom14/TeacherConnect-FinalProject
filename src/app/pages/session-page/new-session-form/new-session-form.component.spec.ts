import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSessionFormComponent } from './new-session-form.component';

describe('NewSessionFormComponent', () => {
  let component: NewSessionFormComponent;
  let fixture: ComponentFixture<NewSessionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSessionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSessionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
