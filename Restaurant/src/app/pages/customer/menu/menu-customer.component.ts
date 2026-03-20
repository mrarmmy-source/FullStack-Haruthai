import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { CustomerSidebarComponent } from '../../../components/customer-sidebar/customer-sidebar.component';

@Component({
  selector: 'app-menu-customer',
  standalone: true,
  imports: [CommonModule, CustomerSidebarComponent],
  templateUrl: './menu-customer.component.html',
  styleUrls: ['./menu-customer.component.css']
})
export class MenuCustomerComponent implements OnInit {
  menus: any[] = [];
  loading = true;
  selectedCategory = 'All';

  get categories(): string[] {
    const cats = [...new Set(this.menus.map(m => m.category).filter(Boolean))];
    return ['All', ...cats];
  }

  get filteredMenus(): any[] {
    if (this.selectedCategory === 'All') return this.menus;
    return this.menus.filter(m => m.category === this.selectedCategory);
  }

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  goBack(): void { this.router.navigate(['/customer/home']); }

  async ngOnInit() {
    try {
      this.menus = await this.supabaseService.getMenus();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
