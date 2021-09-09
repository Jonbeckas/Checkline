import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportUserModalComponent } from './export-user-modal.component';

describe('ExportUserModalComponent', () => {
  let component: ExportUserModalComponent;
  let fixture: ComponentFixture<ExportUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportUserModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
