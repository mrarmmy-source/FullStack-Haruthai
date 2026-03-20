import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <h2 class="text-2xl font-bold text-gray-800 mb-1">จองโต๊ะอาหาร</h2>
        <p class="text-gray-500 text-sm mb-6">กรอกข้อมูลเพื่อจองโต๊ะ</p>

        <div *ngIf="isSuccess" class="text-center py-6">
          <div class="text-5xl mb-4">✅</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">จองโต๊ะสำเร็จ!</h3>
          <p class="text-gray-500 mb-6">เราจะติดต่อกลับเพื่อยืนยันการจอง</p>
          <button (click)="router.navigate(['/customer/home'])" class="btn-primary">กลับหน้าหลัก</button>
        </div>

        <form *ngIf="!isSuccess" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>วันที่จอง</label>
            <input type="date" [(ngModel)]="booking.booking_date" name="date" [min]="today" required class="input-field">
          </div>

          <div class="form-group">
            <label>เวลา</label>
            <select [(ngModel)]="booking.booking_time" name="time" required class="input-field">
              <option value="">เลือกเวลา</option>
              <option *ngFor="let t of timeSlots" [value]="t">{{ t }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>จำนวนผู้เข้าร่วม</label>
            <input type="number" [(ngModel)]="booking.guests_count" name="guests" min="1" max="20" required class="input-field">
          </div>

          <div class="form-group">
            <label>หมายเหตุ (ถ้ามี)</label>
            <textarea [(ngModel)]="booking.special_request" name="note" rows="3" class="input-field" placeholder="เช่น ต้องการที่นั่งริมหน้าต่าง"></textarea>
          </div>

          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'กำลังจอง...' : 'ยืนยันการจอง' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #444; margin-bottom: 6px; }
    .input-field { width: 100%; padding: 10px 14px; border: 1.5px solid #ddd; border-radius: 10px; font-size: 0.95rem; outline: none; box-sizing: border-box; }
    .input-field:focus { border-color: #d97706; }
    .btn-primary { width: 100%; padding: 13px; background: #d97706; color: white; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; }
    .btn-primary:hover:not(:disabled) { background: #b45309; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class BookingComponent implements OnInit {
  booking = { booking_date: '', booking_time: '', guests_count: 1, special_request: '' };
  loading = false;
  isSuccess = false;
  today = new Date().toISOString().split('T')[0];

  timeSlots = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];

  constructor(public router: Router, private supabaseService: SupabaseService) {}

  ngOnInit() {}

  async onSubmit() {
    if (!this.booking.booking_date || !this.booking.booking_time) return;
    this.loading = true;
    try {
      await this.supabaseService.createBooking(this.booking);
      this.isSuccess = true;
    } catch (err: any) {
      alert('เกิดข้อผิดพลาด: ' + (err?.message || err));
    } finally {
      this.loading = false;
    }
  }
}
