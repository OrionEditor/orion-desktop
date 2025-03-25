import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionCardsComponent } from './selection-cards.component';

describe('SelectionCardsComponent', () => {
  let component: SelectionCardsComponent;
  let fixture: ComponentFixture<SelectionCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectionCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
