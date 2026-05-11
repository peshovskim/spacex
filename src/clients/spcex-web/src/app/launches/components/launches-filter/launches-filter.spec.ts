import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchesFilterComponent } from './launches-filter';

describe('LaunchesFilterComponent', () => {
  let component: LaunchesFilterComponent;
  let fixture: ComponentFixture<LaunchesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchesFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LaunchesFilterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedType', 'upcoming');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
