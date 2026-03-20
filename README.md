# Ha-ru-thai Restaurant System

ระบบจัดการร้านอาหาร แบ่งเป็น 2 ฝั่ง — ลูกค้า และพนักงาน

**สมาชิกกลุ่ม**
1. นายชัยนันท์ ศรีนาค 116610905041-7
2. นายธนทัต สว่างพงษ์ 116610905044-1
3. นายกิตติพงค์ ศรีเมือง 116610905056-5
4. นายสกัลป์ ศรีสุข 116610905061-5
5. นายธัชพงศ์ แสงสี 116610905139-9
6. นายฆนัท กรมธรรมา 116610905108-4

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | Angular 18 (Standalone Components) |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |

---

## Architecture

```
Angular (port 4200)
    │
    │  HTTP + Bearer Token
    ▼
Express API Server (port 3000)
    │
    │  Supabase Admin Client (bypass RLS)
    ▼
Supabase Cloud Database (PostgreSQL)
```

---

## โครงสร้างโปรเจค

```
FullStack-Haruthai/
├── Restaurant/              → Angular Frontend
│   └── src/app/
│       ├── guards/          → Route Guards (auth, role)
│       ├── services/        → SupabaseService (HTTP wrapper)
│       └── pages/
│           ├── customer/    → หน้า Customer
│           └── staff/       → หน้า Staff (Admin)
└── backend/
    ├── controllers/         → Logic ของแต่ละ resource
    ├── routes/              → Express Router
    ├── middleware/          → Auth Middleware (JWT verify)
    └── config/              → Supabase Admin Client
```

---

## ระบบ Authentication & Authorization

### เทคนิคที่ใช้

#### 1. JWT (JSON Web Token)
- หลัง login สำเร็จ backend จะ sign token ด้วย `jsonwebtoken`
- Payload ที่เก็บใน token: `{ id, full_name, phone_number }`
- Token มีอายุ **7 วัน**
- Frontend เก็บ token ใน `localStorage` ชื่อ `haruthai_token`

```js
// backend/controllers/auth.controller.js
const token = jwt.sign(
  { id: data.id, full_name: data.full_name, phone_number: data.phone_number },
  JWT_SECRET,
  { expiresIn: '7d' }
);
```

#### 2. Auth Middleware (JWT Verify)
- ทุก request ที่ต้องการ auth จะผ่าน `authMiddleware`
- ตรวจสอบ `Authorization: Bearer <token>` ใน header
- ถ้า token ถูกต้อง → decode แล้วใส่ใน `req.user`
- ถ้าไม่มีหรือ token หมดอายุ → ตอบกลับ `401 Unauthorized`

```js
// backend/middleware/auth.middleware.js
req.user = jwt.verify(token, JWT_SECRET);
```

#### 3. Role-Based Access Control (RBAC)

**Backend** — Customer/Staff ใช้ endpoint คนละชุด:
- `/api/bookings/my` → คืนเฉพาะข้อมูลของ user นั้น (filter ด้วย `profile_id`)
- `/api/bookings` → คืนทุก record (สำหรับ Staff)

**Frontend** — Angular Route Guard:
- `customerGuard` → ถ้า role ≠ `customer` redirect ไป `/home`
- `staffGuard` → ถ้า role ≠ `staff` redirect ไป `/customer/home`
- Role ถูกเก็บใน `localStorage` ชื่อ `haruthai_role` หลัง login

```ts
// Restaurant/src/app/guards/role.guard.ts
const role = localStorage.getItem('haruthai_role');
if (role !== 'customer') { router.navigate(['/home']); return false; }
```

#### 4. Data Isolation (User-Level Security)
- Bookings/Orders: filter ด้วย `profile_id = req.user.id` (UUID)
- Payments: filter ด้วย `profile_id = req.user.id` (UUID)
- ใช้ `supabaseAdmin` client ที่ bypass RLS ดังนั้น backend ต้องรับผิดชอบ filter เองทุกครั้ง

#### 5. Staff Authentication
- Staff ใช้ hardcoded credential (`admin` / `1234`) ไม่ผ่าน database
- ไม่มี JWT token สำหรับ Staff — ใช้ `haruthai_role = 'staff'` ใน localStorage แทน

