import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownContentComponent } from './markdown-content.component';

describe('MarkdownContentComponent', () => {
  let component: MarkdownContentComponent;
  let fixture: ComponentFixture<MarkdownContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarkdownContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
