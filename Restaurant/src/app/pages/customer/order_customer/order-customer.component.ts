import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-order-customer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold mb-1">My Orders</h2>
      <p class="text-gray-500 mb-6">Track your food status</p>

      <div *ngIf="loading" class="text-center py-10 text-gray-400">Loading...</div>

      <div *ngIf="!loading && orders.length === 0" class="text-center py-10 text-gray-400">
        You have no orders yet.
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let o of orders" class="bg-white rounded-xl shadow p-4 border">
          <div class="flex justify-between mb-2">
            <span class="text-sm text-gray-500">{{ o.order_time }}</span>
            <span class="text-xs px-2 py-1 rounded-full font-semibold"
              [ngClass]="{
                'bg-yellow-100 text-yellow-700': o.status === 'pending',
                'bg-blue-100 text-blue-700': o.status === 'preparing',
                'bg-green-100 text-green-700': o.status === 'completed'
              }">{{ o.status }}</span>
          </div>
          <p class="font-medium">โต๊ะ {{ o.table_number }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ o.items?.join(', ') }}</p>
          <p class="text-right font-bold mt-2">฿{{ o.total?.toLocaleString() }}</p>
        </div>
      </div>

      <div class="mt-6">
        <a routerLink="/customer/home" class="text-blue-600 hover:underline">← กลับหน้าหลัก</a>
      </div>
    </div>
  `
})
export class OrderCustomerComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      this.orders = await this.supabaseService.getMyOrders();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
