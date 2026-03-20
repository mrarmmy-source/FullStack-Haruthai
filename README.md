# Ha-ru-thai Restaurant System
Restaurants Menus Dishes Customers Reservations Orders Payments Staff
1.นายชัยนันท์ ศรีนาค 116610905041-7
2.นายธนทัต สว่างพงษ์ 116610905044-1
3.นายกิตติพงค์ ศรีเมือง 116610905056-5
4.นายสกัลป์ ศรีสุข 116610905061-5
5.นายธัชพงศ์ แสงสี 116610905139-9
6.นายฆนัท กรมธรรมา 116610905108-4 


ระบบจัดการร้านอาหาร แบ่งเป็น 2 ฝั่ง — ลูกค้า และพนักงาน

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | Angular 18 (Standalone Components) |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |

---

## โครงสร้างโปรเจค

```
FullStack-Haruthai/
├── Restaurant/   → Angular Frontend (port 4200)
└── backend/      → Express API Server (port 3000)
```

---

## การทำงานของระบบ

```
Angular → HTTP → Express (localhost:3000) → Supabase (Cloud DB)
```

### ตาราง Database

| Table | เก็บข้อมูล |
|-------|-----------|
| `profiles` | ข้อมูลผู้ใช้ (ชื่อ, เบอร์โทร, PIN) |
| `menus` | รายการอาหาร |
| `bookings` | การจองโต๊ะ |
| `orders` | ออเดอร์อาหาร |
| `payments` | การชำระเงิน |

---

## API Endpoints

### Auth — ไม่ต้อง Token
| Method | Endpoint | การใช้งาน |
|--------|----------|----------|
| POST | `/api/auth/register` | สมัครสมาชิก |
| POST | `/api/auth/login` | เข้าสู่ระบบ → ได้รับ JWT Token |

### Menus
| Method | Endpoint | การใช้งาน |
|--------|----------|----------|
| GET | `/api/menus?available=true` | ดูเมนูที่เปิดขาย (Customer) |
| GET | `/api/menus` | ดูเมนูทั้งหมด (Staff) |
| POST | `/api/menus` | เพิ่มเมนู |
| PATCH | `/api/menus/:id` | แก้ไขเมนู |
| DELETE | `/api/menus/:id` | ลบเมนู |

### Bookings
| Method | Endpoint | การใช้งาน |
|--------|----------|----------|
| POST | `/api/bookings` | จองโต๊ะ |
| GET | `/api/bookings/my` | ดูการจองของตัวเอง |
| GET | `/api/bookings` | ดูการจองทั้งหมด (Staff) |
| PATCH | `/api/bookings/:id/status` | อนุมัติ/ปฏิเสธ (Staff) |

### Orders
| Method | Endpoint | การใช้งาน |
|--------|----------|----------|
| POST | `/api/orders` | สั่งอาหาร |
| GET | `/api/orders/my` | ดูออเดอร์ของตัวเอง |
| GET | `/api/orders?status=...` | ดูออเดอร์ทั้งหมด (Staff) |
| PATCH | `/api/orders/:id/status` | เปลี่ยนสถานะออเดอร์ (Staff) |

### Payments
| Method | Endpoint | การใช้งาน |
|--------|----------|----------|
| POST | `/api/payments` | สร้างรายการชำระเงิน |
| GET | `/api/payments/my` | ดูประวัติชำระเงินของตัวเอง |
| GET | `/api/payments` | ดูทั้งหมด (Staff) |
| PATCH | `/api/payments/:id/status` | อัปเดตสถานะ (Staff) |

> ทุก endpoint ยกเว้น Auth ต้องใส่ `Authorization: Bearer <token>` ใน Header

---

## สิทธิ์การใช้งาน

| ฟีเจอร์ | Customer | Staff |
|---------|----------|-------|
| ดูเมนู | ✅ | ✅ |
| จัดการเมนู | ❌ | ✅ |
| จองโต๊ะ / ดูประวัติ | ✅ (เฉพาะของตัวเอง) | ✅ (ทั้งหมด) |
| สั่งอาหาร / ดูออเดอร์ | ✅ (เฉพาะของตัวเอง) | ✅ (ทั้งหมด) |
| ชำระเงิน | ✅ | ✅ |
| เปลี่ยนสถานะ | ❌ | ✅ |

---

## วิธีรันโปรเจค

### Backend
```bash
cd backend
npm install
npm run dev       # รันพร้อม auto-restart (nodemon)
```

### Frontend
```bash
cd Restaurant
npm install
ng serve
```

> ต้องรัน **ทั้งคู่พร้อมกัน** จึงจะใช้งานได้ครบ

---

## การ Login

| Role | วิธี Login |
|------|-----------|
| Customer | สมัครสมาชิกด้วยเบอร์โทร + PIN |
| Staff | Username: `admin` / Password: `1234` |
