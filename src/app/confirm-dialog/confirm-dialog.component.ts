import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

// Interface pour les données du dialogue
export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'accent' | 'warn';
  showCancel?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {

  // Définition des valeurs par défaut
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmColor: 'primary' | 'accent' | 'warn';
  showCancel: boolean;
  icon: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {
    // Utiliser les données passées ou les valeurs par défaut
    this.title = data.title || 'Confirmation';
    this.message = data.message || 'Êtes-vous sûr de vouloir continuer ?';
    this.confirmText = data.confirmText || 'Confirmer';
    this.cancelText = data.cancelText || 'Annuler';
    this.confirmColor = data.confirmColor || 'primary';
    this.showCancel = data.showCancel !== false; // true par défaut
    this.icon = data.icon || 'warning'; // warning, error, info, question_mark
  }

  onConfirm(): void {
    // Retourne true quand l'utilisateur confirme
    this.dialogRef.close(true);
  }

  onCancel(): void {
    // Retourne false quand l'utilisateur annule
    this.dialogRef.close(false);
  }

  onDismiss(): void {
    // Retourne undefined quand l'utilisateur clique en dehors
    this.dialogRef.close();
  }
}
