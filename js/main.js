// ========================================
// 数据管理器 - 从 works.json 读取数据
// ========================================
const DataManager = {
    works: null,
    profile: null,

    // 初始化 - 加载作品数据
    async init() {
        try {
            // 加载作品数据
            const worksResponse = await fetch('/data/works.json');
            console.log('尝试加载 works.json:', worksResponse);
            if (!worksResponse.ok) {
                throw new Error('Failed to load works.json');
            }
            const worksData = await worksResponse.json();
            this.works = worksData.works || [];
            
            // 加载个人资料数据
            try {
                const profileResponse = await fetch('/data/profile.json');
                console.log('尝试加载 profile.json:', profileResponse);
                if (profileResponse.ok) {
                    this.profile = await profileResponse.json();
                    console.log('个人资料加载成功:', this.profile);
                } else {
                    this.profile = this.getDefaultProfile();
                    console.warn('加载 profile.json 失败，使用默认配置:', profileResponse.statusText);
                }
            } catch (error) {
                console.warn('加载 profile.json 失败，使用默认配置:', error);
                this.profile = this.getDefaultProfile();
            }
            
            return true;
        } catch (error) {
            console.error('加载作品数据失败:', error);
            this.works = [];
            this.profile = this.getDefaultProfile();
            return false;
        }
    },

    // 获取所有作品
    getWorks() {
        return this.works || [];
    },

    // 根据类别筛选
    getWorksByCategory(category) {
        if (category === 'all') {
            return this.getWorks();
        }
        return this.getWorks().filter(work => work.category === category);
    },

    // 根据ID获取作品
    getWorkById(id) {
        return this.getWorks().find(work => work.id === id);
    },

    // 根据文件名获取作品
    getWorkByFilename(filename) {
        return this.getWorks().find(work => work.filename === filename);
    },

    // 获取精选作品
    getFeaturedWorks(count = 3) {
        return this.getWorks().slice(0, count);
    },

    // 获取个人资料
    getProfile() {
        return this.profile || this.getDefaultProfile();
    },

    // 获取默认个人资料
    getDefaultProfile() {
        return {
            name: '艺术家',
            title: '摄影师 & 画家',
            avatar: '',
            description: '热爱摄影与绘画，用镜头捕捉瞬间的美好，用画笔描绘心中的世界。每一幅作品都承载着我对生活的热爱和对美的追求。',
            email: 'artist@example.com',
            phone: '+86 138 0013 8000',
            website: 'www.artistspace.com',
            social: {
                weibo: '',
                wechat: '',
                instagram: '',
                behance: ''
            }
        };
    }
};

