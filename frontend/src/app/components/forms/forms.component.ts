import { Component, OnInit, HostListener, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsService } from '../../services/forms.service';
import { FormCardComponent } from './components/form-card/form-card.component';
import { CommonModule } from '@angular/common';
import { FormModalComponent } from './components/form-modal/form-modal.component';
import { FormData } from '../../types/form';
import { TimeUtilityService } from '../../services/time-utility.service';

@Component({
  selector: 'app-forms-page',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
  imports: [FormModalComponent, FormCardComponent, CommonModule]
})
export class FormsComponent implements OnInit {
  timeUtilityService = inject(TimeUtilityService);
  searchQuery = signal('');
  viewMode: 'grid' | 'list' = 'grid';
  showFilterMenu = false;
  activeFilters: string[] = [];
  isLoading = false;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;

  statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' }
  ];

  constructor(
    public formsService: FormsService, // Replace with your actual forms service
    private router: Router
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.closeFilterMenu();
  }

  ngOnInit() {
    this.loadForms();
  }

  async loadForms() {
    this.isLoading = true;
    await this.formsService.getForms();
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.updatePagination();
    }, 1000);
  }

  getPageTitle(): string {
    const totalForms = this.formsService.forms().length;
    if (totalForms === 0) return 'Forms';
    return totalForms === 1 ? '1 Form' : `${totalForms} Forms`;
  }

  getPageSubtitle(): string {
    const totalForms = this.formsService.forms().length;
    if (totalForms === 0) return 'Create and manage your OJT evaluation forms';
    return 'Create, manage, and analyze your OJT evaluation forms';
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.currentPage = 1;
    this.updatePagination();
  }

  toggleFilterMenu() {
    this.showFilterMenu = !this.showFilterMenu;
  }

  closeFilterMenu() {
    this.showFilterMenu = false;
  }

  toggleFilter(filter: string) {
    const index = this.activeFilters.indexOf(filter);
    if (index > -1) {
      this.activeFilters.splice(index, 1);
    } else {
      this.activeFilters.push(filter);
    }
  }

  removeFilter(filter: string) {
    const index = this.activeFilters.indexOf(filter);
    if (index > -1) {
      this.activeFilters.splice(index, 1);
    }
    this.applyFilters();
  }

  clearFilters() {
    this.activeFilters = [];
    this.applyFilters();
  }

  applyFilters() {
    this.currentPage = 1;
    this.updatePagination();
    this.closeFilterMenu();
  }

  getFilterLabel(filter: string): string {
    const option = this.statusOptions.find(opt => opt.value === filter);
    return option ? option.label : filter;
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  getFilteredForms(): FormData[] {
    let filtered = this.formsService.forms();

    // Apply search filter
    if (this.searchQuery().trim()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter((form: FormData) =>
        form.title.toLowerCase().includes(query) ||
        form.description.toLowerCase().includes(query)
      );
    }

    // Apply status filters
    if (this.activeFilters.length > 0) {
      filtered = filtered.filter((form: FormData) =>
        this.activeFilters.includes(form.status ?? "No Status")
      );
    }

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  getTotalForms(): number {
    let filtered = this.formsService.forms();

    if (this.searchQuery().trim()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter((form: FormData) =>
        form.title.toLowerCase().includes(query) ||
        form.description.toLowerCase().includes(query)
      );
    }

    if (this.activeFilters.length > 0) {
      filtered = filtered.filter((form: FormData) =>
        this.activeFilters.includes(form.status ?? "No Status")
      );
    }

    return filtered.length;
  }

  updatePagination() {
    const totalItems = this.getTotalForms();
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    const totalItems = this.getTotalForms();
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, totalItems);
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  clearSearchAndFilters() {
    this.searchQuery.set(''); 
    this.activeFilters = [];
    this.currentPage = 1;
    this.updatePagination();
  }

  // Form action handlers
  onEditForm(form: FormData) {
    this.router.navigate(['/forms', form.id, 'edit']);
  }

  async onDeleteForm(form: FormData) {
    if (!form.id) return alert("Form ID does not exist");
    if (confirm(`Are you sure you want to delete "${form.title}"?`)) {
      const { success, error } = await this.formsService.deleteForm(form.id);
      if (error) return alert(error);
      if (success) this.formsService.getForms();
      alert("Successfully deleted form");
    }
  }

  onDuplicateForm(form: FormData) {
    // Handle duplicate logic
    console.log('Duplicating form:', form);
  }

  onShareForm(form: FormData) {
    // Handle share logic
    console.log('Sharing form:', form);
  }

  onPreviewForm(form: FormData) {
    this.router.navigate(['/forms', form.id, 'preview']);
  }

  onViewAnalytics(form: FormData) {
    this.router.navigate(['/forms', form.id, 'analytics']);
  }

  getStatusLabel(status: string | undefined): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status ?? "No Status";
  }
}
