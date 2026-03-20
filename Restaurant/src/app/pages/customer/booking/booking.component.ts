import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { CustomerSidebarComponent } from '../../../components/customer-sidebar/customer-sidebar.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerSidebarComponent],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  booking = { booking_date: '', booking_time: '', guests_count: 1, special_request: '' };
  loading = false;
  isSuccess = false;
  today = new Date().toISOString().split('T')[0];
  timeSlots = ['11:00','11:30','12:00','12:30','13:00','13:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00'];

  constructor(public router: Router, private supabaseService: SupabaseService) {}
  ngOnInit() {}
  goBack(): void { this.router.navigate(['/customer/home']); }

  async onSubmit() {
    if (!this.booking.booking_date || !this.booking.booking_time) return;
    this.loading = true;
    try {
      await this.supabaseService.createBooking(this.booking);
      this.isSuccess = true;
    } catch (err: any) {
      alert('Error: ' + (err?.message || err));
    } finally {
      this.loading = false;
    }
  }
}