import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlContentComponent } from './html-content.component';

describe('HtmlContentComponent', () => {
  let component: HtmlContentComponent;
  let fixture: ComponentFixture<HtmlContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HtmlContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
