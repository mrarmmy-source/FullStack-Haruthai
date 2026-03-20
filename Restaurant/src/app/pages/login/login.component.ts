import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  currentRole: 'customer' | 'staff' = 'customer';
  loginData = {
    username: '',
    password: ''
  };

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  setRole(role: 'customer' | 'staff') {
    this.currentRole = role;
  }

  async handleLogin() {
    try {
      if (this.currentRole === 'staff') {
        if (this.loginData.username === 'admin' && this.loginData.password === '1234') {
          localStorage.setItem('haruthai_role', 'staff');
          this.router.navigate(['/home']);
        } else {
          alert("ชื่อผู้ใช้หรือรหัสผ่านพนักงานไม่ถูกต้อง");
        }
      } else {
        const user = await this.supabaseService.signIn(this.loginData);
        if (user) {
          localStorage.setItem('haruthai_role', 'customer');
          this.router.navigate(['/customer/home']);
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('ไม่พบข้อมูลผู้ใช้งาน หรือรหัสผ่าน PIN ไม่ถูกต้อง');
    }
  }
}