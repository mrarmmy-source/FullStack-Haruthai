import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { StaffSidebarComponent } from '../../../components/staff-sidebar/staff-sidebar.component';

@Component({
  selector: 'app-payment-admin',
  standalone: true,
  imports: [CommonModule, StaffSidebarComponent],
  templateUrl: './payment-admin.component.html',
  styleUrls: ['./payment-admin.component.css']
})
export class PaymentAdminComponent implements OnInit {
  payments: any[] = [];
  loading = true;
  totalSales = 0;
  completed = 0;
  pending = 0;
  confirming: Set<string> = new Set();

  constructor(private supabaseService: SupabaseService, private router: Router) {}
  goBack(): void { this.router.navigate(['/home']); }

  async ngOnInit() {
    await this.loadPayments();
  }

  async loadPayments() {
    try {
      this.payments = await this.supabaseService.getAllPayments();
      this.recalcStats();
    } catch (err) { console.error(err); }
    finally { this.loading = false; }
  }

  recalcStats() {
    this.totalSales = this.payments.reduce((s, p) => s + Number(p.amount ?? 0), 0);
    this.completed  = this.payments.filter(p => p.status === 'completed').reduce((s, p) => s + Number(p.amount ?? 0), 0);
    this.pending    = this.payments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount ?? 0), 0);
  }

  async confirmPayment(payment: any) {
    this.confirming.add(payment.id);
    try {
      await this.supabaseService.updatePaymentStatus(payment.id, 'completed');
      const idx = this.payments.findIndex(p => p.id === payment.id);
      if (idx !== -1) this.payments[idx] = { ...this.payments[idx], status: 'completed' };
      this.recalcStats();
    } catch (err: any) {
      alert('Error: ' + (err?.message || err));
    } finally {
      this.confirming.delete(payment.id);
    }
  }
}
