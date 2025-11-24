# Admin Panel Setup Guide

## Creating Your First Admin User

You have two options to create an admin user:

### Option 1: Using the Backend Seed Script (Recommended)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the admin seed script:
```bash
node seed-admin.js
```

This will create an admin user with:
- **Email:** `admin@semilia.com`
- **Password:** `Admin@123456`
- **Role:** `admin`

### Option 2: Register and Manually Update in MongoDB

1. Register a new user through the frontend (`/register`)
2. Verify the email
3. Open MongoDB Compass or MongoDB Shell
4. Find your user in the `users` collection
5. Update the `role` field from `user` to `admin`

```javascript
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin" } }
)
```

## Accessing the Admin Panel

1. Visit: `http://localhost:3000/admin-login`
2. Enter your admin credentials
3. You'll be redirected to the admin dashboard

## Admin Panel Routes

- `/admin/dashboard` - Overview and stats
- `/admin/products` - Manage products
- `/admin/orders` - Manage orders
- `/admin/users` - Manage users
- `/admin/settings` - Admin settings

## Security Notes

⚠️ **Important:**
- The admin panel is protected - only users with `role: 'admin'` can access it
- Regular users trying to access admin routes will be redirected to the home page
- Unauthenticated users will be redirected to the admin login page
- Change the default admin password immediately after first login

## Test Admin Credentials (from seed-admin.js)

```
Email: admin@semilia.com
Password: Admin@123456
```

**Remember to change this password in production!**

