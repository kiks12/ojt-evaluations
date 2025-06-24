import { CommonModule } from '@angular/common';
import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [RouterLink, CommonModule]
})
export class HeaderComponent {
  @Output() search = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  showUserMenu = false;
  showMobileMenu = false;
  searchQuery = '';

  // Mock user data - replace with actual user service
  currentUser: User = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  constructor(private router: Router) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Close menus when clicking outside
    this.closeAllMenus();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showMobileMenu = false;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    this.showUserMenu = false;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }

  closeAllMenus() {
    this.showUserMenu = false;
    this.showMobileMenu = false;
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.search.emit(this.searchQuery);
  }

  onLogout() {
    this.closeAllMenus();
    // Add confirmation dialog
    if (confirm('Are you sure you want to sign out?')) {
      this.logout.emit();
      // Handle logout logic here
      console.log('User logged out');
      // this.router.navigate(['/login']);
    }
  }

  getUserInitials(): string {
    if (!this.currentUser?.name) return 'JD';
    
    const names = this.currentUser.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  }

  // Method to handle navigation and close mobile menu
  navigateAndClose(route: string) {
    this.closeMobileMenu();
    this.router.navigate([route]);
  }
}