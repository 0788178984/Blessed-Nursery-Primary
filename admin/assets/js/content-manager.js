// Content Manager for Admin Panel
class ContentManager {
    constructor() {
        this.pages = [];
        this.news = [];
        this.programs = [];
        this.staff = [];
        this.media = [];
        this.navigation = [];
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
    }

    loadData() {
        // Load pages data
        this.pages = [
            {
                id: 1,
                title: 'Home',
                url: '../index.html',
                description: 'Main homepage of Blessed Nursery and Primary School',
                status: 'published',
                lastModified: '2025-01-15',
                content: this.getPageContent('../index.html')
            },
            {
                id: 2,
                title: 'Vision & Mission',
                url: '../about/vision-mission.html',
                description: 'Our vision, mission, and core values',
                status: 'published',
                lastModified: '2025-01-14',
                content: this.getPageContent('../about/vision-mission.html')
            },
            {
                id: 3,
                title: 'Academic Programs',
                url: '../academics/programs.html',
                description: 'Overview of all academic programs offered',
                status: 'published',
                lastModified: '2025-01-13',
                content: this.getPageContent('../academics/programs.html')
            },
            {
                id: 4,
                title: 'Administration',
                url: '../about/administration.html',
                description: 'Leadership and administrative structure',
                status: 'published',
                lastModified: '2025-01-12',
                content: this.getPageContent('../about/administration.html')
            },
            {
                id: 5,
                title: 'History',
                url: '../about/history.html',
                description: 'Institutional history and milestones',
                status: 'published',
                lastModified: '2025-01-11',
                content: this.getPageContent('../about/history.html')
            },
            {
                id: 6,
                title: 'Strategic Plans',
                url: '../about/strategic-plans.html',
                description: 'Strategic planning and future direction',
                status: 'published',
                lastModified: '2025-01-10',
                content: this.getPageContent('../about/strategic-plans.html')
            },
            {
                id: 7,
                title: 'Policies',
                url: '../about/policies.html',
                description: 'Institutional policies and procedures',
                status: 'published',
                lastModified: '2025-01-09',
                content: this.getPageContent('../about/policies.html')
            },
            {
                id: 8,
                title: 'Anthem',
                url: '../about/anthem.html',
                description: 'Institutional anthem and songs',
                status: 'published',
                lastModified: '2025-01-08',
                content: this.getPageContent('../about/anthem.html')
            },
            {
                id: 9,
                title: 'Administrative Offices',
                url: '../about/administrative-offices.html',
                description: 'Administrative offices and departments',
                status: 'published',
                lastModified: '2025-01-07',
                content: this.getPageContent('../about/administrative-offices.html')
            },
            {
                id: 10,
                title: 'Organogram',
                url: '../about/organogram.html',
                description: 'Organizational structure and hierarchy',
                status: 'published',
                lastModified: '2025-01-06',
                content: this.getPageContent('../about/organogram.html')
            },
            {
                id: 11,
                title: 'The Chancellor',
                url: '../about/governance/chancellor.html',
                description: 'Chancellor profile and message',
                status: 'published',
                lastModified: '2025-01-05',
                content: this.getPageContent('../about/governance/chancellor.html')
            },
            {
                id: 12,
                title: 'The Director',
                url: '../about/governance/vice-chancellor.html',
                description: 'Director profile and message',
                status: 'published',
                lastModified: '2025-01-04',
                content: this.getPageContent('../about/governance/vice-chancellor.html')
            },
            {
                id: 13,
                title: 'University Council',
                url: '../about/governance/university-council.html',
                description: 'University council members and functions',
                status: 'published',
                lastModified: '2025-01-03',
                content: this.getPageContent('../about/governance/university-council.html')
            },
            {
                id: 14,
                title: 'University Management',
                url: '../about/governance/university-management.html',
                description: 'University management team',
                status: 'published',
                lastModified: '2025-01-02',
                content: this.getPageContent('../about/governance/university-management.html')
            },
            {
                id: 15,
                title: 'University Senate',
                url: '../about/governance/university-senate.html',
                description: 'University senate members and functions',
                status: 'published',
                lastModified: '2025-01-01',
                content: this.getPageContent('../about/governance/university-senate.html')
            },
            {
                id: 16,
                title: 'Staff Directory',
                url: '../about/governance/staff-directory.html',
                description: 'Complete staff directory',
                status: 'published',
                lastModified: '2024-12-31',
                content: this.getPageContent('../about/governance/staff-directory.html')
            },
            {
                id: 17,
                title: 'Chancellor\'s Message',
                url: '../about/governance/chancellor-message.html',
                description: 'Chancellor\'s welcome message',
                status: 'published',
                lastModified: '2024-12-30',
                content: this.getPageContent('../about/governance/chancellor-message.html')
            },
            {
                id: 18,
                title: 'Academic Calendar',
                url: '../academics/calendar.html',
                description: 'Academic calendar and important dates',
                status: 'published',
                lastModified: '2024-12-29',
                content: this.getPageContent('../academics/calendar.html')
            },
            {
                id: 19,
                title: 'Apply',
                url: '../admissions/apply.html',
                description: 'Admission application process',
                status: 'published',
                lastModified: '2024-12-28',
                content: this.getPageContent('../admissions/apply.html')
            },
            {
                id: 20,
                title: 'Research',
                url: '../research/index.html',
                description: 'Research activities and publications',
                status: 'published',
                lastModified: '2024-12-27',
                content: this.getPageContent('../research/index.html')
            },
            {
                id: 21,
                title: 'News & Events',
                url: '../news/index.html',
                description: 'Latest news and upcoming events',
                status: 'published',
                lastModified: '2024-12-26',
                content: this.getPageContent('../news/index.html')
            },
            {
                id: 22,
                title: 'Contact',
                url: '../contact/index.html',
                description: 'Contact information and location',
                status: 'published',
                lastModified: '2024-12-25',
                content: this.getPageContent('../contact/index.html')
            },
            {
                id: 23,
                title: 'E-Learning',
                url: '../elearning/index.html',
                description: 'Online learning platform',
                status: 'published',
                lastModified: '2024-12-24',
                content: this.getPageContent('../elearning/index.html')
            }
        ];

        // Load news data
        this.news = [
            {
                id: 1,
                title: 'Admissions Open for 2025/2026 Academic Year',
                excerpt: 'Applications are now open for all undergraduate and postgraduate programs.',
                content: 'We are pleased to announce that applications for the 2025/2026 academic year are now open. Prospective students can apply for various programs including diplomas, certificates, and short courses.',
                image: '../assets/images/slider/body.jpeg',
                date: '2025-09-06',
                category: 'Admissions',
                status: 'published'
            },
            {
                id: 2,
                title: 'Orientation Week for New Students',
                excerpt: 'Join us for orientation activities from September 15-20, 2025.',
                content: 'New students are invited to participate in our comprehensive orientation program designed to help them transition smoothly into academic life.',
                image: '../assets/images/slider/students.jpg',
                date: '2025-09-01',
                category: 'Events',
                status: 'published'
            },
            {
                id: 3,
                title: 'Annual Convocation Ceremony',
                excerpt: 'Graduation ceremony scheduled for September 26, 2025.',
                content: 'The annual convocation ceremony will be held on September 26, 2025, to celebrate the achievements of our graduating students.',
                image: '../assets/images/slider/uvtb.jpeg',
                date: '2025-08-25',
                category: 'Events',
                status: 'published'
            }
        ];

        // Load programs data
        this.programs = [
            {
                id: 1,
                title: 'Diploma in Information Technology',
                description: 'Practical IT skills for the modern workplace.',
                level: 'Diploma',
                duration: '2 years',
                requirements: 'O-Level certificate or equivalent',
                icon: 'fas fa-laptop-code',
                status: 'active'
            },
            {
                id: 2,
                title: 'Diploma in Business Administration',
                description: 'Foundational business knowledge in marketing, finance and management.',
                level: 'Diploma',
                duration: '2 years',
                requirements: 'O-Level certificate or equivalent',
                icon: 'fas fa-briefcase',
                status: 'active'
            },
            {
                id: 3,
                title: 'Certificate in Computer Applications',
                description: 'Essential computer literacy: Word, Excel, PowerPoint, Internet.',
                level: 'Certificate',
                duration: '6 months',
                requirements: 'Basic literacy',
                icon: 'fas fa-keyboard',
                status: 'active'
            },
            {
                id: 4,
                title: 'Tailoring & Fashion Design',
                description: 'Hands‑on garment construction and design fundamentals.',
                level: 'Short Course',
                duration: '3 months',
                requirements: 'No formal requirements',
                icon: 'fas fa-cut',
                status: 'active'
            }
        ];

        // Load staff data
        this.staff = [
            {
                id: 1,
                name: 'Dr. John Smith',
                position: 'Executive Director',
                department: 'Administration',
                email: 'director@blessednursery.ac.ug',
                phone: '+256 772 990 845',
                bio: 'Experienced educational leader with over 15 years in higher education.',
                avatar: '../images/ACAALI.jpg',
                status: 'active'
            },
            {
                id: 2,
                name: 'Dr. Jane Doe',
                position: 'Academic Registrar',
                department: 'Academics',
                email: 'registrar@blessednursery.ac.ug',
                phone: '+256 777 348 121',
                bio: 'Academic administrator specializing in curriculum development and quality assurance.',
                avatar: '../images/ACAALI.jpg',
                status: 'active'
            },
            {
                id: 3,
                name: 'Mr. Robert Johnson',
                position: 'Bursar',
                department: 'Finance',
                email: 'bursar@blessednursery.ac.ug',
                phone: '+256 700 123 456',
                bio: 'Financial management expert with extensive experience in educational institutions.',
                avatar: '../images/ACAALI.jpg',
                status: 'active'
            }
        ];

        // Load media data
        this.media = [
            {
                id: 1,
                name: 'institute-logo.png',
                type: 'image',
                size: '2.5 MB',
                url: '../logoBlessed.jpg',
                category: 'general',
                uploadDate: '2025-01-15'
            },
            {
                id: 2,
                name: 'campus-photo.jpg',
                type: 'image',
                size: '1.8 MB',
                url: '../assets/images/slider/body.jpeg',
                category: 'general',
                uploadDate: '2025-01-14'
            },
            {
                id: 3,
                name: 'students.jpg',
                type: 'image',
                size: '2.1 MB',
                url: '../assets/images/slider/students.jpg',
                category: 'news',
                uploadDate: '2025-01-13'
            }
        ];

        // Load navigation data
        this.navigation = [
            { id: 1, title: 'Home', url: '../index.html', parent: null, order: 1, status: 'active' },
            { id: 2, title: 'About', url: '#', parent: null, order: 2, hasChildren: true, status: 'active' },
            { id: 3, title: 'History', url: '../about/history.html', parent: 2, order: 1, status: 'active' },
            { id: 4, title: 'Vision & Mission', url: '../about/vision-mission.html', parent: 2, order: 2, status: 'active' },
            { id: 5, title: 'Academics', url: '../academics/programs.html', parent: null, order: 3, status: 'active' },
            { id: 6, title: 'Admissions', url: '../admissions/apply.html', parent: null, order: 4, status: 'active' },
            { id: 7, title: 'Research', url: '../research/index.html', parent: null, order: 5, status: 'active' },
            { id: 8, title: 'News & Events', url: '../news/index.html', parent: null, order: 6, status: 'active' },
            { id: 9, title: 'Contact', url: '../contact/index.html', parent: null, order: 7, status: 'active' }
        ];
    }

