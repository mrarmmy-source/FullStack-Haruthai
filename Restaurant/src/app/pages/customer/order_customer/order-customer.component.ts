import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { CustomerSidebarComponent } from '../../../components/customer-sidebar/customer-sidebar.component';

@Component({
  selector: 'app-order-customer',
  standalone: true,
  imports: [CommonModule, CustomerSidebarComponent],
  templateUrl: './order-customer.component.html',
  styleUrls: ['./order-customer.component.css']
})
export class OrderCustomerComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private supabaseService: SupabaseService, private router: Router) {}
  goBack(): void { this.router.navigate(['/customer/home']); }

  async ngOnInit() {
    try {
      this.orders = await this.supabaseService.getMyOrders();
    } catch (err) { console.error(err); }
    finally { this.loading = false; }
  }
}
