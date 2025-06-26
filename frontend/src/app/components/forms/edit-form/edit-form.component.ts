import { Component, inject, OnInit } from '@angular/core';
import { FormsService } from '../../../services/forms.service';
import { ActivatedRoute } from '@angular/router';
import { EvaluationCriterion, FormStructure } from '../../../types/form';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-edit-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.css'
})
export class EditFormComponent implements OnInit {
  formsService = inject(FormsService);
  formStructure: FormStructure = {
    title: '',
    description: '',
    status: 'draft',
    criteria: []
  };
  newCriterion: Partial<EvaluationCriterion> = {
    label: '',
    type: 'text',
    required: false,
    options: [],
    answer: [],
    userAnswer: [],
    saved: false
  };
  optionInput = '';
  answerInput = '';
  inputTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'rating', label: 'Rating Scale (1-5)' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'select', label: 'Dropdown Select' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const formUuid = params.get("id");
      if (!formUuid) return alert("Form UUID does not exist");
      const result = await this.formsService.getForm(formUuid);
      if (!result) return alert("Form not found");
      // Ensure all criteria have answer and userAnswer arrays initialized
      const criteriaWithAnswers = result.criteria.map(criterion => ({
        ...criterion,
        answer: criterion.answer || [],
        userAnswer: criterion.userAnswer || [],
        saved: criterion.saved !== undefined ? criterion.saved : true // Default to true for existing criteria
      }));
      this.formStructure = {
        ...result,
        criteria: criteriaWithAnswers
      }
    })
  }

  addCriterion(): void {
    if (!this.newCriterion.label) return;

    const criterion: EvaluationCriterion = {
      id: Date.now().toString(),
      label: this.newCriterion.label,
      type: this.newCriterion.type || 'text',
      required: this.newCriterion.required || false,
      options: this.newCriterion.options || [],
      answer: this.newCriterion.answer || [],
      userAnswer: this.newCriterion.userAnswer || [],
      saved: false // New criteria are not saved yet
    };

    this.formStructure.criteria.push(criterion);

    this.newCriterion = {
      label: '',
      type: 'text',
      required: false,
      options: [],
      answer: [],
      userAnswer: [],
      saved: false
    };
    this.optionInput = '';
    this.answerInput = '';
  }

  async removeCriterion(id: string): Promise<void> {
    const criterion = this.formStructure.criteria.find(c => c.id === id);
    if (!criterion) return;

    // Show confirmation dialog
    const confirmMessage = criterion.saved 
      ? `Are you sure you want to delete "${criterion.label}"? This action cannot be undone.`
      : `Are you sure you want to remove "${criterion.label}"?`;
    
    if (!confirm(confirmMessage)) {
      return; // User cancelled
    }

    if (criterion.saved) {
      // If criterion is saved in database, delete it using the service
      try {
        const result = await this.formsService.deleteCriterion(this.formStructure.id!, id);
        if (result.success) {
          // Remove from local array after successful deletion
          this.formStructure.criteria = this.formStructure.criteria.filter(c => c.id !== id);
        } else {
          alert('Failed to delete criterion. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting criterion:', error);
        alert('An error occurred while deleting the criterion.');
      }
    } else {
      // If not saved, just filter out from local array
      this.formStructure.criteria = this.formStructure.criteria.filter(c => c.id !== id);
    }
  }

  addOption(): void {
    if (!this.optionInput.trim()) return;

    if (!this.newCriterion.options) {
      this.newCriterion.options = [];
    }
    this.newCriterion.options.push(this.optionInput.trim());
    this.optionInput = '';
  }

  removeOption(index: number): void {
    if (this.newCriterion.options) {
      this.newCriterion.options.splice(index, 1);
    }
  }

  onTypeChange(): void {
    this.newCriterion.options = [];
    this.newCriterion.answer = [];
    this.optionInput = '';
    this.answerInput = '';
  }

  needsOptions(): boolean {
    return this.newCriterion.type === 'radio' || this.newCriterion.type === 'select' || this.newCriterion.type === 'checkbox';
  }

  canAddCriterion(): boolean {
    if (!this.newCriterion.label) return false;
    if (this.needsOptions() && (!this.newCriterion.options || this.newCriterion.options.length === 0)) {
      return false;
    }
    return true;
  }

  async saveForm(): Promise<void> {
    const updatedForm : FormStructure = {
      ...this.formStructure,
      updatedAt: Timestamp.now(),
      status: this.formStructure.status || 'draft'
    }
    console.log('Form Structure:', updatedForm);
    const {success, error} = await this.formsService.updateForm(updatedForm);
    if (success) {
      this.formStructure.criteria.forEach(criterion => {
        criterion.saved = true;
      });
      alert('Form structure saved successfully!');
    } else {
      console.log(error);
      alert('Failed to save form: ' + error);
    }
  }

  canSaveForm(): boolean {
    return !!(this.formStructure.title && this.formStructure.criteria.length > 0);
  }

  getRatingArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  shouldShowAnswer(type: string): boolean {
    return type === 'radio' || type === 'checkbox';
  }

  addAnswer(): void {
    if (!this.answerInput.trim()) return;

    if (!this.newCriterion.answer) {
      this.newCriterion.answer = [];
    }
    this.newCriterion.answer.push(this.answerInput.trim());
    this.answerInput = '';
  }

  removeAnswer(index: number): void {
    if (this.newCriterion.answer) {
      this.newCriterion.answer.splice(index, 1);
    }
  }

  setCorrectAnswer(option: string): void {
    // For radio buttons, only one answer is allowed
    this.newCriterion.answer = [option];
  }

  isCorrectAnswer(option: string): boolean {
    return this.newCriterion.answer?.includes(option) || false;
  }

  toggleCorrectAnswer(option: string): void {
    if (!this.newCriterion.answer) {
      this.newCriterion.answer = [];
    }
    const index = this.newCriterion.answer.indexOf(option);
    if (index > -1) {
      // If already exists, remove it (toggle off)
      this.newCriterion.answer.splice(index, 1);
    } else {
      // Otherwise, add it (toggle on)
      this.newCriterion.answer.push(option);
    }
  }
}
