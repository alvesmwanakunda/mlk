import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { PvService } from 'src/app/shared/services/pv.service';
const fontBaseUrl = `${window.location.origin}/assets/fonts`;


// ─── Constantes de style (identiques au PDF de référence) ──────────────────
const GREEN       = '#01754F';
const DARK_GREEN  = '#01754F';
const TITLE_GREEN = '#01754F';
const GRAY        = '#6b7280';
const LIGHT_GRAY  = '#9ca3af';
const FONT_SIZE   = 12;
const LINE_HEIGHT = 1.2;


type DownloadPvDialogData = { idPv: string; idProjet?: string };


@Component({
  selector: 'app-download-pv',
  templateUrl: './download-pv.component.html',
  styleUrls: ['./download-pv.component.scss']
})
export class DownloadPvComponent implements OnInit {
  isLoading = false;
  pv: any;
  googleApiKey='AIzaSyBlfD5KS4zHBNnEuUvNoj1MeOZW6vZQDqg';



  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DownloadPvDialogData,
    private readonly dialogRef: MatDialogRef<DownloadPvComponent>,
    private readonly pvService: PvService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchPv();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FETCH
  // ═══════════════════════════════════════════════════════════════════════════

  private fetchPv(): void {
    if (!this.data?.idPv) {
      this.openSnackBarError('Identifiant du PV manquant.');
      this.dialogRef.close();
      return;
    }
    this.isLoading = true;
    this.pvService.getPV(this.data.idPv).subscribe({
      next: (res: any) => {
        this.pv = res?.message;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; this.openSnackBarError('Impossible de récupérer le PV.'); }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GÉNÉRATION PDF
  // ═══════════════════════════════════════════════════════════════════════════

  async downloadMergedPdf(): Promise<void> {
  if (!this.pv) {
    this.openSnackBarError("Le PV n'est pas encore chargé.");
    return;
  }

  const isMlka = (this.pv?.entrepriseCode || '').toUpperCase() === 'MLKA';
  const mainColor = isMlka ? '#28628B' : '#01754F';

  const GREEN = mainColor;
  const DARK_GREEN = mainColor;
  const TITLE_GREEN = mainColor;

  this.isLoading = true;

  (pdfMake as any).fonts= {
    Helvetica: {
      normal: `${fontBaseUrl}/Helvetica.ttf`,
      bold: `${fontBaseUrl}/Helvetica-Bold.ttf`,
      italics: `${fontBaseUrl}/Helvetica-Oblique.ttf`,
      bolditalics: `${fontBaseUrl}/Helvetica-BoldOblique.ttf`
    }
  };

  try {
    const logoDataUrl = await this.toDataUrl('assets/images/mlka_logo.png');
    const declaration = this.pv?.declaration;
    const planUrl = this.pv?.travaux?.planUrl;
    const pvTitle = (this.pv?.titre || 'PV DE RÉCEPTION DE TRAVAUX').toString().toUpperCase();

    const entrepriseRep = this.pv?.entreprise?.representant;
    const maitreOuvrage = this.pv?.societeCliente?.maitreOuvrage;
    const projet = typeof this.pv?.projet === 'object' ? this.pv.projet : null;

    const companySignUrl = this.pv?.signatures?.companyRep?.signatureUrl;
    const clientSignUrl = this.pv?.signatures?.client?.signatureUrl;

    const mapImageOnly = await this.buildMapImageOnly(this.pv?.chantier);

    const peopleRows = this.buildPeopleRows(this.pv?.personnesPresent);
    const allReserves = Array.isArray(this.pv?.reserves) ? this.pv.reserves : [];
    const observationReserves = allReserves.filter((r: any) => this.normalizeEtat(r?.etat) === 'observation');
    const classicReserves = allReserves.filter((r: any) => this.normalizeEtat(r?.etat) !== 'observation');
    const reservesRows = await this.buildReservesRows(classicReserves);
    const observationsRows = await this.buildObservationsRows(observationReserves);


    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [36, 90, 36, 52],

      header: () => ({
        margin: [36, 20, 36, 0],
        stack: [
          {
            columnGap: 16,
            columns: [
              {
                width: 50,
                image: logoDataUrl,
                fit: [50, 50],
                margin: [0, 0, 0, 0]
              },
              {
                width: '*',
                text: pvTitle,
                style: 'header',
                margin: [0, 14, 0, 0]
              }
            ]
          },
          {
            canvas: [
              { type: 'line', x1: 0, y1: 8, x2: 523, y2: 8, lineWidth: 2.5, lineColor: GREEN }
            ]
          }
        ]
      }),

      footer: (currentPage: number, pageCount: number) => ({
        margin: [36, 8, 36, 0],
        stack: [
          {
            canvas: [
              { type: 'line', x1: 0, y1: 0, x2: 523, y2: 0, lineWidth: 1, lineColor: GREEN }
            ]
          },
          {
            columns: [
              {
                text: this.pv?.entreprise?.nom || '',
                fontSize: 7.5,
                color: GRAY,
                margin: [0, 4, 0, 0]
              },
              {
                text: `Page ${currentPage} sur ${pageCount}`,
                alignment: 'right',
                fontSize: 7.5,
                color: GRAY,
                margin: [0, 4, 0, 0]
              },
              // {
              //   text: this.pv?.entreprise?.adresse || '',
              //   alignment: 'right',
              //   fontSize: 7.5,
              //   color: GRAY,
              //   margin: [0, 4, 0, 0]
              // }
            ]
          }
        ]
      }),

      content: [
        // Bloc projet
        {
          table: {
            widths: ['*'],
            body: [[
              {
                stack: [
                  {
                    text: `Projet : ${projet?.projet || this.pv?.titre}`,
                    color: 'white',
                    bold: true,
                    style:'contentText',
                    alignment: 'center',
                    margin: [0, 4, 0, 2]
                  },
                  {
                    text: `Date de début des travaux : ${this.formatDateShort(this.pv?.travaux?.dateExecution)}`,
                    color: 'white',
                    bold: true,
                    alignment: 'center',
                    style:'contentText',
                    margin: [0, 0, 0, 2]
                  },
                  {
                    text: `Objet des travaux : ${this.pv?.travaux?.objet}`,
                    color: 'white',
                    bold: true,
                    style:'contentText',
                    alignment: 'center'
                  }
                ],
                fillColor: DARK_GREEN,
                margin: [6, 6, 6, 6]
              }
            ]]
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0
          },
          margin: [0, 0, 0, 18]
        },

        // Entreprise / Client
        {
          columns: [
            {
              width: '48%',
              stack: [
                { text: 'Entreprise effectuant les travaux', style: 'sectionTitle', decoration: 'underline', margin: [0, 0, 0, 8] },
                this.lineItemLabelValue("Nom de l'Entreprise", this.pv?.entreprise?.nom),
                this.lineItemLabelValue("Adresse de l'Entreprise", this.pv?.entreprise?.adresse),
                this.lineItemLabelValue("Nom du contact", `${(entrepriseRep?.prenom || '')} ${(entrepriseRep?.nom || '')}`.trim()),
                this.lineItemLabelValue("Tel", entrepriseRep?.telephone),
                this.lineItemLabelValue("Email", entrepriseRep?.email),
                // { text: `Nom de l'Entreprise : ${this.pv?.entreprise?.nom}`, bold: true,style:'contentText', margin: [0, 0, 0, 2] },
                // this.lineItem(`Adresse de l'Entreprise : ${this.pv?.entreprise?.adresse}`),
                // this.lineItem(`Nom du contact : ${(entrepriseRep?.prenom || '')} ${(entrepriseRep?.nom || '')}`.trim()),
                // this.lineItem(`Tel : ${entrepriseRep?.telephone}`),
                // this.lineItem(`Email : ${entrepriseRep?.email}`)
              ]
            },
            { width: '4%', text: '' },
            {
              width: '48%',
              stack: [
                { text: "Maître d'Ouvrage (ou client)", style: 'sectionTitle',decoration: 'underline', margin: [0, 0, 0, 8] },
                this.lineItemLabelValue("Nom de l'Entreprise", this.pv?.societeCliente?.nom),
                this.lineItemLabelValue("Adresse de l'Entreprise", this.pv?.societeCliente?.adresse),
                this.lineItemLabelValue("Nom du contact", `${(maitreOuvrage?.prenom || '')} ${(maitreOuvrage?.nom || '')}`.trim()),
                this.lineItemLabelValue("Tel", maitreOuvrage?.telephone),
                this.lineItemLabelValue("Email", maitreOuvrage?.email),
                // { text: `Nom de l'Entreprise : ${this.pv?.societeCliente?.nom}`, bold: true, margin: [0, 0, 0, 2] },
                // this.lineItem(`Adresse de l'Entreprise : ${this.pv?.societeCliente?.adresse}`),
                // this.lineItem(`Nom du contact : ${(maitreOuvrage?.prenom || '')} ${(maitreOuvrage?.nom || '')}`.trim()),
                // this.lineItem(`Tel : ${maitreOuvrage?.telephone}`),
                // this.lineItem(`Email : ${maitreOuvrage?.email}`)
              ]
            }
          ],
          margin: [0, 0, 0, 16]
        },

        // Adresse chantier + map dans un vrai bloc à 2 colonnes
        { text: 'Adresse chantier', style: 'sectionTitle',decoration: 'underline', alignment: 'center', margin: [0, 0, 0, 8] },
        {
          table: {
            widths: ['48%', '52%'],
            body: [[
              {
                stack: [
                  {
                    text: 'Adresse physique',
                    color: TITLE_GREEN,
                    bold: true,
                    style:'contentText',
                    alignment: 'center',
                    margin: [0, 8, 0, 6]
                  },
                  {
                    text: this.pv?.chantier?.adresse,
                    alignment: 'center',
                    style:'contentText',
                    margin: [10, 0, 10, 0]
                  }
                ],
                margin: [0, 6, 0, 6]
              },
              {
                stack: [
                  {
                    text: 'Adresse map',
                    color: TITLE_GREEN,
                    bold: true,
                    alignment: 'center',
                    style:'contentText',
                    margin: [0, 8, 0, 6]
                  },
                  mapImageOnly,
                  // {
                  //   text: this.pv?.chantier?.latitude && this.pv?.chantier?.longitude
                  //     ? `Coordonnées : ${this.pv.chantier.latitude}, ${this.pv.chantier.longitude}`
                  //     : '',
                  //   alignment: 'center',
                  //   fontSize: 8,
                  //   color: GRAY,
                  //   margin: [0, 6, 0, 0]
                  // }
                ],
                margin: [0, 6, 0, 6]
              }
            ]]
          },
          layout: {
            hLineColor: () => '#bdbdbd',
            vLineColor: () => '#bdbdbd',
            hLineWidth: () => 0.8,
            vLineWidth: () => 0.8
          },
          margin: [0, 0, 0, 18]
        },

        // Personnes présentes
        { text: 'Personnes présentes', style: 'sectionTitle', decoration: 'underline', alignment: 'center', margin: [0, 0, 0, 8] },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'Prénom(s) et nom(s)', style: 'tableHeader' },
                { text: 'Téléphone', style: 'tableHeader' },
                { text: 'Email', style: 'tableHeader' },
                { text: 'Profession', style: 'tableHeader' }
              ],
              ...peopleRows
            ]
          },
          layout: this.tableLayout(),
          margin: [0, 0, 0, 16]
        },

        // Déclaration
        { text: "Le Maître d'Ouvrage (ou client) déclare que :", style: 'sectionTitle', margin: [0, 0, 0, 8] },
        {
          stack: [
            this.checkLine(
              declaration === 'WITHOUT_RESERVE',
              `La réception est prononcée sans réserve avec effet à la date du ${this.formatDate(this.pv?.effectiveDate)}`
            ),
            this.checkLine(
              declaration === 'WITH_RESERVES',
              `La réception est prononcée avec réserves mentionnées dans l'état des réserves figurant ci-après avec effet à la date du ${this.formatDate(this.pv?.effectiveDate)}`
            ),
            this.checkLine(
              declaration === 'REFUSED',
              'La réception est refusée'
            ),
            this.checkLine(
              declaration === 'WITHOUT_RESERVE_WITH_OBSERVATION',
              `La réception est prononcée sans réserves mais avec observation avec effet à la date du ${this.formatDate(this.pv?.effectiveDate)}`
            )
          ],
          margin: [0, 0, 0, 14]
        },

        // Réserves
        ...(
          ['WITH_RESERVES'].includes(this.pv?.declaration) && reservesRows.length
            ? [
                {
                  text: 'Liste des réserves',
                  style: 'sectionTitle',
                  decoration: 'underline',
                  alignment: 'center',
                  margin: [0, 4, 0, 10]
                },
                {
                  table: {
                    headerRows: 1,
                    widths: [30, '*', '*', 55, 48, 55],
                    body: [
                      [
                        { text: 'N°', style: 'tableHeader' },
                        { text: 'Nature', style: 'tableHeader' },
                        { text: 'Travaux à exécuter', style: 'tableHeader' },
                        { text: 'Photo', style: 'tableHeader' },
                        { text: 'État', style: 'tableHeader' },
                        { text: 'Photo levée', style: 'tableHeader' }
                      ],
                      ...reservesRows
                    ]
                  },
                  layout: this.tableLayout(),
                  margin: [0, 0, 0, 14]
                }
              ]
            : []
        ),

        ...(
          (
            ['WITHOUT_RESERVE_WITH_OBSERVATION'].includes(this.pv?.declaration) ||
            (['WITH_RESERVES'].includes(this.pv?.declaration) && observationsRows.length > 0)
          )
          && observationsRows.length
            ? [
                {
                  text: 'Liste des observations',
                  style: 'sectionTitle',
                  decoration: 'underline',
                  alignment: 'center',
                  margin: [0, 4, 0, 10]
                },
                {
                  table: {
                    headerRows: 1,
                    widths: [40, '*', 55],
                    body: [
                      [
                        { text: 'N°', style: 'tableHeader' },
                        { text: 'Nature', style: 'tableHeader' },
                        { text: 'Photo', style: 'tableHeader' },
                      ],
                      ...observationsRows
                    ]
                  },
                  layout: this.tableLayout(),
                  margin: [0, 0, 0, 14]
                }
              ]
            : []
        ),

        // ...(this.pv?.declaration === 'WITHOUT_RESERVE_WITH_OBSERVATION' ? [
        //   {
        //     text: `Observations`,
        //     style: 'sectionTitle',
        //     margin: [0, 4, 0, 10]
        //   },
        //   {
        //     text: `${this.pv?.observation}`,
        //     style: 'contentText',
        //     margin: [0, 0, 0, 10]
        //   }
        // ] : []),

        ...(this.pv?.declaration === 'REFUSED' ? [
          {
            text: `La raison du refus`,
            style: 'sectionTitle',
            margin: [0, 4, 0, 10]
          },
          {
            text: `${this.pv?.refusalReason}`,
            style: 'contentText',
            color:'red',
            bold: true,
            margin: [0, 0, 0, 10]
          }
        ] : []),
        ...(this.pv?.declaration === 'WITH_RESERVES' ? [
          {
            text: `L'entreprise et le Maître d'Ouvrage conviennent que les travaux nécessités par les réserves exposées ci-dessus seront exécutés dans un délai de ${this.pv?.reservesExecutionDelayDays ?? ''} jours à compter du ${this.formatDate(this.pv?.reservesFromDate)}.`,
            style: 'contentText',
            margin: [0, 0, 0, 6]
          },
          {
            text: `Prochaine réception prévue le : ${this.formatDate(this.pv?.nextReceptionDate)}`,
            style: 'contentText',
            bold: true,
            margin: [0, 0, 0, 10]
          }
        ] : []),
        {
          text: 'Les garanties découlant des articles 1792, 1792-2 et 1792-3 du Code Civil commencent à courir à compter de la signature du présent procès-verbal, avec ou sans réserve.',
          fontSize: 9,
          color: '#1565C0',
          italics: true,
          margin: [0, 0, 0, 6]
        },
        {
          text: "La signature du procès-verbal et le règlement des travaux autorisent le Maître d'Ouvrage (ou client) soussigné à prendre possession de l'ouvrage.",
          fontSize: 9,
          color: '#1565C0',
          italics: true,
          margin: [0, 0, 0, 20]
        },

        // Signatures
        { text: 'Signatures', style: 'sectionTitle', margin: [0, 0, 0, 4] },
        {
          text: `Fait à ${this.pv?.place} le ${this.formatDate(this.pv?.effectiveDate)}.`,
          italics: true,
          style:"contentText",
          margin: [0, 0, 0, 16]
        },
        {
          columns: [
            {
              width: '45%',
              stack: [
                ...(companySignUrl
                  ? [{ image: companySignUrl, width: 140, height: 65, alignment: 'center', margin: [0, 0, 0, 2] }]
                  : [{ text: '[Non signé]', alignment: 'center', color: LIGHT_GRAY, italics: true, margin: [0, 0, 0, 30] }]
                ),
                {
                  canvas: [
                    { type: 'line', x1: 20, y1: 0, x2: 160, y2: 0, lineWidth: 1, lineColor: '#374151' }
                  ]
                },
                {
                  text: this.pv?.signatures?.companyRep?.signerName
                    || `${entrepriseRep?.prenom || ''} ${entrepriseRep?.nom || ''}`.trim(),
                  alignment: 'center',
                  bold: true,
                  fontSize: 10,
                  margin: [0, 4, 0, 1]
                },
                {
                  text: "Signature de l'entreprise",
                  alignment: 'center',
                  fontSize: 8.5,
                  color: GRAY
                },
                ...(this.pv?.signatures?.companyRep?.signedAt
                  ? [{
                      text: `Signé le ${this.formatDate(this.pv.signatures.companyRep.signedAt)}`,
                      alignment: 'center',
                      fontSize: 8,
                      color: GRAY,
                      margin: [0, 2, 0, 0]
                    }]
                  : []
                )
              ]
            },
            { width: '*', text: '' },
            {
              width: '45%',
              stack: [
                ...(clientSignUrl
                  ? [{ image: clientSignUrl, width: 140, height: 65, alignment: 'center', margin: [0, 0, 0, 2] }]
                  : [{ text: '[Non signé]', alignment: 'center', color: LIGHT_GRAY, italics: true, margin: [0, 0, 0, 30] }]
                ),
                {
                  canvas: [
                    { type: 'line', x1: 20, y1: 0, x2: 160, y2: 0, lineWidth: 1, lineColor: '#374151' }
                  ]
                },
                {
                  text: this.pv?.signatures?.client?.signerName,
                    //|| `${maitreOuvrage?.prenom || ''} ${maitreOuvrage?.nom || ''}`.trim(),
                  alignment: 'center',
                  bold: true,
                  fontSize: 10,
                  margin: [0, 4, 0, 1]
                },
                {
                  text: "Signature du Maître d'Ouvrage (ou client)",
                  alignment: 'center',
                  fontSize: 8.5,
                  color: GRAY
                },
                ...(this.pv?.signatures?.client?.signedAt
                  ? [{
                      text: `Signé le ${this.formatDate(this.pv.signatures.client.signedAt)}`,
                      alignment: 'center',
                      fontSize: 8,
                      color: GRAY,
                      margin: [0, 2, 0, 0]
                    }]
                  : []
                )
              ]
            }
          ],
          margin: [0, 0, 0, 10]
        },

        // Plan
        ...(planUrl ? [
          { text: '', pageBreak: 'before' },
          { text: 'PLAN', style: 'sectionTitle', margin: [0, 0, 0, 8] },
          { text: `Projet : ${projet?.projet || this.pv?.titre}`, margin: [0, 0, 0, 4] },
          { text: 'Le plan est disponible au lien ci-dessous :', margin: [0, 0, 0, 4] },
          { text: planUrl, link: planUrl, color: '#1d4ed8', decoration: 'underline', fontSize: 9 }
        ] : [])
      ],

      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: TITLE_GREEN
        },
        subheader: {
          fontSize: 14,
          bold: true,
          color: TITLE_GREEN
        },
        contentText:{
           fontSize: 10,
        },
        sectionTitle: {
          fontSize: 12,
          bold: true,
          color: TITLE_GREEN,
          //alignment: 'center'
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'white',
          fillColor: DARK_GREEN,
          alignment: 'center'
        },
        bold: {
          bold: true
        }
      },

      defaultStyle: {
        fontSize: FONT_SIZE,
        lineHeight: LINE_HEIGHT,
        font: 'Helvetica'
      }
    };

    const pvName = (this.pv?.titre || 'pv-reception')
      .toString()
      .replace(/[^\w\- ]+/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .toLowerCase();

    (pdfMake).createPdf(docDefinition).download(`${pvName}.pdf`);
    this.openSnackBar('Le PDF a été téléchargé.');
    this.dialogRef.close(true);

  } catch (e) {
    console.error(e);
    this.openSnackBarError('Échec de génération du PDF.');
  } finally {
    this.isLoading = false;
  }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CARTOGRAPHIE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Génère le bloc cartographique à partir de chantier.latitude et chantier.longitude
   */
  private async buildMapImageOnly(chantier: any): Promise<any> {
  const lat = chantier?.latitude;
  const lon = chantier?.longitude;

  if (!lat || !lon) {
    return {
      text: 'Aucune coordonnée disponible',
      alignment: 'center',
      color: LIGHT_GRAY,
      margin: [0, 30, 0, 30]
    };
  }

    const staticMapUrl =
    `https://maps.googleapis.com/maps/api/staticmap?` +
    `center=${lat},${lon}` +
    `&zoom=15` +
    `&size=640x420` +
    `&scale=2` +
    `&format=png32` +
    `&maptype=roadmap` +
    `&markers=color:red|${lat},${lon}` +
    `&key=${this.googleApiKey}`;

  const mapLink = `https://www.google.com/maps?q=${lat},${lon}`;

  try {
    const mapDataUrl = await this.toDataUrl(staticMapUrl);
    return {
      image: mapDataUrl,
      width: 270,
      height: 180,
      alignment: 'center',
      link: mapLink
    };
  } catch {
    return {
      text: 'Carte indisponible',
      alignment: 'center',
      color: LIGHT_GRAY,
      margin: [0, 30, 0, 30]
    };
  }
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // BUILDERS
  // ═══════════════════════════════════════════════════════════════════════════

  private buildPeopleRows(personnes: any[]): any[][] {
    const rows = Array.isArray(personnes) ? personnes : [];
    if (!rows.length) return [['', '', '', '']];
    return rows.slice(0, 8).map((p: any) => [
      { text: `${p?.prenom || ''} ${p?.nom || ''}`.trim(), fontSize: 10 },
      { text: p?.telephone,  fontSize: 10 },
      { text: p?.email    ,  fontSize: 10 },
      { text: p?.profession, fontSize: 10 },
    ]);
  }

  private buildEtatBadge(etat: string, leveeDate?: any): any {
    const value = (etat).trim();
    const normalized = value.toLowerCase();

    const bgColor =
      normalized === 'fait' ? '#047857' :
      normalized === 'observation' ? '#d97706' :
      '#ea580c'; // A FAIRE

    const width =
      normalized === 'fait' ? 42 :
      normalized === 'observation' ? 52 :
      42;

    const height = 20;
    const rx = 15;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect x="0" y="0" width="${width}" height="${height}" rx="${rx}" ry="${rx}" fill="${bgColor}" />
        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="Helvetica"
          font-size="8"
          fill="#ffffff"
        >${value}</text>
      </svg>
    `;

    return {
      stack: [
        {
          svg,
          width,
          height,
          alignment: 'center',
          margin: [0, 2, 0, 0]
        },
        ...(leveeDate ? [{
          text: `le ${this.formatDate(leveeDate)}`,
          fontSize: 7.5,
          color: GRAY,
          alignment: 'center',
          margin: [0, 4, 0, 0]
        }] : [])
      ]
    };
  }

  private async buildReservesRows(reserves: any[]): Promise<any[][]> {
    const rows = Array.isArray(reserves) ? reserves : [];
    if (!rows.length) return [];

    return Promise.all(
      rows.slice(0, 20).map(async (r: any, i: number) => {
        const photoCell = await this.imageCell(r?.photoUrl);
        const photoLeveeCell = await this.imageCell(r?.photoLevee);

        return [
          { text: `RE${String(i + 1).padStart(2, '0')}`, fontSize: 10, alignment: 'center' },
          { text: r?.nature, fontSize: 10 },
          { text: r?.travauxAExecuter, fontSize: 10 },
          photoCell,
          this.buildEtatBadge(r?.etat, r?.leveeDate),
          photoLeveeCell,
        ];
      })
    );
  }

    private async buildObservationsRows(reserves: any[]): Promise<any[][]> {
    const rows = Array.isArray(reserves) ? reserves : [];
    if (!rows.length) return [];

    return Promise.all(
      rows.slice(0, 20).map(async (r: any, i: number) => {
        const photoCell = await this.observationPhotoCell(r?.photoUrl);

        return [
          { text: `OB${i + 1}`, fontSize: 10, alignment: 'center' },
          { text: r?.nature, fontSize: 10 },
          photoCell,
        ];
      })
    );
  }

  // private async buildReservesRows(reserves: any[]): Promise<any[][]> {
  //   const rows = Array.isArray(reserves) ? reserves : [];
  //   if (!rows.length) return [['', '', '', '', '', '']];

  //   return Promise.all(
  //     rows.slice(0, 20).map(async (r: any, i: number) => {
  //       const photoCell      = await this.imageCell(r?.photoUrl);
  //       const photoLeveeCell = await this.imageCell(r?.photoLevee);
  //       const etatColor      = r?.etat === 'Fait' ? '#16a34a' : '#dc2626';

  //       return [
  //         { text: `RE${String(i + 1).padStart(2, '0')}`, fontSize: 10, alignment: 'center' },
  //         { text: r?.nature            , fontSize: 10 },
  //         { text: r?.travauxAExecuter  , fontSize: 10 },
  //         photoCell,
  //         {
  //           stack: [
  //             { text: r?.etat, color: etatColor, bold: true, fontSize: 10, alignment: 'center' },
  //             ...(r?.leveeDate ? [{ text: `le ${this.formatDate(r.leveeDate)}`, fontSize: 7.5, color: GRAY, alignment: 'center' }] : [])
  //           ]
  //         },
  //         photoLeveeCell,
  //       ];
  //     })
  //   );
  // }

  private async imageCell(url?: string): Promise<any> {
    if (!url) return { text: '', fontSize: 9, alignment: 'center', color: LIGHT_GRAY };
    try {
      const dataUrl = await this.toDataUrl(url);
      return { image: dataUrl, width: 50, height: 42, alignment: 'center',link: url };
    } catch {
      return { text: '', fontSize: 8.5, alignment: 'center', color: LIGHT_GRAY };
    }
  }

  private async observationPhotoCell(url?: string):  Promise<any> {
    return this.imageCell(url);
  }

  private normalizeEtat(value: any): string {
    return (value || '').toString().trim().toLowerCase();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS DE MISE EN FORME
  // ═══════════════════════════════════════════════════════════════════════════

  /** Texte simple avec marge basse */
  private lineItem(text: string): any {
    return { text, margin: [0, 0, 0, 2] };
  }

  private lineItemLabelValue(label: string, value: string): any {
    return {
      text: [
        { text: `${label} : `, bold: true },
        { text: value }
      ],
      style: 'contentText',
      margin: [0, 0, 0, 2]
    };
  }

  /** Ligne checkbox (☒ / ☐) */
  // private checkLine(checked: boolean, label: string): any {
  //   return {
  //     text: [
  //       { text: checked ? '☒' : '☐', bold: true, fontSize: 10 },
  //       { text: `  ${label}`,fontSize: 10 }
  //     ],
  //     margin: [0, 0, 0, 5]
  //   };
  // }

  private checkLine(checked: boolean, label: string): any {
  return {
    columns: [
      {
        width: 11,
        stack: [
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: 10,
                h: 10,
                lineColor: '#b3b3b3',
                lineWidth: 1,
                color: '#ffffff'
              }
            ]
          },
          {
            text: checked ? 'X' : '',
            fontSize: 7,
            bold: true,
            color: '#111111',
            alignment: 'center',
            margin: [-0.5, -7.5, 0, 0]
          }
        ],
        margin: [0, 1, 0, 0]
      },
      {
        width: '*',
        text: label,
        fontSize: 10,
        margin: [6, -1, 0, 0]
      }
    ],
    margin: [0, 0, 0, 12]
  };
}

  /** Layout commun pour tous les tableaux */

  private tableLayout(): any {
    return {
      fillColor: (rowIndex: number) => rowIndex === 0 ? DARK_GREEN : null,
      hLineColor: () => '#bdbdbd',
      vLineColor: () => '#bdbdbd',
      hLineWidth: () => 0.8,
      vLineWidth: () => 0.8,
      paddingTop: () => 6,
      paddingBottom: () => 6,
      paddingLeft: () => 5,
      paddingRight: () => 5
    };
  }

  private formatDateShort(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('fr-FR');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITAIRES
  // ═══════════════════════════════════════════════════════════════════════════

  private async toDataUrl(url: string): Promise<string> {
    if (url.startsWith('data:')) return url;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private getDeclarationLabel(type?: string): string {
    const map: Record<string, string> = {
      WITHOUT_RESERVE:                   'Réception prononcée sans réserve',
      WITH_RESERVES:                     'Réception prononcée avec réserves',
      REFUSED:                           'Réception refusée',
      WITHOUT_RESERVE_WITH_OBSERVATION:  'Réception prononcée sans réserves mais avec observation',
    };
    return type ? (map[type] || type) : '';
  }

  private formatDate(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  close(): void { this.dialogRef.close(); }

  private openSnackBarError(msg: string): void {
    this.snackbar.open(msg, 'Fermer', { duration: 6000, panelClass: ['error-snackbar'] });
  }
  private openSnackBar(msg: string): void {
    this.snackbar.open(msg, 'Fermer', { duration: 4000 });
  }
}
