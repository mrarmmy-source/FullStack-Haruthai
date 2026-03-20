import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-menu-customer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold mb-1">เมนูอาหาร</h2>
      <p class="text-gray-500 mb-6">อาหารไทยต้นตำรับแท้ๆ</p>

      <div *ngIf="loading" class="text-center py-10 text-gray-400">กำลังโหลด...</div>

      <!-- Category filter -->
      <div *ngIf="!loading" class="flex gap-2 flex-wrap mb-6">
        <button *ngFor="let cat of categories"
          (click)="selectedCategory = cat"
          [class]="selectedCategory === cat ? 'px-4 py-2 rounded-full bg-amber-600 text-white text-sm font-semibold' : 'px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm hover:bg-gray-200'">
          {{ cat }}
        </button>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let item of filteredMenus" class="bg-white rounded-xl shadow border overflow-hidden">
          <img *ngIf="item.image_url" [src]="item.image_url" [alt]="item.name" class="w-full h-44 object-cover">
          <div *ngIf="!item.image_url" class="w-full h-44 bg-amber-50 flex items-center justify-center text-5xl">🍜</div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-1">
              <h3 class="font-semibold text-gray-800">{{ item.name }}</h3>
              <span class="text-amber-600 font-bold">฿{{ item.price }}</span>
            </div>
            <p *ngIf="item.description" class="text-sm text-gray-500">{{ item.description }}</p>
            <span class="inline-block mt-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{{ item.category }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && filteredMenus.length === 0" class="text-center py-10 text-gray-400">ไม่มีเมนูในหมวดนี้</div>
    </div>
  `
})
export class MenuCustomerComponent implements OnInit {
  menus: any[] = [];
  loading = true;
  selectedCategory = 'ทั้งหมด';

  get categories(): string[] {
    const cats = [...new Set(this.menus.map(m => m.category).filter(Boolean))];
    return ['ทั้งหมด', ...cats];
  }

  get filteredMenus(): any[] {
    if (this.selectedCategory === 'ทั้งหมด') return this.menus;
    return this.menus.filter(m => m.category === this.selectedCategory);
  }

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      this.menus = await this.supabaseService.getMenus();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
