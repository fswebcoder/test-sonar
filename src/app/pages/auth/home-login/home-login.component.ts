import { LoginSmartComponent } from '@/presentation/modules/auth/login-smart/login-smart.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-login',
  imports: [LoginSmartComponent],
  templateUrl: './home-login.component.html',
  styleUrl: './home-login.component.scss'
})
export class HomeLoginComponent {}
