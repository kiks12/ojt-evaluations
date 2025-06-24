import { Component, inject, signal } from '@angular/core';
import { FormsService } from '../../../../services/forms.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-form-modal',
  imports: [],
  templateUrl: './form-modal.component.html',
  styleUrl: './form-modal.component.css'
})
export class FormModalComponent {
  title = signal("")
  description = signal("")
  loadingSubmit = signal(false)
  error = signal("")
  formsService = inject(FormsService)

  onTitleChange(event: Event) {
    this.title.set((event.target as HTMLInputElement).value)
  }

  onDescriptionChange(event: Event) {
    this.description.set((event.target as HTMLInputElement).value)
  }

  async submitForm() {
    this.loadingSubmit.set(true)
    const { success, error } = await this.formsService.createForm({
      title: this.title(),
      description: this.description(),
      createdAt: Timestamp.now(),
    })
    this.loadingSubmit.set(false)
    if (!success) {
      this.error.set((error as Error).message ?? "")
      return;
    }

    alert("Created new form")
    this.formsService.toggleAddFormModal()
    this.formsService.getForms()
  }
}
