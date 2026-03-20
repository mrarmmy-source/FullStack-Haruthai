import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-payment-customer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold mb-1">My Payments</h2>
      <p class="text-gray-500 mb-6">Your transaction history</p>

      <div *ngIf="loading" class="text-center py-10 text-gray-400">Loading...</div>

      <div *ngIf="!loading" class="overflow-x-auto bg-white rounded-xl shadow border">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th class="px-4 py-3 text-left">Transaction ID</th>
              <th class="px-4 py-3 text-left">Amount</th>
              <th class="px-4 py-3 text-left">Method</th>
              <th class="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of payments" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3 font-mono">{{ p.id?.substring(0,8) }}...</td>
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
              <td colspan="4" class="px-4 py-10 text-center text-gray-400">No payment history</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6">
        <a routerLink="/customer/home" class="text-blue-600 hover:underline">← กลับหน้าหลัก</a>
      </div>
    </div>
  `
})
export class PaymentCustomerComponent implements OnInit {
  payments: any[] = [];
  loading = true;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      this.payments = await this.supabaseService.getMyPayments();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
