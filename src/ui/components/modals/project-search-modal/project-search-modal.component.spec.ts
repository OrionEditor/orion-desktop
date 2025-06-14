import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSearchModalComponent } from './project-search-modal.component';

describe('ProjectSearchModalComponent', () => {
  let component: ProjectSearchModalComponent;
  let fixture: ComponentFixture<ProjectSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSearchModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
