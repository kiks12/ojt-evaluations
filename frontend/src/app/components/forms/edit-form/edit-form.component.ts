import { Component, signal, WritableSignal } from '@angular/core';

interface EvaluationCriterion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'rating' | 'checkbox' | 'radio' | 'select';
  required: boolean;
  options?: string[];
}

interface FormStructure {
  title: string;
  description: string;
  criteria: EvaluationCriterion[];
}

@Component({
  selector: 'app-edit-form',
  imports: [],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.css'
})
export class EditFormComponent {
  formStructure: WritableSignal<FormStructure> = signal<FormStructure>({
    title: '',
    description: '',
    criteria: []
  });

  newCriterion: Partial<EvaluationCriterion> = {
    label: '',
    type: 'text',
    required: false,
    options: []
  };

  optionInput = '';

  inputTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'rating', label: 'Rating Scale (1-5)' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'select', label: 'Dropdown Select' }
  ];

  addCriterion(): void {
    if (!this.newCriterion.label) return;

    const criterion: EvaluationCriterion = {
      id: Date.now().toString(),
      label: this.newCriterion.label,
      type: this.newCriterion.type || 'text',
      required: this.newCriterion.required || false,
      options: this.newCriterion.options || []
    };

    this.formStructure().criteria.push(criterion);

    this.newCriterion = {
      label: '',
      type: 'text',
      required: false,
      options: []
    };
    this.optionInput = '';
  }

  removeCriterion(id: string): void {
    this.formStructure().criteria = this.formStructure().criteria.filter(c => c.id !== id);
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
    this.optionInput = '';
  }

  needsOptions(): boolean {
    return this.newCriterion.type === 'radio' || this.newCriterion.type === 'select';
  }

  canAddCriterion(): boolean {
    if (!this.newCriterion.label) return false;
    if (this.needsOptions() && (!this.newCriterion.options || this.newCriterion.options.length === 0)) {
      return false;
    }
    return true;
  }

  saveForm(): void {
    console.log('Form Structure:', this.formStructure);
    alert('Form structure saved! Check console for details.');
  }

  canSaveForm(): boolean {
    return !!(this.formStructure().title && this.formStructure().criteria.length > 0);
  }

  getRatingArray(): number[] {
    return [1, 2, 3, 4, 5];
  }
}