    getPageContent(url) {
        // This would typically fetch content from the actual page
        // For now, return a placeholder
        return 'Page content would be loaded here...';
    }

    setupEventListeners() {
        // Set up event listeners for content management
        $(document).on('click', '.edit-page', (e) => {
            const pageId = $(e.currentTarget).data('id');
            this.editPage(pageId);
        });

        $(document).on('click', '.delete-page', (e) => {
            const pageId = $(e.currentTarget).data('id');
            this.deletePage(pageId);
        });
    }

    // Display content based on type
    displayContent(type) {
        switch(type) {
            case 'pages':
                this.displayPages();
                break;
            case 'news':
                this.displayNews();
                break;
            case 'programs':
                this.displayPrograms();
                break;
            case 'staff':
                this.displayStaff();
                break;
            case 'media':
                this.displayMedia();
                break;
        }
    }

    displayPages() {
        const pagesGrid = $('#pagesGrid');
        pagesGrid.empty();

        this.pages.forEach(page => {
            const pageCard = $(`
                <div class="page-card">
                    <div class="page-card-header">
                        <h3 class="page-title">${page.title}</h3>
                        <a href="${page.url}" class="page-url" target="_blank">${page.url}</a>
                    </div>
                    <div class="page-card-body">
                        <p class="page-description">${page.description}</p>
                        <div class="page-meta">
                            <span class="page-status status-${page.status}">${page.status}</span>
                            <span class="page-date">Modified: ${page.lastModified}</span>
                        </div>
                        <div class="page-actions">
                            <button class="btn btn-primary btn-sm edit-page" data-id="${page.id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="window.open('${page.url}', '_blank')">
                                <i class="fas fa-external-link-alt"></i> View
                            </button>
                            <button class="btn btn-danger btn-sm delete-page" data-id="${page.id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `);
            
            pagesGrid.append(pageCard);
        });
    }

