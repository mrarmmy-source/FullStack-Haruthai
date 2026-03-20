import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { StaffSidebarComponent } from '../../../components/staff-sidebar/staff-sidebar.component';

@Component({
  selector: 'app-menu-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffSidebarComponent],
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit {
  menus: any[] = [];
  loading = true;
  showForm = false;
  editing: any = null;
  saving = false;
  form = { name: '', price: 0, category: '', description: '', image_url: '', is_available: true };

  constructor(private supabaseService: SupabaseService, private router: Router) {}
  goBack(): void { this.router.navigate(['/home']); }

  async ngOnInit() { await this.load(); }

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
    } catch (err: any) { alert('Error: ' + err?.message); }
    finally { this.saving = false; }
  }

  async deleteMenu(id: string) {
    if (!confirm('Delete this menu item?')) return;
    try { await this.supabaseService.deleteMenu(id); await this.load(); }
    catch (err: any) { alert('Error: ' + err?.message); }
  }
}
