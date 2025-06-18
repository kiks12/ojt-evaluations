import { Component, Input } from '@angular/core';
import { Form } from '../../../../types/form';

@Component({
  selector: 'app-form-card',
  imports: [],
  templateUrl: './form-card.component.html',
  styleUrl: './form-card.component.css'
})
export class FormCardComponent {
  @Input({required: true}) form!: Form;

}
