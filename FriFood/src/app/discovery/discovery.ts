import { Component, inject } from '@angular/core';

import { PartnerService } from '../services/partner.service';

@Component({
  selector: 'app-discovery',
  imports: [],
  templateUrl: './discovery.html',
  styleUrl: './discovery.less',
})
export class Discovery {
  private partnerService = inject(PartnerService);

  partners = this.partnerService.partners;
}
