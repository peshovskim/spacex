import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsHome } from './missions-home';

describe('MissionsHome', () => {
  let component: MissionsHome;
  let fixture: ComponentFixture<MissionsHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionsHome],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionsHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