    displayNews() {
        const newsList = $('#newsList');
        newsList.empty();

        this.news.forEach(item => {
            const newsItem = $(`
                <div class="news-item">
                    <div class="news-image">
                        <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="news-content">
                        <h3 class="news-title">${item.title}</h3>
                        <p class="news-excerpt">${item.excerpt}</p>
                        <div class="news-meta">
                            <span>${item.date}</span> • <span>${item.category}</span> • <span class="status-${item.status}">${item.status}</span>
                        </div>
                        <div class="news-actions" style="margin-top: 10px;">
                            <button class="btn btn-primary btn-sm edit-news" data-id="${item.id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-danger btn-sm delete-news" data-id="${item.id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `);
            
            newsList.append(newsItem);
        });
    }

    displayPrograms() {
        const programsList = $('#programsList');
        programsList.empty();

        this.programs.forEach(program => {
            const programCard = $(`
                <div class="program-card">
                    <div class="program-icon">
                        <i class="${program.icon}"></i>
                    </div>
                    <h3 class="program-title">${program.title}</h3>
                    <p class="program-description">${program.description}</p>
                    <div class="program-details">
                        <span class="program-level">${program.level}</span>
                        <span class="program-duration">${program.duration}</span>
                    </div>
                    <div class="program-actions" style="margin-top: 15px;">
                        <button class="btn btn-primary btn-sm edit-program" data-id="${program.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-program" data-id="${program.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `);
            
            programsList.append(programCard);
        });
    }

