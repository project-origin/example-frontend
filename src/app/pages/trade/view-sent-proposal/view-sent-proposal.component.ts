import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Agreement } from 'src/app/services/agreements/models';
import { AgreementService, WithdrawProposalsRequest, WithdrawProposalsResponse } from 'src/app/services/agreements/agreement.service';
import { Facility } from 'src/app/services/facilities/models';


@Component({
  selector: 'app-view-sent-proposal',
  templateUrl: './view-sent-proposal.component.html',
  styleUrls: ['./view-sent-proposal.component.css']
})
export class ViewSentProposalComponent {

  agreement: Agreement;
  loading: boolean = false;
  error: boolean = false;


  constructor(
    private dialogRef: MatDialogRef<ViewSentProposalComponent>,
    private agreementService: AgreementService,
    @Inject(MAT_DIALOG_DATA) data: { agreement: Agreement }
  ) {
    this.agreement = data.agreement;
  }


  closeDialog() {
    this.dialogRef.close();
  }


  isOutbound() : boolean {
    return this.agreement.direction == 'outbound';
  }


  isInbound() : boolean {
    return this.agreement.direction == 'inbound';
  }


  withdrawProposal() {
    let request = new WithdrawProposalsRequest({
      id: this.agreement.id,
    });

    this.loading = true;
    this.agreementService
        .withdrawProposal(request)
        .subscribe(this.onWithdrawComplete.bind(this));
  }


  onWithdrawComplete(response: WithdrawProposalsResponse) {
    this.loading = false;
    this.error = !response.success;

    if(response.success) {
      this.closeDialog();
    }
  }

  get facilities() : string[] {
    return this.agreement.facilities.map((facility: Facility) => facility.name);
  }

}
