// ===== Hero区入场动画（页面加载后立即触发）=====
window.addEventListener('load', () => {
    const heroEls = document.querySelectorAll(
        '.hero-greeting, .hero-name, .hero-desc, .hero-sub, .hero-tags, .scroll-down'
    );
    // 用 requestAnimationFrame 确保浏览器渲染一帧后再加class，让transition生效
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            heroEls.forEach(el => el.classList.add('hero-visible'));
        });
    });
});

// ===== 导航栏滚动效果 =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== 移动端导航菜单 =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== 粒子背景效果 =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 50;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update(mouseX, mouseY) {
        this.x += this.speedX;
        this.y += this.speedY;

        // 鼠标吸引效果
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            this.x += dx * 0.01;
            this.y += dy * 0.01;
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30, 136, 229, ${this.opacity})`;
        ctx.fill();
    }
}

// 初始化粒子
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

document.querySelector('.hero').addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update(mouseX, mouseY);
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// ===== 滚动入场动画（统一由Observer控制，触发一次后停止监听）=====
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target); // 触发一次后停止，防止滚出消失
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
});

// 监听所有需要滚动入场的元素
const scrollTargets = document.querySelectorAll(
    '.fade-in, .timeline-item, .project-card, .video-card, .award-item, .contact-item'
);
scrollTargets.forEach(el => scrollObserver.observe(el));

// ===== 技能条动画（触发一次）=====
const skillBars = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const targetWidth = entry.target.style.width;
            entry.target.style.width = '0';
            setTimeout(() => {
                entry.target.style.width = targetWidth;
            }, 100);
            skillObserver.unobserve(entry.target); // 只触发一次
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ===== 视频弹窗 =====
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const modalClose = document.getElementById('modalClose');
const videoCards = document.querySelectorAll('.video-card');

// 视频ID映射（需要替换为实际的抖音视频ID）
const videoIds = {
    '7561326573895437583': '7561326573895437583',
    '7614784455487655210': '7614784455487655210'
};

videoCards.forEach(card => {
    card.addEventListener('click', () => {
        const videoId = card.dataset.videoId;
        // 使用抖音 embed 方式
        videoPlayer.innerHTML = `
            <iframe 
                src="https://www.iesdouyin.com/share/video/${videoId}/" 
                allow="autoplay; fullscreen"
                allowfullscreen
                style="width:100%;height:100%;border:none;">
            </iframe>
        `;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

modalClose.addEventListener('click', closeModal);
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeModal();
});

function closeModal() {
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
    videoPlayer.innerHTML = '';
}

// ESC 关闭弹窗
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeModal();
    }
});

// ===== 联系表单 =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.submit-btn');
    const originalText = btn.textContent;
    
    btn.textContent = '发送中...';
    btn.disabled = true;

    // 模拟发送
    setTimeout(() => {
        btn.textContent = '✓ 已发送';
        btn.style.background = '#4CAF50';
        contactForm.reset();
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 2000);
    }, 1000);
});

// ===== 平滑滚动优化 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
