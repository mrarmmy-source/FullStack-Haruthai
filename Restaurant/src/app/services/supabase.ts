import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // ใส่ URL และ Key ที่ได้จากหน้าเว็บ Supabase
    const supabaseUrl = 'https://eqhvkkoayaueizwpcqrt.supabase.co/';
    const supabaseKey = 'sb_publishable_e4k0MIH-h2vhxZMvCoyUyA_5vWIfBOf';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // ฟังก์ชันสมัครสมาชิก
  async signUp(user: any) {
    const { data, error } = await this.supabase
      .from('members') // ชื่อตาราง
      .insert([
        { 
          fullname: user.fullname, 
          phone: user.phone, 
          member_type: user.memberType 
        }
      ]);

    if (error) throw error;
    return data;
  }
}