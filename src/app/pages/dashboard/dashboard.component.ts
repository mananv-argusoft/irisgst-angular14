import { Component, OnInit } from '@angular/core';

import Chart from 'chart.js/auto';

import { BusinessService } from 'src/app/services/business.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public selectedCompany: any
  
  public gstinCount: number = 0
  public outwardSupplies: number = 0
  public outwardSuppliesGstins: Array<Array<string>> = []
  public outwardSuppliesGstinsForFp: Array<string> = []
  public quickStats: Array<Object> = []
  public quickStatsGstins: Array<Array<string>> = []
  public quickStatsGstinsForFp: Array<string> = []
  public rcmInwardSupplies: number = 0
  public rcmPayments: number = 0
  
  public filingPeriod: Array<string> = []
  public selectedFilingPeriod: string
  public outwardTaxableSupplies: Array<number> = []
  public chart1: any
  public grossTaxLiability: Array<number> = []
  public chart2: any
  public taxPayment: Object = {}
  public chart3: any

  public newsList: Array<any>

  public months = [ "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December" ];

  constructor(
    private businessService: BusinessService, 
    private dashboardService: DashboardService,
    private newsService: NewsService
  ) { }

  ngOnInit(): void {
    this.businessService.selectedCompany.subscribe(company => {
      this.selectedCompany = company

      this.gstinCount = 0
      if (!this.selectedCompany['childCompanies'] || !this.selectedCompany['childCompanies'].length)
        this.countGstins([this.selectedCompany])
      else
        this.countGstins(this.selectedCompany['childCompanies'])

      this.dashboardService.getOutWardSupplyAndLiability(this.selectedCompany)
        .subscribe({
          next: (response) => {
            console.log(response)

            this.filingPeriod = []
            this.selectedFilingPeriod = ""
            this.outwardTaxableSupplies = []
            this.outwardSupplies = 0
            this.outwardSuppliesGstins = []
            this.outwardSuppliesGstinsForFp = []
            this.grossTaxLiability = []
            if (this.chart1)
              this.chart1.destroy()
            if (this.chart2)
              this.chart2.destroy()

            if (response['response']) {
              const data = response['response']
              data.slice(0).reverse().map(x => {
                this.filingPeriod.push(x.fp)

                this.outwardTaxableSupplies.push(+x.outwardTaxSupply)
                this.outwardSuppliesGstins.push(x['gstins'])

                this.grossTaxLiability.push(+x.totTaxLiability)

                // console.log('ots = ', this.outwardTaxableSupplies);
                // console.log('gtl = ', this.grossTaxLiability);
              })
              
              this.outwardSupplies = this.outwardTaxableSupplies.slice(-1)[0]

              console.log(this.filingPeriod)
              

              this.selectedFilingPeriod = this.filingPeriod.slice(-1)[0]
              console.log('sfp = ', this.selectedFilingPeriod)
              console.log(this.outwardSuppliesGstins);
              
              
              this.outwardSuppliesGstinsForFp = this.outwardSuppliesGstins.slice(-1)[0]

              const outwardTaxableSuppliesMax = Math.max(...this.outwardTaxableSupplies)
              const grossTaxLiabilityMax = Math.max(...this.grossTaxLiability)
              let divisorFactor, yAxesScaleLabel

              if (outwardTaxableSuppliesMax<=1000000 || grossTaxLiabilityMax<=1000000) {
                divisorFactor = 1000;
                yAxesScaleLabel = "Data in Rupees thousands";
              } else if (outwardTaxableSuppliesMax<=100000000 || grossTaxLiabilityMax<=100000000) {
                  divisorFactor = 100000;
                  yAxesScaleLabel = "Data in Rupees lakh";
              } else if (outwardTaxableSuppliesMax>100000000 || grossTaxLiabilityMax>100000000) {
                  divisorFactor = 10000000;
                  yAxesScaleLabel = "Data in Rupees crore";
              }

              const options = this.getOptionsForChart1And2(divisorFactor, yAxesScaleLabel)

              this.createChart1(options)
              this.createChart2(options)
            }
          },
          error: (errorMessage) => {
            console.log(errorMessage)
          }
        })

      this.dashboardService.getQuickStats(this.selectedCompany)
        .subscribe({
          next: (response) => {
            console.log(response)           

            this.quickStats = []
            this.rcmInwardSupplies = 0
            this.rcmPayments = 0
            this.quickStatsGstins = []
            this.quickStatsGstinsForFp = []

            if (response['response']) {
              this.quickStats = response['response']
              
              this.quickStats.slice().reverse().map(x => {
                this.quickStatsGstins.push(x['gstins'])
              })

              this.quickStatsGstinsForFp = this.quickStatsGstins.slice(-1)[0]

              this.rcmInwardSupplies = this.quickStats.slice()[0]['txvalTot']
              this.rcmPayments = this.quickStats.slice()[0]['pdCashTot']

              // console.log(this.rcmInwardSupplies);
              // console.log(this.rcmPayments)
              
            }
          },
          error: (errorMessage) => {
            console.log(errorMessage)
          }
        })

      this.dashboardService.getTaxPayment(this.selectedCompany)
        .subscribe({
          next: (response) => {
            if (this.chart3)
              this.chart3.destroy()

            console.log(response)
            
            if (response['response']) {
              console.log(response)
              
              this.taxPayment = {}


              const data = response['response']
              const igstCash = [], igstItc = [], cgstCash = [],cgstItc = []
              const sgstCash = [], sgstItc = [], cessCash = [], cessItc = []
              data.slice(0).reverse().map(x => {
                igstCash.push(x['igstCash'])
                igstItc.push(x['igstItc'])
                cgstCash.push(x['cgstCash'])
                cgstItc.push(x['cgstItc'])
                sgstCash.push(x['sgstCash'])
                sgstItc.push(x['sgstItc'])
                cessCash.push(x['cessCash'])
                cessItc.push(x['cessItc'])
              })
              this.taxPayment['igstCash'] = igstCash
              this.taxPayment['igstItc'] = igstItc
              this.taxPayment['cgstCash'] = cgstCash
              this.taxPayment['cgstItc'] = cgstItc
              this.taxPayment['sgstCash'] = sgstCash
              this.taxPayment['sgstItc'] = sgstItc
              this.taxPayment['cessCash'] = cessCash
              this.taxPayment['cessItc'] = cessItc

              console.log(this.taxPayment);              

              this.createChart3()
            }
          },
          error: (errorMessage) => {
            console.log(errorMessage)
          }
        })
    })

    this.newsService.newsList.subscribe(news => {
      this.newsList = news
    })

  }

  countGstins(companyArr) {
      companyArr.map(com => {
        if (com.entityType==='FILING' && com.role!=='0')
          this.gstinCount++
        else if (com.entityType === 'LEGAL')
          this.countGstins(com['childCompanies'])
      })
  }

  getOptionsForChart1And2(divisorFactor, yAxesScaleLabel) {
    return {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: function(context) {
              const title = context[0]['label']
              const month = title.substring(0, 2)
              const date = new Date();
              date.setMonth(month - 1);

              return date.toLocaleString('en-US', { month: 'long' }).substring(0, 3)
            },
            label: function(context) {
              let yLabel = context.dataset.label
              let yValue = context.parsed.y

              yValue = '₹' + yValue.toLocaleString('en-IN');
    
              return yLabel + ': ' + yValue;
            }
          }
        }
      },
      maintainAspectRatio: true,
      scales: {
        y: {
          suggestedMin: 0,
          ticks: {
            callback: (value, index, values) => {
              return value / divisorFactor
            }
          },
          grid: {
            display: false,
            drawBorder: false
          },
          title: {
            display: true,
            text: yAxesScaleLabel
          }
        },
        x: {
          ticks: {
            callback: function(value, index) {
              const month = +this.getLabelForValue(value).substring(0, 2)
              const date = new Date();
              date.setMonth(month - 1);

              return date.toLocaleString('en-US', { month: 'long' }).substring(0, 3);
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        }
      },
    }
  }

  createChart1(options){
    this.chart1 = new Chart("chart-1", {  
      type: 'line',
      data: {  // values on X-Axis
        labels: this.filingPeriod,
	      datasets: [
          {
            label: 'Outward Taxable Supplies',
            data: this.outwardTaxableSupplies,
            tension: 0.4,
            borderColor: '#1C3C6D',
            fill: true,
            segment: {
              borderWidth: 2
            },
            pointRadius: 3
          }
        ]
      },
      options: options
    });
  }

  createChart2(options){
    this.chart2 = new Chart("chart-2", {  
      type: 'line',
      data: {  // values on X-Axis
        labels: this.filingPeriod,
        datasets: [
          {
            label: 'Total Tax Liability',
            data: this.grossTaxLiability,
            tension: 0.4,
            borderColor: '#f7d023',
            fill: true,
            backgroundColor: '#fdf6d5',
            segment: {
              borderWidth: 2
            },
            pointRadius: 3
          }
        ]
      },
      options: options
    });
  }

  createChart3() {
    this.chart3 = new Chart("chart-3", {
      type: 'bar',
      data: {
        labels: this.filingPeriod,
        datasets: [
          {
            label: 'IGST Cash',
            data: this.taxPayment['igstCash'],
            borderColor: 'rgba(28, 60, 109, 1)',
            backgroundColor: 'rgba(28, 60, 109, 0.2)',
            borderWidth: 2,
            stack: 'Stack 0'
          },
          {
            label: 'IGST ITC',
            data: this.taxPayment['igstItc'],
            borderColor: 'rgba(247, 208, 35, 1)',
            backgroundColor: 'rgba(247, 208, 35, 0.2)',
            borderWidth: 2,
            stack: 'Stack 0'
          },
          {
            label: 'CGST Cash',
            borderColor: 'rgba(28, 60, 109, 1)',
            backgroundColor: 'rgba(28, 60, 109, 0.2)',
            data: this.taxPayment['cgstCash'],
            borderWidth: 2,
            stack: 'Stack 1'
          },
          {
            label: 'CGST ITC',
            data: this.taxPayment['cgstItc'],
            borderColor: 'rgba(247, 208, 35, 1)',
            backgroundColor: 'rgba(247, 208, 35, 0.2)',
            borderWidth: 2,
            stack: 'Stack 1'
          },
          {
            label: 'SGST Cash',
            borderColor: 'rgba(28, 60, 109, 1)',
            backgroundColor: 'rgba(28, 60, 109, 0.2)',
            data: this.taxPayment['sgstCash'],
            borderWidth: 2,
            stack: 'Stack 2'
          },
          {
            label: 'SGST ITC',
            data: this.taxPayment['sgstItc'],
            borderColor: 'rgba(247, 208, 35, 1)',
            backgroundColor: 'rgba(247, 208, 35, 0.2)',
            borderWidth: 2,
            stack: 'Stack 2'
          },
          {
            label: 'Cess Cash',
            borderColor: 'rgba(28, 60, 109, 1)',
            backgroundColor: 'rgba(28, 60, 109, 0.2)',
            data: this.taxPayment['cessCash'],
            borderWidth: 2,
            stack: 'Stack 3'
          },
          {
            label: 'Cess ITC',
            data: this.taxPayment['cessItc'],
            borderColor: 'rgba(247, 208, 35, 1)',
            backgroundColor: 'rgba(247, 208, 35, 0.2)',
            borderWidth: 2,
            stack: 'Stack 3'
          },
        ]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              title: function(context) {
                const title = context[0]['label']
                const month = title.substring(0, 2)
                const date = new Date();
                date.setMonth(+month - 1);
  
                return date.toLocaleString('en-US', { month: 'long' })
              },
            }
          }
        },
        maintainAspectRatio: true,
        scales: {
          y: {
            suggestedMin: 0,
            // ticks: {
            //   callback: (value, index, values) => {
            //     return value / divisorFactor
            //   }
            // },
            grid: {
              display: false,
              drawBorder: false
            },
            title: {
              display: true,
              // text: yAxesScaleLabel
            }
          },
          x: {
            ticks: {
              callback: function(value, index) {
                const month = +this.getLabelForValue(+value).substring(0, 2)
                const date = new Date();
                date.setMonth(month - 1);
  
                return date.toLocaleString('en-US', { month: 'long' });
                
              }
            },
            grid: {
              display: false,
              drawBorder: false
            }
          }
        },
      }
    })
  }

  onFilingPeriodChange(selectedFilingPeriod) {
    console.log(selectedFilingPeriod)

    this.selectedFilingPeriod = selectedFilingPeriod

    this.outwardSuppliesGstinsForFp = []
    this.quickStatsGstinsForFp = []
    let index = this.filingPeriod.findIndex(fp => fp === selectedFilingPeriod)
    console.log(index)
    
    this.outwardSuppliesGstinsForFp = this.outwardSuppliesGstins[index]
    this.quickStatsGstinsForFp = this.quickStatsGstins[index]

    index = this.filingPeriod.indexOf(selectedFilingPeriod)
    this.outwardSupplies = this.outwardTaxableSupplies[index]

    const quickStat = this.quickStats.find(qs => qs['fp'] === selectedFilingPeriod)
    this.rcmInwardSupplies = quickStat['txvalTot']
    this.rcmPayments = quickStat['pdCashTot']
  }

}