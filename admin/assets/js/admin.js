// Admin Panel JavaScript
$(document).ready(function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize admin panel
    initializeAdminPanel();
    
    // Load initial data using content manager
    loadDashboardData();
    contentManager.displayContent('pages');
    contentManager.displayContent('news');
    contentManager.displayContent('programs');
    contentManager.displayContent('staff');
    contentManager.displayContent('media');
    loadNavigationData();
    loadBackupData();
});

// Authentication check
function isAuthenticated() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// Initialize admin panel functionality
function initializeAdminPanel() {
    // Sidebar toggle
    $('#sidebarToggle').click(function() {
        $('.admin-sidebar').toggleClass('collapsed');
        $('.admin-main').toggleClass('sidebar-collapsed');
    });
    
    // Navigation switching
    $('.nav-link').click(function(e) {
        e.preventDefault();
        
        // Remove active class from all nav links
        $('.nav-link').removeClass('active');
        
        // Add active class to clicked link
        $(this).addClass('active');
        
        // Hide all content sections
        $('.content-section').removeClass('active');
        
        // Show selected section
        const section = $(this).data('section');
        $('#' + section).addClass('active');
        
        // Load section-specific data
        if (section === 'backup') {
            loadBackupData();
        }
        
        // Update page title
        updatePageTitle($(this).text().trim());
    });
    
    // Settings tabs
    $('.tab-btn').click(function() {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        
        const tab = $(this).data('tab');
        $('.tab-content').removeClass('active');
        $('#' + tab).addClass('active');
    });
    
    // Modal functionality
    initializeModals();
    
    // Quick actions
    initializeQuickActions();
    
    // Content management
    initializeContentManagement();
}

// Update page title
function updatePageTitle(title) {
    $('#pageTitle').text(title);
}

