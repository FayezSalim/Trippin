import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'lib-login',
  imports: [CommonModule,MatFormFieldModule,MatCheckboxModule,MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {

}
