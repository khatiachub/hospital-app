import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDescriptionComponent } from './doctor-description.component';

describe('DoctorDescriptionComponent', () => {
  let component: DoctorDescriptionComponent;
  let fixture: ComponentFixture<DoctorDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorDescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
