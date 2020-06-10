import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Account } from 'src/app/services/auth/models';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-account-details-dialog',
  templateUrl: './account-details-dialog.component.html',
  styleUrls: ['./account-details-dialog.component.css']
})
export class AccountDetailsDialogComponent {


  constructor(
    private dialogRef: MatDialogRef<AccountDetailsDialogComponent>,
    private authService: AuthService,
  ) { }


  get accounts() : Account[] {
    return this.authService.user.accounts;
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