// ========================================
// 工具函数
// ========================================
const Utils = {
    // 显示提示消息
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-title">${type === 'success' ? '成功' : '错误'}</div>
            <div class="toast-message">${message}</div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // 格式化价格
    formatPrice(price) {
        if (!price || price === 0) {
            return '价格面议';
        }
        return `¥${price.toLocaleString()}`;
    },

    // 获取类别中文名
    getCategoryName(category) {
        const categoryMap = {
            'photography': '摄影',
            'painting': '绘画'
        };
        return categoryMap[category] || category;
    },

    // 获取用户IP地址
    async getUserIP() {
        try {
            // 使用免费的IP获取API
            const response = await fetch('https://api64.ipify.org?format=json');
            const data = await response.json();
            return data.ip || '未知IP';
        } catch (error) {
            console.warn('获取IP失败:', error);
            return '未知IP';
        }
    },

    // 获取浏览器信息
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = '未知浏览器';
        let os = '未知操作系统';

        // 检测浏览器
        if (ua.includes('Chrome') && !ua.includes('Edg')) {
            browser = 'Chrome';
        } else if (ua.includes('Firefox')) {
            browser = 'Firefox';
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            browser = 'Safari';
        } else if (ua.includes('Edg')) {
            browser = 'Edge';
        } else if (ua.includes('Opera') || ua.includes('OPR')) {
            browser = 'Opera';
        }

        // 检测操作系统
        if (ua.includes('Windows')) {
            os = 'Windows';
        } else if (ua.includes('Mac OS X')) {
            os = 'macOS';
        } else if (ua.includes('Linux')) {
            os = 'Linux';
        } else if (ua.includes('Android')) {
            os = 'Android';
        } else if (ua.includes('iOS')) {
            os = 'iOS';
        }

        return `${browser} (${os})`;
    },

    // 显示文件内容（用于复制到 works.json）
    showFileContent(content, filename) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.style.zIndex = '3000';
        
        modal.innerHTML = `
            <div class="modal" style="max-width: 800px;">
                <div class="modal-header">
                    <h2 class="modal-title">${filename}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <svg viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 16px; color: var(--color-text-secondary);">
                        请复制以下内容，粘贴到 <code>data/works.json</code> 文件中，然后保存：
                    </p>
                    <textarea style="width: 100%; height: 400px; font-family: monospace; font-size: 12px; padding: 12px; background: var(--color-bg-primary); color: var(--color-text-primary); border: 1px solid var(--color-border); border-radius: 8px; resize: vertical;">${content}</textarea>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="Utils.copyToClipboard(this.previousElementSibling.previousElementSibling.querySelector('textarea'))">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                        复制内容
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // 复制到剪贴板
    copyToClipboard(textarea) {
        textarea.select();
        document.execCommand('copy');
        Utils.showToast('已复制到剪贴板！');
    }
};

// ========================================
// 首页功能
// ========================================
const HomePage = {
    async init() {
        await DataManager.init();
        this.loadFeaturedWorks();
    },

    loadFeaturedWorks() {
        const container = document.getElementById('featured-works');
        if (!container) return;

        const works = DataManager.getFeaturedWorks(3);

        if (works.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: var(--spacing-xxl);">
                    <p style="color: var(--color-text-secondary);">暂无作品，请先运行预处理脚本</p>
                </div>
            `;
            return;
        }

        container.innerHTML = works.map(work => `
            <div class="gallery-item" onclick="GalleryPage.openWorkDetail('${work.filename}')">
                <img src="/images/${work.filename}" alt="${work.title}">
                <div class="gallery-overlay">
                    <h3 class="gallery-title">${work.title}</h3>
                    <p class="gallery-description">${Utils.getCategoryName(work.category)}</p>
                </div>
            </div>
        `).join('');
    }
};

