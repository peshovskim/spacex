import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchCardComponent } from './launch-card';

describe('LaunchCardComponent', () => {
  let component: LaunchCardComponent;
  let fixture: ComponentFixture<LaunchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LaunchCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('launch', {
      flight_number: 1,
      name: 'Test launch',
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
