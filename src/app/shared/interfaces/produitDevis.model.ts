export interface ProduitDevis {
  _id: string;
  produit: string;
  quantite: number;
  unites: string;
  price_unitaire: number;
  price: number;
  tva: number;
  devis: string;
  description: string;
  createdAt: Date;
  total: number;
  isEditable: boolean;
}
