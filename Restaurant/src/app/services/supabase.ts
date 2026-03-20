import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  currentUser: any = null;

  constructor() {
    const supabaseUrl = 'https://eqhvkkoayaueizwpcqrt.supabase.co/';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxaHZra29heWF1ZWl6d3BjcXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDM0ODIsImV4cCI6MjA4OTU3OTQ4Mn0.0slh8y9kvvIkW8ZRsqB7ZABjc4wXTpBr4hLQdxE78PE';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // ── AUTH ──────────────────────────────────────────────────────

  async insertMember(userData: any) {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert([{
        id: crypto.randomUUID(),
        full_name: userData.fullname,
        phone_number: userData.phone,
        pin_code: userData.pin,
        email: userData.email || null
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async signIn(credentials: any) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('phone_number', credentials.username)
      .eq('pin_code', credentials.password)
      .single();
    if (error) throw error;
    this.currentUser = data;
    return data;
  }

  // ── MENUS ─────────────────────────────────────────────────────

  async getMenus() {
    const { data, error } = await this.supabase
      .from('menus')
      .select('*')
      .eq('is_available', true)
      .order('category');
    if (error) throw error;
    return data ?? [];
  }

  async getAllMenus() {
    const { data, error } = await this.supabase
      .from('menus')
      .select('*')
      .order('category');
    if (error) throw error;
    return data ?? [];
  }

  async createMenu(menuData: any) {
    const { error } = await this.supabase.from('menus').insert([menuData]);
    if (error) throw error;
  }

  async updateMenu(id: string, menuData: any) {
    const { error } = await this.supabase.from('menus').update(menuData).eq('id', id);
    if (error) throw error;
  }

  async deleteMenu(id: string) {
    const { error } = await this.supabase.from('menus').delete().eq('id', id);
    if (error) throw error;
  }

  // ── BOOKINGS ──────────────────────────────────────────────────

  async createBooking(bookingData: any) {
    const { error } = await this.supabase.from('bookings').insert([{
      profile_id: this.currentUser?.id ?? null,
      ...bookingData
    }]);
    if (error) throw error;
  }

  async getMyBookings() {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('profile_id', this.currentUser?.id)
      .order('booking_date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async getAllBookings(status?: string) {
    let query = this.supabase
      .from('bookings')
      .select('*, profiles(full_name, phone_number)')
      .order('booking_date', { ascending: false });
    if (status && status !== 'all') query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  async updateBookingStatus(id: string, status: string) {
    const { error } = await this.supabase.from('bookings').update({ status }).eq('id', id);
    if (error) throw error;
  }

  // ── ORDERS ────────────────────────────────────────────────────

  async getMyOrders() {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('profile_id', this.currentUser?.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async getAllOrders(status?: string) {
    let query = this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (status && status !== 'all') query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  async createOrder(orderData: { customer_name: string; table_number: string; items: any[]; total: number }) {
    const { error } = await this.supabase.from('orders').insert([{
      profile_id: this.currentUser?.id ?? null,
      status: 'pending',
      ...orderData
    }]);
    if (error) throw error;
  }

  async updateOrderStatus(id: string, status: string) {
    const { error } = await this.supabase.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
  }

  // ── PAYMENTS ──────────────────────────────────────────────────

  async getMyPayments() {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('customer_name', this.currentUser?.full_name)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async getAllPayments() {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async createPayment(paymentData: { customer_name: string; amount: number; method: string; status: string }) {
    const { error } = await this.supabase.from('payments').insert([paymentData]);
    if (error) throw error;
  }

  async updatePaymentStatus(id: string, status: string) {
    const { error } = await this.supabase.from('payments').update({ status }).eq('id', id);
    if (error) throw error;
  }

  async updatePaymentStatusByCustomer(customerName: string, fromStatus: string, toStatus: string) {
    const { error } = await this.supabase
      .from('payments')
      .update({ status: toStatus })
      .eq('customer_name', customerName)
      .eq('status', fromStatus);
    if (error) throw error;
  }
}
