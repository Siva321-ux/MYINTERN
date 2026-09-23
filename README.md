MAKE # PS65 — Internship & Job Application Tracker

A full-stack, production-ready web application built with the **MERN** stack for students to track internship and job applications submitted externally, monitor interview stages, record notes & activity timelines, and manage follow-up reminders.

---

## 🚀 Key Features

1. **User Authentication & Data Isolation**
   - User Registration & Login with JWT Authentication.
   - Passwords hashed securely using `bcryptjs`.
   - Strict data ownership enforcement (Users can only view and modify their own applications).

2. **Application Lifecycle & Stage Management**
   - Support for mandatory stages: `Applied`, `Interview`, `Offer`, `Rejected`.
   - Fast, interactive Stage Switcher (`Applied → Interview → Offer / Rejected`).
   - Closed and Rejected applications are maintained in application history.

3. **Follow-Up Reminder System**
   - Automatic categorization of follow-up dates into:
     - **Overdue** (Past follow-up date for active applications)
     - **Due Today** (Today's follow-up reminders)
     - **Upcoming** (Future follow-up dates)
   - Excludes closed/rejected applications from generating active overdue warnings.

4. **Dynamic Dashboard Analytics**
   - Real-time dynamic count calculations: `Total`, `Applied`, `Interview`, `Offer`, `Rejected`.
   - Visual charts powered by **Recharts**:
     - **Doughnut / Pie Chart**: Stage distribution breakdown.
     - **Bar Chart**: Application pipeline statistics.
   - Follow-up reminders alert widget.
   - Recent Applications quick-access table.

5. **Search, Filtering, and Multiple Views**
   - Search by **Company Name** or **Job/Internship Role**.
   - Filter by current Stage (`Applied`, `Interview`, `Offer`, `Rejected`).
   - Multi-field sorting: Newest, Oldest, Company Name (A-Z), Follow-Up Date.
   - Multiple view layouts: **Table View**, **Grid Card View**, and **Kanban Board View**.

6. **Chronological Activity Timeline & Notes Log**
   - Tracks application history as a chronological activity feed:
     - Application Creation
     - Stage Transitions (`Applied → Interview`, `Interview → Offer`, etc.)
     - Notes Appended with timestamps
     - Follow-up Date modifications

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React (Icons), Recharts (Data Visualization), React Router DOM v7.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose ORM, JWT, Bcryptjs, CORS.
- **Architecture**: REST API with JWT bearer tokens.

---

## 🗄️ Database Schema

### User Schema (`User.js`)
```javascript
{
  _id: ObjectId,
  name: String,
  email: { type: String, unique: true, lowercase: true },
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Application Schema (`Application.js`)
```javascript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', index: true },
  companyName: String,
  role: String,
  applicationDate: Date,
  stage: { type: String, enum: ['Applied', 'Interview', 'Offer', 'Rejected'] },
  notes: String,
  followUpDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### ApplicationActivity Schema (`Activity.js`)
```javascript
{
  _id: ObjectId,
  applicationId: { type: ObjectId, ref: 'Application', index: true },
  userId: { type: ObjectId, ref: 'User' },
  type: { type: String, enum: ['CREATED', 'STAGE_CHANGED', 'NOTE_ADDED', 'FOLLOW_UP_UPDATED'] },
  content: String,
  previousStage: String,
  newStage: String,
  createdAt: Date
}
```

---

## 📡 API Documentation

### Authentication
- `POST /api/auth/register` — Register new user account.
- `POST /api/auth/login` — Sign in user & receive JWT token.
- `GET  /api/auth/me` — Fetch current user profile.

### Applications (Protected)
- `GET    /api/applications` — Get user applications (Supports `?search=`, `?stage=`, `?sort=`).
- `POST   /api/applications` — Log a new application.
- `GET    /api/applications/:id` — Get application details & chronological timeline.
- `PUT    /api/applications/:id` — Update application details.
- `DELETE /api/applications/:id` — Delete application and activity logs.
- `PATCH  /api/applications/:id/stage` — Update stage (`Applied`, `Interview`, `Offer`, `Rejected`).
- `POST   /api/applications/:id/notes` — Append a note to application timeline.

### Dashboard & Reminders (Protected)
- `GET /api/dashboard/stats` — Fetch dynamic statistics counts per stage.
- `GET /api/applications/followups` — Fetch categorized active follow-ups (`upcoming`, `today`, `overdue`).

---

## ⚙️ Environment Variables

Create `.env` inside the `server/` folder:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/internship_tracker
JWT_SECRET=super_secret_hackathon_jwt_key_ps65_2026
NODE_ENV=development
```

---

## 🏃 Running Locally

### 1. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Start Backend Server
```bash
cd server
npm start
```
*Backend runs on `http://localhost:5000`*

### 3. Start Frontend Development Client
```bash
cd client
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🧪 Testing Checklist

- [x] **Auth**: Registration, Login, JWT verification, Logout, and Demo Login shortcut.
- [x] **Applications**: Create, View, Edit, Delete, Stage Switcher, Notes timeline, Follow-ups.
- [x] **Dashboard**: Dynamic KPI cards, Doughnut chart, Bar chart, Follow-up alert banner.
- [x] **Search & Filter**: Search by company/role, filter by stage, sort by dates/company.
- [x] **History**: Closed & Rejected applications retained in history.
- [x] **Security**: User isolation verified (User A cannot view User B's applications).
