import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormsService } from '../../services/forms.service';
import { EvaluationCriterion, FormStructure } from '../../types/form';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.css'],
  imports: [CommonModule, FormsModule]
})
export class FormPreviewComponent implements OnInit {
  formsService = inject(FormsService);
  formStructure: FormStructure | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      const formId = params.get('id');
      if (!formId) {
        this.errorMessage = 'Invalid form ID';
        this.isLoading = false;
        return;
      }

      try {
        const result = await this.formsService.getForm(formId);
        if (!result) {
          this.errorMessage = 'Form not found';
          this.isLoading = false;
          return;
        }

        // Initialize sample answers for preview purposes
        result.criteria.forEach(criterion => {
          criterion.userAnswer = this.getSampleAnswer(criterion);
        });

        this.formStructure = result;
        this.isLoading = false;
      } catch (error) {
        console.error('Error loading form:', error);
        this.errorMessage = 'Failed to load form. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  getSampleAnswer(criterion: EvaluationCriterion): string[] {
    // Provide sample answers for preview purposes
    switch (criterion.type) {
      case 'text':
        return ['Sample text response'];
      case 'textarea':
        return ['This is a sample detailed response that shows how a user might fill out this textarea field.'];
      case 'rating':
        return ['4']; // Sample 4-star rating
      case 'radio':
        return criterion.options && criterion.options.length > 0 ? [criterion.options[0]] : [];
      case 'checkbox':
        // Select first option as sample
        return criterion.options && criterion.options.length > 0 ? [criterion.options[0]] : [];
      case 'select':
        return criterion.options && criterion.options.length > 0 ? [criterion.options[0]] : [];
      default:
        return [];
    }
  }

  isAnswerSelected(criterion: EvaluationCriterion, value: string): boolean {
    return criterion.userAnswer?.includes(value) || false;
  }

  getRatingArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getRatingValue(criterion: EvaluationCriterion): number {
    return criterion.userAnswer && criterion.userAnswer[0] ? +criterion.userAnswer[0] : 0;
  }

  goBackToEdit(): void {
    this.router.navigate(['/forms', this.formStructure?.id, 'edit']);
  }

  goToShareableLink(): void {
    if (!this.formStructure?.id) return;
    
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/forms/${this.formStructure.id}/fill`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableUrl).then(() => {
      alert(`Shareable link copied to clipboard!\n\nLink: ${shareableUrl}\n\nAnyone with this link can fill out the form.`);
    }).catch(err => {
      console.error('Failed to copy link to clipboard:', err);
      // Fallback: show the link in a prompt
      prompt('Copy this shareable link:', shareableUrl);
    });
  }
}
