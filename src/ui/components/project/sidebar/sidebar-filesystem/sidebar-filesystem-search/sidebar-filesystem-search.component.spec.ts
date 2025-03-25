import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFilesystemSearchComponent } from './sidebar-filesystem-search.component';

describe('SidebarFilesystemSearchComponent', () => {
  let component: SidebarFilesystemSearchComponent;
  let fixture: ComponentFixture<SidebarFilesystemSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarFilesystemSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarFilesystemSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
