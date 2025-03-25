import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTabComponent } from './file-tab.component';

describe('FileTabComponent', () => {
  let component: FileTabComponent;
  let fixture: ComponentFixture<FileTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
