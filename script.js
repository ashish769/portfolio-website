// Typed.js initialization
var typed = new Typed(".text", {
    strings: ["FullStack Developer", "Python Developer", "AI Enthusiast"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('#navbar a');

    hamburger.addEventListener('click', function () {
        navbar.classList.toggle('active');
    });

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navbar.classList.remove('active');
        });
    });
});

// Project rendering system
document.addEventListener('DOMContentLoaded', function() {
    // Project variables
    let projects = [];
    let filteredProjects = [];
    let currentPage = 1;
    const projectsPerPage = 6;
    let currentFilter = 'all';
    let currentSort = 'newest';
    
    // DOM elements
    const portfolioContainer = document.getElementById('portfolio-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageNumbers = document.getElementById('page-numbers');
    const projectSearch = document.getElementById('project-search');
    const sortSelect = document.getElementById('sort-projects');
    const projectModal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');
    
    // Load projects from JSON file - FIXED CORS ISSUE
    function loadProjects() {
        // First try to fetch from same origin
        fetch('/projects.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                projects = data.projects || [];
                initializeProjects();
            })
            .catch(error => {
                console.log('Local fetch failed, trying alternative:', error);
                // Fallback to absolute path if relative fails
                fetch('https://ashishrajpoudel.com.np/projects.json')
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.json();
                    })
                    .then(data => {
                        projects = data.projects || [];
                        initializeProjects();
                    })
                    .catch(error => {
                        console.error('Both fetch attempts failed:', error);
                        // Load from local data if both fail
                        projects = [
                            {
                                id: 1,
                                title: "Example Project 1",
                                thumbnail: "images/default-project.jpg",
                                description: "This is an example project that loads when the JSON file can't be fetched",
                                year: "2024",
                                tags: ["web", "example"],
                                details: {
                                    features: ["Feature 1", "Feature 2"]
                                }
                            }
                        ];
                        initializeProjects();
                    });
            });
    }

    function initializeProjects() {
        filteredProjects = [...projects];
        applyFiltersAndSort();
        renderProjects();
        updatePagination();
    }
    
    // Filter projects by tag
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentFilter = button.dataset.filter;
            currentPage = 1;
            applyFiltersAndSort();
            renderProjects();
            updatePagination();
        });
    });
    
    // Search projects
    projectSearch.addEventListener('input', () => {
        currentPage = 1;
        applyFiltersAndSort();
        renderProjects();
        updatePagination();
    });
    
    // Sort projects
    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        applyFiltersAndSort();
        renderProjects();
        updatePagination();
    });
    
    // Pagination controls
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProjects();
            updatePagination();
            window.scrollTo({ top: portfolioContainer.offsetTop - 100, behavior: 'smooth' });
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderProjects();
            updatePagination();
            window.scrollTo({ top: portfolioContainer.offsetTop - 100, behavior: 'smooth' });
        }
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        projectModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Apply filters, search, and sort
    function applyFiltersAndSort() {
        // Apply filter
        if (currentFilter === 'all') {
            filteredProjects = [...projects];
        } else {
            filteredProjects = projects.filter(project => 
                project.tags.some(tag => tag.toLowerCase().includes(currentFilter.toLowerCase()))
            );
        }
        
        // Apply search
        const searchTerm = projectSearch.value.toLowerCase();
        if (searchTerm) {
            filteredProjects = filteredProjects.filter(project => 
                project.title.toLowerCase().includes(searchTerm) || 
                project.description.toLowerCase().includes(searchTerm) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Apply sort
        switch(currentSort) {
            case 'newest':
                filteredProjects.sort((a, b) => b.year - a.year);
                break;
            case 'oldest':
                filteredProjects.sort((a, b) => a.year - b.year);
                break;
            case 'name-asc':
                filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                filteredProjects.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
    }
    
    // Render projects to the page
    function renderProjects() {
        portfolioContainer.innerHTML = '';
        
        const startIndex = (currentPage - 1) * projectsPerPage;
        const endIndex = startIndex + projectsPerPage;
        const projectsToShow = filteredProjects.slice(startIndex, endIndex);
        
        if (projectsToShow.length === 0) {
            portfolioContainer.innerHTML = `
                <div class="no-projects">
                    <i class='bx bx-search-alt'></i>
                    <h3>No projects found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        projectsToShow.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            // Use default image if thumbnail is not available
            const thumbnail = project.thumbnail || 'images/default-project.jpg';
            
            projectCard.innerHTML = `
                <img src="${thumbnail}" alt="${project.title}" class="project-thumbnail">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description.substring(0, 120)}${project.description.length > 120 ? '...' : ''}</p>
                    <div class="project-meta">
                        <span class="project-year">${project.year}</span>
                        <span>${project.tags[0] || ''}</span>
                    </div>
                    <div class="project-tags">
                        ${(project.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                        ${(project.tags || []).length > 3 ? `<span class="tag">+${project.tags.length - 3}</span>` : ''}
                    </div>
                </div>
            `;
            
            projectCard.addEventListener('click', () => openProjectModal(project));
            portfolioContainer.appendChild(projectCard);
        });
    }
    
    // Open project modal with details
    function openProjectModal(project) {
        // Use default image if thumbnail is not available
        const thumbnail = project.thumbnail || 'images/default-project.jpg';
        
        modalBody.innerHTML = `
            <h2>${project.title}</h2>
            <p class="project-subtitle">${project.description}</p>
            
            <div class="project-gallery">
                <img src="${thumbnail}" alt="${project.title} preview">
            </div>
            
            <div class="project-content">
                <div class="project-details-col">
                    <div class="project-description">
                        <h3>About This Project</h3>
                        <p>${project.longDescription || project.description || 'No description available.'}</p>
                    </div>
                    
                    ${renderProjectDetails(project.details)}
                </div>
                
                <div class="project-meta-col">
                    <div class="project-details">
                        <h3>Project Details</h3>
                        <div class="detail-item">
                            <strong>Year:</strong>
                            <span>${project.year || 'N/A'}</span>
                        </div>
                        ${project.technologies ? `
                            <div class="detail-item">
                                <strong>Technologies:</strong>
                                <div class="tech-tags">
                                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    ${project.features ? `
                        <div class="project-details">
                            <h3>Key Features</h3>
                            <ul class="features-list">
                                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${project.tags ? `
                        <div class="project-details">
                            <h3>Tags</h3>
                            <div class="tech-tags">
                                ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            ${project.githubLink || project.liveDemoLink ? `
                <div class="project-links">
                    ${project.githubLink ? `
                        <a href="${project.githubLink}" target="_blank" class="project-link github">
                            <i class='bx bxl-github'></i> View Code
                        </a>
                    ` : ''}
                    ${project.liveDemoLink ? `
                        <a href="${project.liveDemoLink}" target="_blank" class="project-link demo">
                            <i class='bx bx-link-external'></i> Live Demo
                        </a>
                    ` : ''}
                </div>
            ` : ''}
        `;
        
        projectModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        modalBody.scrollTo(0, 0);
    }
    
    // Helper function to render project details
    function renderProjectDetails(details) {
        if (!details) return '';
        
        let html = '<div class="project-details"><h3>Project Highlights</h3>';
        
        if (details.temperature && details.location) {
            html += `
                <div class="detail-item">
                    <strong>Current Weather:</strong>
                    <span>${details.temperature} in ${details.location}</span>
                </div>
            `;
        }
        
        if (details.features) {
            html += `
                <div class="detail-item">
                    <strong>Features:</strong>
                    <ul>
                        ${details.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Add any other details
        for (const [key, value] of Object.entries(details)) {
            if (key !== 'features' && key !== 'temperature' && key !== 'location') {
                html += `
                    <div class="detail-item">
                        <strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong>
                        <span>${value}</span>
                    </div>
                `;
            }
        }
        
        html += '</div>';
        return html;
    }
    
    // Update pagination controls
    function updatePagination() {
        const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        
        pageNumbers.innerHTML = '';
        const maxVisiblePages = 5;
        let startPage, endPage;
        
        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
            const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
            
            if (currentPage <= maxPagesBeforeCurrent) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - maxPagesBeforeCurrent;
                endPage = currentPage + maxPagesAfterCurrent;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                renderProjects();
                updatePagination();
                window.scrollTo({ top: portfolioContainer.offsetTop - 100, behavior: 'smooth' });
            });
            pageNumbers.appendChild(pageNumber);
        }
    }
    
    // Initialize the projects
    loadProjects();
});