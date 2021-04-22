import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGroupModalComponent } from './new-group-modal.component';

describe('NewGroupModalComponent', () => {
  let component: NewGroupModalComponent;
  let fixture: ComponentFixture<NewGroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGroupModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
