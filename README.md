# SalaConnect (សាលាភ្ជាប់) - Teacher-Parent Portal

SalaConnect គឺជាគេហទំព័រទំនាក់ទំនងទ្វិភាសា (ខ្មែរ/English) រវាងលោកគ្រូអ្នកគ្រូ និងមាតាបិតាសិស្ស ដើម្បីជួយសម្រួលដល់ការតាមដានការសិក្សា និងពង្រឹងកិច្ចសហការ។
SalaConnect is a premium, bilingual teacher-parent communication portal designed to streamline academic tracking and promote school-home partnerships.

---

## 🛠️ បច្ចេកវិទ្យាដែលប្រើប្រាស់ / Technology Stack

- **Frontend**: HTML5, CSS3 (Custom transitions, dark/light theme, glassmorphic container layout)
- **Typography**: 
  - **Khmer OS Muol Light** / **Moul** for headings.
  - **Khmer OS Battambang** / **Battambang** for messages, text fields, inputs, and button labels.
- **State Management**: Persisted locally in the browser's `localStorage` (simulates database inserts, private chats, progress reports, and notification alerts).

---

## 📂 រចនាសម្ព័ន្ធឯកសារ / Project Structure

- `index.html` - Main container markup containing page views and popup modals.
- `styles.css` - UI custom property tokens, glassmorphism layouts, and font family mappings.
- `app.js` - SPA state manager. Tracks logins, registrations, grade updates, and schedules interval synchronization checks.
- `mockData.js` - Seed database initializer that populates `localStorage` on initial boot.

---

## 🚀 របៀបដំណើរការ / Running Instructions

ម៉ូដែលគំរូនេះអាចដំណើរការដោយ**មិនបាច់ដំឡើង Server ឡើយ** (Serverless Client Prototype)៖
1. គ្រាន់តែធ្វើការ **Double-Click** លើឯកសារ `index.html` ដើម្បីបើកដំណើរការក្នុង Browser ភ្លាមៗ។
2. ម៉្យាងទៀត អ្នកអាចដំណើរការ Server ធម្មតាដូចជា Python static server៖
   ```bash
   python -m http.server 8000
   ```
   រួចចូលទៅកាន់អាសយដ្ឋាន៖ `http://localhost:8000`

---

## 🔑 គណនីសាកល្បង / Seeded Login Credentials

| តួនាទី / Role | ឈ្មោះគណនី / Username | ពាក្យសម្ងាត់ / Password | ព័ត៌មានលម្អិត / Details |
| :--- | :--- | :--- | :--- |
| **គ្រូបង្រៀន (Teacher)** | `teacher1` | `password` | គ្រប់គ្រងថ្នាក់ទី ១២A និង ១១B / Manages 12A & 11B |
| **គ្រូបង្រៀន (Teacher)** | `teacher2` | `password` | គ្រប់គ្រងថ្នាក់ទី ១២A និង ១០A / Manages 12A & 10A |
| **មាតាបិតា (Parent)** | `parent1` | `password` | មាតាបិតារបស់សិស្ស **សុខ សុភា** (Sok Sophea - 12A) |
| **មាតាបិតា (Parent)** | `parent2` | `password` | មាតាបិតារបស់សិស្ស **កែវ ពិសិដ្ឋ** (Keo Piseth - 12A) |
