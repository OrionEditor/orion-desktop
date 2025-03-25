import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFilesystemComponent } from './sidebar-filesystem.component';

describe('SidebarFilesystemComponent', () => {
  let component: SidebarFilesystemComponent;
  let fixture: ComponentFixture<SidebarFilesystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarFilesystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarFilesystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