    displayStaff() {
        const staffList = $('#staffList');
        staffList.empty();

        this.staff.forEach(member => {
            const staffCard = $(`
                <div class="staff-card">
                    <img src="${member.avatar}" alt="${member.name}" class="staff-avatar">
                    <h3 class="staff-name">${member.name}</h3>
                    <p class="staff-position">${member.position}</p>
                    <span class="staff-department">${member.department}</span>
                    <div class="staff-contact">
                        <p><i class="fas fa-envelope"></i> ${member.email}</p>
                        <p><i class="fas fa-phone"></i> ${member.phone}</p>
                    </div>
                    <div class="staff-actions" style="margin-top: 15px;">
                        <button class="btn btn-primary btn-sm edit-staff" data-id="${member.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-staff" data-id="${member.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `);
            
            staffList.append(staffCard);
        });
    }

    displayMedia() {
        const mediaGrid = $('#mediaGrid');
        mediaGrid.empty();

        this.media.forEach(item => {
            const mediaItem = $(`
                <div class="media-item">
                    <div class="media-preview">
                        <i class="fas fa-image"></i>
                    </div>
                    <div class="media-info">
                        <h4 class="media-name">${item.name}</h4>
                        <p class="media-size">${item.size}</p>
                        <p class="media-category">${item.category}</p>
                        <div class="media-actions" style="margin-top: 10px;">
                            <button class="btn btn-primary btn-sm edit-media" data-id="${item.id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-danger btn-sm delete-media" data-id="${item.id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `);
            
            mediaGrid.append(mediaItem);
        });
    }

