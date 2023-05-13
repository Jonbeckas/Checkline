import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConspicousComponent } from './conspicous.component';

describe('ConspicousComponent', () => {
  let component: ConspicousComponent;
  let fixture: ComponentFixture<ConspicousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConspicousComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConspicousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
