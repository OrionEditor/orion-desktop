import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabContextMenuComponent } from './tab-context-menu.component';

describe('TabContextMenuComponent', () => {
  let component: TabContextMenuComponent;
  let fixture: ComponentFixture<TabContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabContextMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
