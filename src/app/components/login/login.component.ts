import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('form') signInForm: NgForm;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

  }

  onSubmit() {
    const email = this.signInForm.value.email
    const password = this.signInForm.value.password    

    this.authService.login(email, password)
      .subscribe({
        next: (responseData) => {
          console.log(responseData);
        },
        error: (errorMessage) =>{
          console.log(errorMessage)
        }
      })
  }
}
