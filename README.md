# ReadNest - Library Management System

ReadNest is a comprehensive library management system built with Next.js, featuring user authentication, book borrowing, admin dashboard, and automated workflows.

## 📖 Overview

ReadNest allows users to browse books, borrow them, and manage their reading history. Admins can manage books, users, borrow records, and system configurations. The system includes automated email workflows for user engagement.

## 🚀 Tech Stack

- **Framework:** Next.js 15 with App Router & Turbopack
- **Database:** PostgreSQL with Drizzle ORM (Neon serverless)
- **Authentication:** NextAuth.js with credentials provider
- **Styling:** Tailwind CSS 4 with custom utilities
- **File Upload:** UploadThing
- **State Management:** React Hook Form with Zod validation
- **Caching:** Upstash Redis
- **Email & Workflows:** Upstash QStash with Resend
- **UI Components:** Radix UI primitives
- **Data Tables:** TanStack Table
- **Search Params:** nuqs for type-safe URL state

## 📁 Project Structure

```
readnest/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── (root)/            # User-facing pages
│   │   │   ├── library/       # Book browsing with filters
│   │   │   ├── books/[id]/    # Book details & borrow
│   │   │   └── myprofile/     # User profile & borrowed books
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── page.tsx       # Dashboard with statistics
│   │   │   ├── books/         # Book management (CRUD)
│   │   │   ├── users/         # User management
│   │   │   ├── borrow-records/# Borrow records tracking
│   │   │   └── config/        # System settings
│   │   ├── auth/              # Sign in/Sign up pages
│   │   └── api/               # API routes
│   │       ├── uploadthing/   # File upload endpoints
│   │       └── workflows/     # Automated email workflows
│   ├── components/            # React components
│   │   ├── admin/            # Admin-specific components
│   │   │   ├── BooksTable.tsx
│   │   │   ├── UsersTable.tsx
│   │   │   ├── BorrowRecordsTable.tsx
│   │   │   └── forms/        # Admin forms
│   │   └── ui/               # Reusable UI components
│   ├── lib/                   # Utility functions & actions
│   │   ├── actions/          # User server actions
│   │   └── admin/actions/    # Admin server actions
│   ├── db/                    # Database configuration
│   │   ├── schema.ts         # Drizzle schema definitions
│   │   └── seed.ts           # Database seeding
│   ├── constants/            # App constants
│   ├── styles/               # CSS files
│   └── hooks/                # Custom React hooks
├── public/                    # Static assets
│   ├── icons/                # SVG icons
│   └── images/               # Images
└── drizzle.config.ts         # Drizzle ORM configuration
```

## ✨ Core Features

### 1. Authentication & Authorization
- **User Registration:** Sign up with email, password, university ID, and ID card upload
- **Role-Based Access:** Two roles (USER, ADMIN) with different permissions
- **Protected Routes:** Automatic redirects for unauthenticated users
- **Session Management:** JWT-based sessions with NextAuth.js
- **Account Status:** Pending, Approved, Rejected, Banned statuses

### 2. Book Management

#### User Features:
- **Browse Library:** Paginated book grid with search and filters
- **Search Books:** Full-text search by title and author
- **Filter by Genre:** Category-based filtering
- **Sort Options:** Newest, Oldest, Highest Rated, Available
- **Book Details:** Comprehensive book information with video trailers
- **Borrow Books:** Request books with availability checks
- **Borrow Limits:** Configurable max books per user (default: 5)
- **Return Books:** Mark borrowed books as returned
- **Borrow History:** Track current and past borrowing activity

#### Admin Features:
- **CRUD Operations:** Create, read, update, and delete books
- **Inventory Management:** Track total and available copies
- **Cover & Video Upload:** Upload book covers and trailers
- **Bulk Management:** Data table with sorting and filtering
- **Book Statistics:** View total books, borrowed, and available counts

### 3. User Management (Admin)
- **View All Users:** Comprehensive user list with status
- **Approve/Reject:** Process user registration requests
- **Ban Users:** Suspend user accounts
- **Filter & Sort:** Advanced table filtering and sorting
- **User Activity:** Track last activity dates
- **Role Management:** USER and ADMIN role assignment

### 4. Borrow Records Management (Admin) 🆕
- **View All Records:** Complete borrowing history
- **Statistics Dashboard:**
  - Total borrow records
  - Currently borrowed books
  - Overdue books count
  - Returned books count
- **Status Tracking:** BORROWED, RETURNED, OVERDUE statuses
- **Detailed Information:**
  - Borrower name and email
  - Book title and author
  - Borrow date, due date, return date
- **Advanced Filtering:**
  - Filter by status (All, Borrowed, Returned, Overdue)
  - Search by borrower name
  - Sort by any column
- **Pagination:** 10 records per page with navigation
- **Overdue Detection:** Automatic overdue status calculation

### 5. Borrowing System
- **Quota Management:** Configurable max books per user
- **Availability Check:** Ensures books are available before borrowing
- **Duplicate Prevention:** Users can't borrow the same book twice
- **Due Date Tracking:** 14-day borrow period
- **Status Management:** BORROWED/RETURNED status
- **Overdue Tracking:** Automatic overdue detection and display

### 6. Admin Dashboard
- **Statistics Cards:**
  - Total books in library
  - Currently borrowed count
  - Available books
  - Total users
  - Active users
  - Pending approval requests
- **Recent Activities:** Live feed of borrow/return events
- **Quick Actions:** Links to manage books, users, borrow records, and settings

