import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToolBarComponent } from "../../projects/user-management/src/lib/components/toolbar/toolBar.component";
import { AuthService } from '@trippin/user-management';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Trippin_Angular_App';

  private authService = inject(AuthService);
  private router =inject(Router);

  constructor() {

    effect(()=>{
      var isLoggedIn = this.authService.isLoggedIn();
      if(isLoggedIn){
        this.router.navigate(['trips']);
      }      
    });
    
  }
}
