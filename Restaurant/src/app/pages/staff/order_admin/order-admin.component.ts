import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-order-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">All Orders</h2>

      <div class="flex gap-3 mb-6">
        <input [(ngModel)]="search" (input)="filterOrders()"
          placeholder="Search customer..."
          class="border rounded-lg px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">

        <select [(ngModel)]="statusFilter" (change)="loadOrders()"
          class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div *ngIf="loading" class="text-center py-10 text-gray-400">Loading...</div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let o of filtered" class="bg-white rounded-xl shadow p-4 border">
          <div class="flex justify-between mb-2">
            <span class="font-semibold">{{ o.customer_name }}</span>
            <span class="text-xs px-2 py-1 rounded-full font-semibold"
              [ngClass]="{
                'bg-yellow-100 text-yellow-700': o.status === 'pending',
                'bg-blue-100 text-blue-700': o.status === 'preparing',
                'bg-green-100 text-green-700': o.status === 'completed'
              }">{{ o.status }}</span>
          </div>
          <p class="text-sm text-gray-500">โต๊ะ {{ o.table_number }}</p>
          <p class="text-sm mt-1">{{ o.items?.join(', ') }}</p>
          <p class="text-right font-bold mt-2">฿{{ o.total?.toLocaleString() }}</p>
        </div>
        <div *ngIf="!loading && filtered.length === 0" class="col-span-3 text-center py-10 text-gray-400">
          No orders found.
        </div>
      </div>

      <div class="mt-6">
        <a routerLink="/home" class="text-blue-600 hover:underline">← กลับหน้าหลัก</a>
      </div>
    </div>
  `
})
export class OrderAdminComponent implements OnInit {
  orders: any[] = [];
  filtered: any[] = [];
  loading = true;
  search = '';
  statusFilter = 'all';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadOrders();
  }

  async loadOrders() {
    this.loading = true;
    try {
      this.orders = await this.supabaseService.getAllOrders(this.statusFilter);
      this.filterOrders();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  filterOrders() {
    const s = this.search.toLowerCase();
    this.filtered = this.orders.filter(o =>
      o.customer_name?.toLowerCase().includes(s)
    );
  }
}
