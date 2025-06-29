import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextModalComponent } from './text-modal.component';

describe('TextModalComponent', () => {
  let component: TextModalComponent;
  let fixture: ComponentFixture<TextModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
