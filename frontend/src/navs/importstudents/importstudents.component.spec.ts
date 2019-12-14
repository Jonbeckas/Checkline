import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportstudentsComponent } from './importstudents.component';

describe('ImportstudentsComponent', () => {
  let component: ImportstudentsComponent;
  let fixture: ComponentFixture<ImportstudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportstudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportstudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
