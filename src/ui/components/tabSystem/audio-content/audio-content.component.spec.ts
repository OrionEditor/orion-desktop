import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioContentComponent } from './audio-content.component';

describe('AudioContentComponent', () => {
  let component: AudioContentComponent;
  let fixture: ComponentFixture<AudioContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudioContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
