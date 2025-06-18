import { Component, inject } from '@angular/core';
import { FormModalComponent } from "./components/form-modal/form-modal.component";
import { FormsService } from '../../services/forms.service';
import { FormCardComponent } from './components/form-card/form-card.component';

@Component({
  selector: 'app-forms',
  imports: [FormModalComponent, FormCardComponent],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent {
  formsService = inject(FormsService)
}
