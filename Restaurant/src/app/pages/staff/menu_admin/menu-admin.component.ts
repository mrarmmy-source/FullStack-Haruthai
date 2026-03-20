import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-menu-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold">จัดการเมนู</h2>
          <p class="text-gray-500 text-sm">เพิ่ม แก้ไข หรือลบรายการอาหาร</p>
        </div>
        <button (click)="openForm()" class="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700">+ เพิ่มเมนู</button>
      </div>

      <!-- Form Modal -->
      <div *ngIf="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 class="text-lg font-bold mb-4">{{ editing ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่' }}</h3>
          <div class="space-y-3">
            <input [(ngModel)]="form.name" placeholder="ชื่อเมนู" class="input-field">
            <input [(ngModel)]="form.price" type="number" placeholder="ราคา (บาท)" class="input-field">
            <input [(ngModel)]="form.category" placeholder="หมวดหมู่ เช่น อาหารจานหลัก, เครื่องดื่ม" class="input-field">
            <textarea [(ngModel)]="form.description" placeholder="รายละเอียด" rows="3" class="input-field"></textarea>
            <input [(ngModel)]="form.image_url" placeholder="URL รูปภาพ (ถ้ามี)" class="input-field">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" [(ngModel)]="form.is_available"> มีจำหน่าย
            </label>
          </div>
          <div class="flex gap-3 mt-5">
            <button (click)="saveMenu()" class="flex-1 bg-amber-600 text-white py-2 rounded-lg font-semibold" [disabled]="saving">
              {{ saving ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
            <button (click)="showForm = false" class="flex-1 border py-2 rounded-lg font-semibold">ยกเลิก</button>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-10 text-gray-400">กำลังโหลด...</div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let item of menus" class="bg-white rounded-xl shadow border overflow-hidden">
          <img *ngIf="item.image_url" [src]="item.image_url" [alt]="item.name" class="w-full h-36 object-cover">
          <div *ngIf="!item.image_url" class="w-full h-36 bg-amber-50 flex items-center justify-center text-4xl">🍜</div>
          <div class="p-4">
            <div class="flex justify-between items-start">
              <h3 class="font-semibold">{{ item.name }}</h3>
              <span class="text-amber-600 font-bold">฿{{ item.price }}</span>
            </div>
            <p class="text-xs text-gray-400 mt-1">{{ item.category }}</p>
            <span class="text-xs mt-1 inline-block px-2 py-0.5 rounded-full"
              [ngClass]="item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'">
              {{ item.is_available ? 'มีจำหน่าย' : 'หมด' }}
            </span>
            <div class="flex gap-2 mt-3">
              <button (click)="openForm(item)" class="flex-1 text-sm border border-amber-400 text-amber-600 py-1 rounded-lg hover:bg-amber-50">แก้ไข</button>
              <button (click)="deleteMenu(item.id)" class="flex-1 text-sm border border-red-300 text-red-500 py-1 rounded-lg hover:bg-red-50">ลบ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.input-field { width: 100%; padding: 10px 12px; border: 1.5px solid #ddd; border-radius: 8px; outline: none; font-size: 0.9rem; box-sizing: border-box; }`]
})
export class MenuAdminComponent implements OnInit {
  menus: any[] = [];
  loading = true;
  showForm = false;
  editing: any = null;
  saving = false;

  form = { name: '', price: 0, category: '', description: '', image_url: '', is_available: true };

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    try { this.menus = await this.supabaseService.getAllMenus(); }
    catch (err) { console.error(err); }
    finally { this.loading = false; }
  }

  openForm(item?: any) {
    this.editing = item || null;
    this.form = item
      ? { name: item.name, price: item.price, category: item.category, description: item.description || '', image_url: item.image_url || '', is_available: item.is_available }
      : { name: '', price: 0, category: '', description: '', image_url: '', is_available: true };
    this.showForm = true;
  }

  async saveMenu() {
    this.saving = true;
    try {
      if (this.editing) await this.supabaseService.updateMenu(this.editing.id, this.form);
      else await this.supabaseService.createMenu(this.form);
      this.showForm = false;
      await this.load();
    } catch (err: any) { alert('เกิดข้อผิดพลาด: ' + err?.message); }
    finally { this.saving = false; }
  }

  async deleteMenu(id: string) {
    if (!confirm('ต้องการลบเมนูนี้?')) return;
    try { await this.supabaseService.deleteMenu(id); await this.load(); }
    catch (err: any) { alert('เกิดข้อผิดพลาด: ' + err?.message); }
  }
}
