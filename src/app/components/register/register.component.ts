import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('form') registerForm: NgForm;

  constructor() { }

  ngOnInit(): void { 
  }

  onSubmit() {
    const firstName = this.registerForm.value.firstName
    const email = this.registerForm.value.email    
  }

}
