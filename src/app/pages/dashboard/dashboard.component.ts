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
  public filingPeriod: Array<string> = []
  public outwardTaxableSupplies: Array<number> = []
  public chart1: any
  public grossTaxLiability: Array<number> = []
  public chart2: any

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

      this.dashboardService.getOutWardSupplyAndLiability(this.selectedCompany)
        .subscribe({
          next: (response) => {
            console.log(response)
            this.filingPeriod = []
            this.outwardTaxableSupplies = []
            this.grossTaxLiability = []
            if (this.chart1)
              this.chart1.destroy()
            if (this.chart2)
              this.chart2.destroy()

            if (response['response']) {
              const data = response['response']
              data.slice(0).reverse().map(x => {
                const month = +x.fp.substring(0, 2)

                this.filingPeriod.push(this.months[month-1].substring(0, 3))

                this.outwardTaxableSupplies.push(+x.outwardTaxSupply)

                this.grossTaxLiability.push(+x.totTaxLiability)

                // console.log('ots = ', this.outwardTaxableSupplies);
                // console.log('gtl = ', this.grossTaxLiability);
                
              })
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
    })

    this.newsService.newsList.subscribe(news => {
      this.newsList = news
    })

  }

  getOptionsForChart1And2(divisorFactor, yAxesScaleLabel) {
    return {
      plugins: {
        legend: {
          display: false
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

}