### 7. System Configuration
- **Max Books Setting:** Admin can configure borrowing limits
- **System-wide Application:** Applied to all users
- **Real-time Updates:** Changes take effect immediately

### 8. File Upload
- **UploadThing Integration:** Handles images and videos
- **Preview Support:** Show previews before/after upload
- **Delete Capability:** Remove uploaded files
- **File Types:**
  - Book covers (images)
  - Book trailers (videos)
  - University ID cards (images)

### 9. Automated Workflows
- **Onboarding Email:** Welcome email on signup
- **Engagement Emails:** Follow-up emails for inactive users
- **QStash Integration:** Reliable workflow execution
- **State Tracking:** Monitor user activity dates

## 🗄️ Database Schema

### Tables:

1. **users**
   - User accounts with authentication
   - Roles: USER, ADMIN
   - Status: PENDING, APPROVED, REJECTED, BANNED
   - University ID and card verification

2. **books**
   - Book catalog with inventory
   - Total and available copies tracking
   - Cover images and video trailers
   - Rating and genre information

3. **borrowRecords**
   - Borrow transactions
   - Dates: borrow, due, return
   - Status: BORROWED, RETURNED
   - User and book relationships

4. **systemConfig**
   - Key-value configuration store
   - System-wide settings
   - Admin-configurable options

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon serverless)
- pnpm (recommended) or npm
- Upstash Redis account
- Upstash QStash account
- UploadThing account
- Resend account (for emails)

### Environment Variables

Create `.env.local` in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
AUTH_SECRET=your-secret-key-here

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# QStash (Automated Workflows)
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your-qstash-token
QSTASH_CURRENT_SIGNING_KEY=your-current-signing-key
QSTASH_NEXT_SIGNING_KEY=your-next-signing-key

# Resend (Email)
RESEND_TOKEN=your-resend-api-key

# UploadThing (File Upload)
UPLOADTHING_TOKEN=your-uploadthing-token

# App URLs
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
PROD_ENDPOINT=https://your-production-url.com
```

### Installation

```bash
# Install dependencies
pnpm install

# Generate database migrations from schema
pnpm drizzle-kit generate

# Run migrations to set up database
pnpm drizzle-kit migrate

# Seed database with sample data (optional)
pnpm db:seed

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Database Commands

```bash
# Generate new migrations after schema changes
pnpm drizzle-kit generate

# Apply pending migrations
pnpm drizzle-kit migrate

# Open Drizzle Studio (database GUI)
pnpm drizzle-kit studio

# Seed database with sample data
pnpm db:seed
```

## 🔑 Key Features Explained

### Library Browsing (/library)
- **Infinite Scroll:** Load more books on demand
- **URL State Management:** Filters persist in URL with nuqs
- **Server-Side Filtering:** Efficient database queries
- **12 Books Per Page:** Optimized pagination

### Book Details (/books/[id])
- **Video Trailer:** Embedded video player
- **Borrow Status:** Real-time availability check
- **User Quota Display:** Shows remaining borrow capacity
- **Disabled State:** Shows "Borrowed" if user already has the book

### Admin Dashboard (/admin)
- **Real-time Statistics:** Live data from database
- **Activity Feed:** Recent borrow/return events with timestamps
- **Quick Navigation:** Direct links to management pages
- **Responsive Design:** Works on all screen sizes

### Borrow Records (/admin/borrow-records) 🆕
- **Complete History:** All borrowing transactions
- **Statistics Overview:** 4 key metrics at a glance
- **Overdue Tracking:** Automatic calculation and highlighting
- **Advanced Table:** Sorting, filtering, and search capabilities
- **User & Book Details:** Complete information in one view

## 🎨 Styling

### CSS Architecture
- **Global Styles:** CSS variables for theming
- **Admin Styles:** Separate stylesheet for admin interface
- **Tailwind CSS:** Utility-first with custom configuration
- **Custom Utilities:** Reusable `@utility` blocks

### Design System
- **Colors:** Primary, secondary, dark, light palettes
- **Typography:** IBM Plex Sans (body), Bebas Neue (headings)
- **Components:** Radix UI with custom styling
- **Icons:** Custom SVG icon library

## 🔒 Security

- **Rate Limiting:** 5 requests per minute per IP (Upstash Redis)
- **Authentication Required:** All user routes protected
- **Admin Authorization:** Role-based access control
- **Password Hashing:** bcrypt for secure password storage
- **JWT Tokens:** Secure session management
- **SQL Injection Prevention:** Drizzle ORM parameterized queries

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

### Environment Setup
- Add all `.env.local` variables to Vercel dashboard
- Update `PROD_ENDPOINT` to production URL
- Configure database connection (use Neon for serverless)

## 📝 API Rate Limiting

- **Implementation:** Upstash Redis with `@upstash/ratelimit`
- **Limit:** 5 requests per minute per IP address
- **Redirect:** `/too-fast` page on limit exceeded
- **Applies To:** Sign in and sign up endpoints

## 👤 Default Admin Setup

After seeding the database:
1. Create a user account normally
2. Update the user's role in the database:
   ```sql
   UPDATE users SET role = 'ADMIN', status = 'APPROVED' WHERE email = 'your-email@example.com';
   ```
3. Sign in with the updated account

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Table](https://tanstack.com/table)
- [nuqs](https://nuqs.47ng.com/)

## 🤝 Contributing

This is a learning project. Feel free to fork and modify for your needs.

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
