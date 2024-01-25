import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSessionDetailsComponent } from './modal-session-details.component';

describe('ModalSessionDetailsComponent', () => {
  let component: ModalSessionDetailsComponent;
  let fixture: ComponentFixture<ModalSessionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSessionDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalSessionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
