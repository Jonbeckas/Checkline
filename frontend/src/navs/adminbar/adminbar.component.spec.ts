import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminbarComponent } from './adminbar.component';

describe('AdminbarComponent', () => {
  let component: AdminbarComponent;
  let fixture: ComponentFixture<AdminbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
