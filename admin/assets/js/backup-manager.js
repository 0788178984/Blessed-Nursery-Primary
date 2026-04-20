// Backup Manager for Admin Panel
class BackupManager {
    constructor() {
        this.backupData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadBackupSettings();
    }

    setupEventListeners() {
        // Backup buttons
        $(document).on('click', '#createBackupBtn', () => {
            this.createBackup();
        });

        $(document).on('click', '#restoreBackupBtn', () => {
            this.showRestoreDialog();
        });

        $(document).on('click', '#downloadBackupBtn', () => {
            this.downloadBackup();
        });

        $(document).on('click', '#uploadBackupBtn', () => {
            $('#backupFileInput').click();
        });

        $(document).on('change', '#backupFileInput', (e) => {
            this.uploadBackup(e.target.files[0]);
        });

        // Auto backup
        setInterval(() => {
            if (this.shouldAutoBackup()) {
                this.createBackup(true);
            }
        }, 60000); // Check every minute
    }

    loadBackupSettings() {
        const settings = localStorage.getItem('backupSettings');
        if (settings) {
            this.backupSettings = JSON.parse(settings);
        } else {
            this.backupSettings = {
                autoBackup: true,
                backupFrequency: 'daily',
                backupRetention: 30,
                lastBackup: null
            };
        }
    }

    shouldAutoBackup() {
        if (!this.backupSettings.autoBackup) return false;
        
        const lastBackup = this.backupSettings.lastBackup;
        if (!lastBackup) return true;
        
        const now = new Date();
        const lastBackupDate = new Date(lastBackup);
        const diffHours = (now - lastBackupDate) / (1000 * 60 * 60);
        
        switch (this.backupSettings.backupFrequency) {
            case 'hourly':
                return diffHours >= 1;
            case 'daily':
                return diffHours >= 24;
            case 'weekly':
                return diffHours >= 168; // 7 days
            default:
                return false;
        }
    }

