import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportGroupModalComponent } from './import-group-modal.component';

describe('ImportGroupModalComponent', () => {
  let component: ImportGroupModalComponent;
  let fixture: ComponentFixture<ImportGroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportGroupModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
