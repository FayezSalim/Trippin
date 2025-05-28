import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy } from "@angular/core";
import { AuthStore } from "../../store/auth.store";
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    styleUrl: './toolBar.component.css',
    templateUrl: './toolBar.component.html',
    imports: [CommonModule, MatToolbarModule],
    selector: 'trippin-toolbar',
    standalone: true
})
export class ToolBarComponent implements OnDestroy {

    protected readonly authStore = inject(AuthStore);

    protected dropdownOpen: boolean;

    private outsideClickHandler: () => void;

    constructor() {
        this.dropdownOpen = false;
        this.outsideClickHandler = () => {
            if(this.dropdownOpen){
                this.dropdownOpen = false;
            }
        };

        document.body.addEventListener('click', this.outsideClickHandler);
    }
    ngOnDestroy(): void {
        document.body.removeEventListener('click', this.outsideClickHandler);
    }

    toggleProfileSettings(ev: Event) {
        ev.stopPropagation();
        this.dropdownOpen = !this.dropdownOpen;
    }
}