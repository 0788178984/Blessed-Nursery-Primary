// Settings Manager for Admin Panel
class SettingsManager {
    constructor() {
        this.settings = {
            general: {
                siteTitle: 'Blessed Nursery and Primary School',
                siteDescription: 'A leading educational institution committed to academic excellence and community transformation.',
                siteLogo: '../logoBlessed.jpg',
                siteUrl: 'https://blessednursery.ac.ug',
                adminEmail: 'admin@blessednursery.ac.ug'
            },
            appearance: {
                primaryColor: '#16a34a',
                secondaryColor: '#1f2937',
                accentColor: '#22c55e',
                fontFamily: 'Roboto',
                headerStyle: 'default',
                footerStyle: 'default'
            },
            contact: {
                phone: '+256 772 990 845',
                email: 'info@blessednursery.ac.ug',
                address: '123 Education Road, Kampala, Uganda',
                workingHours: 'Mon - Fri: 8:00 AM - 5:00 PM',
                socialMedia: {
                    facebook: 'https://facebook.com/blessednursery',
                    twitter: 'https://twitter.com/blessednursery',
                    linkedin: 'https://linkedin.com/company/blessednursery',
                    youtube: 'https://youtube.com/blessednursery',
                    instagram: 'https://instagram.com/blessednursery'
                }
            },
            seo: {
                metaDescription: 'Blessed Nursery and Primary School - A leading educational institution committed to academic excellence and community transformation.',
                metaKeywords: 'education, university, Uganda, academic excellence, higher education, diploma, certificate',
                googleAnalytics: '',
                googleSearchConsole: '',
                robotsTxt: 'User-agent: *\nAllow: /',
                sitemapUrl: '/sitemap.xml'
            },
            email: {
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                smtpUsername: '',
                smtpPassword: '',
                fromEmail: 'noreply@blessednursery.ac.ug',
                fromName: 'Blessed Nursery and Primary School'
            },
            security: {
                sessionTimeout: 30, // minutes
                maxLoginAttempts: 5,
                passwordMinLength: 8,
                requireTwoFactor: false,
                allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
                maxFileSize: 10 // MB
            },
            backup: {
                autoBackup: true,
                backupFrequency: 'daily', // daily, weekly, monthly
                backupRetention: 30, // days
                backupLocation: 'local' // local, cloud
            }
        };
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
    }

    loadSettings() {
        // Load settings from localStorage or server
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        
        this.populateSettingsForm();
    }

    saveSettings() {
        // Save settings to localStorage or server
        localStorage.setItem('adminSettings', JSON.stringify(this.settings));
        this.showMessage('Settings saved successfully!', 'success');
    }

    populateSettingsForm() {
        // General settings
        $('#siteTitle').val(this.settings.general.siteTitle);
        $('#siteDescription').val(this.settings.general.siteDescription);
        $('#siteUrl').val(this.settings.general.siteUrl);
        $('#adminEmail').val(this.settings.general.adminEmail);

        // Appearance settings
        $('#primaryColor').val(this.settings.appearance.primaryColor);
        $('#secondaryColor').val(this.settings.appearance.secondaryColor);
        $('#accentColor').val(this.settings.appearance.accentColor);
        $('#fontFamily').val(this.settings.appearance.fontFamily);

        // Contact settings
        $('#contactPhone').val(this.settings.contact.phone);
        $('#contactEmail').val(this.settings.contact.email);
        $('#contactAddress').val(this.settings.contact.address);
        $('#workingHours').val(this.settings.contact.workingHours);
        $('#facebookUrl').val(this.settings.contact.socialMedia.facebook);
        $('#twitterUrl').val(this.settings.contact.socialMedia.twitter);
        $('#linkedinUrl').val(this.settings.contact.socialMedia.linkedin);
        $('#youtubeUrl').val(this.settings.contact.socialMedia.youtube);
        $('#instagramUrl').val(this.settings.contact.socialMedia.instagram);

        // SEO settings
        $('#metaDescription').val(this.settings.seo.metaDescription);
        $('#metaKeywords').val(this.settings.seo.metaKeywords);
        $('#googleAnalytics').val(this.settings.seo.googleAnalytics);
        $('#googleSearchConsole').val(this.settings.seo.googleSearchConsole);
    }

    setupEventListeners() {
        // Save settings button
        $(document).on('click', '#saveSettingsBtn', () => {
            this.updateSettings();
            this.saveSettings();
        });

        // Reset settings button
        $(document).on('click', '#resetSettingsBtn', () => {
            if (confirm('Are you sure you want to reset all settings to default?')) {
                this.resetSettings();
            }
        });

        // Export settings button
        $(document).on('click', '#exportSettingsBtn', () => {
            this.exportSettings();
        });

        // Import settings button
        $(document).on('click', '#importSettingsBtn', () => {
            $('#importSettingsFile').click();
        });

        // Import settings file change
        $(document).on('change', '#importSettingsFile', (e) => {
            this.importSettings(e.target.files[0]);
        });

        // Color picker changes
        $(document).on('change', '#primaryColor, #secondaryColor, #accentColor', () => {
            this.updateColorPreview();
        });
    }

