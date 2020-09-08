import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


type InjectData = {
  headline1: string,
  headline2: string,
};


@Component({
  selector: 'app-export-eco-declaration-pdf-dialog',
  templateUrl: './export-eco-declaration-pdf-dialog.component.html',
  styleUrls: ['./export-eco-declaration-pdf-dialog.component.css']
})
export class ExportEcoDeclarationPdfDialogComponent {

  
  headline1: string;
  headline2: string;


  constructor(
    private dialogRef: MatDialogRef<ExportEcoDeclarationPdfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: InjectData,
  ) {
    this.headline1 = data.headline1;
    this.headline2 = data.headline2;
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
