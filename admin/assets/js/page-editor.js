// Page Editor for Admin Panel
class PageEditor {
    constructor() {
        this.currentPage = null;
        this.isDirty = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeEditor();
    }

    setupEventListeners() {
        // Auto-save functionality
        setInterval(() => {
            if (this.isDirty) {
                this.autoSave();
            }
        }, 30000); // Auto-save every 30 seconds

        // Warn before leaving if there are unsaved changes
        window.addEventListener('beforeunload', (e) => {
            if (this.isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    initializeEditor() {
        // Initialize rich text editor (using a simple implementation)
        this.setupRichTextEditor();
    }

    setupRichTextEditor() {
        // This would integrate with a rich text editor like TinyMCE, CKEditor, or Quill
        // For now, we'll use a simple textarea with basic formatting
        const editorContainer = $('#pageEditorContainer');
        if (editorContainer.length) {
            editorContainer.html(`
                <div class="editor-toolbar">
                    <button type="button" class="btn btn-sm" data-command="bold">
                        <i class="fas fa-bold"></i>
                    </button>
                    <button type="button" class="btn btn-sm" data-command="italic">
                        <i class="fas fa-italic"></i>
                    </button>
                    <button type="button" class="btn btn-sm" data-command="underline">
                        <i class="fas fa-underline"></i>
                    </button>
                    <button type="button" class="btn btn-sm" data-command="insertUnorderedList">
                        <i class="fas fa-list-ul"></i>
                    </button>
                    <button type="button" class="btn btn-sm" data-command="insertOrderedList">
                        <i class="fas fa-list-ol"></i>
                    </button>
                    <button type="button" class="btn btn-sm" data-command="createLink">
                        <i class="fas fa-link"></i>
                    </button>
                    <button type="button" class="btn btn-sm" data-command="insertImage">
                        <i class="fas fa-image"></i>
                    </button>
                </div>
                <div class="editor-content">
                    <textarea id="pageContentEditor" rows="20" style="width: 100%; border: 1px solid #d1d5db; border-radius: 8px; padding: 15px; font-family: inherit;"></textarea>
                </div>
            `);

            // Setup toolbar buttons
            $('.editor-toolbar button').click(function() {
                const command = $(this).data('command');
                document.execCommand(command, false, null);
                $('#pageContentEditor').focus();
            });
        }
    }

    openEditor(page) {
        this.currentPage = page;
        this.isDirty = false;
        
        const content = `
            <div class="page-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <h3>Edit Page: ${page.title}</h3>
                        <span class="editor-url">${page.url}</span>
                    </div>
                    <div class="editor-actions">
                        <button class="btn btn-secondary" id="previewBtn">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <button class="btn btn-primary" id="savePageBtn">
                            <i class="fas fa-save"></i> Save
                        </button>
                    </div>
                </div>
                
                <div class="editor-tabs">
                    <button class="tab-btn active" data-tab="content">Content</button>
                    <button class="tab-btn" data-tab="seo">SEO</button>
                    <button class="tab-btn" data-tab="settings">Settings</button>
                </div>
                
                <div class="editor-content">
                    <div id="contentTab" class="tab-content active">
                        <div class="form-group">
                            <label for="pageTitle">Page Title</label>
                            <input type="text" id="pageTitle" value="${page.title}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="pageDescription">Description</label>
                            <textarea id="pageDescription" rows="3" class="form-control">${page.description}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="pageContent">Content</label>
                            <div id="pageEditorContainer"></div>
                        </div>
                    </div>
                    
                    <div id="seoTab" class="tab-content">
                        <div class="form-group">
                            <label for="metaTitle">Meta Title</label>
                            <input type="text" id="metaTitle" value="${page.metaTitle || page.title}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="metaDescription">Meta Description</label>
                            <textarea id="metaDescription" rows="3" class="form-control">${page.metaDescription || page.description}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="metaKeywords">Meta Keywords</label>
                            <input type="text" id="metaKeywords" value="${page.metaKeywords || ''}" class="form-control">
                        </div>
                    </div>
                    
                    <div id="settingsTab" class="tab-content">
                        <div class="form-group">
                            <label for="pageStatus">Status</label>
                            <select id="pageStatus" class="form-control">
                                <option value="published" ${page.status === 'published' ? 'selected' : ''}>Published</option>
                                <option value="draft" ${page.status === 'draft' ? 'selected' : ''}>Draft</option>
                                <option value="archived" ${page.status === 'archived' ? 'selected' : ''}>Archived</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="pageTemplate">Template</label>
                            <select id="pageTemplate" class="form-control">
                                <option value="default">Default</option>
                                <option value="full-width">Full Width</option>
                                <option value="sidebar">With Sidebar</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="pageOrder">Menu Order</label>
                            <input type="number" id="pageOrder" value="${page.order || 0}" class="form-control">
                        </div>
                    </div>
                </div>
            </div>
        `;

        openModal('Page Editor', content);
        
        // Initialize editor after modal is shown
        setTimeout(() => {
            this.setupEditorTabs();
            this.setupEditorEvents();
            this.loadPageContent();
        }, 100);
    }

    setupEditorTabs() {
        $('.tab-btn').click(function() {
            $('.tab-btn').removeClass('active');
            $(this).addClass('active');
            
            const tab = $(this).data('tab');
            $('.tab-content').removeClass('active');
            $(`#${tab}Tab`).addClass('active');
        });
    }

    setupEditorEvents() {
        // Save button
        $('#savePageBtn').click(() => {
            this.savePage();
        });

        // Preview button
        $('#previewBtn').click(() => {
            this.previewPage();
        });

        // Track changes
        $('#pageTitle, #pageDescription, #pageContentEditor, #metaTitle, #metaDescription, #metaKeywords, #pageStatus, #pageTemplate, #pageOrder').on('input change', () => {
            this.isDirty = true;
        });
    }

    loadPageContent() {
        if (this.currentPage) {
            $('#pageContentEditor').val(this.currentPage.content);
        }
    }

    savePage() {
        if (!this.currentPage) return;

        // Update page data
        this.currentPage.title = $('#pageTitle').val();
        this.currentPage.description = $('#pageDescription').val();
        this.currentPage.content = $('#pageContentEditor').val();
        this.currentPage.metaTitle = $('#metaTitle').val();
        this.currentPage.metaDescription = $('#metaDescription').val();
        this.currentPage.metaKeywords = $('#metaKeywords').val();
        this.currentPage.status = $('#pageStatus').val();
        this.currentPage.template = $('#pageTemplate').val();
        this.currentPage.order = parseInt($('#pageOrder').val());
        this.currentPage.lastModified = new Date().toISOString().split('T')[0];

        // Update in content manager
        if (typeof contentManager !== 'undefined') {
            const pageIndex = contentManager.pages.findIndex(p => p.id === this.currentPage.id);
            if (pageIndex !== -1) {
                contentManager.pages[pageIndex] = this.currentPage;
            }
        }

        this.isDirty = false;
        
        // Show success message
        this.showMessage('Page saved successfully!', 'success');
        
        // Close modal after a short delay
        setTimeout(() => {
            closeModal();
        }, 1000);
    }

    previewPage() {
        const previewContent = `
            <div class="page-preview">
                <div class="preview-header">
                    <h1>${$('#pageTitle').val()}</h1>
                    <p class="preview-description">${$('#pageDescription').val()}</p>
                </div>
                <div class="preview-content">
                    ${this.formatContent($('#pageContentEditor').val())}
                </div>
            </div>
        `;
        
        openModal('Page Preview', previewContent);
    }

    formatContent(content) {
        // Basic HTML formatting
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    autoSave() {
        if (this.currentPage && this.isDirty) {
            // Auto-save to localStorage or send to server
            const autoSaveData = {
                id: this.currentPage.id,
                title: $('#pageTitle').val(),
                description: $('#pageDescription').val(),
                content: $('#pageContentEditor').val(),
                lastAutoSave: new Date().toISOString()
            };
            
            localStorage.setItem(`page_autosave_${this.currentPage.id}`, JSON.stringify(autoSaveData));
            this.showMessage('Auto-saved', 'info');
        }
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

    // Load auto-saved content
    loadAutoSave(pageId) {
        const autoSaveData = localStorage.getItem(`page_autosave_${pageId}`);
        if (autoSaveData) {
            const data = JSON.parse(autoSaveData);
            return data;
        }
        return null;
    }

    // Clear auto-save data
    clearAutoSave(pageId) {
        localStorage.removeItem(`page_autosave_${pageId}`);
    }
}

// Initialize page editor
const pageEditor = new PageEditor();
