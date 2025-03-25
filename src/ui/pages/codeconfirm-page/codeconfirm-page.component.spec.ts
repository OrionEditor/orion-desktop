import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeconfirmPageComponent } from './codeconfirm-page.component';

describe('CodeconfirmPageComponent', () => {
  let component: CodeconfirmPageComponent;
  let fixture: ComponentFixture<CodeconfirmPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeconfirmPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CodeconfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
