import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { CustomerSidebarComponent } from '../../../components/customer-sidebar/customer-sidebar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, CustomerSidebarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  get initial(): string { return this.user?.full_name?.charAt(0)?.toUpperCase() ?? '?'; }

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  ngOnInit() {
    this.user = this.supabaseService.currentUser;
    if (!this.user) this.router.navigate(['/login']);
  }

  goBack(): void { this.router.navigate(['/customer/home']); }

  logout() {
    this.supabaseService.currentUser = null;
    this.router.navigate(['/login']);
  }
}
