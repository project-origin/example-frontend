import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Agreement } from 'src/app/services/agreements/models';
import { AgreementService, WithdrawProposalsRequest, WithdrawProposalsResponse } from 'src/app/services/agreements/agreement.service';


@Component({
  selector: 'app-show-proposed-agreement',
  templateUrl: './show-proposed-agreement.component.html',
  styleUrls: ['./show-proposed-agreement.component.css']
})
export class ShowProposedAgreementComponent {


  agreement: Agreement;
  loading: boolean = false;


  constructor(
    private dialogRef: MatDialogRef<ShowProposedAgreementComponent>,
    private agreementService: AgreementService,
    @Inject(MAT_DIALOG_DATA) data: {
      agreement: Agreement,
    }
  ) {
    this.agreement = data.agreement;
  }


  closeDialog() {
    this.dialogRef.close();
  }


  // -- Withdraw -------------------------------------------------------------


  withdrawProposal() {
    if(confirm('Withdraw this proposal?')) {
      this.loading = true;
      this.agreementService
          .withdrawProposal(new WithdrawProposalsRequest({id: this.agreement.id}))
          .subscribe(this.onWithdrawComplete.bind(this));
    }
  }


  onWithdrawComplete(response: WithdrawProposalsResponse) {
    this.loading = false;
    if(response.success) {
      this.closeDialog();
    }
  }

}
