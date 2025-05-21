import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  isCollapsed = false;

  @Output() sidebarToggle = new EventEmitter<boolean>();

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggle.emit(this.isCollapsed);
  }

  menuSections = [
    {
      title: 'Orders',
      icon: 'fa-solid fa-receipt',
      links: [
        { label: 'View All Orders', route: '/admin/orders' }
      ]
    },
    {
      title: 'Products',
      icon: 'fa-solid fa-box',
      links: [
        { label: 'Product List', route: '/admin/products' },
      ]
    },
    {
      title: 'Customers',
      icon: 'fa-solid fa-users',
      links: [
        { label: 'View Registered Users', route: '/admin/users' }
      ]
    },
    {
      title: 'Inventory Management',
      icon: 'fa-solid fa-toolbox',
      links: [
        { label: 'Stock Levels', route: '/admin/inventory' }
      ]
    },
    {
      title: 'Categories Management',
      icon: 'fa-solid fa-tags',
      links: [
        { label: 'Manage Categories', route: '/admin/categories' }
      ]
    },
    {
      title: 'Promotions & Coupons',
      icon: 'fa-solid fa-bullhorn',
      links: [
        { label: 'Manage Promotions', route: '/admin/promotions' }
      ]
    },
    {
      title: 'Admin Settings',
      icon: 'fa-solid fa-shield-alt',
      links: [
        { label: 'Settings', route: '/admin/settings' }
      ]
    }
  ];
}
