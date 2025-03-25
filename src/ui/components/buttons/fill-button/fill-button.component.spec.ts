import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillButtonComponent } from './fill-button.component';

describe('FillButtonComponent', () => {
  let component: FillButtonComponent;
  let fixture: ComponentFixture<FillButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FillButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FillButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
