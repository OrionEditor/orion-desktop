import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuNodeComponent } from './context-menu-node.component';

describe('ContextMenuNodeComponent', () => {
  let component: ContextMenuNodeComponent;
  let fixture: ComponentFixture<ContextMenuNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextMenuNodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContextMenuNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
