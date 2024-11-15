
// Initialize AOS
AOS.init();

// API Key (Replace with your actual API key)
const API_KEY = 'cd5b0eec1871449d9c3d9f6f0cb2e027';
const DEFAULT_CATEGORY = 'technology';

// DOM Elements
const newsGrid = document.getElementById('news-grid');
const searchInput = document.querySelector('.search-input');
const themeToggle = document.getElementById('theme-toggle');
const loading = document.querySelector('.loading');
const weatherTemp = document.getElementById('weather-temp');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Fetch News Articles
async function fetchNews(category = DEFAULT_CATEGORY) {
    try {
        loading.classList.add('active');
        const response = await fetch(
            `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
        );
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        newsGrid.innerHTML = '<p>Error loading news. Please try again later.</p>';
    } finally {
        loading.classList.remove('active');
    }
}

// Display News Articles
function displayNews(articles) {
    newsGrid.innerHTML = '';
    articles.forEach((article, index) => {
        const card = document.createElement('article');
        card.className = 'article-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', index * 100);

        card.innerHTML = `
            <img src="${article.urlToImage || 'https://picsum.photos/300/200?random=' + index}" 
                 alt="${article.title}" 
                 class="article-image">
            <div class="article-content">
                <h2 class="article-title">${article.title}</h2>
                <p class="article-description">${article.description || 'No description available'}</p>
                <div class="article-meta">
                    <span>${new Date(article.publishedAt).toLocaleDateString()}</span>
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read More</a>
                </div>
            </div>
        `;
        newsGrid.appendChild(card);
    });
}

// Search Functionality
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase();
        const articles = document.querySelectorAll('.article-card');
        
        articles.forEach(article => {
            const title = article.querySelector('.article-title').textContent.toLowerCase();
            const description = article.querySelector('.article-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    }, 300);
});

// Category Navigation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;
        fetchNews(category);
    });
});

// Weather API (Example)
async function fetchWeather() {
    try {
        const response = await fetch(
            'https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=572c2e60cb35d324416de20497275da2'
        );
        const data = await response.json();
        weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherTemp.textContent = 'N/A';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
    fetchWeather();
});
