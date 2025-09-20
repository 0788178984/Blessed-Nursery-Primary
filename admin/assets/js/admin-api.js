// Admin Panel JavaScript with PHP API Integration
// Main functionality for the admin dashboard

// API Base URL
const API_BASE = '../api/';

// Global variables
let currentUser = null;
let authToken = null;

$(document).ready(function() {
    // Check authentication first
    checkAuthentication();
});

function checkAuthentication() {
    $.ajax({
        url: API_BASE + 'auth.php?action=check',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                currentUser = response.data.user;
                authToken = response.data.token;
                initializeAdminPanel();
            } else {
                redirectToLogin();
            }
        },
        error: function() {
            redirectToLogin();
        }
    });
}

function redirectToLogin() {
    window.location.href = 'login.php';
}

function initializeAdminPanel() {
    updatePageTitle('Dashboard');
    initializeModals();
    initializeQuickActions();
    initializeContentManagement();
    loadDashboardData();
    initializeNavigation();
}

function initializeNavigation() {
    // Handle navigation clicks
    $('.nav-link').on('click', function(e) {
        e.preventDefault();
        const section = $(this).data('section');
        showSection(section);
    });
    
    // Handle logout
    $('#logoutBtn').on('click', function() {
        handleLogout();
    });
}

function showSection(section) {
    // Hide all sections
    $('.content-section').hide();
    
    // Show selected section
    $('#' + section + 'Section').show();
    
    // Update active nav link
    $('.nav-link').removeClass('active');
    $('.nav-link[data-section="' + section + '"]').addClass('active');
    
    // Load section data
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'pages':
            loadPagesData();
            break;
        case 'news':
            loadNewsData();
            break;
        case 'programs':
            loadProgramsData();
            break;
        case 'staff':
            loadStaffData();
            break;
        case 'media':
            loadMediaData();
            break;
        case 'navigation':
            loadNavigationData();
            break;
        case 'settings':
            loadSettingsData();
            break;
        case 'backup':
            loadBackupData();
            break;
    }
}

function updatePageTitle(title) {
    $('.page-title').text(title);
    document.title = title + ' - Admin Panel';
}

function initializeModals() {
    // Close modal when clicking outside
    $(document).on('click', '.modal-overlay', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal with escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(modalId) {
    $('#' + modalId).addClass('active');
    $('body').addClass('modal-open');
}

function closeModal() {
    $('.modal').removeClass('active');
    $('body').removeClass('modal-open');
    // Clear form data
    $('.modal form')[0].reset();
}

function initializeQuickActions() {
    $('.quick-action').on('click', function() {
        const action = $(this).data('action');
        switch(action) {
            case 'add-page':
                openModal('addPageModal');
                break;
            case 'add-news':
                openModal('addNewsModal');
                break;
            case 'add-program':
                openModal('addProgramModal');
                break;
            case 'add-staff':
                openModal('addStaffModal');
                break;
        }
    });
}

function initializeContentManagement() {
    // Initialize filters
    $('#contentFilter').on('change', function() {
        const type = $(this).val();
        filterContent(type);
    });
    
    $('#mediaFilter').on('change', function() {
        const type = $(this).val();
        filterMediaByType(type);
    });
}

function loadDashboardData() {
    // Load dashboard statistics
    Promise.all([
        loadPagesCount(),
        loadNewsCount(),
        loadProgramsCount(),
        loadStaffCount(),
        loadMediaCount(),
        loadContactStats()
    ]).then(() => {
        // Animate numbers
        $('.stat-number').each(function() {
            const target = parseInt($(this).data('target'));
            animateNumber($(this), 0, target, 1000);
        });
    });
}

function loadPagesCount() {
    return $.ajax({
        url: API_BASE + 'pages.php?action=list&limit=1',
        method: 'GET',
        dataType: 'json'
    }).done(function(response) {
        if (response.success) {
            $('#pagesCount').data('target', response.data.pagination.total_items);
        }
    });
}

function loadNewsCount() {
    return $.ajax({
        url: API_BASE + 'news.php?action=list&limit=1',
        method: 'GET',
        dataType: 'json'
    }).done(function(response) {
        if (response.success) {
            $('#newsCount').data('target', response.data.pagination.total_items);
        }
    });
}

function loadProgramsCount() {
    return $.ajax({
        url: API_BASE + 'programs.php?action=list&limit=1',
        method: 'GET',
        dataType: 'json'
    }).done(function(response) {
        if (response.success) {
            $('#programsCount').data('target', response.data.pagination.total_items);
        }
    });
}

function loadStaffCount() {
    return $.ajax({
        url: API_BASE + 'staff.php?action=list&limit=1',
        method: 'GET',
        dataType: 'json'
    }).done(function(response) {
        if (response.success) {
            $('#staffCount').data('target', response.data.pagination.total_items);
        }
    });
}

function loadMediaCount() {
    return $.ajax({
        url: API_BASE + 'media.php?action=list&limit=1',
        method: 'GET',
        dataType: 'json'
    }).done(function(response) {
        if (response.success) {
            $('#mediaCount').data('target', response.data.pagination.total_items);
        }
    });
}

function loadContactStats() {
    return $.ajax({
        url: API_BASE + 'contact.php?action=stats',
        method: 'GET',
        dataType: 'json'
    }).done(function(response) {
        if (response.success) {
            $('#messagesCount').data('target', response.data.stats.total);
        }
    });
}

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.text(Math.floor(current));
    }, 16);
}

