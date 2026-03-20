import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { CustomerSidebarComponent } from '../../../components/customer-sidebar/customer-sidebar.component';

@Component({
  selector: 'app-payment-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerSidebarComponent],
  templateUrl: './payment-customer.component.html',
  styleUrls: ['./payment-customer.component.css']
})
export class PaymentCustomerComponent implements OnInit {

  // ── Mode ────────────────────────────────────────────────────
  isCheckout = false;
  checkoutData: { amount: number; customerName: string; guests: number; date: string; time: string } | null = null;

  // ── Payment form ─────────────────────────────────────────────
  selectedMethod: 'cash' | 'card' | 'qr' = 'cash';
  card = { holder: '', number: '', expiry: '', cvv: '' };
  submitting = false;
  isSuccess = false;

  // ── History mode ─────────────────────────────────────────────
  payments: any[] = [];
  loading = true;

  constructor(private supabaseService: SupabaseService, public router: Router) {}

  ngOnInit() {
    const state = history.state as any;
    if (state?.checkout === true) {
      this.isCheckout = true;
      this.checkoutData = {
        amount:       state.amount,
        customerName: state.customerName,
        guests:       state.guests,
        date:         state.date,
        time:         state.time
      };
    } else {
      this.loadHistory();
    }
  }

  async loadHistory() {
    try {
      this.payments = await this.supabaseService.getMyPayments();
    } catch (err) { console.error(err); }
    finally { this.loading = false; }
  }

  // ── Card number formatter ────────────────────────────────────
  onCardNumberInput(e: Event) {
    const v = (e.target as HTMLInputElement).value.replace(/\D/g, '').substring(0, 16);
    this.card.number = v.replace(/(.{4})/g, '$1 ').trim();
  }

  onExpiryInput(e: Event) {
    let v = (e.target as HTMLInputElement).value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
    this.card.expiry = v;
  }

  get canSubmit(): boolean {
    if (this.selectedMethod === 'card') {
      return !!(this.card.holder && this.card.number.replace(/\s/g, '').length === 16
        && this.card.expiry.length === 5 && this.card.cvv.length >= 3);
    }
    return true;
  }

  async pay() {
    if (!this.checkoutData || !this.canSubmit) return;
    this.submitting = true;
    try {
      await this.supabaseService.createPayment({
        customer_name: this.checkoutData.customerName,
        amount:        this.checkoutData.amount,
        method:        this.selectedMethod,
        status:        'pending'
      });
      this.isSuccess = true;
    } catch (err: any) {
      alert('Payment error: ' + (err?.message || err));
    } finally {
      this.submitting = false;
    }
  }

  viewHistory() {
    this.isCheckout = false;
    this.isSuccess = false;
    this.loading = true;
    this.loadHistory();
  }
}
