// Amarudu Handbook - Salesforce Administrator Interactive Script

// DOM Elements
const progressBar = document.getElementById('progressBar');
const navToggle = document.getElementById('navToggle');
const sidebar = document.getElementById('sidebar');
const searchInput = document.getElementById('searchInput');
const backToTop = document.getElementById('backToTop');
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');

// Progress Bar
function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
}

window.addEventListener('scroll', updateProgressBar);

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992) {
        if (!sidebar.contains(e.target) && !navToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// Active Section Highlighting
function highlightActiveSection() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// Smooth Scroll for Sidebar Links
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile sidebar
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('open');
            }
        }
    });
});

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const contentCards = document.querySelectorAll('.content-card');
    
    // Remove previous highlights
    document.querySelectorAll('.highlight').forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });
    
    if (searchTerm.length < 2) {
        contentCards.forEach(card => {
            card.style.display = 'block';
        });
        return;
    }
    
    contentCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
            highlightText(card, searchTerm);
        } else {
            card.style.display = 'none';
        }
    });
});

function highlightText(element, searchTerm) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.toLowerCase().includes(searchTerm)) {
            textNodes.push(node);
        }
    }
    
    textNodes.forEach(node => {
        const span = document.createElement('span');
        span.className = 'highlight';
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const parts = node.textContent.split(regex);
        
        parts.forEach((part, i) => {
            if (part.toLowerCase() === searchTerm) {
                const highlight = document.createElement('span');
                highlight.className = 'highlight';
                highlight.textContent = part;
                node.parentNode.insertBefore(highlight, node);
            } else {
                node.parentNode.insertBefore(document.createTextNode(part), node);
            }
        });
        
        node.parentNode.removeChild(node);
    });
}

// Back to Top Button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Q&A Accordion
const qaItems = document.querySelectorAll('.qa-item');

qaItems.forEach(item => {
    const question = item.querySelector('.question');
    const answer = item.querySelector('.answer');
    
    // Initially hide answers
    answer.style.display = 'none';
    
    question.addEventListener('click', () => {
        const isVisible = answer.style.display === 'block';
        
        // Close all other answers
        qaItems.forEach(otherItem => {
            otherItem.querySelector('.answer').style.display = 'none';
        });
        
        // Toggle current answer
        answer.style.display = isVisible ? 'none' : 'block';
    });
});

// Card Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.content-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
});

// Copy Code Functionality
document.querySelectorAll('code').forEach(codeBlock => {
    codeBlock.style.cursor = 'pointer';
    codeBlock.title = 'Click to copy';
    
    codeBlock.addEventListener('click', () => {
        navigator.clipboard.writeText(codeBlock.textContent).then(() => {
            const originalBg = codeBlock.style.background;
            codeBlock.style.background = '#2e844a';
            codeBlock.style.color = '#fff';
            
            setTimeout(() => {
                codeBlock.style.background = '';
                codeBlock.style.color = '';
            }, 500);
        });
    });
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Press Escape to close mobile sidebar
    if (e.key === 'Escape') {
        sidebar.classList.remove('open');
        searchInput.blur();
    }
    
    // Press / to focus search
    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
    }
});

// Print Styles
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'p') {
        // Add print-specific styles
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                .sidebar, .navbar, .back-to-top, .progress-container {
                    display: none !important;
                }
                .main-content {
                    margin-left: 0 !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateProgressBar();
    highlightActiveSection();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
        sidebar.classList.remove('open');
    }
});
