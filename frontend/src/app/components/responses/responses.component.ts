import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsService } from '../../services/forms.service';
import { FormResponse, FormStructure } from '../../types/form';

@Component({
  selector: 'app-responses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.css']
})
export class ResponsesComponent implements OnInit {
  formsService = inject(FormsService);
  route = inject(ActivatedRoute);
  form: FormStructure | null = null;
  isLoading = true;
  errorMessage = '';

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const formId = params.get('id');
      if (!formId) {
        this.errorMessage = 'Invalid form ID.';
        this.isLoading = false;
        return;
      }
      try {
        const result = await this.formsService.getForm(formId);
        if (!result) {
          this.errorMessage = 'Form not found.';
          this.isLoading = false;
          return;
        }
        this.form = result;
        this.isLoading = false;
      } catch (error) {
        this.errorMessage = 'Failed to load form responses.';
        this.isLoading = false;
      }
    });
  }

  getResponses(): FormResponse[] {
    return this.form?.responses || [];
  }
}
 