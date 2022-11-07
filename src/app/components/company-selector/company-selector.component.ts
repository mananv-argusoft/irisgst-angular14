import { Component, OnInit, ViewChild } from '@angular/core';

import { BusinessService } from 'src/app/services/business.service';

@Component({
  selector: 'app-company-selector',
  templateUrl: './company-selector.component.html',
  styleUrls: ['./company-selector.component.css']
})
export class CompanySelectorComponent implements OnInit {
  @ViewChild('autocomplete') autocomplete
  public businessEntityList: Array<any>
  public companyHierarchy: Object
  public companyArray: Array<any>
  public allCompanies: Array<any>


  constructor(private businessService: BusinessService) { }

  ngOnInit(): void {    
    this.businessService.getBusinessEntities()
      .subscribe({
        next: (responseData) => {
          // console.log('business entity list = ', responseData['response'])
          this.businessEntityList = responseData['response']
        },
        error: (errorMessage) => {
          console.log(errorMessage)
        }
      })
  }

  onChangeBusiness(companyId) {
    this.businessService.changeBusiness(companyId)
      .subscribe({
        next: (responseData) => {
          // console.log('company change response = ', responseData)
        },
        error: (errorMessage) => {
          console.log(errorMessage) 
        }
      })

    this.getCompanyHierarchy(companyId)
  }

  getCompanyHierarchy(companyId) {
    this.businessService.getCompanyHierarchy(companyId)
      .subscribe({
        next: (responseData) => {
          // console.log('company hierarchy response = ', responseData)

          const response = responseData['response']
          // console.log('response hier = ', response)

          this.companyArray = []
          this.companyArray.push(response)
          this.companyHierarchy = response

          this.allCompanies = []
          this.storeAllCompanies(this.companyHierarchy)
          // console.log('all com = ', this.allCompanies)

          this.businessService.selectedCompany.next(this.companyHierarchy)
        },
        error: (errorMessage) => {
          console.log(errorMessage) 
        }
      })
  }

  onChangeCompany(company, i) {
    // console.log('cl = ', this.companyArray.length, 'ci = ', i)
    this.companyArray.splice(i+1, this.companyArray.length-1)

    if (company)
      this.companyArray.push(company)

    // console.log('carr = ', this.companyArray)

    this.businessService.selectedCompany.next(this.companyArray.slice().at(-1))
  }

  storeAllCompanies(company) {
    if (!company['childCompanies'].length)
      return

    company['childCompanies'].map(childCompany => {
      this.allCompanies.push(childCompany)
      this.storeAllCompanies(childCompany)
    })
  }

  onCompanySelect(selectedCompany) {
    this.depthFirstSearch(this.companyHierarchy, selectedCompany, [])    
    this.autocomplete.clear()

    this.businessService.selectedCompany.next(this.companyArray.slice().at(-1))
  }

  depthFirstSearch(company, companyToSearch, pathArray) {
    if (!company)
      return

    pathArray.push(company)

    if (company === companyToSearch) {
      this.companyArray = []
      pathArray.forEach(com => {
        this.companyArray.push(com)
      })
      return
    }

    company['childCompanies'].map(childCompany => {
      this.depthFirstSearch(childCompany, companyToSearch, pathArray)
    })

    pathArray.pop()
  }
}
