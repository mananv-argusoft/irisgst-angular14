import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-and-register',
  templateUrl: './login-and-register.component.html',
  styleUrls: ['./login-and-register.component.css']
})
export class LoginAndRegisterComponent {
  @ViewChild('loginTab') loginDiv: ElementRef 
  @ViewChild('registerTab') registerDiv: ElementRef 

  constructor(public router: Router, private renderer: Renderer2) { }
  
  toLogin() {
    if (this.router.url !== '/')
      this.router.navigate(['/login'])

    this.renderer.removeClass(this.registerDiv.nativeElement, 'active')
    this.renderer.addClass(this.loginDiv.nativeElement, 'active')
  }

  toRegister() {
    this.router.navigate(['/register'])

    this.renderer.removeClass(this.loginDiv.nativeElement, 'active')
    this.renderer.addClass(this.registerDiv.nativeElement, 'active')
  }

}
