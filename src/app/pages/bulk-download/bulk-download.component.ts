import { Component, OnInit } from '@angular/core'

import { BulkDownloadService } from 'src/app/services/bulk-download.service'
import { BusinessService } from 'src/app/services/business.service'

@Component({
  selector: 'app-bulk-download',
  templateUrl: './bulk-download.component.html',
  styleUrls: ['./bulk-download.component.css']
})
export class BulkDownloadComponent implements OnInit {
  public selectedCompany: Object = {}

  public activeTab: number = 1
  public viewType: number = 1

  public currentPage: number = 1
  public recordsPerPage: number = 10
  public totalRecords: number = 0

  public returnType: Object = {}
  public sectionTypes: Object = {}
  public isGSTREinvoice: boolean = false
  public isGSTR2: boolean = false
  public isSelectedGstr2ACtin: boolean = false
  public isSelectedGstr2AIncrement: boolean = false
  public isGSTR2B: boolean = false
  public isGSTR9: boolean = false
  public isITC04: boolean = false

  public returnTypes: Array<Object> = [
    { key: 'GSTR1', value: 'GSTR1' },
    { key: 'EINV', value: 'GSTR1-Einvoices' },
    { key: 'GSTR2A', value: 'GSTR2A' },
    { key: 'GSTR2', value: 'GSTR2' },
    { key: 'GSTR3B', value: 'GSTR3B' },
    { key: 'GSTR6', value: 'GSTR6' },
    { key: 'GSTR6A', value: 'GSTR6A' },
    { key: 'LEDGER', value: 'LEDGER' },
    { key: 'LEDGER BAL', value: 'LEDGER BALANCE' },
    { key: 'GSTR7', value: 'GSTR7' },
    { key: 'GSTR8', value: 'GSTR8' },
    { key: 'GSTR2X', value: 'GSTR2X' },
    { key: 'GSTR9', value: 'GSTR9' },
    { key: 'GSTR9C', value: 'GSTR9C' },
    { key: 'ITC04', value: 'ITC04' },
    { key: 'GSTR2B', value: 'GSTR2B' },
  ]

  public rowList: Array<Object> = []

  public historyData: Array<Object> = []

  constructor(private businessService: BusinessService, private bulkDownloadService: BulkDownloadService) { }

  ngOnInit(): void {
    this.selectedCompany = this.businessService.selectedCompany.getValue()
    
    this.businessService.selectedCompany.subscribe(selectedCompany => {
      this.selectedCompany = selectedCompany

      this.bulkDownloadService.getGstnBulkHistory(
        this.selectedCompany, 
        this.recordsPerPage, 
        this.recordsPerPage*(this.currentPage-1), 
        this.viewType
      )
        .subscribe({
          next: (response) => {
            this.totalRecords = 0
            if (response['response']) {
              const responseData = response['response']
              this.totalRecords = responseData['reqcount']
              this.historyData = responseData['data']
            }
          },
          error: (errorMessage) => {
            console.log(errorMessage)
          }
        })
    })
  }

  gstinChanged(selected) {
    console.log(selected)
  }

  viewTypeChanged() {
    this.currentPage = 1

    this.bulkDownloadService.getGstnBulkHistory(
      this.selectedCompany, 
      this.recordsPerPage, 
      this.recordsPerPage*(this.currentPage-1), 
      this.viewType
    )
      .subscribe({
        next: (response) => {
          this.totalRecords = 0
          if (response['response']) {
            const responseData = response['response']
            this.totalRecords = responseData['reqcount']
            this.historyData = responseData['data']
            console.log('hs = ', this.historyData)
          }
        },
        error: (errorMessage) => {
          console.log(errorMessage)
        }
      })
  }

  pageChanged(currentPage, recordsPerPage) {
    this.currentPage = currentPage
    this.recordsPerPage = recordsPerPage

    this.bulkDownloadService.getGstnBulkHistory(
      this.selectedCompany, 
      this.recordsPerPage, 
      this.recordsPerPage*(this.currentPage-1), 
      this.viewType
    )
      .subscribe({
        next: (response) => {
          this.totalRecords = 0
          if (response['response']) {
            const responseData = response['response']
            this.totalRecords = responseData['reqcount']
            this.historyData = responseData['data']
            console.log('hs = ', this.historyData)
          }
        },
        error: (errorMessage) => {
          console.log(errorMessage)
          
        }
      })
  }

  returnTypeChanged(event) {
    this.returnType = event.target.value
    
    if (this.returnType == 'GSTR1') {
      this.sectionTypes = this.bulkDownloadService.getGSTR1SectionType();
    } else if (this.returnType == 'EINV') {
        this.sectionTypes = this.bulkDownloadService.getGSTR1SectionTypeEinvoice();
        this.isGSTREinvoice = true;
    } else if (this.returnType == 'GSTR2') {
      this.sectionTypes = this.bulkDownloadService.getGSTR2SectionType();
      this.isGSTR2 = true;
    } else if (this.returnType == 'GSTR2A') {
        this.sectionTypes = this.bulkDownloadService.getGSTR2ASectionType();
    } else if (this.returnType == 'GSTR2A (Counterparty-wise)') {
        this.sectionTypes = this.bulkDownloadService.getGSTR2AIncrementalSectionType();
    } else if (this.returnType == 'GSTR2B') {
        this.sectionTypes = this.bulkDownloadService.getGSTR2BSectionType();
        this.isGSTR2B = true;
    } else if (this.returnType == 'GSTR2X') {
      this.sectionTypes = this.bulkDownloadService.getGSTR2XSectionType();
    } else if (this.returnType == 'GSTR3B') {
      this.sectionTypes = this.bulkDownloadService.getGSTR3BSectionType();
    }else if (this.returnType == 'GSTR6') {
        this.sectionTypes = this.bulkDownloadService.getGSTR6SectionType();
    } else if (this.returnType == 'GSTR6A') {
        this.sectionTypes = this.bulkDownloadService.getGSTR6ASectionType();
    } else if (this.returnType == 'LEDGER') {
        this.sectionTypes = this.bulkDownloadService.getLedgerSectionType();
    } else if (this.returnType == 'LEDGER BAL') {
        this.sectionTypes = this.bulkDownloadService.getLedgerBalSectionType();
    } else if (this.returnType == 'GSTR7') {
        this.sectionTypes = this.bulkDownloadService.getGSTR7SectionType();
    } else if (this.returnType == 'GSTR8') {
        this.sectionTypes = this.bulkDownloadService.getGSTR8SectionType();
    }  else if (this.returnType == 'GSTR9') {
        this.sectionTypes = this.bulkDownloadService.getGSTR9SectionType();
        this.isGSTR9 = true;
    } else if (this.returnType == 'GSTR9C') {
        this.sectionTypes = this.bulkDownloadService.getGSTR9CSectionType()
    }  else if (this.returnType == 'ITC04') {
        this.sectionTypes = this.bulkDownloadService.getITC04SectionType();
        this.isITC04 = true;
    }
  }

}
