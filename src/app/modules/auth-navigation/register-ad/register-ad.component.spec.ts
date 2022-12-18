import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAdComponent } from './register-ad.component';

describe('RegisterAdComponent', () => {
  let component: RegisterAdComponent;
  let fixture: ComponentFixture<RegisterAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterAdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
