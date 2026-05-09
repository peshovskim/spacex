import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchesHome } from './launches-home';

describe('LaunchesHome', () => {
  let component: LaunchesHome;
  let fixture: ComponentFixture<LaunchesHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchesHome],
    }).compileComponents();

    fixture = TestBed.createComponent(LaunchesHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
