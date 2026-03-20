import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // --- [1. ตั้งค่าการเชื่อมต่อ] ---
    // ใส่ URL และ Anon Key จาก Supabase Dashboard ของคุณที่นี่
    const supabaseUrl = 'https://eqhvkkoayaueizwpcqrt.supabase.co/'; 
    const supabaseKey = 'sb_publishable_e4k0MIH-h2vhxZMvCoyUyA_5vWIfBOf';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // --- [2. ฟังก์ชันสมัครสมาชิก (Insert)] ---
  async insertMember(userData: any) {
    const { data, error } = await this.supabase
      .from('profiles') // ชื่อ Table ตามรูปของคุณ
      .insert([
        { 
          full_name: userData.fullname,    // ตรงกับ Column full_name
          phone_number: userData.phone,   // ตรงกับ Column phone_number
          pin_code: userData.pin,         // ตรงกับ Column pin_code (รหัสผ่าน)
          email: userData.email,          // ตรงกับ Column email
          birthday: userData.birthday     // ตรงกับ Column birthday
        }
      ]);

    if (error) {
      console.error('Error Inserting:', error.message);
      throw error;
    }
    return data;
  }

  // --- [3. ฟังก์ชันเข้าสู่ระบบ (Select / Sign In)] ---
  async signIn(credentials: any) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('phone_number', credentials.username) // ใช้เบอร์โทรเป็น Username
      .eq('pin_code', credentials.password)     // ใช้ PIN เป็น Password
      .single(); // ดึงข้อมูลแถวเดียวที่ตรงเงื่อนไข

    if (error) {
      console.error('Login Error:', error.message);
      throw error; // ส่ง Error ไปให้หน้า Login จัดการต่อ (เช่น แจ้งเตือนรหัสผิด)
    }
    return data; // ส่งข้อมูล User กลับไปที่ Component
  }

  // --- [4. ฟังก์ชันดึงข้อมูลโปรไฟล์ (Optional)] ---
  // เอาไว้ดึงข้อมูล User ปัจจุบันมาโชว์ในหน้า Home
  async getProfile(phone: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('phone_number', phone)
      .single();

    if (error) throw error;
    return data;
  }
}