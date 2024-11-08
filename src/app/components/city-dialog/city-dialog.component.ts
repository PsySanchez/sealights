import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogData } from '../../interfaces';

@Component({
  selector: 'city-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './city-dialog.component.html',
  styleUrl: './city-dialog.component.scss',
})
export class CityDialog {
  readonly dialogRef = inject(MatDialogRef<CityDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly city = model(this.data.city);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