function loadPagesData() {
    $.ajax({
        url: API_BASE + 'pages.php?action=list',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                displayPages(response.data.pages);
            } else {
                showError('Failed to load pages: ' + response.error);
            }
        },
        error: function() {
            showError('Failed to load pages');
        }
    });
}

function displayPages(pages) {
    const container = $('#pagesList');
    container.empty();
    
    pages.forEach(page => {
        const statusClass = page.status === 'published' ? 'status-published' : 'status-draft';
        const pageHtml = `
            <div class="content-item">
                <div class="content-info">
                    <h4>${page.title}</h4>
                    <p>Created: ${formatDate(page.created_at)} by ${page.created_by_name || 'Unknown'}</p>
                </div>
                <div class="content-actions">
                    <span class="status ${statusClass}">${page.status}</span>
                    <button class="btn btn-sm btn-outline" onclick="editPage(${page.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePage(${page.id})">Delete</button>
                </div>
            </div>
        `;
        container.append(pageHtml);
    });
}

function loadNewsData() {
    $.ajax({
        url: API_BASE + 'news.php?action=list',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                displayNews(response.data.news);
            } else {
                showError('Failed to load news: ' + response.error);
            }
        },
        error: function() {
            showError('Failed to load news');
        }
    });
}

function displayNews(news) {
    const container = $('#newsList');
    container.empty();
    
    news.forEach(item => {
        const statusClass = item.status === 'published' ? 'status-published' : 'status-draft';
        const featuredBadge = item.is_featured ? '<span class="badge badge-primary">Featured</span>' : '';
        const newsHtml = `
            <div class="content-item">
                <div class="content-info">
                    <h4>${item.title} ${featuredBadge}</h4>
                    <p>Created: ${formatDate(item.created_at)} by ${item.created_by_name || 'Unknown'}</p>
                </div>
                <div class="content-actions">
                    <span class="status ${statusClass}">${item.status}</span>
                    <button class="btn btn-sm btn-outline" onclick="editNews(${item.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteNews(${item.id})">Delete</button>
                </div>
            </div>
        `;
        container.append(newsHtml);
    });
}

function loadProgramsData() {
    $.ajax({
        url: API_BASE + 'programs.php?action=list',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                displayPrograms(response.data.programs);
            } else {
                showError('Failed to load programs: ' + response.error);
            }
        },
        error: function() {
            showError('Failed to load programs');
        }
    });
}

function displayPrograms(programs) {
    const container = $('#programsList');
    container.empty();
    
    programs.forEach(program => {
        const statusClass = program.status === 'active' ? 'status-published' : 'status-draft';
        const programHtml = `
            <div class="content-item">
                <div class="content-info">
                    <h4>${program.title}</h4>
                    <p>${program.level} • ${program.duration || 'N/A'}</p>
                </div>
                <div class="content-actions">
                    <span class="status ${statusClass}">${program.status}</span>
                    <button class="btn btn-sm btn-outline" onclick="editProgram(${program.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProgram(${program.id})">Delete</button>
                </div>
            </div>
        `;
        container.append(programHtml);
    });
}

