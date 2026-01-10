import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spelling } from './spelling';

describe('Spelling', () => {
  let component: Spelling;
  let fixture: ComponentFixture<Spelling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spelling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Spelling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
