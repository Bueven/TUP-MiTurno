import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettignsComponent } from './settigns.component';

describe('SettignsComponent', () => {
  let component: SettignsComponent;
  let fixture: ComponentFixture<SettignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettignsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettignsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