function loadStaffData() {
    $.ajax({
        url: API_BASE + 'staff.php?action=list',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                displayStaff(response.data.staff);
            } else {
                showError('Failed to load staff: ' + response.error);
            }
        },
        error: function() {
            showError('Failed to load staff');
        }
    });
}

function displayStaff(staff) {
    const container = $('#staffList');
    container.empty();
    
    staff.forEach(member => {
        const staffHtml = `
            <div class="content-item">
                <div class="content-info">
                    <h4>${member.full_name}</h4>
                    <p>${member.position} • ${member.department || 'N/A'}</p>
                </div>
                <div class="content-actions">
                    <button class="btn btn-sm btn-outline" onclick="editStaff(${member.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStaff(${member.id})">Delete</button>
                </div>
            </div>
        `;
        container.append(staffHtml);
    });
}

function loadMediaData() {
    $.ajax({
        url: API_BASE + 'media.php?action=list',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                displayMedia(response.data.media);
            } else {
                showError('Failed to load media: ' + response.error);
            }
        },
        error: function() {
            showError('Failed to load media');
        }
    });
}

function displayMedia(media) {
    const container = $('#mediaList');
    container.empty();
    
    media.forEach(item => {
        const typeIcon = getMediaTypeIcon(item.file_type);
        const mediaHtml = `
            <div class="media-item">
                <div class="media-icon">
                    <i class="${typeIcon}"></i>
                </div>
                <div class="media-info">
                    <h4>${item.original_name}</h4>
                    <p>${item.file_type.toUpperCase()} • ${formatFileSize(item.file_size)} • ${formatDate(item.created_at)}</p>
                </div>
                <div class="media-actions">
                    <button class="btn btn-sm btn-outline" onclick="viewMedia(${item.id})">View</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMedia(${item.id})">Delete</button>
                </div>
            </div>
        `;
        container.append(mediaHtml);
    });
}

function getMediaTypeIcon(type) {
    if (type.startsWith('image/')) return 'fas fa-image';
    if (type.startsWith('video/')) return 'fas fa-video';
    if (type.includes('pdf')) return 'fas fa-file-pdf';
    if (type.startsWith('audio/')) return 'fas fa-music';
    return 'fas fa-file';
}

function loadNavigationData() {
    // This would load navigation data from API
    // For now, using static data
    const navigation = [
        { id: 1, title: 'Home', url: '/', sort_order: 1, is_active: true },
        { id: 2, title: 'About', url: '/about/', sort_order: 2, is_active: true },
        { id: 3, title: 'Programs', url: '/programs/', sort_order: 3, is_active: true }
    ];
    displayNavigation(navigation);
}

function displayNavigation(navigation) {
    const container = $('#navigationList');
    container.empty();
    
    navigation.forEach(item => {
        const statusClass = item.is_active ? 'status-published' : 'status-draft';
        const navHtml = `
            <div class="content-item">
                <div class="content-info">
                    <h4>${item.title}</h4>
                    <p>${item.url} • Order: ${item.sort_order}</p>
                </div>
                <div class="content-actions">
                    <span class="status ${statusClass}">${item.is_active ? 'Active' : 'Inactive'}</span>
                    <button class="btn btn-sm btn-outline" onclick="editNavigation(${item.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteNavigation(${item.id})">Delete</button>
                </div>
            </div>
        `;
        container.append(navHtml);
    });
}

function loadSettingsData() {
    $.ajax({
        url: API_BASE + 'settings.php?action=get',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                displaySettings(response.data.settings);
            } else {
                showError('Failed to load settings: ' + response.error);
            }
        },
        error: function() {
            showError('Failed to load settings');
        }
    });
}

function displaySettings(settings) {
    // Populate settings form
    Object.keys(settings).forEach(key => {
        const input = $(`[name="${key}"]`);
        if (input.length) {
            input.val(settings[key].value);
        }
    });
}

function loadBackupData() {
    // Load backup statistics and list
    // This would integrate with backup management
    console.log('Loading backup data...');
}

function filterContent(type) {
    // Hide all content sections
    $('.content-section').hide();
    
    // Show selected content type
    $('#' + type + 'Section').show();
    
    // Update active nav link
    $('.nav-link').removeClass('active');
    $('.nav-link[data-section="' + type + '"]').addClass('active');
}

function filterContentByType(type) {
    // This would filter content within each section
    console.log('Filtering content by type:', type);
}

