import { CommonModule, Time } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostListener, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormData, FormStructure } from '../../../../types/form';
import { TimeUtilityService } from '../../../../services/time-utility.service';

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.css'],
  imports: [CommonModule]
})
export class FormCardComponent implements OnInit {
  @Input() form!: FormStructure;
  @Output() delete = new EventEmitter<FormStructure>();
  @Output() edit? = new EventEmitter<FormStructure>();
  @Output() duplicate? = new EventEmitter<FormStructure>();
  @Output() share? = new EventEmitter<FormStructure>();
  @Output() preview? = new EventEmitter<FormStructure>();
  @Output() analytics? = new EventEmitter<FormStructure>();
  @Output() cardClick? = new EventEmitter<FormStructure>();
  timeUtilService = inject(TimeUtilityService);

  showDropdown = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log(this.form);
  }

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
    // Navigate to edit route
    this.router.navigate(['/forms', this.form.id, 'edit']);
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
    this.generateShareableLink();
  }

  onPreview(event: Event) {
    event.stopPropagation();
    this.closeDropdown();
    // Navigate to preview page for form editing/viewing
    this.router.navigate(['/forms', this.form.id, 'preview']);
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

  generateShareableLink(): void {
    // Generate shareable link for public form access
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/forms/${this.form.id}/fill`;
    
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