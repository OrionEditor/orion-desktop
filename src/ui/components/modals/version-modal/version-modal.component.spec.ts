import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionModalComponent } from './version-modal.component';

describe('VersionModalComponent', () => {
  let component: VersionModalComponent;
  let fixture: ComponentFixture<VersionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VersionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
