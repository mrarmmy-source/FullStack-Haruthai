import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  title = 'Register';
  isSuccess = false;
  submitted = false;
  loading = false;

  user = {
    fullname: '',
    phone: '',
    pin: '',
    email: ''
  };

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async onRegister() {
    this.submitted = true;
    if (!this.user.fullname || !this.user.phone || !this.user.pin) return;
    this.loading = true;
    try {
      const data = await this.supabaseService.insertMember(this.user);
      this.supabaseService.currentUser = { full_name: this.user.fullname, phone_number: this.user.phone };
      this.router.navigate(['/customer/home']);
    } catch (err: any) {
      console.error('เกิดข้อผิดพลาด:', err);
      alert('บันทึกข้อมูลไม่สำเร็จ!\n\nError: ' + (err?.message || JSON.stringify(err)));
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
//