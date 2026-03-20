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

  constructor(private supabaseService: SupabaseService, private router: Router) {}
  goBack(): void { this.router.navigate(['/home']); }

  async ngOnInit() {
    try {
      this.payments = await this.supabaseService.getAllPayments();
      this.totalSales = this.payments.reduce((s, p) => s + Number(p.amount ?? 0), 0);
      this.completed = this.payments.filter(p => p.status === 'completed').reduce((s, p) => s + Number(p.amount ?? 0), 0);
      this.pending = this.payments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount ?? 0), 0);
    } catch (err) { console.error(err); }
    finally { this.loading = false; }
  }
}
