export interface Fichiers {
  _id:string;
  nom:string;
  profondeur:string;
  dateLastUpdate: string;
  dossierParent: string;
  creator: any;
  chemin: string;
  extension: string;
  size:string;
  isPlan?: boolean;
  isActif?: boolean;
  classificationPending?: boolean;
  validationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  validatedBy?: any;
  validatedAt?: string;
}