    // CRUD operations
    editPage(id) {
        const page = this.pages.find(p => p.id === id);
        if (page) {
            this.showPageEditor(page);
        }
    }

    deletePage(id) {
        if (confirm('Are you sure you want to delete this page?')) {
            this.pages = this.pages.filter(p => p.id !== id);
            this.displayPages();
        }
    }

    showPageEditor(page) {
        const content = `
            <form id="pageEditorForm">
                <div class="form-group">
                    <label for="editPageTitle">Page Title</label>
                    <input type="text" id="editPageTitle" value="${page.title}" required>
                </div>
                <div class="form-group">
                    <label for="editPageUrl">Page URL</label>
                    <input type="text" id="editPageUrl" value="${page.url}" required>
                </div>
                <div class="form-group">
                    <label for="editPageDescription">Description</label>
                    <textarea id="editPageDescription" rows="3">${page.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="editPageContent">Content</label>
                    <textarea id="editPageContent" rows="15">${page.content}</textarea>
                </div>
                <div class="form-group">
                    <label for="editPageStatus">Status</label>
                    <select id="editPageStatus">
                        <option value="published" ${page.status === 'published' ? 'selected' : ''}>Published</option>
                        <option value="draft" ${page.status === 'draft' ? 'selected' : ''}>Draft</option>
                        <option value="archived" ${page.status === 'archived' ? 'selected' : ''}>Archived</option>
                    </select>
                </div>
            </form>
        `;
        
        openModal('Edit Page', content);
        
        $('#modalSave').off('click').click(() => {
            this.savePage(id);
        });
    }

    savePage(id) {
        const page = this.pages.find(p => p.id === id);
        if (page) {
            page.title = $('#editPageTitle').val();
            page.url = $('#editPageUrl').val();
            page.description = $('#editPageDescription').val();
            page.content = $('#editPageContent').val();
            page.status = $('#editPageStatus').val();
            page.lastModified = new Date().toISOString().split('T')[0];
            
            this.displayPages();
            closeModal();
        }
    }

    // Add new page
    addPage(pageData) {
        const newPage = {
            id: Math.max(...this.pages.map(p => p.id)) + 1,
            ...pageData,
            lastModified: new Date().toISOString().split('T')[0],
            status: 'draft'
        };
        
        this.pages.push(newPage);
        this.displayPages();
    }

    // Add new news
    addNews(newsData) {
        const newNews = {
            id: Math.max(...this.news.map(n => n.id)) + 1,
            ...newsData,
            status: 'published'
        };
        
        this.news.push(newNews);
        this.displayNews();
    }

    // Add new program
    addProgram(programData) {
        const newProgram = {
            id: Math.max(...this.programs.map(p => p.id)) + 1,
            ...programData,
            status: 'active'
        };
        
        this.programs.push(newProgram);
        this.displayPrograms();
    }

    // Add new staff member
    addStaff(staffData) {
        const newStaff = {
            id: Math.max(...this.staff.map(s => s.id)) + 1,
            ...staffData,
            status: 'active'
        };
        
        this.staff.push(newStaff);
        this.displayStaff();
    }

    // Get statistics
    getStats() {
        return {
            totalPages: this.pages.length,
            publishedPages: this.pages.filter(p => p.status === 'published').length,
            totalNews: this.news.length,
            totalPrograms: this.programs.length,
            totalStaff: this.staff.length,
            totalMedia: this.media.length
        };
    }
}

// Initialize content manager
const contentManager = new ContentManager();