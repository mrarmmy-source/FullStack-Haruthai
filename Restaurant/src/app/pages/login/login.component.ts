import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase'; // เช็ค Path ให้ถูกนะครับ

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // สร้างตัวแปรเก็บสถานะ Role และข้อมูลฟอร์ม
  currentRole: 'customer' | 'staff' = 'customer';
  loginData = {
    username: '', // สำหรับลูกค้าคือ phone_number, สำหรับพนักงานคือ admin
    password: ''  // สำหรับลูกค้าคือ pin_code, สำหรับพนักงานคือ 1234
  };

  constructor(private supabaseService: SupabaseService) {}

  // ฟังก์ชันสลับ Role (Event Binding)
  setRole(role: 'customer' | 'staff') {
    this.currentRole = role;
  }

  // ฟังก์ชันจัดการการ Login
  async handleLogin() {
    try {
      if (this.currentRole === 'staff') {
        // --- Mock Admin Login ---
        if (this.loginData.username === 'admin' && this.loginData.password === '1234') {
          alert("เข้าสู่ระบบในฐานะพนักงานสำเร็จ!");
        } else {
          alert("ชื่อผู้ใช้หรือรหัสผ่านพนักงานไม่ถูกต้อง");
        }
      } else {
        // --- Supabase Customer Login ---
        // เรียกใช้ฟังก์ชัน signIn ที่เราเขียนไว้ใน Service
        const user = await this.supabaseService.signIn(this.loginData);
        
        if (user) {
          alert(`ยินดีต้อนรับคุณ ${user.full_name} (ลูกค้า)`);
          // ตรงนี้คุณสามารถใช้ Router เพื่อย้ายหน้าไป Dashboard ได้
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('ไม่พบข้อมูลผู้ใช้งาน หรือรหัสผ่าน PIN ไม่ถูกต้อง');
    }
  }
}