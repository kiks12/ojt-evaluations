import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormsService } from '../../services/forms.service';
import { EvaluationCriterion, FormStructure } from '../../types/form';
import { FormResponseService } from '../../services/form-response.service';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-form-fill',
  templateUrl: './form-fill.component.html',
  styleUrls: ['./form-fill.component.css'],
  imports: [CommonModule, FormsModule]
})
export class FormFillComponent implements OnInit {
  formsService = inject(FormsService);
  formResponseService = inject(FormResponseService);
  formStructure: FormStructure | null = null;
  isLoading = true;
  isSubmitting = false;
  isSubmitted = false;
  errorMessage = '';
  name: string = '';
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      const formId = params.get('id');
      if (!formId) {
        this.errorMessage = 'Invalid form link';
        this.isLoading = false;
        return;
      }

      try {
        const result = await this.formsService.getForm(formId);
        if (!result) {
          this.errorMessage = 'Form not found or no longer available';
          this.isLoading = false;
          return;
        }

        // Check if form is active
        if (result.status !== 'active') {
          this.errorMessage = 'This form is not currently accepting responses';
          this.isLoading = false;
          return;
        }

        // Initialize user answers for all criteria
        result.criteria.forEach(criterion => {
          criterion.userAnswer = criterion.userAnswer || [];
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

  updateAnswer(criterion: EvaluationCriterion, value: string): void {
    if (!criterion.userAnswer) {
      criterion.userAnswer = [];
    }

    switch (criterion.type) {
      case 'text':
      case 'textarea':
      case 'rating':
      case 'select':
        criterion.userAnswer = [value];
        break;
      case 'radio':
        criterion.userAnswer = [value];
        break;
      case 'checkbox':
        const index = criterion.userAnswer.indexOf(value);
        if (index > -1) {
          criterion.userAnswer.splice(index, 1);
        } else {
          criterion.userAnswer.push(value);
        }
        break;
    }
  }

  isAnswerSelected(criterion: EvaluationCriterion, value: string): boolean {
    return criterion.userAnswer?.includes(value) || false;
  }

  isFormValid(): boolean {
    if (!this.formStructure) return false;
    if (!this.name.trim() || !this.email.trim()) return false;
    return this.formStructure.criteria.every(criterion => {
      if (!criterion.required) return true;
      return criterion.userAnswer && criterion.userAnswer.length > 0;
    });
  }

  getRatingArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  async submitForm(): Promise<void> {
    if (!this.formStructure || !this.isFormValid()) {
      alert('Please complete all required fields before submitting.');
      return;
    }
    this.isSubmitting = true;
    try {
      // Build answers array for FormResponse
      const answers = this.formStructure.criteria.map(c => ({
        criterionId: c.id,
        answer: (c.userAnswer && Array.isArray(c.userAnswer)) ? c.userAnswer.join(', ') : ''
      }));
      this.formResponseService.createResponse(this.formStructure.id!, {
        id: uuidv4(),
        formId: this.formStructure.id!,
        name: this.name,
        email: this.email,
        createdAt: Timestamp.now(),
        answers
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isSubmitted = true;
      this.isSubmitting = false;
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
      this.isSubmitting = false;
    }
  }

  resetForm(): void {
    if (!this.formStructure) return;
    this.formStructure.criteria.forEach(criterion => {
      criterion.userAnswer = [];
    });
    this.name = '';
    this.email = '';
    this.isSubmitted = false;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
