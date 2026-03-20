import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { StaffSidebarComponent } from '../../../components/staff-sidebar/staff-sidebar.component';

@Component({
  selector: 'app-booking-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffSidebarComponent],
  templateUrl: './booking-admin.component.html',
  styleUrls: ['./booking-admin.component.css']
})
export class BookingAdminComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  statusFilter = 'all';

  constructor(private supabaseService: SupabaseService, private router: Router) {}
  goBack(): void { this.router.navigate(['/home']); }

  async ngOnInit() { await this.load(); }

  async load() {
    this.loading = true;
    try { this.bookings = await this.supabaseService.getAllBookings(this.statusFilter); }
    catch (err) { console.error(err); }
    finally { this.loading = false; }
  }

  async updateStatus(id: string, status: string) {
    try { await this.supabaseService.updateBookingStatus(id, status); await this.load(); }
    catch (err: any) { alert('Error: ' + err?.message); }
  }
}
