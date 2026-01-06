import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerDashboardModal } from './partner-dashboard-modal';

describe('PartnerDashboardModal', () => {
  let component: PartnerDashboardModal;
  let fixture: ComponentFixture<PartnerDashboardModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerDashboardModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerDashboardModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