// ========================================
// 作品展示页功能
// ========================================
const GalleryPage = {
    currentFilter: 'all',

    async init() {
        await DataManager.init();
        this.initFilters();
        this.loadWorks();
        this.initModal();
    },

    initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => {
                    b.classList.remove('active', 'btn-primary');
                });
                btn.classList.add('active', 'btn-primary');
                
                this.currentFilter = btn.dataset.filter;
                this.loadWorks();
            });
        });
    },

    loadWorks() {
        const container = document.getElementById('gallery-grid');
        if (!container) return;

        const works = DataManager.getWorksByCategory(this.currentFilter);

        if (works.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: var(--spacing-xxl);">
                    <p style="color: var(--color-text-secondary);">暂无作品</p>
                </div>
            `;
            return;
        }

        container.innerHTML = works.map(work => `
            <div class="gallery-item" onclick="GalleryPage.openWorkDetail('${work.filename}')">
                <img src="/images/${work.filename}" alt="${work.title}">
                <div class="gallery-overlay">
                    <h3 class="gallery-title">${work.title}</h3>
                    <p class="gallery-description">${Utils.getCategoryName(work.category)} | ${Utils.formatPrice(work.price)}</p>
                </div>
            </div>
        `).join('');
    },

    initModal() {
        const modal = document.getElementById('work-modal');
        const closeBtn = document.getElementById('modal-close');
        const closeBtnFooter = document.getElementById('modal-close-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        if (closeBtnFooter) {
            closeBtnFooter.addEventListener('click', () => this.closeModal());
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }
    },

    openWorkDetail(filename) {
        const work = DataManager.getWorkByFilename(filename);

        if (!work) return;

        const modal = document.getElementById('work-modal');
        if (!modal) return;

        document.getElementById('modal-title').textContent = work.title;
        document.getElementById('modal-image').src = `/images/${work.filename}`;
        document.getElementById('modal-category').textContent = Utils.getCategoryName(work.category);
        document.getElementById('modal-date').textContent = work.date;
        document.getElementById('modal-description').textContent = work.description || '暂无描述';
        document.getElementById('modal-price').textContent = Utils.formatPrice(work.price);

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        const modal = document.getElementById('work-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};

// ========================================
// 个人介绍页功能
// ========================================
const AboutPage = {
    async init() {
        await DataManager.init();
        this.loadProfile();
        this.loadStats();
    },

    loadProfile() {
        const profile = DataManager.getProfile();

        // 更新艺术家信息
        const nameEl = document.getElementById('artist-name');
        const titleEl = document.getElementById('artist-title');
        const descEl = document.getElementById('about-description');

        if (nameEl) nameEl.textContent = profile.name;
        if (titleEl) titleEl.textContent = profile.title;
        if (descEl) descEl.textContent = profile.description;

        // 处理头像显示
        this.loadAvatar(profile.avatar);
    },

    loadAvatar(avatarUrl) {
        const avatarContainer = document.querySelector('.avatar-container');
        if (!avatarContainer) return;

        if (avatarUrl && avatarUrl.trim() !== '') {
            // 使用自定义头像
            avatarContainer.innerHTML = `
                <img src="${avatarUrl}" alt="${DataManager.getProfile().name}" 
                     style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"
                     onerror="this.style.display='none'; this.parentElement.innerHTML='<svg style=\\'width: 80px; height: 80px; fill: var(--color-bg-primary);\\' viewBox=\\'0 0 24 24\\'><path d=\\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\\'/></svg>'">
            `;
        }
        // 否则保持默认图标（HTML中已定义）
    },

    loadStats() {
        const works = DataManager.getWorks();
        const statEl = document.getElementById('stat-works');
        if (statEl) {
            statEl.textContent = works.length;
        }
    }
};

// ========================================
// 联系页面功能
// ========================================
const ContactPage = {
    async init() {
        await DataManager.init();
        this.initEmailJS();
        this.loadContactInfo();
        this.initForm();
    },

    // 初始化 EmailJS
    initEmailJS() {
        const profile = DataManager.getProfile();
        console.log(profile.emailjs);

        // 检查是否配置了 EmailJS
        if (profile.emailjs && profile.emailjs.publicKey && profile.emailjs.publicKey !== 'YOUR_PUBLIC_KEY') {
            console.log('初始化 EmailJS SDK');
            if (typeof emailjs !== 'undefined') {
                console.log('EmailJS SDK 已加载，进行初始化');
                emailjs.init(profile.emailjs.publicKey);
            }
        }else{
            console.log('EmailJS 未配置或配置不完整');
        }
    },

    loadContactInfo() {
        const profile = DataManager.getProfile();

        // 更新联系信息
        const emailEl = document.querySelector('.contact-email-link');
        const phoneEl = document.querySelector('.contact-phone-link');
        const websiteEl = document.querySelector('.contact-website-link');
        const emailDisplayEl = document.querySelector('.contact-email-display');
        const phoneDisplayEl = document.querySelector('.contact-phone-display');
        const websiteDisplayEl = document.querySelector('.contact-website-display');

        if (emailEl && profile.email) {
            emailEl.href = `mailto:${profile.email}`;
        }
        if (phoneEl && profile.phone) {
            phoneEl.href = `tel:${profile.phone.replace(/[^0-9+]/g, '')}`;
        }
        if (websiteEl && profile.website) {
            websiteEl.href = profile.website.startsWith('http') ? profile.website : `https://${profile.website}`;
        }
        if (emailDisplayEl && profile.email) {
            emailDisplayEl.textContent = profile.email;
        }
        if (phoneDisplayEl && profile.phone) {
            phoneDisplayEl.textContent = profile.phone;
        }
        if (websiteDisplayEl && profile.website) {
            websiteDisplayEl.textContent = profile.website;
        }

        // 更新社交媒体链接
        this.loadSocialLinks(profile.social || {});
    },

    loadSocialLinks(social) {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            const platform = link.dataset.platform;
            
            // 检查该平台是否启用
            if (social[platform] && social[platform].enabled) {
                link.style.display = 'inline-flex';
                
                // 添加点击事件
                link.onclick = (e) => {
                    e.preventDefault();
                    this.handleSocialClick(platform, social[platform]);
                };
            } else {
                link.style.display = 'none';
            }
        });
    },

    handleSocialClick(platform, config) {
        if (platform === 'weibo') {
            // 新浪微博：直接跳转链接
            if (config.url) {
                window.open(config.url, '_blank');
            }
        } else if (platform === 'wechat' || platform === 'qq') {
            // 微信和QQ：显示二维码弹窗
            if (config.qrcode) {
                this.showQrcodeModal(platform, config.qrcode);
            }
        }
    },

    showQrcodeModal(platform, qrcodeUrl) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.style.zIndex = '3000';
        
        const platformName = platform === 'wechat' ? '微信' : 'QQ';
        
        modal.innerHTML = `
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header">
                    <h2 class="modal-title">扫码添加${platformName}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <svg viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body" style="text-align: center;">
                    <img src="${qrcodeUrl}" alt="${platformName}二维码" 
                         style="max-width: 100%; height: auto; border-radius: 8px;"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzQwNDA0MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYjBiMGIwIj7mi5HkvY/lvZ/vvIzkvaDljY7mianlj7fmsYLlubPliqg8L3RleHQ+PC9zdmc+'">
                    <p style="margin-top: var(--spacing-md); color: var(--color-text-secondary);">
                        请使用${platformName}扫描上方二维码
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);

        // 点击遮罩层关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    initForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 检查 EmailJS 是否已配置
            if (typeof emailjs === 'undefined') {
                Utils.showToast('EmailJS SDK 未加载，请检查网络连接', 'error');
                return;
            }

            const profile = DataManager.getProfile();
            
            // 检查 profile.json 中是否配置了 EmailJS
            if (!profile.emailjs || !profile.emailjs.serviceId || profile.emailjs.serviceId === 'YOUR_SERVICE_ID') {
                Utils.showToast('请在 data/profile.json 中配置 EmailJS 参数', 'error');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;

            // 获取表单数据
            const formData = new FormData(form);

            // 显示加载状态
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="icon spinning" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/>
                </svg>
                发送中...
            `;

            try {
                // 获取用户IP和浏览器信息
                const userIP = await Utils.getUserIP();
                const browserInfo = Utils.getBrowserInfo();

                // 准备模板参数
                const templateParams = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                    admin_email: profile.email,
                    user_ip: userIP,
                    browser_info: browserInfo,
                    send_time: new Date().toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })
                };

                // 发送通知给管理员
                await emailjs.send(
                    profile.emailjs.serviceId,
                    profile.emailjs.adminTemplateId,
                    templateParams
                );

                // 发送成功
                form.reset();
                Utils.showToast(`留言已发送，我们会尽快通过 ${profile.email} 联系您！`);

            } catch (error) {
                // 发送失败
                console.error('邮件发送失败:', error);
                Utils.showToast('发送失败，请稍后重试或直接发送邮件联系我们', 'error');

            } finally {
                // 恢复按钮状态
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }
};

// ========================================
// 页面初始化
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    const currentPage = window.location.pathname.split('/').pop();

    // 根据当前页面初始化对应功能
    switch (currentPage) {
        case '':
        case 'index.html':
            await HomePage.init();
            break;
        case 'gallery.html':
            await GalleryPage.init();
            break;
        case 'about.html':
            await AboutPage.init();
            break;
        case 'contact.html':
            ContactPage.init();
            break;
    }
});
