import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSessionListComponent } from './modal-session-list.component';

describe('ModalSessionListComponent', () => {
  let component: ModalSessionListComponent;
  let fixture: ComponentFixture<ModalSessionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSessionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalSessionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