---

## ตาราง Database

| Table | เก็บข้อมูล | หมายเหตุ |
|-------|-----------|---------|
| `profiles` | ชื่อ, เบอร์โทร, PIN, email | UUID เป็น PK |
| `menus` | ชื่ออาหาร, ราคา, หมวดหมู่, สถานะ | |
| `bookings` | การจองโต๊ะ | มี `profile_id` FK |
| `orders` | ออเดอร์อาหาร | มี `profile_id` FK |
| `payments` | การชำระเงิน | มี `profile_id` FK |

> **หมายเหตุ:** ต้องรัน SQL นี้ใน Supabase ก่อนใช้งาน payments:
> ```sql
> ALTER TABLE payments ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES profiles(id);
> ```

---

## API Endpoints

> ทุก endpoint ยกเว้น Auth ต้องใส่ `Authorization: Bearer <token>` ใน Header

### Auth
| Method | Endpoint | การใช้งาน | Auth |
|--------|----------|----------|------|
| POST | `/api/auth/register` | สมัครสมาชิก | ไม่ต้อง |
| POST | `/api/auth/login` | เข้าสู่ระบบ → ได้ JWT Token | ไม่ต้อง |

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
| GET | `/api/bookings/my` | ดูการจองของตัวเอง (Customer) |
| GET | `/api/bookings` | ดูการจองทั้งหมด (Staff) |
| PATCH | `/api/bookings/:id/status` | อนุมัติ/ปฏิเสธ (Staff) |

### Orders
| Method | Endpoint | การใช้งาน |
|--------|----------|----------|
| POST | `/api/orders` | สั่งอาหาร |
| GET | `/api/orders/my` | ดูออเดอร์ของตัวเอง (Customer) |
| GET | `/api/orders?status=...` | ดูออเดอร์ทั้งหมด (Staff) |
| PATCH | `/api/orders/:id/status` | เปลี่ยนสถานะออเดอร์ (Staff) |

### Payments
| Method | Endpoint | การใช้งาน |
|--------|----------|----------|
| POST | `/api/payments` | สร้างรายการชำระเงิน |
| GET | `/api/payments/my` | ดูประวัติชำระเงินของตัวเอง (Customer) |
| GET | `/api/payments` | ดูทั้งหมด (Staff) |
| PATCH | `/api/payments/:id/status` | อัปเดตสถานะ (Staff) |
| PATCH | `/api/payments/by-customer` | Customer ยืนยันชำระเงิน |

---

## สิทธิ์การใช้งาน

| ฟีเจอร์ | Customer | Staff |
|---------|----------|-------|
| ดูเมนู | ✅ | ✅ |
| จัดการเมนู | ❌ | ✅ |
| จองโต๊ะ | ✅ | ❌ |
| ดูประวัติการจอง | ✅ เฉพาะของตัวเอง | ✅ ทั้งหมด |
| สั่งอาหาร | ✅ | ❌ |
| ดูออเดอร์ | ✅ เฉพาะของตัวเอง | ✅ ทั้งหมด |
| ชำระเงิน | ✅ | ❌ |
| ดูประวัติชำระเงิน | ✅ เฉพาะของตัวเอง | ✅ ทั้งหมด |
| เปลี่ยนสถานะ booking/order | ❌ | ✅ |

---

## วิธีรันโปรเจค

### 1. ตั้งค่า Environment Variable
สร้างไฟล์ `backend/.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_secret_key
PORT=3000
```

### 2. รัน Backend
```bash
cd backend
npm install
npm run dev
```

### 3. รัน Frontend
```bash
cd Restaurant
npm install
ng serve
```

> ต้องรัน **ทั้งคู่พร้อมกัน** — Backend port 3000, Frontend port 4200

---

## การ Login

| Role | วิธี Login | Session |
|------|-----------|---------|
| Customer | เบอร์โทร + PIN (จาก database) | JWT Token (7 วัน) |
| Staff | Username: `admin` / Password: `1234` | localStorage flag |
