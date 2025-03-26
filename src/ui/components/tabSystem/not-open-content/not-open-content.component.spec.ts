import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotOpenContentComponent } from './not-open-content.component';

describe('NotOpenContentComponent', () => {
  let component: NotOpenContentComponent;
  let fixture: ComponentFixture<NotOpenContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotOpenContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotOpenContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
