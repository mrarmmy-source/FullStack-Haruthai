import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-1">ประวัติการจอง</h2>
      <p class="text-gray-500 mb-6">รายการจองโต๊ะของคุณ</p>

      <div *ngIf="loading" class="text-center py-10 text-gray-400">กำลังโหลด...</div>

      <div class="space-y-4" *ngIf="!loading">
        <div *ngFor="let b of bookings" class="bg-white rounded-xl shadow border p-4 flex justify-between items-center">
          <div>
            <p class="font-semibold text-gray-800">📅 {{ b.booking_date }} เวลา {{ b.booking_time }}</p>
            <p class="text-sm text-gray-500 mt-1">👥 {{ b.guests_count }} คน</p>
            <p *ngIf="b.special_request" class="text-sm text-gray-400 mt-1">📝 {{ b.special_request }}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-semibold"
            [ngClass]="{
              'bg-yellow-100 text-yellow-700': b.status === 'pending',
              'bg-green-100 text-green-700': b.status === 'confirmed',
              'bg-red-100 text-red-700': b.status === 'cancelled'
            }">{{ b.status }}</span>
        </div>

        <div *ngIf="bookings.length === 0" class="text-center py-10 text-gray-400">
          <p class="mb-4">ยังไม่มีประวัติการจอง</p>
          <a routerLink="/customer/reservations" class="text-amber-600 font-semibold hover:underline">จองโต๊ะเลย →</a>
        </div>
      </div>
    </div>
  `
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];
  loading = true;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      this.bookings = await this.supabaseService.getMyBookings();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
