import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BulkDownloadService {
  public GSTN_BULK_HISTORY_URL = 'https://dev.asp.api.irisgst.com/capsule/gstn/bulk/history'

  public GSTR1SectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "RETSUM", name: "GSTR 1 Summary", children: [], parentCompanyId: 0, id: 1 },
        { key: "B2B", name: "B2B Invoices", children: [], parentCompanyId: 0, id: 2 },
        { key: "CDNR", name: "Credit and Debit Notes (CDN)", children: [], parentCompanyId: 0, id: 3 },
        { key: "EXP", name: "Exports", children: [], parentCompanyId: 0, id: 4 },
        { key: "B2CL", name: "B2C Large Transactions", children: [], parentCompanyId: 0, id: 5 },
        { key: "CDNUR", name: "CDN for Unregistered Taxpayers", children: [], parentCompanyId: 0, id: 6 },
        { key: "B2CS", name: "B2C Small Transactions", children: [], parentCompanyId: 0, id: 7 },
        { key: "AT", name: " Advance Tax Paid", children: [], parentCompanyId: 0, id: 8 },
        { key: "TXP", name: "Tax adjusted against advances", children: [], parentCompanyId: 0, id: 9 },
        { key: "B2BA", name: "Amendments to B2B Invoices", children: [], parentCompanyId: 0, id: 10 },
        { key: "CDNRA", name: "Amendments to Credit and Debit Notes", children: [], parentCompanyId: 0, id: 11 },
        { key: "CDNURA", name: "Amendments to CDN for Unregistered Taxpayers", children: [], parentCompanyId: 0, id: 12 },
        { key: "B2CLA", name: " Amendments to B2C Large Transactions", children: [], parentCompanyId: 0, id: 13 },
        { key: "B2CSA", name: "Amendments to B2C Small Transactions", children: [], parentCompanyId: 0, id: 14 },
        { key: "ATA", name: "Amendments to Advance Tax", children: [], parentCompanyId: 0, id: 15 },
        { key: "TXPA", name: "Amendments to Tax adjusted against advances", children: [], parentCompanyId: 0, id: 16 },
        { key: "EXPA", name: " Amendments to Exports", children: [], parentCompanyId: 0, id: 17 },
        { key: "HSNSUM", name: "HSN Summary", children: [], parentCompanyId: 0, id: 18 },
        { key: "DOCISS", name: "Document Details", children: [], parentCompanyId: 0, id: 19 },
        { key: "NIL", name: "NIL", children: [], parentCompanyId: 0, id: 20 }
    ]
  }];
  public GSTR1SectionTypeEinvoice = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "B2B", name: "B2B Invoices", children: [], parentCompanyId: 0, id: 2 },
        { key: "CDNR", name: "Credit and Debit Notes (CDN)", children: [], parentCompanyId: 0, id: 3 },
        { key: "EXP", name: "Exports", children: [], parentCompanyId: 0, id: 4 },
        { key: "CDNUR", name: "CDN for Unregistered Taxpayers", children: [], parentCompanyId: 0, id: 6 },
    ]
  }];
  public GSTR2SectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "B2B", name: "B2B Invoices", children: [], parentCompanyId: 0, id: 1 },
        { key: "CDN", name: "Credit and Debit Notes  (CDN)", children: [], parentCompanyId: 0, id: 3 },
    ]
  }];
  public GSTR2ASectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "B2B", name: "B2B Invoices", children: [], parentCompanyId: 0, id: 1 },
        { key: "B2BA", name: "Amendments to B2B Invoices", children: [], parentCompanyId: 0, id: 2 },
        { key: "CDN", name: "Credit and Debit Notes  (CDN)", children: [], parentCompanyId: 0, id: 3 },
        { key: "CDNA", name: "Amendments to Credit and Debit Notes", children: [], parentCompanyId: 0, id: 4 },
        { key: "ISD", name: "ISD", children: [], parentCompanyId: 0, id: 5 },
        { key: "IMPG", name: "IMPG", children: [], parentCompanyId: 0, id: 6 },
        { key: "IMPGSEZ", name: "IMPGSEZ", children: [], parentCompanyId: 0, id: 7 }
    ]
  }];
  public GSTR2AIncrementalSectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "B2B", name: "B2B Invoices", children: [], parentCompanyId: 0, id: 1 },
        { key: "B2BA", name: "Amendments to B2B Invoices", children: [], parentCompanyId: 0, id: 2 },
        { key: "CDN", name: "Credit and Debit Notes  (CDN)", children: [], parentCompanyId: 0, id: 3 },
        { key: "CDNA", name: "Amendments to Credit and Debit Notes", children: [], parentCompanyId: 0, id: 4 },
        { key: "ISD", name: "ISD", children: [], parentCompanyId: 0, id: 5 },
        { key: "IMPGSEZ", name: "IMPGSEZ", children: [], parentCompanyId: 0, id: 7 }
    ]
  }];
  public GSTR2BSectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "GET2B", name: "All Data", children: [], parentCompanyId: 0, id: 1 },
    ]
  }];
  public GSTR2XSectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "TDSTCS", name: "TDS TCS credit Details & Summary", children: [], parentCompanyId: 0, id: 1 }
    ]
  }];
  public GSTR3BSectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "RETSUM", name: "GSTR 3B Summary", children: [], parentCompanyId: 0, id: 1 },
        { key: "AUTOLIAB", name: "Liability Auto compute from GSTR1 to GSTR3B", children: [], parentCompanyId: 0, id: 2 }
    ]
  }];
  public GSTR6SectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "B2B", name: "B2B Invoices", children: [], parentCompanyId: 0, id: 1 },
        { key: "B2BA", name: "Amendments to B2B Invoices", children: [], parentCompanyId: 0, id: 2 },
        { key: "CDN", name: "Credit and Debit Notes  (CDN)", children: [], parentCompanyId: 0, id: 3 },
        { key: "CDNA", name: "Amendments to Credit and Debit Notes", children: [], parentCompanyId: 0, id: 4 },
        { key: "ISD", name: "ISD Invoices", children: [], parentCompanyId: 0, id: 5 },
        { key: "ISDA", name: "ISDA Invoices", children: [], parentCompanyId: 0, id: 6 }
    ]
  }];
  public GSTR6ASectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "B2B", name: "B2B Invoices", children: [], parentCompanyId: 0, id: 1 },
        { key: "B2BA", name: "Amendments to B2B Invoices", children: [], parentCompanyId: 0, id: 2 },
        { key: "CDN", name: "Credit and Debit Notes  (CDN)", children: [], parentCompanyId: 0, id: 3 },
        { key: "CDNA", name: "  Amendments to Credit and Debit Notes", children: [], parentCompanyId: 0, id: 4 }
    ]
  }];
  public LedgerSectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "CASH", name: "Cash", children: [], parentCompanyId: 0, id: 1 },
        { key: "ITC", name: "ITC", children: [], parentCompanyId: 0, id: 2 },
        { key: "TAX", name: "Liability", children: [], parentCompanyId: 0, id: 3 }
    ]
  }];
  public LedgerBalSectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "BAL", name: "Cash ITC Balance", children: [], parentCompanyId: 0, id: 1 }
    ]
  }];
  public GSTR7SectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "TDS", name: "TDS Details", children: [], parentCompanyId: 0, id: 1 },
        { key: "RETSUM", name: "TDS Summary", children: [], parentCompanyId: 0, id: 2 }
    ]
  }];
  public GSTR8SectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "TCSDET", name: "TCS Details", children: [], parentCompanyId: 0, id: 1 },
        { key: "RETSUM", name: "TCS Summary", children: [], parentCompanyId: 0, id: 2 }
    ]
  }];
  public GSTR9SectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "CALRCDS", name: "Autodrafted Data GSTN", children: [], parentCompanyId: 0, id: 1 },
        { key: "RECORDS", name: "Actual Data on GSTN", children: [], parentCompanyId: 0, id: 2 },
        { key: "FILEDETL8A", name: "ITC as per table 8A", children: [], parentCompanyId: 0, id: 3 }
    ]
  }];
  public GSTR9CSectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "RECDS", name: "GSTR 9 Records", children: [], parentCompanyId: 0, id: 1 },
        { key: "RETSUM", name: "Return Summary", children: [], parentCompanyId: 0, id: 2 }
    ]
  }]
  public ITC04SectionType = [{
    name: 'Select All',
    id: 0,
    selected: false,
    parentCompanyId: 0,
    data: 'parent',
    isExpanded: false,
    children: [
        { key: "GET", name: "ITC-04 Details ", children: [], parentCompanyId: 0, id: 1 },

    ]
  }];

  constructor(private http: HttpClient, private authService: AuthService) { }

  getGSTR1SectionType() {
    return this.GSTR1SectionType
  }
  getGSTR1SectionTypeEinvoice() {
    return this.GSTR1SectionTypeEinvoice
  }
  getGSTR2SectionType() {
    return this.GSTR2SectionType
  }
  getGSTR2ASectionType() {
    return this.GSTR2ASectionType
  }
  getGSTR2AIncrementalSectionType() {
    return this.GSTR2AIncrementalSectionType
  }
  getGSTR2XSectionType() {
    return this.GSTR2XSectionType
  }
  getGSTR2BSectionType() {
    return this.GSTR2BSectionType
  }
  getGSTR3BSectionType() {
    return this.GSTR3BSectionType
  }
  getGSTR6SectionType() {
    return this.GSTR6SectionType
  }
  getGSTR6ASectionType() {
    return this.GSTR6ASectionType
  }
  getLedgerSectionType() {
    return this.LedgerSectionType
  }
  getLedgerBalSectionType() {
    return this.LedgerBalSectionType
  }
  getGSTR7SectionType() {
    return this.GSTR7SectionType
  }
  getGSTR8SectionType() {
    return this.GSTR8SectionType
  }
  getGSTR9SectionType() {
    return this.GSTR9SectionType
  }
  getGSTR9CSectionType() {
    return this.GSTR9CSectionType
  }
  getITC04SectionType() {
    return this.ITC04SectionType
  }

  handleError(errorMessage: string) {
    return throwError(() => {
      if (errorMessage)
        return errorMessage
      return 'An error occurred!'
    })
  }
  
  getGstnBulkHistory(company, limit, skip, viewType) {
    return this.http.get(this.GSTN_BULK_HISTORY_URL, {
      params: {
        limit, skip, viewType, 'reqType': 'gstdata'
      },
      headers: new HttpHeaders({
        'X-Auth-Token':  this.authService.user.token,
        'companyid': company.rootCompanyId
      })
    })
      .pipe(
        catchError(this.handleError),
        tap(response => {
          if (response['status'] !== 'SUCCESS')
            throw new Error()
        })
      )
  }
}
