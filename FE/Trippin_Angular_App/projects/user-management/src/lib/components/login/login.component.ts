import { CommonModule, NgFor } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { trigger, state, style, animate, transition, query, group } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EmailCredential } from '../../models/email-credential';


@Component({
  selector: 'login-component',
  imports: [CommonModule, MatFormFieldModule, MatCheckboxModule, MatInputModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  animations: [
    // trigger('slideInOut', [
    //   state('login', style({ transform: 'translateX(0%)', })),
    //   state('register', style({ transform: 'translateX(0%)', })),
    //   transition('login <=> register', [
    //     style({ transform: 'translateX(-5%)', }),
    //     animate('1000ms ease', style({ transform: 'translateX(0%)', }))
    //   ])
    // ]),
    // trigger('resizeBox', [
    //   transition('* <=> *', [
    //     style({ height: '{{startHeight}}px', width: '{{startWidth}}px' }),
    //     animate('2.0s ease', style({ height: '*', width: '*' })),
    //   ], { params: { startHeight: 400, startWidth: 400 } })
    // ]),
    trigger('paneChange', [
      transition('void => *',[]),
      transition('* => *', [
        query(':self', [style({ height: '{{startHeight}}px' })]),
        query(':enter', [style({ opacity: 0,  })]),
        // query(':leave', [
        //   style({ opacity: 1,  }),
        //   animate('2.0s ease-out', style({ opacity: 0 })),
        // ]),
        group(
          [
            query(':self', [animate('1.0s ease', style({ height: '*' }))]),
            query(':enter', [
              animate('1.0s ease', style({ opacity: 1,  })),
            ]),
          ],
          { params: { startHeight: 0 } }
        ),
      ]),
    ]),
  ]
})
export class LoginComponent {
  protected isRegistering = signal(false);
  protected errorMessage = signal("");

  constructor(private authService: AuthService) {
    
  }
  // TODO fix scaling for mobile devices

  showRegister(event: Event) {
    this.errorMessage.set('');
    event.preventDefault();
    this.isRegistering.set(true);
  }

  showLogin(event: Event) {
    this.errorMessage.set('');
    event.preventDefault();
    this.isRegistering.set(false);
  }

  register(form: NgForm) {
    const { email, name, password, confirmPassword } = form.value;

    if (confirmPassword !== password) {
      alert("Passwords do not match"); //change to popup validation
      return;
    }

    this.authService.signUp(new EmailCredential(email, password, name));

    //TODO progress bar 
  }

  async login(form: NgForm) {
    const { username, password } = form.value;
    const userNameModel = form.controls['username'];


    //TODO hash passwrod

    await this.authService.login(new EmailCredential(username, password)).then((res) => {
      if (res.error) {
        this.errorMessage.set(res.error);
        // Example: set a custom error
        if (userNameModel) {
          userNameModel.setErrors({ ...userNameModel.errors, custom: `${res.error}` });
        }
      } else {
        this.errorMessage.set("");
        //TODO redirect to home page
      }
    });
    //failure case //success case
    //TODO progress bar 

    //await fetch('http://localhost:3000/auth/test', { credentials: 'include' });
  }
}
