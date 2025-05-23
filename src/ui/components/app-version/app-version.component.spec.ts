import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppVersionComponent } from './app-version.component';

describe('AppVersionComponent', () => {
  let component: AppVersionComponent;
  let fixture: ComponentFixture<AppVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppVersionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
