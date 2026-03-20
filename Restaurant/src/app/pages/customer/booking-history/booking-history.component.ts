import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { CustomerSidebarComponent } from '../../../components/customer-sidebar/customer-sidebar.component';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, CustomerSidebarComponent],
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];
  loading = true;

  constructor(private supabaseService: SupabaseService, private router: Router) {}
  goBack(): void { this.router.navigate(['/customer/home']); }
  goReserve(): void { this.router.navigate(['/customer/reservations']); }

  async ngOnInit() {
    try {
      this.bookings = await this.supabaseService.getMyBookings();
    } catch (err) { console.error(err); }
    finally { this.loading = false; }
  }
}
