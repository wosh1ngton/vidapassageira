import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugestaoIaComponent } from './sugestao-ia.component';

describe('SugestaoIaComponent', () => {
  let component: SugestaoIaComponent;
  let fixture: ComponentFixture<SugestaoIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SugestaoIaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SugestaoIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
