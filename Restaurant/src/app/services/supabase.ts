import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const API_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  currentUser: any = null;

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('haruthai_user');
    if (stored) this.currentUser = JSON.parse(stored);
  }

  private get token(): string | null {
    return localStorage.getItem('haruthai_token');
  }

  private get authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
    });
  }

  private get<T>(path: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(`${API_URL}${path}`, { headers: this.authHeaders }));
  }

  private post<T>(path: string, body: any): Promise<T> {
    return firstValueFrom(this.http.post<T>(`${API_URL}${path}`, body, { headers: this.authHeaders }));
  }

  private patch<T>(path: string, body: any): Promise<T> {
    return firstValueFrom(this.http.patch<T>(`${API_URL}${path}`, body, { headers: this.authHeaders }));
  }

  private del<T>(path: string): Promise<T> {
    return firstValueFrom(this.http.delete<T>(`${API_URL}${path}`, { headers: this.authHeaders }));
  }

  // ── AUTH ──────────────────────────────────────────────────────

  async insertMember(userData: any) {
    return this.post('/auth/register', {
      fullname: userData.fullname,
      phone: userData.phone,
      pin: userData.pin,
      email: userData.email || null
    });
  }

  async signIn(credentials: any) {
    const res: any = await this.post('/auth/login', {
      phone: credentials.username,
      pin: credentials.password
    });
    this.currentUser = res.user;
    localStorage.setItem('haruthai_user', JSON.stringify(res.user));
    localStorage.setItem('haruthai_token', res.token);
    return res.user;
  }

  signOut() {
    this.currentUser = null;
    localStorage.removeItem('haruthai_user');
    localStorage.removeItem('haruthai_token');
  }

  // ── MENUS ─────────────────────────────────────────────────────

  async getMenus() {
    return this.get<any[]>('/menus?available=true');
  }

  async getAllMenus() {
    return this.get<any[]>('/menus');
  }

  async createMenu(menuData: any) {
    return this.post('/menus', menuData);
  }

  async updateMenu(id: string, menuData: any) {
    return this.patch(`/menus/${id}`, menuData);
  }

  async deleteMenu(id: string) {
    return this.del(`/menus/${id}`);
  }

  // ── BOOKINGS ──────────────────────────────────────────────────

  async createBooking(bookingData: any) {
    return this.post('/bookings', bookingData);
  }

  async getMyBookings() {
    return this.get<any[]>('/bookings/my');
  }

  async getAllBookings(status?: string) {
    const q = status && status !== 'all' ? `?status=${status}` : '';
    return this.get<any[]>(`/bookings${q}`);
  }

  async updateBookingStatus(id: string, status: string) {
    return this.patch(`/bookings/${id}/status`, { status });
  }

  // ── ORDERS ────────────────────────────────────────────────────

  async getMyOrders() {
    return this.get<any[]>('/orders/my');
  }

  async getAllOrders(status?: string) {
    const q = status && status !== 'all' ? `?status=${status}` : '';
    return this.get<any[]>(`/orders${q}`);
  }

  async createOrder(orderData: { customer_name: string; table_number: string; items: any[]; total: number }) {
    return this.post('/orders', orderData);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.patch(`/orders/${id}/status`, { status });
  }

  // ── PAYMENTS ──────────────────────────────────────────────────

  async getMyPayments() {
    return this.get<any[]>('/payments/my');
  }

  async getAllPayments() {
    return this.get<any[]>('/payments');
  }

  async createPayment(paymentData: { customer_name: string; amount: number; method: string; status: string }) {
    return this.post('/payments', paymentData);
  }

  async updatePaymentStatus(id: string, status: string) {
    return this.patch(`/payments/${id}/status`, { status });
  }

  async updatePaymentStatusByCustomer(customerName: string, fromStatus: string, toStatus: string) {
    return this.patch('/payments/by-customer', {
      customer_name: customerName,
      from_status: fromStatus,
      to_status: toStatus
    });
  }
}
