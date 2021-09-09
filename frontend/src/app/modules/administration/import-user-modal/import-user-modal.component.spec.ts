import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportUserModalComponent } from './import-user-modal.component';

describe('ImportUserModalComponent', () => {
  let component: ImportUserModalComponent;
  let fixture: ComponentFixture<ImportUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportUserModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
