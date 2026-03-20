import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-payment-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Payments</h2>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow p-4 border">
          <p class="text-sm text-gray-500">Total Sales</p>
          <h3 class="text-xl font-bold mt-1">฿{{ totalSales.toLocaleString() }}</h3>
        </div>
        <div class="bg-white rounded-xl shadow p-4 border">
          <p class="text-sm text-gray-500">Completed</p>
          <h3 class="text-xl font-bold mt-1 text-green-600">฿{{ completed.toLocaleString() }}</h3>
        </div>
        <div class="bg-white rounded-xl shadow p-4 border">
          <p class="text-sm text-gray-500">Pending</p>
          <h3 class="text-xl font-bold mt-1 text-yellow-600">฿{{ pending.toLocaleString() }}</h3>
        </div>
        <div class="bg-white rounded-xl shadow p-4 border">
          <p class="text-sm text-gray-500">Transactions</p>
          <h3 class="text-xl font-bold mt-1">{{ payments.length }}</h3>
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-10 text-gray-400">Loading...</div>

      <div *ngIf="!loading" class="overflow-x-auto bg-white rounded-xl shadow border">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th class="px-4 py-3 text-left">ID</th>
              <th class="px-4 py-3 text-left">Customer</th>
              <th class="px-4 py-3 text-left">Amount</th>
              <th class="px-4 py-3 text-left">Method</th>
              <th class="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of payments" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3 font-mono">{{ p.id?.substring(0,8) }}...</td>
              <td class="px-4 py-3">{{ p.customer_name }}</td>
              <td class="px-4 py-3 font-semibold">฿{{ p.amount?.toLocaleString() }}</td>
              <td class="px-4 py-3">{{ p.method }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-full text-xs font-semibold"
                  [ngClass]="{
                    'bg-green-100 text-green-700': p.status === 'completed',
                    'bg-yellow-100 text-yellow-700': p.status === 'pending'
                  }">{{ p.status }}</span>
              </td>
            </tr>
            <tr *ngIf="payments.length === 0">
              <td colspan="5" class="px-4 py-10 text-center text-gray-400">No payments found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6">
        <a routerLink="/home" class="text-blue-600 hover:underline">← กลับหน้าหลัก</a>
      </div>
    </div>
  `
})
export class PaymentAdminComponent implements OnInit {
  payments: any[] = [];
  loading = true;
  totalSales = 0;
  completed = 0;
  pending = 0;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      this.payments = await this.supabaseService.getAllPayments();
      this.totalSales = this.payments.reduce((s, p) => s + Number(p.amount ?? 0), 0);
      this.completed = this.payments.filter(p => p.status === 'completed').reduce((s, p) => s + Number(p.amount ?? 0), 0);
      this.pending = this.payments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount ?? 0), 0);
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
