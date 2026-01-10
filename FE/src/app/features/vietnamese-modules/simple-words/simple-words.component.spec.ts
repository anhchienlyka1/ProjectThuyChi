import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleWords } from './simple-words';

describe('SimpleWords', () => {
  let component: SimpleWords;
  let fixture: ComponentFixture<SimpleWords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleWords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleWords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
