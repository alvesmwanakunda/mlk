// src/app/pv-reception/pv.types.ts
export type PvDeclaration =
  | 'WITHOUT_RESERVE'
  | 'WITH_RESERVES'
  | 'REFUSED'
  | 'WITHOUT_RESERVE_WITH_OBSERVATION';

export interface ReserveItem {
  nature: string;
  travauxAExecuter: string;
  photoUrl?: string | null;
  etat?: 'Non levée' | 'Levée' | 'Observation';
}

export interface PvReception {
  _id?: string;
  number?: string;
  declaration: PvDeclaration;
  effectiveDate: string; // ISO
  place: string;

  refusalReason?: string;
  observation?: string;

  nextReceptionDate?: string;
  reserves?: ReserveItem[];
  reservesExecutionDelayDays?: number;
  reservesFromDate?: string;
  allReservesLifted?: boolean;

  signatures?: {
    companyRep?: { signerName?: string; signerRole?: string; signedAt?: string; signatureUrl?: string; };
    client?: { signerName?: string; signerRole?: string; signedAt?: string; signatureUrl?: string; };
  };

  status?: 'DRAFT'|'SUBMITTED'|'SIGNED';
}
