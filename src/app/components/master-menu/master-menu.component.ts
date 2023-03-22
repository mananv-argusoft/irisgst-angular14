import { Component, OnInit } from '@angular/core';
import { BusinessService } from 'src/app/services/business.service';

@Component({
  selector: 'app-master-menu',
  templateUrl: './master-menu.component.html',
  styleUrls: ['./master-menu.component.css']
})
export class MasterMenuComponent implements OnInit {
  public selectedCompany: Object = {}

  constructor(private businessService: BusinessService) { }

  ngOnInit(): void {
    this.businessService.selectedCompany.subscribe(company => {
      this.selectedCompany = company

      if (this.selectedCompany['entityType']==='FILING' && this.selectedCompany['gstin']) {
        this.businessService.getTaxPayerType(this.selectedCompany)
          .subscribe({
            next: (response) => {
              console.log(response)
              
              if (response['status']==='SUCCESS' && response['response']) {
                if (response['response']['taxPayerType']) {
                  this.selectedCompany['taxPayerType'] = response['response']['taxPayerType']
                }
                else
                  this.selectedCompany['taxPayerType'] = null
              }

              console.log(this.selectedCompany)
              
            },
            error: (errorMessage) => {
              console.log(errorMessage)
            }
          })
      }
    })
  }

  isTaxPayer() : boolean {
    return this.selectedCompany['taxPayerType']
  }
  isTaxPayerISD(): boolean {
    return this.isTaxPayer() && this.selectedCompany['taxPayerType']==='ISD'
  }
  isTaxPayerTDSDeductor(): boolean {
    return this.isTaxPayer() && this.selectedCompany['taxPayerType']==='TDS'
  }
  isTaxPayerECOM(): boolean {
    return this.isTaxPayer() && this.selectedCompany['taxPayerType']==='ECOM'
  }

}
