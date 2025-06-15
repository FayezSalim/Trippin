import { CommonModule, NgFor } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { trigger, state, style, animate, transition, query, group } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { EmailCredential } from '../../models/email-credential';
import { Router } from '@angular/router';


@Component({
  selector: 'login-component',
  imports: [CommonModule, MatFormFieldModule, MatCheckboxModule, MatInputModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  protected isRegistering = signal(false);
  protected errorMessage = signal("");

  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  constructor() {
    effect(()=>{
      const newVal = this.isRegistering();
      console.log(newVal);
    })
  }

  register(form: NgForm) {
    const { email, name, password, confirmPassword } = form.value;

    if (confirmPassword !== password) {
      alert("Passwords do not match"); //change to popup validation
      return;
    }

    this.authService.signUp(new EmailCredential(email, password, name));

    //TODO progress bar 
    //navigate to login on success
  }

  async login(form: NgForm) {
    const { email, password } = form.value;
    const userNameModel = form.controls['username'];

    this.authService.login(new EmailCredential(email, password)).then((res) => {
      if (res.error) {
        this.errorMessage.set(res.error);
        // Example: set a custom error
        if (userNameModel) {
          userNameModel.setErrors({ ...userNameModel.errors, custom: `${res.error}` });
        }
      } else {
        this.errorMessage.set("");
      }
    }).catch((err) => {
      console.error(`login error ${err}`);
    });


    //failure case //success case
    //TODO progress bar 
  }

  switchForm() {
    this.isRegistering.update((currVal) => !currVal);
  }

}
