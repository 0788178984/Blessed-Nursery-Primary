# Blessed Nursery and Primary School Website with Admin Panel

A comprehensive educational website for Blessed Nursery and Primary School with a full-featured admin panel, built with HTML, CSS, JavaScript, PHP, and MySQL.

## 🚀 Features

### Frontend Website
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Dynamic Content**: News, programs, staff directory, and more
- **Contact System**: Interactive contact form with validation
- **Media Gallery**: Image and document management
- **SEO Optimized**: Meta tags, structured data, and clean URLs

### Admin Panel
- **Authentication System**: Secure login with MD5 password hashing
- **Content Management**: Full CRUD operations for all content types
- **Media Management**: File upload, organization, and deletion
- **User Management**: Admin, editor, and viewer roles
- **Settings Management**: Site-wide configuration options
- **Backup System**: Database backup and restore functionality
- **Activity Logging**: Track all admin actions

### Backend API
- **RESTful API**: Clean, well-documented endpoints
- **Database Integration**: MySQL with PDO for security
- **File Upload**: Secure file handling with validation
- **Error Handling**: Comprehensive error management
- **CORS Support**: Cross-origin request handling

## 📋 Requirements

- **Web Server**: Apache/Nginx with PHP support
- **PHP**: Version 7.4 or higher
- **MySQL**: Version 5.7 or higher
- **Browser**: Modern browser with JavaScript enabled

## 🛠️ Installation

### 1. Clone/Download the Project
```bash
git clone [repository-url]
cd ParadigmInstitute
```

### 2. Database Setup
1. Create a MySQL database named `blessed_nursery_school`
2. Update database credentials in `config/database.php`
3. Run the setup script: `http://yourdomain.com/setup.php`

### 3. File Permissions
```bash
chmod 755 uploads/
chmod 644 config/database.php
```

### 4. Configuration
Update the following files with your settings:
- `config/database.php` - Database connection
- `config/config.php` - Site configuration
- `admin/login.php` - Admin login page

## 🗄️ Database Schema

### Core Tables
- **users**: Admin authentication and user management
- **pages**: Website content pages
- **news**: News articles and events
- **programs**: Academic programs and courses
- **staff**: Staff directory and profiles
- **media**: File uploads and media library
- **navigation**: Menu structure and links
- **settings**: Site-wide configuration
- **contact_messages**: Contact form submissions
- **partners**: Partner organizations and logos

### Sample Data
The setup script includes:
- Default admin user (admin/admin123)
- Sample pages, news, programs, and staff
- Basic site settings
- Navigation structure

## 🔧 API Endpoints

### Authentication
- `POST /api/auth.php?action=login` - User login
- `POST /api/auth.php?action=logout` - User logout
- `GET /api/auth.php?action=check` - Check auth status

### Content Management
- `GET /api/pages.php?action=list` - List pages
- `POST /api/pages.php?action=create` - Create page
- `PUT /api/pages.php?action=update` - Update page
- `DELETE /api/pages.php?action=delete&id=X` - Delete page

### News Management
- `GET /api/news.php?action=list` - List news
- `POST /api/news.php?action=create` - Create news
- `PUT /api/news.php?action=update` - Update news
- `DELETE /api/news.php?action=delete&id=X` - Delete news

### Programs Management
- `GET /api/programs.php?action=list` - List programs
- `POST /api/programs.php?action=create` - Create program
- `PUT /api/programs.php?action=update` - Update program
- `DELETE /api/programs.php?action=delete&id=X` - Delete program

### Staff Management
- `GET /api/staff.php?action=list` - List staff
- `POST /api/staff.php?action=create` - Create staff member
- `PUT /api/staff.php?action=update` - Update staff member
- `DELETE /api/staff.php?action=delete&id=X` - Delete staff member

### Media Management
- `POST /api/media.php?action=upload` - Upload file
- `GET /api/media.php?action=list` - List media files
- `PUT /api/media.php?action=update` - Update media metadata
- `DELETE /api/media.php?action=delete&id=X` - Delete media file

### Settings Management
- `GET /api/settings.php?action=get` - Get all settings
- `PUT /api/settings.php?action=update` - Update settings

### Contact Management
- `POST /api/contact.php?action=submit` - Submit contact form
- `GET /api/contact.php?action=list` - List contact messages
- `PUT /api/contact.php?action=update_status` - Update message status

## 🔐 Security Features

- **Password Hashing**: MD5 encryption for user passwords
- **SQL Injection Prevention**: PDO prepared statements
- **XSS Protection**: Input sanitization and output escaping
- **CSRF Protection**: Token-based request validation
- **File Upload Security**: Type validation and size limits
- **Session Management**: Secure session handling
- **Access Control**: Role-based permissions

## 📱 Admin Panel Usage

### Login
1. Navigate to `/admin/login.php`
2. Use default credentials: `admin` / `admin123`
3. Change password after first login

### Content Management
1. **Pages**: Create and edit website pages
2. **News**: Manage news articles and events
3. **Programs**: Add academic programs and courses
4. **Staff**: Manage staff directory
5. **Media**: Upload and organize files
6. **Settings**: Configure site-wide options

### Dashboard
- Real-time statistics
- Quick action buttons
- Recent activity overview
- System status indicators

## 🎨 Customization

### Styling
- Main site: `assets/css/style.css`
- Admin panel: `admin/assets/css/admin.css`
- Responsive design included

### Content
- Edit pages in the admin panel
- Update site settings
- Manage navigation menu
- Customize contact information

### Functionality
- Add new API endpoints
- Extend user roles
- Customize file upload types
- Add new content types

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify credentials in `config/database.php`
   - Ensure database exists

2. **File Upload Issues**
   - Check `uploads/` directory permissions
   - Verify PHP upload settings
   - Check file size limits

3. **Admin Panel Not Loading**
   - Check JavaScript console for errors
   - Verify API endpoints are accessible
   - Check authentication status

4. **API Errors**
   - Check PHP error logs
   - Verify database connection
   - Check file permissions

### Debug Mode
Enable debug mode in `config/config.php`:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 📈 Performance Optimization

- **Database Indexing**: Optimize query performance
- **File Compression**: Enable GZIP compression
- **Caching**: Implement Redis/Memcached
- **CDN**: Use content delivery network
- **Image Optimization**: Compress uploaded images

## 🔄 Backup and Maintenance

### Database Backup
```bash
mysqldump -u username -p blessed_nursery_school > backup.sql
```

### File Backup
```bash
tar -czf website_backup.tar.gz /path/to/website
```

### Regular Maintenance
- Monitor error logs
- Update passwords regularly
- Clean up old media files
- Optimize database tables

## 📞 Support

For technical support or questions:
- Email: admin@blessednursery.ac.ug
- Documentation: Check this README
- Issues: Report via GitHub issues

## 📄 License

This project is proprietary software for Blessed Nursery and Primary School. All rights reserved.

## 🚀 Deployment

### Production Checklist
- [ ] Change default admin password
- [ ] Update database credentials
- [ ] Set up SSL certificate
- [ ] Configure backup system
- [ ] Test all functionality
- [ ] Monitor error logs
- [ ] Set up monitoring

### Server Requirements
- PHP 7.4+
- MySQL 5.7+
- Apache/Nginx
- 100MB+ disk space
- 512MB+ RAM

---

**Built with ❤️ for Blessed Nursery and Primary School**
