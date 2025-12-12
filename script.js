// Set active navigation link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
    }
});

// Animated counter for stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate counters when about section is visible
            if (entry.target.id === 'about') {
                document.querySelectorAll('.stat-number').forEach(stat => {
                    if (!stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        animateCounter(stat);
                    }
                });
            }
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Work item modal functionality
const workItems = document.querySelectorAll('.work-item');
const modal = document.getElementById('work-modal');
const modalClose = document.querySelector('.modal-close');

const workData = {
    'Urban Residence': {
        category: 'Architecture',
        description: 'A contemporary urban residence exploring the relationship between interior and exterior spaces. The design emphasizes natural light and open floor plans while maintaining privacy and functionality.'
    },
    'Digital Form Study': {
        category: 'Digital Art',
        description: 'An exploration of digital forms and geometric compositions. This piece investigates the interplay between positive and negative space in a digital medium.'
    },
    'Minimalist Space': {
        category: 'Architecture',
        description: 'A minimalist architectural approach focusing on essential elements. Clean lines and thoughtful material selection create a serene living environment.'
    },
    'Geometric Composition': {
        category: 'Digital Art',
        description: 'A study in geometric abstraction, balancing symmetry and asymmetry. This work explores rhythm and pattern through digital manipulation.'
    },
    'Contemporary Structure': {
        category: 'Architecture',
        description: 'A modern structure that bridges traditional and contemporary design principles. The project demonstrates innovative use of materials and sustainable practices.'
    },
    'Abstract Design': {
        category: 'Digital Art',
        description: 'An abstract digital composition exploring color, form, and movement. This piece represents a departure from representational art into pure abstraction.'
    }
};

if (workItems.length > 0 && modal) {
    workItems.forEach(item => {
        const btn = item.querySelector('.work-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const title = item.querySelector('.work-title').textContent;
                const data = workData[title];
                
                if (data && modal) {
                    document.getElementById('modal-title').textContent = title;
                    document.getElementById('modal-category').textContent = data.category;
                    document.getElementById('modal-description').textContent = data.description;
                    
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        }
    });

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// API Integration - Quote API
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');

// Function to fetch quote from API
// Function to fetch quote from API
async function fetchQuote() {
    try {
        quoteText.textContent = 'Loading inspiration...';
        quoteAuthor.textContent = '';
        newQuoteBtn.disabled = true;
        newQuoteBtn.style.opacity = '0.5';
        
        // Using dummyjson.com as alternative since quotable.io certificate expired
        const response = await fetch('https://dummyjson.com/quotes/random?tags=inspirational,art,design', {
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // dummyjson returns { quote: "...", author: "..." }
        quoteText.textContent = `"${data.quote}"`;
        quoteAuthor.textContent = `— ${data.author}`;
        newQuoteBtn.disabled = false;
        newQuoteBtn.style.opacity = '1';
    } catch (error) {
        console.error('Error fetching quote:', error);
        quoteText.textContent = '"Design is not just what it looks like and feels like. Design is how it works."';
        quoteAuthor.textContent = '— Steve Jobs';
        newQuoteBtn.disabled = false;
        newQuoteBtn.style.opacity = '1';
    }
}

// Fetch quote on page load (only if elements exist)
if (quoteText && quoteAuthor && newQuoteBtn) {
    fetchQuote();
    // Fetch new quote on button click
    newQuoteBtn.addEventListener('click', fetchQuote);
}


// Add fade-in animation to work items
if (workItems.length > 0) {
    const workObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    workItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        workObserver.observe(item);
    });
}

