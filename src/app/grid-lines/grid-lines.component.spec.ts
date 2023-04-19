import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridLinesComponent } from './grid-lines.component';

describe('GridLinesComponent', () => {
  let component: GridLinesComponent;
  let fixture: ComponentFixture<GridLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridLinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
