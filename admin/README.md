# Blessed Nursery and Primary School Admin Panel

A comprehensive admin panel for managing all aspects of the Blessed Nursery and Primary School website.

## Features

### 🔐 Authentication & Security
- Secure login system with session management
- Password protection and session timeout
- Configurable security settings
- Two-factor authentication support (optional)

### 📄 Content Management
- **Pages Management**: Create, edit, and manage all website pages
- **Visual Page Editor**: Rich text editor with formatting tools
- **Auto-save**: Automatic saving of changes every 30 seconds
- **Preview Mode**: Preview pages before publishing
- **SEO Management**: Meta titles, descriptions, and keywords

### 📰 News & Events
- Create and manage news articles
- Event management system
- Category organization
- Featured image support
- Publication scheduling

### 🎓 Academic Programs
- Manage diploma programs
- Certificate programs
- Short courses and skills training
- Program descriptions and requirements
- Level categorization

### 👥 Staff Directory
- Staff member profiles
- Department organization
- Contact information management
- Photo uploads
- Bio and position details

### 🖼️ Media Library
- Image and document uploads
- File organization by category
- File type restrictions
- Size limitations
- Preview functionality

### 🧭 Navigation Management
- Menu structure editing
- Drag-and-drop ordering
- Parent-child relationships
- URL management
- Status control

### ⚙️ Site Settings
- **General**: Site title, description, logo
- **Appearance**: Colors, fonts, styling
- **Contact**: Phone, email, address, social media
- **SEO**: Meta tags, analytics, sitemap generation
- **Email**: SMTP configuration
- **Security**: Session settings, file restrictions

## File Structure

```
admin/
├── index.html                 # Main admin dashboard
├── login.html                 # Login page
├── README.md                  # This documentation
└── assets/
    ├── css/
    │   └── admin.css          # Admin panel styles
    └── js/
        ├── admin.js           # Main admin functionality
        ├── content-manager.js # Content management system
        ├── page-editor.js     # Page editing functionality
        └── settings-manager.js # Settings management
```

## Getting Started

### 1. Access the Admin Panel
1. Navigate to `/admin/login.html`
2. Enter your credentials (any username/password for demo)
3. Click "Sign In"

### 2. Dashboard Overview
The dashboard provides:
- Quick statistics (pages, news, programs, staff)
- Recent activity feed
- Quick action buttons
- Navigation to all sections

### 3. Managing Content

#### Pages
- View all website pages in a grid layout
- Edit page content using the visual editor
- Manage page settings and SEO
- Preview changes before saving

#### News & Events
- Create new articles with rich content
- Upload featured images
- Categorize content
- Set publication dates

#### Programs
- Add new academic programs
- Set program levels (Certificate, Diploma, Short Course)
- Define requirements and duration
- Organize by categories

#### Staff Directory
- Add staff members with photos
- Organize by departments
- Manage contact information
- Update bios and positions

### 4. Media Management
- Upload images, documents, and videos
- Organize by categories
- Set file restrictions
- Preview media files

### 5. Navigation
- Edit menu structure
- Reorder menu items
- Set parent-child relationships
- Manage URLs and status

### 6. Settings Configuration
- **General**: Update site information
- **Appearance**: Customize colors and fonts
- **Contact**: Manage contact details and social media
- **SEO**: Configure meta tags and analytics
- **Email**: Set up SMTP for notifications
- **Security**: Configure security settings

## Key Features

### Auto-Save
- Changes are automatically saved every 30 seconds
- Manual save option available
- Unsaved changes warning before leaving

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Collapsible sidebar for mobile
- Touch-friendly interface

### Data Persistence
- Settings saved to localStorage
- Content changes tracked
- Export/import functionality

### Security
- Session-based authentication
- Configurable security settings
- File upload restrictions
- XSS protection

## Customization

### Adding New Content Types
1. Extend the `ContentManager` class
2. Add new display methods
3. Create corresponding UI sections
4. Update navigation

### Modifying Settings
1. Edit `settings-manager.js`
2. Add new setting categories
3. Update the settings form HTML
4. Implement save/load logic

### Styling Changes
1. Modify `admin.css`
2. Use CSS variables for colors
3. Update component styles
4. Maintain responsive design

## Technical Details

### Dependencies
- jQuery 3.6.0
- Font Awesome 6.0.0
- Google Fonts (Roboto)

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Storage
- Uses localStorage for data persistence
- Settings and content stored locally
- Export/import for backup

## Troubleshooting

### Common Issues

1. **Login not working**
   - Check browser console for errors
   - Clear localStorage and try again
   - Verify JavaScript is enabled

2. **Changes not saving**
   - Check if auto-save is working
   - Try manual save
   - Check browser storage limits

3. **Images not uploading**
   - Check file size limits
   - Verify file type is allowed
   - Check browser permissions

4. **Page editor not loading**
   - Refresh the page
   - Check JavaScript console
   - Verify all scripts are loaded

### Performance Tips

1. **Large datasets**
   - Use pagination for large lists
   - Implement search/filtering
   - Lazy load content

2. **File uploads**
   - Compress images before upload
   - Use appropriate file formats
   - Set reasonable size limits

3. **Browser optimization**
   - Clear cache regularly
   - Disable unnecessary extensions
   - Use modern browsers

## Security Considerations

### Best Practices
1. **Authentication**
   - Use strong passwords
   - Enable two-factor authentication
   - Regular session timeouts

2. **File Uploads**
   - Validate file types
   - Scan for malware
   - Set size limits

3. **Data Protection**
   - Regular backups
   - Secure storage
   - Access logging

### Production Deployment
1. **Server Setup**
   - Use HTTPS
   - Configure proper headers
   - Set up monitoring

2. **Database Integration**
   - Replace localStorage with database
   - Implement proper authentication
   - Add user management

3. **Backup Strategy**
   - Regular automated backups
   - Version control
   - Disaster recovery plan

## Support

For technical support or feature requests:
- Email: admin@blessednursery.ac.ug
- Phone: +256 772 990 845

## License

This admin panel is proprietary software for Blessed Nursery and Primary School.
All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Author**: Blessed Nursery and Primary School Development Team