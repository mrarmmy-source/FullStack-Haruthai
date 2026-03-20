import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Slide {
  image: string;
  alt: string;
}

interface NavItem {
  label: string;
  icon: string;
  path: string;
  active: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-s.component.html',
  styleUrls: ['./home-s.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {

  // ── Sidebar ───────────────────────────────────────────────────
  sidebarOpen = window.innerWidth >= 1024;

  // ── Slideshow ─────────────────────────────────────────────────
  currentSlide = 0;
  private slideInterval: ReturnType<typeof setInterval> | null = null;

  slides: Slide[] = [
    { image: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=1920&q=80', alt: 'Thai curry dish' },
    { image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=1920&q=80', alt: 'Pad Thai noodles' },
    { image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1920&q=80', alt: 'Fresh salad' },
    { image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1920&q=80', alt: 'Thai soup' },
    { image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&q=80', alt: 'Gourmet dish' },
  ];

  // ── Navigation ────────────────────────────────────────────────
  navItems: NavItem[] = [
    { label: 'ร้านอาหาร', active: true, path: '/home',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'เมนู', active: false, path: '/staff/menu',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { label: 'การจองโต๊ะ', active: false, path: '/staff/bookings',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'คำสั่งซื้อ', active: false, path: '/staff/orders',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'การชำระเงิน', active: false, path: '/staff/payments',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  ];

  constructor(private router: Router) {}

  // ── Lifecycle ─────────────────────────────────────────────────
  ngOnInit(): void {
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  // ── Slideshow ─────────────────────────────────────────────────
  goToSlide(index: number): void {
    this.currentSlide = index;
    this.startSlideshow();
  }

  private startSlideshow(): void {
    this.stopSlideshow();
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 5000);
  }

  private stopSlideshow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  // ── Sidebar ───────────────────────────────────────────────────
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onNavClick(event: Event, item: NavItem): void {
    event.preventDefault();
    this.navItems.forEach(n => (n.active = false));
    item.active = true;
    if (window.innerWidth < 1024) this.sidebarOpen = false;
    this.router.navigate([item.path]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (window.innerWidth >= 1024) return;
    const sidebar = document.querySelector('.sidebar');
    const toggle  = document.querySelector('.mobile-toggle');
    if (
      sidebar && toggle &&
      !sidebar.contains(event.target as Node) &&
      !toggle.contains(event.target as Node) &&
      this.sidebarOpen
    ) {
      this.sidebarOpen = false;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 1024) {
      this.sidebarOpen = true;
    }
  }
}