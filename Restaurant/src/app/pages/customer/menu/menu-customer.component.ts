import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { CustomerSidebarComponent } from '../../../components/customer-sidebar/customer-sidebar.component';

interface CartItem { id: string; name: string; price: number; qty: number; }

@Component({
  selector: 'app-menu-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerSidebarComponent],
  templateUrl: './menu-customer.component.html',
  styleUrls: ['./menu-customer.component.css']
})
export class MenuCustomerComponent implements OnInit {
  menus: any[] = [];
  loading = true;
  selectedCategory = 'All';

  cart: CartItem[] = [];
  cartOpen = false;
  tableNumber = '';
  placingOrder = false;
  orderSuccess = false;

  get categories(): string[] {
    const cats = [...new Set(this.menus.map(m => m.category).filter(Boolean))];
    return ['All', ...cats];
  }

  get filteredMenus(): any[] {
    if (this.selectedCategory === 'All') return this.menus;
    return this.menus.filter(m => m.category === this.selectedCategory);
  }

  get cartCount(): number { return this.cart.reduce((s, i) => s + i.qty, 0); }
  get cartTotal(): number { return this.cart.reduce((s, i) => s + i.price * i.qty, 0); }

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async ngOnInit() {
    try {
      this.menus = await this.supabaseService.getMenus();
    } catch (err) { console.error(err); }
    finally { this.loading = false; }
  }

  getQtyInCart(id: string): number { return this.cart.find(i => i.id === id)?.qty ?? 0; }

  addToCart(item: any) {
    const existing = this.cart.find(i => i.id === item.id);
    if (existing) { existing.qty++; }
    else { this.cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 }); }
  }

  changeQty(id: string, delta: number) {
    const idx = this.cart.findIndex(i => i.id === id);
    if (idx === -1) return;
    this.cart[idx].qty += delta;
    if (this.cart[idx].qty <= 0) this.cart.splice(idx, 1);
  }

  async placeOrder() {
    if (!this.tableNumber.trim() || this.cart.length === 0) return;
    this.placingOrder = true;
    try {
      await this.supabaseService.createOrder({
        customer_name: this.supabaseService.currentUser?.full_name ?? 'Guest',
        table_number: this.tableNumber.trim(),
        items: this.cart.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
        total: this.cartTotal
      });
      this.cart = [];
      this.tableNumber = '';
      this.orderSuccess = true;
    } catch (err: any) {
      alert('Error: ' + (err?.message || err));
    } finally {
      this.placingOrder = false;
    }
  }

  closeSuccess() {
    this.orderSuccess = false;
    this.cartOpen = false;
    this.router.navigate(['/customer/orders']);
  }
}
