export interface Modules {
  _id:string;
  type:string;
  dateLastUpdate:Date;
  nom: string;
  photo:string;
  extension:string;
  plan:string;
  chemin:string;
  position:string;
  categorie:string;
  project:object;
  nom_photo:string;
  hauteur:string;
  largeur:string;
  longueur:string;
  marque:string;
  batiment:string;
  numero:string;
  numero_serie:string;
  qrcode:string;
  dateFabrication:Date;
  module_type:string;
  entreprise:{
    _id:string,
    societe:string,
  };

}
