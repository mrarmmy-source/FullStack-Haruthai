import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';   
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
   standalone: true, 
    imports: [CommonModule, FormsModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  title = 'สมัครสมาชิก';
  isSuccess = false;
  memberOptions = ['สมาชิกทั่วไป', 'staff'];
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
        await this.supabaseService.insertMember(this.user);

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