    createBackup(silent = false) {
        try {
            const backupData = {
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                data: {
                    pages: contentManager.pages,
                    news: contentManager.news,
                    programs: contentManager.programs,
                    staff: contentManager.staff,
                    media: contentManager.media,
                    navigation: contentManager.navigation,
                    settings: settingsManager.settings
                },
                metadata: {
                    totalPages: contentManager.pages.length,
                    totalNews: contentManager.news.length,
                    totalPrograms: contentManager.programs.length,
                    totalStaff: contentManager.staff.length,
                    totalMedia: contentManager.media.length
                }
            };

            // Store backup
            const backupKey = `backup_${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(backupData));
            
            // Update settings
            this.backupSettings.lastBackup = new Date().toISOString();
            localStorage.setItem('backupSettings', JSON.stringify(this.backupSettings));
            
            // Clean old backups
            this.cleanOldBackups();

            if (!silent) {
                this.showMessage('Backup created successfully!', 'success');
            }

            return backupData;
        } catch (error) {
            this.showMessage('Error creating backup: ' + error.message, 'error');
            return null;
        }
    }

    cleanOldBackups() {
        const retentionDays = this.backupSettings.backupRetention;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

        // Get all backup keys
        const keys = Object.keys(localStorage).filter(key => key.startsWith('backup_'));
        
        keys.forEach(key => {
            try {
                const backup = JSON.parse(localStorage.getItem(key));
                const backupDate = new Date(backup.timestamp);
                
                if (backupDate < cutoffDate) {
                    localStorage.removeItem(key);
                }
            } catch (error) {
                // Remove invalid backup
                localStorage.removeItem(key);
            }
        });
    }

    getBackups() {
        const backups = [];
        const keys = Object.keys(localStorage).filter(key => key.startsWith('backup_'));
        
        keys.forEach(key => {
            try {
                const backup = JSON.parse(localStorage.getItem(key));
                backups.push({
                    key: key,
                    timestamp: backup.timestamp,
                    metadata: backup.metadata
                });
            } catch (error) {
                // Skip invalid backup
            }
        });

        return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    showRestoreDialog() {
        const backups = this.getBackups();
        
        if (backups.length === 0) {
            this.showMessage('No backups available', 'warning');
            return;
        }

        const content = `
            <div class="backup-restore">
                <h3>Restore from Backup</h3>
                <p>Select a backup to restore from:</p>
                <div class="backup-list">
                    ${backups.map(backup => `
                        <div class="backup-item">
                            <div class="backup-info">
                                <h4>Backup from ${new Date(backup.timestamp).toLocaleString()}</h4>
                                <p>Pages: ${backup.metadata.totalPages} | News: ${backup.metadata.totalNews} | Programs: ${backup.metadata.totalPrograms}</p>
                            </div>
                            <div class="backup-actions">
                                <button class="btn btn-primary btn-sm" onclick="backupManager.restoreBackup('${backup.key}')">
                                    Restore
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="backupManager.deleteBackup('${backup.key}')">
                                    Delete
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        openModal('Restore Backup', content);
    }

    restoreBackup(backupKey) {
        try {
            const backupData = JSON.parse(localStorage.getItem(backupKey));
            
            if (!backupData || !backupData.data) {
                throw new Error('Invalid backup data');
            }

            // Confirm restore
            if (!confirm('Are you sure you want to restore this backup? This will overwrite all current data.')) {
                return;
            }

            // Restore data
            if (backupData.data.pages) {
                contentManager.pages = backupData.data.pages;
            }
            if (backupData.data.news) {
                contentManager.news = backupData.data.news;
            }
            if (backupData.data.programs) {
                contentManager.programs = backupData.data.programs;
            }
            if (backupData.data.staff) {
                contentManager.staff = backupData.data.staff;
            }
            if (backupData.data.media) {
                contentManager.media = backupData.data.media;
            }
            if (backupData.data.navigation) {
                contentManager.navigation = backupData.data.navigation;
            }
            if (backupData.data.settings) {
                settingsManager.settings = backupData.data.settings;
            }

            // Refresh displays
            contentManager.displayContent('pages');
            contentManager.displayContent('news');
            contentManager.displayContent('programs');
            contentManager.displayContent('staff');
            contentManager.displayContent('media');
            settingsManager.populateSettingsForm();

            closeModal();
            this.showMessage('Backup restored successfully!', 'success');
        } catch (error) {
            this.showMessage('Error restoring backup: ' + error.message, 'error');
        }
    }

    deleteBackup(backupKey) {
        if (confirm('Are you sure you want to delete this backup?')) {
            localStorage.removeItem(backupKey);
            this.showMessage('Backup deleted successfully!', 'success');
            this.showRestoreDialog(); // Refresh the dialog
        }
    }

    downloadBackup() {
        const backupData = this.createBackup(true);
        if (backupData) {
            const dataStr = JSON.stringify(backupData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `paradigm-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            this.showMessage('Backup downloaded successfully!', 'success');
        }
    }

    uploadBackup(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backupData = JSON.parse(e.target.result);
                
                if (!backupData.data) {
                    throw new Error('Invalid backup file format');
                }

                // Validate backup structure
                const requiredKeys = ['pages', 'news', 'programs', 'staff', 'media', 'navigation', 'settings'];
                const hasRequiredKeys = requiredKeys.every(key => backupData.data.hasOwnProperty(key));
                
                if (!hasRequiredKeys) {
                    throw new Error('Backup file is missing required data sections');
                }

                // Store as new backup
                const backupKey = `backup_${Date.now()}`;
                localStorage.setItem(backupKey, JSON.stringify(backupData));
                
                this.showMessage('Backup uploaded successfully!', 'success');
            } catch (error) {
                this.showMessage('Error uploading backup: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    getBackupStats() {
        const backups = this.getBackups();
        const totalSize = backups.reduce((total, backup) => {
            const backupData = localStorage.getItem(backup.key);
            return total + (backupData ? backupData.length : 0);
        }, 0);

        return {
            totalBackups: backups.length,
            totalSize: this.formatBytes(totalSize),
            lastBackup: this.backupSettings.lastBackup,
            autoBackup: this.backupSettings.autoBackup
        };
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
}

// Initialize backup manager
const backupManager = new BackupManager();
