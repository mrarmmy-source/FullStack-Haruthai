import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { StaffSidebarComponent } from '../../../components/staff-sidebar/staff-sidebar.component';

@Component({
  selector: 'app-order-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffSidebarComponent],
  templateUrl: './order-admin.component.html',
  styleUrls: ['./order-admin.component.css']
})
export class OrderAdminComponent implements OnInit {
  orders: any[] = [];
  filtered: any[] = [];
  loading = true;
  search = '';
  statusFilter = 'all';

  constructor(private supabaseService: SupabaseService, private router: Router) {}
  goBack(): void { this.router.navigate(['/home']); }

  async ngOnInit() { await this.loadOrders(); }

  async loadOrders() {
    this.loading = true;
    try {
      this.orders = await this.supabaseService.getAllOrders(this.statusFilter);
      this.filterOrders();
    } catch (err) { console.error(err); }
    finally { this.loading = false; }
  }

  filterOrders() {
    const s = this.search.toLowerCase();
    this.filtered = this.orders.filter(o => o.customer_name?.toLowerCase().includes(s));
  }

  updating: Set<string> = new Set();

  async updateStatus(order: any, status: string) {
    this.updating.add(order.id);
    try {
      await this.supabaseService.updateOrderStatus(order.id, status);
      const idx = this.orders.findIndex(o => o.id === order.id);
      if (idx !== -1) this.orders[idx] = { ...this.orders[idx], status };
      this.filterOrders();
    } catch (err: any) {
      alert('Error: ' + (err?.message || err));
    } finally {
      this.updating.delete(order.id);
    }
  }
}
