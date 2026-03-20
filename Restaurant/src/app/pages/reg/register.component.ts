import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  isSuccess = false;

  user = {
    fullname: '',
    phone: '',
    memberType: ''
  };

  constructor(private supabaseService: SupabaseService) {}

  async onRegister() {
    try {
      if (this.user.fullname && this.user.phone) {

        // ✅ แก้ตรงนี้ (จาก insertMember → signUp)
        await this.supabaseService.signUp(this.user);

        this.isSuccess = true;
        console.log('บันทึกลง Supabase เรียบร้อย!');
      }

    } catch (err) {
      console.error('เกิดข้อผิดพลาด:', err);
      alert('บันทึกข้อมูลไม่สำเร็จ!');
    }
  }
}
//