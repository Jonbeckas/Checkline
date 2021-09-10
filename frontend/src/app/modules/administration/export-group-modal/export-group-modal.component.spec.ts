import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportGroupModalComponent } from './export-group-modal.component';

describe('ExportGroupModalComponent', () => {
  let component: ExportGroupModalComponent;
  let fixture: ComponentFixture<ExportGroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportGroupModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
