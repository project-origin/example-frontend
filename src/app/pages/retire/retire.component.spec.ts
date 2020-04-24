import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetireComponent } from './retire.component';

describe('RetireComponent', () => {
  let component: RetireComponent;
  let fixture: ComponentFixture<RetireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
