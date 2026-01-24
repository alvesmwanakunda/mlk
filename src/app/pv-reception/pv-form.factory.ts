// src/app/pv-reception/pv-form.factory.ts
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PvDeclaration } from './pv.types';

export function buildPvForm(fb: FormBuilder) {


  const form = fb.group({
    declaration: new FormControl<PvDeclaration>('WITHOUT_RESERVE', { nonNullable: true, validators: [Validators.required] }),
    effectiveDate: ['', Validators.required],
    place: ['', Validators.required],

    refusalReason: [''],
    observation: [''],

    nextReceptionDate: [''],
    reservesExecutionDelayDays: [null],
    reservesFromDate: [''],
    allReservesLifted: [false],

    reserves: fb.array([]),
    personnesPresent: fb.array([]),
    signatures: fb.group({
      companyRep: fb.group({
        signerName: [''],
        signerRole: ['Entreprise'],
        signatureUrl: [''],
        signedAt: [new Date()],
      }),
      client: fb.group({
        signerName: [''],
        signerRole: ["Maître d'Ouvrage"],
        signatureUrl: [''],
        signedAt: [new Date()],
      }),
    }),
  });

    // Règles dynamiques selon declaration
    form.get('declaration')!.valueChanges.subscribe((dec) => {
    // reset validators
    form.get('refusalReason')!.clearValidators();
    form.get('observation')!.clearValidators();

    form.get('nextReceptionDate')!.clearValidators();
    form.get('reservesExecutionDelayDays')!.clearValidators();
    form.get('reservesFromDate')!.clearValidators();

    if (dec === 'REFUSED') {
      form.get('refusalReason')!.setValidators([Validators.required, Validators.minLength(5)]);
    }

    if (dec === 'WITHOUT_RESERVE_WITH_OBSERVATION') {
      form.get('observation')!.setValidators([Validators.required, Validators.minLength(5)]);
    }

    if (dec === 'WITH_RESERVES') {
      form.get('nextReceptionDate')!.setValidators([Validators.required]);
      form.get('reservesExecutionDelayDays')!.setValidators([Validators.required, Validators.min(1)]);
      form.get('reservesFromDate')!.setValidators([Validators.required]);
      // reserves: au moins 1 ligne (validation custom à faire au submit)
    }

    // update validity
    form.get('refusalReason')!.updateValueAndValidity();
    form.get('observation')!.updateValueAndValidity();
    form.get('nextReceptionDate')!.updateValueAndValidity();
    form.get('reservesExecutionDelayDays')!.updateValueAndValidity();
    form.get('reservesFromDate')!.updateValueAndValidity();
  });

  return form;
}

export function reserveRow(fb: FormBuilder) {
  return fb.group({
    nature: ['', Validators.required],
    travauxAExecuter: ['', Validators.required],
    photoUrl: [''],
    etat: ['Non levée'],
    leveeDate: [null],
    photoLevee: [null],
  });
}

export function reserveUpdateRow(fb: FormBuilder) {
  return fb.group({
    nature: ['', Validators.required],
    travauxAExecuter: ['', Validators.required],
    etat: ['Non levée'],
    leveeDate: [null],
  });
}

export function reserveExistingRow(fb: FormBuilder) {
  return fb.group({
    nature: ['', Validators.required],
    travauxAExecuter: ['', Validators.required],
    etat: [{ value: 'Non levée', disabled: true }], // ✅ disabled uniquement existant
    photoUrl: [null],
    leveeDate: [null],
    photoLevee: [null],
  });
}

export function personnesRow(fb: FormBuilder) {
  return fb.group({
    nom: [''],
    prenom: [''],
  });
}

export function reservesArray(form: FormGroup): FormArray {
  return form.get('reserves') as FormArray;
}

export function personnesArray(form: FormGroup): FormArray {
  return form.get('personnesPresent') as FormArray;
}

export function onReservePhotoSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.reservePhotoFiles[index] = file;

    // reset pour permettre de rechoisir le même fichier
    input.value = '';
  }

export function onGlobalImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.globalImageFile = input.files[0];
    input.value = '';
}
