# AI Wholesale Order System — Frontend

A modern, installable web application (PWA) built with **React, Vite, and Tailwind CSS** for a central wholesaler, his supplier partners, and shopkeeper clients.

---

## 🌟 Key Application Features

### 1. Three Isolated User Portals with Route Guards
- **Client App (`/client/login` ➔ `/client`)**: Mobile-first WhatsApp-style AI Chat supporting **Pashto (پښتو)**, **Urdu (اردو)**, and **English** with LTR/RTL support. Features voice note recording, AI transcriptions, interactive order cards in chat with confirmation modals, order timeline tracking, ledger dues balance, and 1-tap quick reordering.
- **Supplier App (`/supplier/login` ➔ `/supplier`)**: Restricted portal allowing suppliers to manage stock, prices, fulfill client orders, and track payouts for their own products only. **Profit and cost prices are strictly hidden.**
- **Admin App (`/admin/login` ➔ `/admin`)**: Desktop-first control center with sales & profit KPI metrics, interactive daily/weekly/monthly charts, cost price analysis, supplier permission management, client credit blocking, financial CSV/PDF export reports, and an AI Activity Audit Log.

---

## 🔒 Business Rules Enforced

1. **Strict Cost & Profit Isolation**: Profit margins and unit cost prices appear **ONLY** in the Admin App.
2. **Action Confirmation**: All monetary and inventory adjustments (placing orders, modifying prices, stock updates, client blocking, payment entries) require a clear confirmation step.
3. **List State Readiness**: All data lists include Loading, Empty, and Error retry states.
4. **Isolated API Layer**: All API functions reside cleanly in `src/api/` with persistent mock storage, making backend integration effortless.
5. **Installable PWA**: PWA manifest, service worker support, and in-app install banner included.

---

## 🚀 How to Run locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:3000` in your browser to access the portal selector and test all three persona logins.
