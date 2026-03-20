import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { CustomerSidebarComponent } from '../../../components/customer-sidebar/customer-sidebar.component';

@Component({
  selector: 'app-payment-customer',
  standalone: true,
  imports: [CommonModule, CustomerSidebarComponent],
  templateUrl: './payment-customer.component.html',
  styleUrls: ['./payment-customer.component.css']
})
export class PaymentCustomerComponent implements OnInit {
  payments: any[] = [];
  loading = true;

  constructor(private supabaseService: SupabaseService, private router: Router) {}
  goBack(): void { this.router.navigate(['/customer/home']); }

  async ngOnInit() {
    try {
      this.payments = await this.supabaseService.getMyPayments();
    } catch (err) { console.error(err); }
    finally { this.loading = false; }
  }
}
