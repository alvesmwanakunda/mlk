export interface Contacts {
  _id:string;
  nom:string;
  prenom: string;
  email: string;
  phone: string;
  indicatif: string;
  projet:string;
  entreprise:{
    societe: string,
    _id:string
  };
  poste:string;
  rue:string;
  numero:string;
  postal:string;
  genre:string;
}
