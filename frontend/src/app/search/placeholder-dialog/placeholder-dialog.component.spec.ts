import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceholderDialogComponent } from './placeholder-dialog.component';

describe('PlaceholderDialogComponent', () => {
  let component: PlaceholderDialogComponent;
  let fixture: ComponentFixture<PlaceholderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceholderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceholderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
