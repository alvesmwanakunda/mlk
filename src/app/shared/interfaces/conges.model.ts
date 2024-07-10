export interface Conges {
    _id:string;
    debut:Date;
    heure_debut: string;
    heure_fin: string;
    fin: Date;
    user:{
      nom:string,
      prenom:string,
    };
    types:string;
    status:string;
    jours:string;
    date_demande:Date;
    date_signature:Date;
    signature_user:string;
    signature_entreprise:string;
    motif:string;
    raison:string;
    fichier:string;
    nom_fichier:string
  }