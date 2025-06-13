import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionDiffModalComponent } from './version-diff-modal.component';

describe('VersionDiffModalComponent', () => {
  let component: VersionDiffModalComponent;
  let fixture: ComponentFixture<VersionDiffModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionDiffModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VersionDiffModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
