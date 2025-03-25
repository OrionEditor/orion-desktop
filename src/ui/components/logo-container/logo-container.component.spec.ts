import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoContainerComponent } from './logo-container.component';

describe('LogoContainerComponent', () => {
  let component: LogoContainerComponent;
  let fixture: ComponentFixture<LogoContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
