import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // ใส่ URL และ Key จริงจาก Supabase Dashboard ตรงนี้
    const supabaseUrl = 'https://eqhvkkoayaueizwpcqrt.supabase.co/'; 
    const supabaseKey = 'sb_publishable_e4k0MIH-h2vhxZMvCoyUyA_5vWIfBOf';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // สมัครสมาชิก (Insert ลงตาราง profiles)
  async insertMember(userData: any) {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert([
        { 
          full_name: userData.fullname,
          phone_number: userData.phone,
          pin_code: userData.pin,
          email: userData.email,
          birthday: userData.birthday
        }
      ]);

    if (error) {
      console.error('Error Inserting:', error.message);
      throw error;
    }
    return data;
  }

  // เข้าสู่ระบบ (Select จากตาราง profiles)
  async signIn(credentials: any) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('phone_number', credentials.username)
      .eq('pin_code', credentials.password)
      .single();

    if (error) {
      console.error('Login Error:', error.message);
      throw error;
    }
    return data;
  }
}