function filterMediaByType(type) {
    // This would filter media by file type
    console.log('Filtering media by type:', type);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showError(message) {
    // Create or update error message display
    let errorDiv = $('#errorMessage');
    if (errorDiv.length === 0) {
        errorDiv = $('<div id="errorMessage" class="alert alert-error"></div>');
        $('body').prepend(errorDiv);
    }
    errorDiv.text(message).show();
    setTimeout(() => errorDiv.fadeOut(), 5000);
}

function showSuccess(message) {
    // Create or update success message display
    let successDiv = $('#successMessage');
    if (successDiv.length === 0) {
        successDiv = $('<div id="successMessage" class="alert alert-success"></div>');
        $('body').prepend(successDiv);
    }
    successDiv.text(message).show();
    setTimeout(() => successDiv.fadeOut(), 5000);
}

// Authentication functions
function handleLogout() {
    $.ajax({
        url: API_BASE + 'auth.php?action=logout',
        method: 'POST',
        dataType: 'json',
        success: function(response) {
            redirectToLogin();
        },
        error: function() {
            redirectToLogin();
        }
    });
}

// Modal functions
function openAddPageModal() {
    openModal('addPageModal');
}

function openAddNewsModal() {
    openModal('addNewsModal');
}

function openAddProgramModal() {
    openModal('addProgramModal');
}

function openAddStaffModal() {
    openModal('addStaffModal');
}

// Action functions
function editPage(id) {
    console.log('Edit page:', id);
    // Implementation for editing page
}

function deletePage(id) {
    if (confirm('Are you sure you want to delete this page?')) {
        $.ajax({
            url: API_BASE + 'pages.php?action=delete&id=' + id,
            method: 'DELETE',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showSuccess('Page deleted successfully');
                    loadPagesData();
                } else {
                    showError('Failed to delete page: ' + response.error);
                }
            },
            error: function() {
                showError('Failed to delete page');
            }
        });
    }
}

function editNews(id) {
    console.log('Edit news:', id);
    // Implementation for editing news
}

function deleteNews(id) {
    if (confirm('Are you sure you want to delete this news item?')) {
        $.ajax({
            url: API_BASE + 'news.php?action=delete&id=' + id,
            method: 'DELETE',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showSuccess('News item deleted successfully');
                    loadNewsData();
                } else {
                    showError('Failed to delete news item: ' + response.error);
                }
            },
            error: function() {
                showError('Failed to delete news item');
            }
        });
    }
}

function editProgram(id) {
    console.log('Edit program:', id);
    // Implementation for editing program
}

function deleteProgram(id) {
    if (confirm('Are you sure you want to delete this program?')) {
        $.ajax({
            url: API_BASE + 'programs.php?action=delete&id=' + id,
            method: 'DELETE',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showSuccess('Program deleted successfully');
                    loadProgramsData();
                } else {
                    showError('Failed to delete program: ' + response.error);
                }
            },
            error: function() {
                showError('Failed to delete program');
            }
        });
    }
}

function editStaff(id) {
    console.log('Edit staff:', id);
    // Implementation for editing staff
}

function deleteStaff(id) {
    if (confirm('Are you sure you want to delete this staff member?')) {
        $.ajax({
            url: API_BASE + 'staff.php?action=delete&id=' + id,
            method: 'DELETE',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showSuccess('Staff member deleted successfully');
                    loadStaffData();
                } else {
                    showError('Failed to delete staff member: ' + response.error);
                }
            },
            error: function() {
                showError('Failed to delete staff member');
            }
        });
    }
}

function viewMedia(id) {
    console.log('View media:', id);
    // Implementation for viewing media
}

function deleteMedia(id) {
    if (confirm('Are you sure you want to delete this media file?')) {
        $.ajax({
            url: API_BASE + 'media.php?action=delete&id=' + id,
            method: 'DELETE',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showSuccess('Media file deleted successfully');
                    loadMediaData();
                } else {
                    showError('Failed to delete media file: ' + response.error);
                }
            },
            error: function() {
                showError('Failed to delete media file');
            }
        });
    }
}

function editNavigation(id) {
    console.log('Edit navigation:', id);
    // Implementation for editing navigation
}

function deleteNavigation(id) {
    if (confirm('Are you sure you want to delete this navigation item?')) {
        console.log('Delete navigation:', id);
        // Implementation for deleting navigation
    }
}
