import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PvService } from '../shared/services/pv.service';
import SignaturePad from 'signature_pad';
import * as pdfMake from 'pdfmake/build/pdfmake';

const fontBaseUrl = `${window.location.origin}/assets/fonts`;
const GRAY = '#6b7280';
const LIGHT_GRAY = '#9ca3af';
const FONT_SIZE = 12;
const LINE_HEIGHT = 1.2;

@Component({
  selector: 'app-pv-signature',
  templateUrl: './pv-signature.component.html',
  styleUrls: ['./pv-signature.component.scss'],
})
export class PvSignatureComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('signatureCanvas') signatureCanvas?: ElementRef<HTMLCanvasElement>;

  reviewForm: FormGroup;
  isLoading = false;
  isGeneratingPdf = false;
  pvId = '';
  code = '';
  pvData: any = null;
  pdfPreviewUrl: SafeResourceUrl | null = null;
  signatureValidated = false;
  private readonly googleApiKey = 'AIzaSyBlfD5KS4zHBNnEuUvNoj1MeOZW6vZQDqg';

  private signaturePad?: SignaturePad;
  private rawPdfUrl: string | null = null;
  isSuccess = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly pvService: PvService,
    private readonly fb: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly sanitizer: DomSanitizer,
    private readonly router: Router
  ) {
    this.reviewForm = this.fb.group({
      refuseReception: [false],
      refusalReason: [''],
      comment: [''],
      signerName: ['', [Validators.required, Validators.minLength(2)]],
      signatureUrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.reviewForm
      .get('refuseReception')
      ?.valueChanges.subscribe((isRefused) => {
        this.applyConditionalValidators(!!isRefused);
      });
    
    this.applyConditionalValidators(false);

    this.pvId = this.route.snapshot.paramMap.get('id') || '';
    const code = this.route.snapshot.queryParamMap.get('code') || '';
    this.code = code;
    if (!this.pvId || !this.code) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.fetchPvAndGeneratePreview(code);
  }

  ngAfterViewInit(): void {
    this.initSignaturePad();
  }

  ngOnDestroy(): void {
    if (this.rawPdfUrl) {
      URL.revokeObjectURL(this.rawPdfUrl);
      this.rawPdfUrl = null;
    }
  }

  get isRefused(): boolean {
    return !!this.reviewForm.get('refuseReception')?.value;
  }

  clearSignature(): void {
    this.signaturePad?.clear();
    this.reviewForm.patchValue({ signatureUrl: '' });
    this.signatureValidated = false;
  }

  validateSignature(): void {
    if (!this.signaturePad || this.signaturePad.isEmpty()) {
      this.openSnackBarError('Veuillez signer avant de valider la signature.');
      return;
    }

    this.reviewForm.patchValue({
      signatureUrl: this.signaturePad.toDataURL(),
    });
    this.signatureValidated = true;
    this.openSnackBar('Signature validée avec succès.');
  }

  submit(): void {
    this.reviewForm.markAllAsTouched();

    if (!this.reviewForm.value.signatureUrl) {
      this.openSnackBarError('La signature est obligatoire.');
      return;
    }

    if (this.reviewForm.invalid) {
      this.openSnackBarError('Veuillez compléter les champs obligatoires.');
      return;
    }

    const value = this.reviewForm.getRawValue();
    const payload = {
      code: this.code,
      refuseReception: value.refuseReception,
      refusalReason: value.refuseReception ? value.refusalReason : null,
      comment: value.refuseReception ? null : value.comment,
      signerName: value.signerName,
      signatureUrl: value.signatureUrl,
    };

    this.pvService.validateClientSignature(this.pvId, payload).subscribe({
      next: (res: any) => {
        // this.openSnackBar(res?.message || 'Signature validée avec succès.');
        this.router.navigate(['/pv-signature', this.pvId, 'merci']);
      },
      error: (error) => {
        this.openSnackBarError('Une erreur s\'est produite lors de la validation de la signature.');
      }
    });
  }

  private initSignaturePad(): void {
    if (!this.signatureCanvas?.nativeElement) {
      return;
    }

    this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement, {
      backgroundColor: 'rgb(255,255,255)',
      penColor: '#1B4F8A',
      minWidth: 1,
      maxWidth: 2.5,
    });
  }

  private applyConditionalValidators(isRefused: boolean): void {
    const refusalCtrl = this.reviewForm.get('refusalReason');
    const commentCtrl = this.reviewForm.get('comment');

    if (!refusalCtrl || !commentCtrl) return;

    if (isRefused) {
      refusalCtrl.setValidators([Validators.required, Validators.minLength(5)]);
      commentCtrl.clearValidators();
    } else {
      refusalCtrl.clearValidators();
      commentCtrl.clearValidators();
    }

    refusalCtrl.updateValueAndValidity({ emitEvent: false });
    commentCtrl.updateValueAndValidity({ emitEvent: false });
  }

  private fetchPvAndGeneratePreview( code: string ): void {
    this.isLoading = true;
    this.pvService.getPVForSignature(this.pvId, code).subscribe({
      next: async (res: any) => {
        this.pvData = res?.message;
        this.isLoading = false;
        // Set the signer name in the form
        this.reviewForm.patchValue({
          signerName: this.pvData?.signatures?.client?.signerName,
        });
        
        await this.generatePdfPreview();
        
      },
      error: () => {
        this.isLoading = false;
        this.isSuccess = false;
        // this.openSnackBarError('Impossible de récupérer le PV.');
      },
    });
  }

  private async generatePdfPreview(): Promise<void> {
    if (!this.pvData) return;
    this.isGeneratingPdf = true;

    try {
      const isMlka = (this.pvData?.entrepriseCode || '').toUpperCase() === 'MLKA';
      const mainColor = isMlka ? '#28628B' : '#01754F';
      const GREEN = mainColor;
      const DARK_GREEN = mainColor;
      const TITLE_GREEN = mainColor;

      const pdfMaker: any = pdfMake;
      pdfMaker.fonts = {
        Helvetica: {
          normal: `${fontBaseUrl}/Helvetica.ttf`,
          bold: `${fontBaseUrl}/Helvetica-Bold.ttf`,
          italics: `${fontBaseUrl}/Helvetica-Oblique.ttf`,
          bolditalics: `${fontBaseUrl}/Helvetica-BoldOblique.ttf`,
        },
      };

      const logoDataUrl = await this.toDataUrl('assets/images/mlka_logo.png').catch(
        () => null
      );

      const declaration = this.pvData?.declaration;
      const planUrl = this.pvData?.travaux?.planUrl;
      const pvTitle = (this.pvData?.titre || 'PV DE RÉCEPTION DE TRAVAUX')
        .toString()
        .toUpperCase();
      const entrepriseRep = this.pvData?.entreprise?.representant;
      const maitreOuvrage = this.pvData?.societeCliente?.maitreOuvrage;
      const projet =
        typeof this.pvData?.projet === 'object' ? this.pvData.projet : null;
      const companySignUrl = this.pvData?.signatures?.companyRep?.signatureUrl;
      const clientSignUrl = this.pvData?.signatures?.client?.signatureUrl;

      const mapImageOnly = await this.buildMapImageOnly(this.pvData?.chantier);
      const peopleRows = this.buildPeopleRows(this.pvData?.personnesPresent);
      const allReserves = Array.isArray(this.pvData?.reserves)
        ? this.pvData.reserves
        : [];
      const observationReserves = allReserves.filter(
        (r: any) => this.normalizeEtat(r?.etat) === 'observation'
      );
      const classicReserves = allReserves.filter(
        (r: any) => this.normalizeEtat(r?.etat) !== 'observation'
      );
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
                logoDataUrl
                  ? {
                      width: 50,
                      image: logoDataUrl,
                      fit: [50, 50],
                      margin: [0, 0, 0, 0],
                    }
                  : { width: 50, text: '' },
                {
                  width: '*',
                  text: pvTitle,
                  style: 'header',
                  margin: [0, 14, 0, 0],
                },
              ],
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0,
                  y1: 8,
                  x2: 523,
                  y2: 8,
                  lineWidth: 2.5,
                  lineColor: GREEN,
                },
              ],
            },
          ],
        }),
        footer: (currentPage: number, pageCount: number) => ({
          margin: [36, 8, 36, 0],
          stack: [
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0,
                  y1: 0,
                  x2: 523,
                  y2: 0,
                  lineWidth: 1,
                  lineColor: GREEN,
                },
              ],
            },
            {
              columns: [
                {
                  text: this.pvData?.entreprise?.nom || '',
                  fontSize: 7.5,
                  color: GRAY,
                  margin: [0, 4, 0, 0],
                },
                {
                  text: `Page ${currentPage} sur ${pageCount}`,
                  alignment: 'right',
                  fontSize: 7.5,
                  color: GRAY,
                  margin: [0, 4, 0, 0],
                },
              ],
            },
          ],
        }),
        content: [
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    stack: [
                      {
                        text: `Projet : ${projet?.projet || this.pvData?.titre}`,
                        color: 'white',
                        bold: true,
                        style: 'contentText',
                        alignment: 'center',
                        margin: [0, 4, 0, 2],
                      },
                      {
                        text: `Date de début des travaux : ${this.formatDateShort(this.pvData?.travaux?.dateExecution)}`,
                        color: 'white',
                        bold: true,
                        alignment: 'center',
                        style: 'contentText',
                        margin: [0, 0, 0, 2],
                      },
                      {
                        text: `Objet des travaux : ${this.pvData?.travaux?.objet || ''}`,
                        color: 'white',
                        bold: true,
                        style: 'contentText',
                        alignment: 'center',
                      },
                    ],
                    fillColor: DARK_GREEN,
                    margin: [6, 6, 6, 6],
                  },
                ],
              ],
            },
            layout: {
              hLineWidth: () => 0,
              vLineWidth: () => 0,
            },
            margin: [0, 0, 0, 18],
          },
          {
            columns: [
              {
                width: '48%',
                stack: [
                  {
                    text: 'Entreprise effectuant les travaux',
                    style: 'sectionTitle',
                    decoration: 'underline',
                    margin: [0, 0, 0, 8],
                  },
                  this.lineItemLabelValue("Nom de l'Entreprise", this.pvData?.entreprise?.nom),
                  this.lineItemLabelValue(
                    "Adresse de l'Entreprise",
                    this.pvData?.entreprise?.adresse
                  ),
                  this.lineItemLabelValue(
                    'Nom du contact',
                    `${entrepriseRep?.prenom || ''} ${entrepriseRep?.nom || ''}`.trim()
                  ),
                  this.lineItemLabelValue('Tel', entrepriseRep?.telephone),
                  this.lineItemLabelValue('Email', entrepriseRep?.email),
                ],
              },
              { width: '4%', text: '' },
              {
                width: '48%',
                stack: [
                  {
                    text: "Maître d'Ouvrage (ou client)",
                    style: 'sectionTitle',
                    decoration: 'underline',
                    margin: [0, 0, 0, 8],
                  },
                  this.lineItemLabelValue("Nom de l'Entreprise", this.pvData?.societeCliente?.nom),
                  this.lineItemLabelValue(
                    "Adresse de l'Entreprise",
                    this.pvData?.societeCliente?.adresse
                  ),
                  this.lineItemLabelValue(
                    'Nom du contact',
                    `${maitreOuvrage?.prenom || ''} ${maitreOuvrage?.nom || ''}`.trim()
                  ),
                  this.lineItemLabelValue('Tel', maitreOuvrage?.telephone),
                  this.lineItemLabelValue('Email', maitreOuvrage?.email),
                ],
              },
            ],
            margin: [0, 0, 0, 16],
          },
          {
            text: 'Adresse chantier',
            style: 'sectionTitle',
            decoration: 'underline',
            alignment: 'center',
            margin: [0, 0, 0, 8],
          },
          {
            table: {
              widths: ['48%', '52%'],
              body: [
                [
                  {
                    stack: [
                      {
                        text: 'Adresse physique',
                        color: TITLE_GREEN,
                        bold: true,
                        style: 'contentText',
                        alignment: 'center',
                        margin: [0, 8, 0, 6],
                      },
                      {
                        text: this.pvData?.chantier?.adresse || '',
                        alignment: 'center',
                        style: 'contentText',
                        margin: [10, 0, 10, 0],
                      },
                    ],
                    margin: [0, 6, 0, 6],
                  },
                  {
                    stack: [
                      {
                        text: 'Adresse map',
                        color: TITLE_GREEN,
                        bold: true,
                        alignment: 'center',
                        style: 'contentText',
                        margin: [0, 8, 0, 6],
                      },
                      mapImageOnly,
                    ],
                    margin: [0, 6, 0, 6],
                  },
                ],
              ],
            },
            layout: {
              hLineColor: () => '#bdbdbd',
              vLineColor: () => '#bdbdbd',
              hLineWidth: () => 0.8,
              vLineWidth: () => 0.8,
            },
            margin: [0, 0, 0, 18],
          },
          {
            text: 'Personnes présentes',
            style: 'sectionTitle',
            decoration: 'underline',
            alignment: 'center',
            margin: [0, 0, 0, 8],
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*', '*', '*'],
              body: [
                [
                  { text: 'Prénom(s) et nom(s)', style: 'tableHeader' },
                  { text: 'Téléphone', style: 'tableHeader' },
                  { text: 'Email', style: 'tableHeader' },
                  { text: 'Profession', style: 'tableHeader' },
                ],
                ...peopleRows,
              ],
            },
            layout: this.tableLayout(DARK_GREEN),
            margin: [0, 0, 0, 16],
          },
          {
            text: "Le Maître d'Ouvrage (ou client) déclare que :",
            style: 'sectionTitle',
            margin: [0, 0, 0, 8],
          },
          {
            stack: [
              this.checkLine(
                declaration === 'WITHOUT_RESERVE',
                `La réception est prononcée sans réserve avec effet à la date du ${this.formatDate(this.pvData?.effectiveDate)}`
              ),
              this.checkLine(
                declaration === 'WITH_RESERVES',
                `La réception est prononcée avec réserves mentionnées dans l'état des réserves figurant ci-après avec effet à la date du ${this.formatDate(this.pvData?.effectiveDate)}`
              ),
              this.checkLine(declaration === 'REFUSED', 'La réception est refusée'),
              this.checkLine(
                declaration === 'WITHOUT_RESERVE_WITH_OBSERVATION',
                `La réception est prononcée sans réserves mais avec observation avec effet à la date du ${this.formatDate(this.pvData?.effectiveDate)}`
              ),
            ],
            margin: [0, 0, 0, 14],
          },
          ...(['WITH_RESERVES'].includes(this.pvData?.declaration) && reservesRows.length
            ? [
                {
                  text: 'Liste des réserves',
                  style: 'sectionTitle',
                  decoration: 'underline',
                  alignment: 'center',
                  margin: [0, 4, 0, 10],
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
                        { text: 'Photo levée', style: 'tableHeader' },
                      ],
                      ...reservesRows,
                    ],
                  },
                  layout: this.tableLayout(DARK_GREEN),
                  margin: [0, 0, 0, 14],
                },
              ]
            : []),
          ...((['WITHOUT_RESERVE_WITH_OBSERVATION'].includes(this.pvData?.declaration) ||
            (['WITH_RESERVES'].includes(this.pvData?.declaration) &&
              observationsRows.length > 0)) &&
          observationsRows.length
            ? [
                {
                  text: 'Liste des observations',
                  style: 'sectionTitle',
                  decoration: 'underline',
                  alignment: 'center',
                  margin: [0, 4, 0, 10],
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
                      ...observationsRows,
                    ],
                  },
                  layout: this.tableLayout(DARK_GREEN),
                  margin: [0, 0, 0, 14],
                },
              ]
            : []),
          ...(this.pvData?.declaration === 'REFUSED'
            ? [
                {
                  text: 'La raison du refus',
                  style: 'sectionTitle',
                  margin: [0, 4, 0, 10],
                },
                {
                  text: `${this.pvData?.refusalReason || ''}`,
                  style: 'contentText',
                  color: 'red',
                  bold: true,
                  margin: [0, 0, 0, 10],
                },
              ]
            : []),
          ...(this.pvData?.declaration === 'WITH_RESERVES'
            ? [
                {
                  text: `L'entreprise et le Maître d'Ouvrage conviennent que les travaux nécessités par les réserves exposées ci-dessus seront exécutés dans un délai de ${this.pvData?.reservesExecutionDelayDays ?? ''} jours à compter du ${this.formatDate(this.pvData?.reservesFromDate)}.`,
                  style: 'contentText',
                  margin: [0, 0, 0, 6],
                },
                {
                  text: `Prochaine réception prévue le : ${this.formatDate(this.pvData?.nextReceptionDate)}`,
                  style: 'contentText',
                  bold: true,
                  margin: [0, 0, 0, 10],
                },
              ]
            : []),
          {
            text: 'Les garanties découlant des articles 1792, 1792-2 et 1792-3 du Code Civil commencent à courir à compter de la signature du présent procès-verbal, avec ou sans réserve.',
            fontSize: 9,
            color: '#1565C0',
            italics: true,
            margin: [0, 0, 0, 6],
          },
          {
            text: "La signature du procès-verbal et le règlement des travaux autorisent le Maître d'Ouvrage (ou client) soussigné à prendre possession de l'ouvrage.",
            fontSize: 9,
            color: '#1565C0',
            italics: true,
            margin: [0, 0, 0, 20],
          },
          { text: 'Signatures', style: 'sectionTitle', margin: [0, 0, 0, 4] },
          {
            text: `Fait à ${this.pvData?.place || ''} le ${this.formatDate(this.pvData?.effectiveDate)}.`,
            italics: true,
            style: 'contentText',
            margin: [0, 0, 0, 16],
          },
          {
            columns: [
              {
                width: '45%',
                stack: [
                  ...(companySignUrl
                    ? [
                        {
                          image: companySignUrl,
                          width: 140,
                          height: 65,
                          alignment: 'center',
                          margin: [0, 0, 0, 2],
                        },
                      ]
                    : [
                        {
                          text: '[Non signé]',
                          alignment: 'center',
                          color: LIGHT_GRAY,
                          italics: true,
                          margin: [0, 0, 0, 30],
                        },
                      ]),
                  {
                    canvas: [
                      {
                        type: 'line',
                        x1: 20,
                        y1: 0,
                        x2: 160,
                        y2: 0,
                        lineWidth: 1,
                        lineColor: '#374151',
                        alignment: 'center',
                      },
                    ],
                  },
                  {
                    text:
                      this.pvData?.signatures?.companyRep?.signerName ||
                      `${entrepriseRep?.prenom || ''} ${entrepriseRep?.nom || ''}`.trim(),
                    alignment: 'center',
                    bold: true,
                    fontSize: 10,
                    margin: [0, 4, 0, 1],
                  },
                  {
                    text: "Signature de l'entreprise",
                    alignment: 'center',
                    fontSize: 8.5,
                    color: GRAY,
                  },
                  ...(this.pvData?.signatures?.companyRep?.signedAt
                    ? [
                        {
                          text: `Signé le ${this.formatDate(this.pvData.signatures.companyRep.signedAt)}`,
                          alignment: 'center',
                          fontSize: 8,
                          color: GRAY,
                          margin: [0, 2, 0, 0],
                        },
                      ]
                    : []),
                ],
              },
              { width: '*', text: '' },
              {
                width: '45%',
                stack: [
                  ...(clientSignUrl
                    ? [
                        {
                          image: clientSignUrl,
                          width: 140,
                          height: 65,
                          alignment: 'center',
                          margin: [0, 0, 0, 2],
                        },
                      ]
                    : [
                        {
                          text: '[Non signé]',
                          alignment: 'center',
                          color: LIGHT_GRAY,
                          italics: true,
                          margin: [0, 0, 0, 30],
                        },
                      ]),
                  {
                    canvas: [
                      {
                        type: 'line',
                        x1: 20,
                        y1: 0,
                        x2: 160,
                        y2: 0,
                        lineWidth: 1,
                        lineColor: '#374151',
                        alignment: 'center',
                      },
                    ],
                  },
                  {
                    text: this.pvData?.signatures?.client?.signerName || '',
                    alignment: 'center',
                    bold: true,
                    fontSize: 10,
                    margin: [0, 4, 0, 1],
                  },
                  {
                    text: "Signature du Maître d'Ouvrage (ou client)",
                    alignment: 'center',
                    fontSize: 8.5,
                    color: GRAY,
                  },
                  ...(this.pvData?.signatures?.client?.signedAt
                    ? [
                        {
                          text: `Signé le ${this.formatDate(this.pvData.signatures.client.signedAt)}`,
                          alignment: 'center',
                          fontSize: 8,
                          color: GRAY,
                          margin: [0, 2, 0, 0],
                        },
                      ]
                    : []),
                ],
              },
            ],
            margin: [0, 0, 0, 10],
          },
          ...(planUrl
            ? [
                { text: '', pageBreak: 'before' },
                { text: 'PLAN', style: 'sectionTitle', margin: [0, 0, 0, 8] },
                { text: `Projet : ${projet?.projet || this.pvData?.titre}`, margin: [0, 0, 0, 4] },
                { text: 'Le plan est disponible au lien ci-dessous :', margin: [0, 0, 0, 4] },
                { text: planUrl, link: planUrl, color: '#1d4ed8', decoration: 'underline', fontSize: 9 },
              ]
            : []),
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            color: TITLE_GREEN,
          },
          contentText: {
            fontSize: 10,
          },
          sectionTitle: {
            fontSize: 12,
            bold: true,
            color: TITLE_GREEN,
          },
          tableHeader: {
            bold: true,
            fontSize: 10,
            color: 'white',
            fillColor: DARK_GREEN,
            alignment: 'center',
          },
        },
        defaultStyle: {
          font: 'Helvetica',
          fontSize: FONT_SIZE,
          lineHeight: LINE_HEIGHT,
        },
      };

      const blob = await this.createPdfBlob(docDefinition);
      if (this.rawPdfUrl) URL.revokeObjectURL(this.rawPdfUrl);
      this.rawPdfUrl = URL.createObjectURL(blob);
      this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.rawPdfUrl
      );
    } catch (error) {
      console.error(error);
      this.openSnackBarError("Erreur lors de la génération de l'aperçu PDF.");
    } finally {
      this.isGeneratingPdf = false;
    }
  }

  private createPdfBlob(docDefinition: any): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        (pdfMake as any).createPdf(docDefinition).getBlob((blob: Blob) => {
          resolve(blob);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private async toDataUrl(url: string): Promise<string> {
    if (url.startsWith('data:')) return url;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private async buildMapImageOnly(chantier: any): Promise<any> {
    const lat = chantier?.latitude;
    const lon = chantier?.longitude;

    if (!lat || !lon) {
      return {
        text: 'Aucune coordonnée disponible',
        alignment: 'center',
        color: LIGHT_GRAY,
        margin: [0, 30, 0, 30],
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
        link: mapLink,
      };
    } catch {
      return {
        text: 'Carte indisponible',
        alignment: 'center',
        color: LIGHT_GRAY,
        margin: [0, 30, 0, 30],
      };
    }
  }

  private buildPeopleRows(personnes: any[]): any[][] {
    const rows = Array.isArray(personnes) ? personnes : [];
    if (!rows.length) return [['', '', '', '']];
    return rows.slice(0, 8).map((p: any) => [
      { text: `${p?.prenom || ''} ${p?.nom || ''}`.trim(), fontSize: 10 },
      { text: p?.telephone || '', fontSize: 10 },
      { text: p?.email || '', fontSize: 10 },
      { text: p?.profession || '', fontSize: 10 },
    ]);
  }

  private buildEtatBadge(etat: string, leveeDate?: any): any {
    const value = (etat || '').trim();
    const normalized = value.toLowerCase();
    const bgColor =
      normalized === 'fait'
        ? '#047857'
        : normalized === 'observation'
        ? '#d97706'
        : '#ea580c';
    const width = normalized === 'observation' ? 52 : 42;
    const height = 20;
    const rx = 15;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect x="0" y="0" width="${width}" height="${height}" rx="${rx}" ry="${rx}" fill="${bgColor}" />
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Helvetica" font-size="8" fill="#ffffff">${value}</text>
      </svg>
    `;

    return {
      stack: [
        {
          svg,
          width,
          height,
          alignment: 'center',
          margin: [0, 2, 0, 0],
        },
        ...(leveeDate
          ? [
              {
                text: `le ${this.formatDate(leveeDate)}`,
                fontSize: 7.5,
                color: GRAY,
                alignment: 'center',
                margin: [0, 4, 0, 0],
              },
            ]
          : []),
      ],
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
          { text: r?.nature || '', fontSize: 10 },
          { text: r?.travauxAExecuter || '', fontSize: 10 },
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
        const photoCell = await this.imageCell(r?.photoUrl);
        return [
          { text: `OB${i + 1}`, fontSize: 10, alignment: 'center' },
          { text: r?.nature || '', fontSize: 10 },
          photoCell,
        ];
      })
    );
  }

  private async imageCell(url?: string): Promise<any> {
    if (!url) return { text: '', fontSize: 9, alignment: 'center', color: LIGHT_GRAY };
    try {
      const dataUrl = await this.toDataUrl(url);
      return { image: dataUrl, width: 50, height: 42, alignment: 'center', link: url };
    } catch {
      return { text: '', fontSize: 8.5, alignment: 'center', color: LIGHT_GRAY };
    }
  }

  private normalizeEtat(value: any): string {
    return (value || '').toString().trim().toLowerCase();
  }

  private lineItemLabelValue(label: string, value: string): any {
    return {
      text: [{ text: `${label} : `, bold: true }, { text: value || '' }],
      style: 'contentText',
      margin: [0, 0, 0, 2],
    };
  }

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
                  color: '#ffffff',
                },
              ],
            },
            {
              text: checked ? 'X' : '',
              fontSize: 7,
              bold: true,
              color: '#111111',
              alignment: 'center',
              margin: [-0.5, -7.5, 0, 0],
            },
          ],
          margin: [0, 1, 0, 0],
        },
        {
          width: '*',
          text: label,
          fontSize: 10,
          margin: [6, -1, 0, 0],
        },
      ],
      margin: [0, 0, 0, 12],
    };
  }

  private tableLayout(darkGreen: string): any {
    return {
      fillColor: (rowIndex: number) => (rowIndex === 0 ? darkGreen : null),
      hLineColor: () => '#bdbdbd',
      vLineColor: () => '#bdbdbd',
      hLineWidth: () => 0.8,
      vLineWidth: () => 0.8,
      paddingTop: () => 6,
      paddingBottom: () => 6,
      paddingLeft: () => 5,
      paddingRight: () => 5,
    };
  }

  private formatDateShort(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('fr-FR');
  }

  private formatDate(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private openSnackBar(message: string): void {
    this.snackbar.open(message, 'Fermer', { duration: 4000 });
  }

  private openSnackBarError(message: string): void {
    this.snackbar.open(message, 'Fermer', {
      duration: 6000,
      panelClass: ['error-snackbar'],
    });
  }
}