// Initialize modals
function initializeModals() {
    // Close modal
    $('#modalClose, #modalCancel').click(function() {
        closeModal();
    });
    
    // Close modal on overlay click
    $('#modalOverlay').click(function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Escape key to close modal
    $(document).keyup(function(e) {
        if (e.keyCode === 27) { // Escape key
            closeModal();
        }
    });
}

// Open modal
function openModal(title, content) {
    $('#modalTitle').text(title);
    $('#modalBody').html(content);
    $('#modalOverlay').addClass('active');
}

// Close modal
function closeModal() {
    $('#modalOverlay').removeClass('active');
    $('#modalBody').empty();
}

// Initialize quick actions
function initializeQuickActions() {
    $('.action-btn').click(function() {
        const action = $(this).data('action');
        
        switch(action) {
            case 'add-page':
                showAddPageModal();
                break;
            case 'add-news':
                showAddNewsModal();
                break;
            case 'add-program':
                showAddProgramModal();
                break;
            case 'upload-media':
                showUploadMediaModal();
                break;
        }
    });
}

// Initialize content management
function initializeContentManagement() {
    // Add content button
    $('#addContentBtn').click(function() {
        showAddContentModal();
    });
    
    // Add page button
    $('#addPageBtn').click(function() {
        showAddPageModal();
    });
    
    // Add news button
    $('#addNewsBtn').click(function() {
        showAddNewsModal();
    });
    
    // Add program button
    $('#addProgramBtn').click(function() {
        showAddProgramModal();
    });
    
    // Add staff button
    $('#addStaffBtn').click(function() {
        showAddStaffModal();
    });
    
    // Upload media button
    $('#uploadMediaBtn').click(function() {
        showUploadMediaModal();
    });
    
    // Content search
    $('#contentSearch').on('input', function() {
        filterContent($(this).val());
    });
    
    // Content type filter
    $('#contentTypeFilter').change(function() {
        filterContentByType($(this).val());
    });
    
    // Media type filter
    $('#mediaTypeFilter').change(function() {
        filterMediaByType($(this).val());
    });
}

// Load dashboard data
function loadDashboardData() {
    // This would typically load data from an API
    // For now, we'll use static data
    console.log('Dashboard data loaded');
}

// Load pages data
function loadPagesData() {
    const pages = [
        {
            id: 1,
            title: 'Home',
            url: '../index.html',
            description: 'Main homepage of Blessed Nursery and Primary School',
            status: 'published',
            lastModified: '2025-01-15'
        },
        {
            id: 2,
            title: 'Vision & Mission',
            url: '../about/vision-mission.html',
            description: 'Our vision, mission, and core values',
            status: 'published',
            lastModified: '2025-01-14'
        },
        {
            id: 3,
            title: 'Academic Programs',
            url: '../academics/programs.html',
            description: 'Overview of all academic programs offered',
            status: 'published',
            lastModified: '2025-01-13'
        },
        {
            id: 4,
            title: 'Administration',
            url: '../about/administration.html',
            description: 'Leadership and administrative structure',
            status: 'published',
            lastModified: '2025-01-12'
        }
    ];
    
    displayPages(pages);
}

// Display pages
function displayPages(pages) {
    const pagesGrid = $('#pagesGrid');
    pagesGrid.empty();
    
    pages.forEach(page => {
        const pageCard = $(`
            <div class="page-card">
                <div class="page-card-header">
                    <h3 class="page-title">${page.title}</h3>
                    <a href="${page.url}" class="page-url" target="_blank">${page.url}</a>
                </div>
                <div class="page-card-body">
                    <p class="page-description">${page.description}</p>
                    <div class="page-actions">
                        <button class="btn btn-primary btn-sm" onclick="editPage(${page.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="viewPage('${page.url}')">
                            <i class="fas fa-external-link-alt"></i> View
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deletePage(${page.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `);
        
        pagesGrid.append(pageCard);
    });
}

// Load news data
function loadNewsData() {
    const news = [
        {
            id: 1,
            title: 'Admissions Open for 2025/2026 Academic Year',
            excerpt: 'Applications are now open for all undergraduate and postgraduate programs.',
            image: '../assets/images/slider/body.jpeg',
            date: '2025-09-06',
            category: 'Admissions'
        },
        {
            id: 2,
            title: 'Orientation Week for New Students',
            excerpt: 'Join us for orientation activities from September 15-20, 2025.',
            image: '../assets/images/slider/students.jpg',
            date: '2025-09-01',
            category: 'Events'
        },
        {
            id: 3,
            title: 'Annual Convocation Ceremony',
            excerpt: 'Graduation ceremony scheduled for September 26, 2025.',
            image: '../assets/images/slider/uvtb.jpeg',
            date: '2025-08-25',
            category: 'Events'
        }
    ];
    
    displayNews(news);
}

// Display news
function displayNews(news) {
    const newsList = $('#newsList');
    newsList.empty();
    
    news.forEach(item => {
        const newsItem = $(`
            <div class="news-item">
                <div class="news-image">
                    <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="news-content">
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${item.excerpt}</p>
                    <div class="news-meta">
                        <span>${item.date}</span> • <span>${item.category}</span>
                    </div>
                    <div class="news-actions" style="margin-top: 10px;">
                        <button class="btn btn-primary btn-sm" onclick="editNews(${item.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteNews(${item.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `);
        
        newsList.append(newsItem);
    });
}

// Load programs data
function loadProgramsData() {
    const programs = [
        {
            id: 1,
            title: 'Diploma in Information Technology',
            description: 'Practical IT skills for the modern workplace.',
            level: 'Diploma',
            icon: 'fas fa-laptop-code'
        },
        {
            id: 2,
            title: 'Diploma in Business Administration',
            description: 'Foundational business knowledge in marketing, finance and management.',
            level: 'Diploma',
            icon: 'fas fa-briefcase'
        },
        {
            id: 3,
            title: 'Certificate in Computer Applications',
            description: 'Essential computer literacy: Word, Excel, PowerPoint, Internet.',
            level: 'Certificate',
            icon: 'fas fa-keyboard'
        },
        {
            id: 4,
            title: 'Tailoring & Fashion Design',
            description: 'Hands‑on garment construction and design fundamentals.',
            level: 'Short Course',
            icon: 'fas fa-cut'
        }
    ];
    
    displayPrograms(programs);
}

// Display programs
function displayPrograms(programs) {
    const programsList = $('#programsList');
    programsList.empty();
    
    programs.forEach(program => {
        const programCard = $(`
            <div class="program-card">
                <div class="program-icon">
                    <i class="${program.icon}"></i>
                </div>
                <h3 class="program-title">${program.title}</h3>
                <p class="program-description">${program.description}</p>
                <span class="program-level">${program.level}</span>
                <div class="program-actions" style="margin-top: 15px;">
                    <button class="btn btn-primary btn-sm" onclick="editProgram(${program.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProgram(${program.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `);
        
        programsList.append(programCard);
    });
}

// Load staff data
function loadStaffData() {
    const staff = [
        {
            id: 1,
            name: 'Dr. John Smith',
            position: 'Executive Director',
            department: 'Administration',
            avatar: '../images/ACAALI.jpg'
        },
        {
            id: 2,
            name: 'Dr. Jane Doe',
            position: 'Academic Registrar',
            department: 'Academics',
            avatar: '../images/ACAALI.jpg'
        },
        {
            id: 3,
            name: 'Mr. Robert Johnson',
            position: 'Bursar',
            department: 'Finance',
            avatar: '../images/ACAALI.jpg'
        }
    ];
    
    displayStaff(staff);
}

// Display staff
function displayStaff(staff) {
    const staffList = $('#staffList');
    staffList.empty();
    
    staff.forEach(member => {
        const staffCard = $(`
            <div class="staff-card">
                <img src="${member.avatar}" alt="${member.name}" class="staff-avatar">
                <h3 class="staff-name">${member.name}</h3>
                <p class="staff-position">${member.position}</p>
                <span class="staff-department">${member.department}</span>
                <div class="staff-actions" style="margin-top: 15px;">
                    <button class="btn btn-primary btn-sm" onclick="editStaff(${member.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStaff(${member.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `);
        
        staffList.append(staffCard);
    });
}

// Load media data
function loadMediaData() {
    const media = [
        {
            id: 1,
            name: 'institute-logo.png',
            type: 'image',
            size: '2.5 MB',
            url: '../logoBlessed.jpg'
        },
        {
            id: 2,
            name: 'campus-photo.jpg',
            type: 'image',
            size: '1.8 MB',
            url: '../assets/images/slider/body.jpeg'
        },
        {
            id: 3,
            name: 'students.jpg',
            type: 'image',
            size: '2.1 MB',
            url: '../assets/images/slider/students.jpg'
        }
    ];
    
    displayMedia(media);
}

// Display media
function displayMedia(media) {
    const mediaGrid = $('#mediaGrid');
    mediaGrid.empty();
    
    media.forEach(item => {
        const mediaItem = $(`
            <div class="media-item">
                <div class="media-preview">
                    <i class="fas fa-image"></i>
                </div>
                <div class="media-info">
                    <h4 class="media-name">${item.name}</h4>
                    <p class="media-size">${item.size}</p>
                    <div class="media-actions" style="margin-top: 10px;">
                        <button class="btn btn-primary btn-sm" onclick="editMedia(${item.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteMedia(${item.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `);
        
        mediaGrid.append(mediaItem);
    });
}

// Load navigation data
function loadNavigationData() {
    const navigation = [
        { id: 1, title: 'Home', url: '../index.html', parent: null, order: 1 },
        { id: 2, title: 'About', url: '#', parent: null, order: 2, hasChildren: true },
        { id: 3, title: 'History', url: '../about/history.html', parent: 2, order: 1 },
        { id: 4, title: 'Vision & Mission', url: '../about/vision-mission.html', parent: 2, order: 2 },
        { id: 5, title: 'Academics', url: '../academics/programs.html', parent: null, order: 3 },
        { id: 6, title: 'Admissions', url: '../admissions/apply.html', parent: null, order: 4 },
        { id: 7, title: 'Research', url: '../research/index.html', parent: null, order: 5 },
        { id: 8, title: 'News & Events', url: '../news/index.html', parent: null, order: 6 },
        { id: 9, title: 'Contact', url: '../contact/index.html', parent: null, order: 7 }
    ];
    
    displayNavigation(navigation);
}

// Display navigation
function displayNavigation(navigation) {
    const navTree = $('#navTree');
    navTree.empty();
    
    // Group by parent
    const grouped = {};
    navigation.forEach(item => {
        const parentId = item.parent || 'root';
        if (!grouped[parentId]) {
            grouped[parentId] = [];
        }
        grouped[parentId].push(item);
    });
    
    // Display root items
    if (grouped.root) {
        grouped.root.forEach(item => {
            const navItem = $(`
                <div class="nav-item">
                    <div>
                        <i class="fas fa-link"></i>
                        ${item.title}
                        <span style="color: #9ca3af; font-size: 12px;">(${item.url})</span>
                    </div>
                    <div>
                        <button class="btn-icon edit" onclick="editNavItem(${item.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteNavItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `);
            
            navTree.append(navItem);
            
            // Display children
            if (grouped[item.id]) {
                grouped[item.id].forEach(child => {
                    const childItem = $(`
                        <div class="nav-item" style="margin-left: 20px; background: #f8fafc;">
                            <div>
                                <i class="fas fa-link"></i>
                                ${child.title}
                                <span style="color: #9ca3af; font-size: 12px;">(${child.url})</span>
                            </div>
                            <div>
                                <button class="btn-icon edit" onclick="editNavItem(${child.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon delete" onclick="deleteNavItem(${child.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `);
                    
                    navTree.append(childItem);
                });
            }
        });
    }
}

// Filter content
function filterContent(searchTerm) {
    $('.content-item').each(function() {
        const text = $(this).text().toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

// Filter content by type
function filterContentByType(type) {
    if (type === 'all') {
        $('.content-item').show();
    } else {
        $('.content-item').each(function() {
            if ($(this).hasClass(type)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
}

// Filter media by type
function filterMediaByType(type) {
    if (type === 'all') {
        $('.media-item').show();
    } else {
        $('.media-item').each(function() {
            if ($(this).hasClass(type)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
}

// Modal functions
function showAddPageModal() {
    const content = `
        <form id="addPageForm">
            <div class="form-group">
                <label for="pageTitle">Page Title</label>
                <input type="text" id="pageTitle" required>
            </div>
            <div class="form-group">
                <label for="pageUrl">Page URL</label>
                <input type="text" id="pageUrl" required>
            </div>
            <div class="form-group">
                <label for="pageDescription">Description</label>
                <textarea id="pageDescription" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="pageContent">Content</label>
                <textarea id="pageContent" rows="10"></textarea>
            </div>
        </form>
    `;
    
    openModal('Add New Page', content);
    
    $('#modalSave').click(function() {
        // Handle save logic here
        console.log('Saving page...');
        closeModal();
    });
}

function showAddNewsModal() {
    const content = `
        <form id="addNewsForm">
            <div class="form-group">
                <label for="newsTitle">News Title</label>
                <input type="text" id="newsTitle" required>
            </div>
            <div class="form-group">
                <label for="newsExcerpt">Excerpt</label>
                <textarea id="newsExcerpt" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="newsContent">Content</label>
                <textarea id="newsContent" rows="10"></textarea>
            </div>
            <div class="form-group">
                <label for="newsCategory">Category</label>
                <select id="newsCategory">
                    <option value="General">General</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Events">Events</option>
                    <option value="Research">Research</option>
                </select>
            </div>
            <div class="form-group">
                <label for="newsImage">Featured Image</label>
                <input type="file" id="newsImage" accept="image/*">
            </div>
        </form>
    `;
    
    openModal('Add News Article', content);
    
    $('#modalSave').click(function() {
        // Handle save logic here
        console.log('Saving news...');
        closeModal();
    });
}

function showAddProgramModal() {
    const content = `
        <form id="addProgramForm">
            <div class="form-group">
                <label for="programTitle">Program Title</label>
                <input type="text" id="programTitle" required>
            </div>
            <div class="form-group">
                <label for="programDescription">Description</label>
                <textarea id="programDescription" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="programLevel">Level</label>
                <select id="programLevel">
                    <option value="Certificate">Certificate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Short Course">Short Course</option>
                </select>
            </div>
            <div class="form-group">
                <label for="programDuration">Duration</label>
                <input type="text" id="programDuration" placeholder="e.g., 2 years">
            </div>
            <div class="form-group">
                <label for="programRequirements">Requirements</label>
                <textarea id="programRequirements" rows="3"></textarea>
            </div>
        </form>
    `;
    
    openModal('Add New Program', content);
    
    $('#modalSave').click(function() {
        // Handle save logic here
        console.log('Saving program...');
        closeModal();
    });
}

function showAddStaffModal() {
    const content = `
        <form id="addStaffForm">
            <div class="form-group">
                <label for="staffName">Full Name</label>
                <input type="text" id="staffName" required>
            </div>
            <div class="form-group">
                <label for="staffPosition">Position</label>
                <input type="text" id="staffPosition" required>
            </div>
            <div class="form-group">
                <label for="staffDepartment">Department</label>
                <input type="text" id="staffDepartment" required>
            </div>
            <div class="form-group">
                <label for="staffEmail">Email</label>
                <input type="email" id="staffEmail">
            </div>
            <div class="form-group">
                <label for="staffPhone">Phone</label>
                <input type="tel" id="staffPhone">
            </div>
            <div class="form-group">
                <label for="staffBio">Bio</label>
                <textarea id="staffBio" rows="4"></textarea>
            </div>
            <div class="form-group">
                <label for="staffPhoto">Photo</label>
                <input type="file" id="staffPhoto" accept="image/*">
            </div>
        </form>
    `;
    
    openModal('Add Staff Member', content);
    
    $('#modalSave').click(function() {
        // Handle save logic here
        console.log('Saving staff...');
        closeModal();
    });
}

function showUploadMediaModal() {
    const content = `
        <form id="uploadMediaForm">
            <div class="form-group">
                <label for="mediaFiles">Select Files</label>
                <input type="file" id="mediaFiles" multiple accept="image/*,video/*,.pdf,.doc,.docx">
            </div>
            <div class="form-group">
                <label for="mediaCategory">Category</label>
                <select id="mediaCategory">
                    <option value="general">General</option>
                    <option value="news">News</option>
                    <option value="programs">Programs</option>
                    <option value="staff">Staff</option>
                </select>
            </div>
        </form>
    `;
    
    openModal('Upload Media', content);
    
    $('#modalSave').click(function() {
        // Handle upload logic here
        console.log('Uploading media...');
        closeModal();
    });
}

function showAddContentModal() {
    const content = `
        <form id="addContentForm">
            <div class="form-group">
                <label for="contentType">Content Type</label>
                <select id="contentType">
                    <option value="page">Page</option>
                    <option value="news">News Article</option>
                    <option value="program">Program</option>
                    <option value="staff">Staff Member</option>
                </select>
            </div>
            <div class="form-group">
                <label for="contentTitle">Title</label>
                <input type="text" id="contentTitle" required>
            </div>
            <div class="form-group">
                <label for="contentDescription">Description</label>
                <textarea id="contentDescription" rows="3"></textarea>
            </div>
        </form>
    `;
    
    openModal('Add Content', content);
    
    $('#modalSave').click(function() {
        // Handle save logic here
        console.log('Saving content...');
        closeModal();
    });
}

// Action functions
function editPage(id) {
    console.log('Editing page:', id);
    // Implementation for editing page
}

function viewPage(url) {
    window.open(url, '_blank');
}

function deletePage(id) {
    if (confirm('Are you sure you want to delete this page?')) {
        console.log('Deleting page:', id);
        // Implementation for deleting page
    }
}

function editNews(id) {
    console.log('Editing news:', id);
    // Implementation for editing news
}

function deleteNews(id) {
    if (confirm('Are you sure you want to delete this news article?')) {
        console.log('Deleting news:', id);
        // Implementation for deleting news
    }
}

function editProgram(id) {
    console.log('Editing program:', id);
    // Implementation for editing program
}

function deleteProgram(id) {
    if (confirm('Are you sure you want to delete this program?')) {
        console.log('Deleting program:', id);
        // Implementation for deleting program
    }
}

function editStaff(id) {
    console.log('Editing staff:', id);
    // Implementation for editing staff
}

function deleteStaff(id) {
    if (confirm('Are you sure you want to delete this staff member?')) {
        console.log('Deleting staff:', id);
        // Implementation for deleting staff
    }
}

function editMedia(id) {
    console.log('Editing media:', id);
    // Implementation for editing media
}

function deleteMedia(id) {
    if (confirm('Are you sure you want to delete this media file?')) {
        console.log('Deleting media:', id);
        // Implementation for deleting media
    }
}

function editNavItem(id) {
    console.log('Editing navigation item:', id);
    // Implementation for editing navigation item
}

function deleteNavItem(id) {
    if (confirm('Are you sure you want to delete this navigation item?')) {
        console.log('Deleting navigation item:', id);
        // Implementation for deleting navigation item
    }
}

// Load backup data
function loadBackupData() {
    if (typeof backupManager !== 'undefined') {
        const stats = backupManager.getBackupStats();
        
        $('#totalBackups').text(stats.totalBackups);
        $('#totalSize').text(stats.totalSize);
        $('#lastBackup').text(stats.lastBackup ? new Date(stats.lastBackup).toLocaleDateString() : 'Never');
        $('#autoBackup').text(stats.autoBackup ? 'On' : 'Off');
        
        // Load backup list
        const backups = backupManager.getBackups();
        const backupListContent = $('#backupListContent');
        backupListContent.empty();
        
        if (backups.length === 0) {
            backupListContent.html('<p>No backups available</p>');
        } else {
            backups.forEach(backup => {
                const backupItem = $(`
                    <div class="backup-item">
                        <div class="backup-info">
                            <h4>Backup from ${new Date(backup.timestamp).toLocaleString()}</h4>
                            <p>Pages: ${backup.metadata.totalPages} | News: ${backup.metadata.totalNews} | Programs: ${backup.metadata.totalPrograms}</p>
                        </div>
                        <div class="backup-actions">
                            <button class="btn btn-primary btn-sm" onclick="backupManager.restoreBackup('${backup.key}')">
                                <i class="fas fa-undo"></i> Restore
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="backupManager.deleteBackup('${backup.key}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `);
                backupListContent.append(backupItem);
            });
        }
    }
}

// Backup settings
$(document).on('click', '#saveBackupSettings', function() {
    if (typeof backupManager !== 'undefined') {
        backupManager.backupSettings.autoBackup = $('#autoBackupEnabled').is(':checked');
        backupManager.backupSettings.backupFrequency = $('#backupFrequency').val();
        backupManager.backupSettings.backupRetention = parseInt($('#backupRetention').val());
        
        localStorage.setItem('backupSettings', JSON.stringify(backupManager.backupSettings));
        backupManager.showMessage('Backup settings saved!', 'success');
    }
});

// Logout functionality
$('#logoutBtn').click(function() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear authentication
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUser');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
});
