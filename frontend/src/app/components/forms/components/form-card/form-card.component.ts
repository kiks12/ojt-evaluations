import { CommonModule, Time } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormData } from '../../../../types/form';
import { Timestamp } from 'firebase/firestore';
import { TimeUtilityService } from '../../../../services/time-utility.service';

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.css'],
  imports: [CommonModule]
})
export class FormCardComponent {
  @Input() form!: FormData;
  @Output() delete = new EventEmitter<FormData>();
  @Output() edit? = new EventEmitter<FormData>();
  @Output() duplicate? = new EventEmitter<FormData>();
  @Output() share? = new EventEmitter<FormData>();
  @Output() preview? = new EventEmitter<FormData>();
  @Output() analytics? = new EventEmitter<FormData>();
  @Output() cardClick? = new EventEmitter<FormData>();
  timeUtilService = inject(TimeUtilityService);

  showDropdown = false;

  constructor(private router: Router) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Close dropdown when clicking outside
    if (this.showDropdown) {
      this.showDropdown = false;
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  onCardClick() {
    // this.cardClick.emit(this.form);
  }

  onEdit(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.closeDropdown();
    // this.edit.emit(this.form);
    // Alternative: Navigate directly
    this.router.navigate(['/forms', this.form.id || this.form.title]);
  }

  onDelete(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.closeDropdown();
    
    // Show confirmation dialog
    if (this.delete) this.delete.emit(this.form);
  }

  onDuplicate(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.closeDropdown();
    // this.duplicate.emit(this.form);
  }

  onShare(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.closeDropdown();
    // this.share.emit(this.form);
  }

  onPreview(event: Event) {
    event.stopPropagation();
    this.closeDropdown();
    // this.preview.emit(this.form);
  }

  onAnalytics(event: Event) {
    event.stopPropagation();
    this.closeDropdown();
    // this.analytics.emit(this.form);
  }

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'draft': return 'Draft';
      case 'archived': return 'Archived';
      default: return 'Draft';
    }
  }
}