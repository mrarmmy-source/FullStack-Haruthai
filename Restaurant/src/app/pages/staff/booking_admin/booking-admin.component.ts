import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-booking-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold mb-1">การจองโต๊ะ</h2>
      <p class="text-gray-500 mb-6">จัดการการจองโต๊ะทั้งหมด</p>

      <div class="flex gap-3 mb-6">
        <select [(ngModel)]="statusFilter" (change)="load()" class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
          <option value="all">ทุกสถานะ</option>
          <option value="pending">รอยืนยัน</option>
          <option value="confirmed">ยืนยันแล้ว</option>
          <option value="cancelled">ยกเลิก</option>
        </select>
      </div>

      <div *ngIf="loading" class="text-center py-10 text-gray-400">กำลังโหลด...</div>

      <div class="space-y-3" *ngIf="!loading">
        <div *ngFor="let b of bookings" class="bg-white rounded-xl shadow border p-4 flex justify-between items-center">
          <div>
            <p class="font-semibold">{{ b.profiles?.full_name || 'ลูกค้า' }}</p>
            <p class="text-sm text-gray-500 mt-1">📅 {{ b.booking_date }} เวลา {{ b.booking_time }}</p>
            <p class="text-sm text-gray-500">👥 {{ b.guests_count }} คน <span *ngIf="b.table_number">| โต๊ะ {{ b.table_number }}</span></p>
            <p *ngIf="b.special_request" class="text-sm text-gray-400 mt-1">📝 {{ b.special_request }}</p>
          </div>
          <div class="flex flex-col gap-2 items-end">
            <span class="px-3 py-1 rounded-full text-xs font-semibold"
              [ngClass]="{
                'bg-yellow-100 text-yellow-700': b.status === 'pending',
                'bg-green-100 text-green-700': b.status === 'confirmed',
                'bg-red-100 text-red-700': b.status === 'cancelled'
              }">{{ b.status }}</span>
            <div class="flex gap-1" *ngIf="b.status === 'pending'">
              <button (click)="updateStatus(b.id, 'confirmed')" class="text-xs bg-green-500 text-white px-2 py-1 rounded-lg">ยืนยัน</button>
              <button (click)="updateStatus(b.id, 'cancelled')" class="text-xs bg-red-400 text-white px-2 py-1 rounded-lg">ยกเลิก</button>
            </div>
          </div>
        </div>
        <div *ngIf="bookings.length === 0" class="text-center py-10 text-gray-400">ไม่มีการจอง</div>
      </div>
    </div>
  `
})
export class BookingAdminComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  statusFilter = 'all';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() { await this.load(); }

  async load() {
    this.loading = true;
    try { this.bookings = await this.supabaseService.getAllBookings(this.statusFilter); }
    catch (err) { console.error(err); }
    finally { this.loading = false; }
  }

  async updateStatus(id: string, status: string) {
    try { await this.supabaseService.updateBookingStatus(id, status); await this.load(); }
    catch (err: any) { alert('เกิดข้อผิดพลาด: ' + err?.message); }
  }
}
