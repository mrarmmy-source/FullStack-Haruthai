import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <div class="w-20 h-20 rounded-full bg-amber-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
          {{ initial }}
        </div>
        <h2 class="text-xl font-bold text-gray-800">{{ user?.full_name }}</h2>
        <p class="text-gray-500 text-sm mt-1">📱 {{ user?.phone_number }}</p>
        <span class="inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700">
          {{ user?.member_type || 'Silver' }} Member
        </span>

        <div class="mt-8 text-left border-t pt-6 space-y-3">
          <p class="text-sm text-gray-500">สมัครสมาชิกเมื่อ</p>
          <p class="font-medium">{{ user?.created_at | date:'dd MMM yyyy' }}</p>
        </div>

        <button (click)="logout()" class="mt-8 w-full py-3 rounded-xl border-2 border-red-400 text-red-500 font-semibold hover:bg-red-50">
          ออกจากระบบ
        </button>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: any = null;

  get initial(): string {
    return this.user?.full_name?.charAt(0) ?? '?';
  }

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  ngOnInit() {
    this.user = this.supabaseService.currentUser;
    if (!this.user) this.router.navigate(['/login']);
  }

  logout() {
    this.supabaseService.currentUser = null;
    this.router.navigate(['/login']);
  }
}
