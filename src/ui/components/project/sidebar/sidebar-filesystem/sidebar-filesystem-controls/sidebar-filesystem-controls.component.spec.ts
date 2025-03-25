import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFilesystemControlsComponent } from './sidebar-filesystem-controls.component';

describe('SidebarFilesystemControlsComponent', () => {
  let component: SidebarFilesystemControlsComponent;
  let fixture: ComponentFixture<SidebarFilesystemControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarFilesystemControlsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarFilesystemControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