    updateSettings() {
        // General settings
        this.settings.general.siteTitle = $('#siteTitle').val();
        this.settings.general.siteDescription = $('#siteDescription').val();
        this.settings.general.siteUrl = $('#siteUrl').val();
        this.settings.general.adminEmail = $('#adminEmail').val();

        // Appearance settings
        this.settings.appearance.primaryColor = $('#primaryColor').val();
        this.settings.appearance.secondaryColor = $('#secondaryColor').val();
        this.settings.appearance.accentColor = $('#accentColor').val();
        this.settings.appearance.fontFamily = $('#fontFamily').val();

        // Contact settings
        this.settings.contact.phone = $('#contactPhone').val();
        this.settings.contact.email = $('#contactEmail').val();
        this.settings.contact.address = $('#contactAddress').val();
        this.settings.contact.workingHours = $('#workingHours').val();
        this.settings.contact.socialMedia.facebook = $('#facebookUrl').val();
        this.settings.contact.socialMedia.twitter = $('#twitterUrl').val();
        this.settings.contact.socialMedia.linkedin = $('#linkedinUrl').val();
        this.settings.contact.socialMedia.youtube = $('#youtubeUrl').val();
        this.settings.contact.socialMedia.instagram = $('#instagramUrl').val();

        // SEO settings
        this.settings.seo.metaDescription = $('#metaDescription').val();
        this.settings.seo.metaKeywords = $('#metaKeywords').val();
        this.settings.seo.googleAnalytics = $('#googleAnalytics').val();
        this.settings.seo.googleSearchConsole = $('#googleSearchConsole').val();
    }

    updateColorPreview() {
        const primaryColor = $('#primaryColor').val();
        const secondaryColor = $('#secondaryColor').val();
        const accentColor = $('#accentColor').val();

        // Update CSS variables for preview
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);
    }

    resetSettings() {
        // Reset to default settings
        this.settings = {
            general: {
                siteTitle: 'Blessed Nursery and Primary School',
                siteDescription: 'A leading educational institution committed to academic excellence and community transformation.',
                siteLogo: '../logoBlessed.jpg',
                siteUrl: 'https://blessednursery.ac.ug',
                adminEmail: 'admin@blessednursery.ac.ug'
            },
            appearance: {
                primaryColor: '#16a34a',
                secondaryColor: '#1f2937',
                accentColor: '#22c55e',
                fontFamily: 'Roboto',
                headerStyle: 'default',
                footerStyle: 'default'
            },
            contact: {
                phone: '+256 772 990 845',
                email: 'info@blessednursery.ac.ug',
                address: '123 Education Road, Kampala, Uganda',
                workingHours: 'Mon - Fri: 8:00 AM - 5:00 PM',
                socialMedia: {
                    facebook: 'https://facebook.com/blessednursery',
                    twitter: 'https://twitter.com/blessednursery',
                    linkedin: 'https://linkedin.com/company/blessednursery',
                    youtube: 'https://youtube.com/blessednursery',
                    instagram: 'https://instagram.com/blessednursery'
                }
            },
            seo: {
                metaDescription: 'Blessed Nursery and Primary School - A leading educational institution committed to academic excellence and community transformation.',
                metaKeywords: 'education, university, Uganda, academic excellence, higher education, diploma, certificate',
                googleAnalytics: '',
                googleSearchConsole: '',
                robotsTxt: 'User-agent: *\nAllow: /',
                sitemapUrl: '/sitemap.xml'
            }
        };

        this.populateSettingsForm();
        this.saveSettings();
    }

    exportSettings() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'paradigm-institute-settings.json';
        link.click();
    }

    importSettings(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);
                this.settings = { ...this.settings, ...importedSettings };
                this.populateSettingsForm();
                this.saveSettings();
                this.showMessage('Settings imported successfully!', 'success');
            } catch (error) {
                this.showMessage('Error importing settings: Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
    }

    getSetting(category, key) {
        return this.settings[category]?.[key];
    }

    setSetting(category, key, value) {
        if (!this.settings[category]) {
            this.settings[category] = {};
        }
        this.settings[category][key] = value;
        this.saveSettings();
    }

    showMessage(message, type = 'info') {
        const messageClass = `alert-${type}`;
        const messageHtml = `
            <div class="alert ${messageClass}" style="position: fixed; top: 20px; right: 20px; z-index: 9999; padding: 10px 20px; border-radius: 4px; background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'}; color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};">
                ${message}
            </div>
        `;
        
        $('body').append(messageHtml);
        
        setTimeout(() => {
            $('.alert').fadeOut();
        }, 3000);
    }

    // Generate sitemap
    generateSitemap() {
        const pages = contentManager.pages.filter(page => page.status === 'published');
        const baseUrl = this.settings.general.siteUrl;
        
        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        pages.forEach(page => {
            sitemap += '  <url>\n';
            sitemap += `    <loc>${baseUrl}${page.url.replace('../', '/')}</loc>\n`;
            sitemap += `    <lastmod>${page.lastModified}</lastmod>\n`;
            sitemap += '    <changefreq>weekly</changefreq>\n';
            sitemap += '    <priority>0.8</priority>\n';
            sitemap += '  </url>\n';
        });
        
        sitemap += '</urlset>';
        
        return sitemap;
    }

    // Generate robots.txt
    generateRobotsTxt() {
        const baseUrl = this.settings.general.siteUrl;
        return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;
    }
}

// Initialize settings manager
const settingsManager = new SettingsManager();
