import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';

export interface FormData {
  id?: string;
  title: string;
  description: string;
  status?: 'active' | 'draft' | 'archived';
  criteria?: any[];
  responses?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.css'],
  imports: [CommonModule]
})
export class FormCardComponent {
  @Input() form!: FormData;
  @Output() delete? = new EventEmitter<FormData>();
  @Output() edit? = new EventEmitter<FormData>();
  @Output() duplicate? = new EventEmitter<FormData>();
  @Output() share? = new EventEmitter<FormData>();
  @Output() preview? = new EventEmitter<FormData>();
  @Output() analytics? = new EventEmitter<FormData>();
  @Output() cardClick? = new EventEmitter<FormData>();

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
    // this.router.navigate(['/forms', this.form.id || this.form.title]);
  }

  onDelete(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.closeDropdown();
    
    // Show confirmation dialog
    if (confirm(`Are you sure you want to delete "${this.form.title}"? This action cannot be undone.`)) {
      // this.delete.emit(this.form);
    }
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

  getRelativeTime(date?: Date | string): string {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return targetDate.toLocaleDateString();
  }
}