/* Resources Page Specific Styles */

.resources-hero {
    position: relative;
    min-height: 70vh;
    display: flex;
    align-items: center;
    padding-top: 120px;
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    overflow: hidden;
}

.resources-hero .hero-content {
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
}

.resources-hero .hero-title {
    font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 800;
    margin-bottom: var(--spacing-lg);
    line-height: 1.1;
}

.resources-hero .hero-subtitle {
    font-size: 1.5rem;
    color: var(--primary-light);
    margin-bottom: var(--spacing-md);
    font-weight: 600;
}

.resources-hero .hero-description {
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-2xl);
    line-height: 1.6;
}

.resources-hero .hero-stats {
    display: flex;
    justify-content: center;
    gap: var(--spacing-4xl);
    margin-bottom: var(--spacing-2xl);
    flex-wrap: wrap;
}

.resources-hero .stat {
    text-align: center;
}

.resources-hero .stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--primary-color);
    display: block;
    margin-bottom: var(--spacing-xs);
}

.resources-hero .stat-label {
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 1rem;
}

.floating-icons {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.floating-icons i {
    position: absolute;
    color: rgba(99, 102, 241, 0.1);
    font-size: 3rem;
    animation: floatIcons 8s ease-in-out infinite;
}

.floating-icons i:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.floating-icons i:nth-child(2) {
    top: 60%;
    right: 15%;
    animation-delay: 2s;
}

.floating-icons i:nth-child(3) {
    top: 30%;
    right: 25%;
    animation-delay: 4s;
}

.floating-icons i:nth-child(4) {
    bottom: 30%;
    left: 20%;
    animation-delay: 1s;
}

.floating-icons i:nth-child(5) {
    bottom: 60%;
    right: 30%;
    animation-delay: 3s;
}

.floating-icons i:nth-child(6) {
    top: 70%;
    left: 30%;
    animation-delay: 5s;
}

@keyframes floatIcons {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.1;
    }
    50% {
        transform: translateY(-20px) rotate(180deg);
        opacity: 0.3;
    }
}

/* Resource Categories */
.resource-categories {
    padding: var(--spacing-4xl) 0;
    background: var(--bg-primary);
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);
}

.category-card {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-xl);
    padding: var(--spacing-2xl);
    text-align: center;
    transition: var(--transition-normal);
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.category-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.05), transparent);
    transition: var(--transition-slow);
}

.category-card:hover::before {
    left: 100%;
}

.category-card:hover {
    transform: translateY(-10px);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: var(--shadow-xl);
}

.category-icon {
    width: 80px;
    height: 80px;
    background: var(--gradient-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--spacing-lg);
    font-size: 2rem;
    color: var(--text-primary);
    transition: var(--transition-normal);
}

.category-card:hover .category-icon {
    transform: scale(1.1) rotate(5deg);
}

.category-card h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
}

.category-card p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
    line-height: 1.6;
}

.category-count {
    display: inline-block;
    background: rgba(99, 102, 241, 0.2);
    color: var(--primary-light);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--border-radius-lg);
    font-size: 0.9rem;
    font-weight: 600;
}

/* Resource Filters */
.resource-filters {
    padding: var(--spacing-xl) 0;
    background: var(--bg-secondary);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: sticky;
    top: 70px;
    z-index: 100;
    backdrop-filter: blur(20px);
}

.filters-container {
    display: flex;
    gap: var(--spacing-lg);
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: var(--spacing-lg);
}

.view-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-lg);
}

.filter-group,
.sort-group {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.filter-group label,
.sort-group label {
    color: var(--text-secondary);
    font-weight: 500;
    white-space: nowrap;
    font-size: 0.9rem;
}

.filter-select {
    background: var(--bg-glass);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius-md);
    color: var(--text-primary);
    padding: var(--spacing-sm) var(--spacing-md);
    outline: none;
    transition: var(--transition-normal);
    min-width: 140px;
    font-size: 0.9rem;
}

.filter-select:focus {
    border-color: var(--primary-color);
    background: rgba(255, 255, 255, 0.08);
}

.search-group {
    flex: 1;
    max-width: 300px;
}

.search-box {
    position: relative;
    display: flex;
    align-items: center;
}

.search-box input {
    background: var(--bg-glass);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius-md);
    color: var(--text-primary);
    padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-sm) var(--spacing-3xl);
    outline: none;
    transition: var(--transition-normal);
    width: 100%;
    font-size: 0.9rem;
}

.search-box input:focus {
    border-color: var(--primary-color);
    background: rgba(255, 255, 255, 0.08);
}

.search-box i {
    position: absolute;
    left: var(--spacing-md);
    color: var(--text-muted);
    pointer-events: none;
}

.view-toggle {
    display: flex;
    gap: var(--spacing-sm);
}

.view-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-secondary);
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: var(--transition-normal);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.9rem;
}

.view-btn:hover,
.view-btn.active {
    background: var(--primary-color);
    color: var(--text-primary);
    border-color: var(--primary-color);
}

/* Featured Resources */
.featured-resources {
    padding: var(--spacing-4xl) 0;
    background: var(--bg-secondary);
}

.featured-resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--spacing-xl);
}

.featured-resource-card {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    border: 2px solid var(--primary-color);
    border-radius: var(--border-radius-xl);
    overflow: hidden;
    transition: var(--transition-normal);
    position: relative;
}

.featured-resource-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--gradient-primary);
}

.featured-resource-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-xl);
}

.resource-image {
    height: 200px;
    background: var(--bg-secondary);
    position: relative;
    overflow: hidden;
}

.resource-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition-normal);
}

.resource-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: var(--transition-normal);
}

.featured-resource-card:hover .resource-overlay {
    opacity: 1;
}

.resource-actions {
    display: flex;
    gap: var(--spacing-md);
}

.action-btn {
    width: 50px;
    height: 50px;
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition-normal);
    font-size: 1.2rem;
}

.action-btn:hover {
    background: var(--primary-color);
    transform: scale(1.1);
}

.resource-content {
    padding: var(--spacing-xl);
}

.resource-category {
    display: inline-block;
    background: rgba(99, 102, 241, 0.2);
    color: var(--primary-light);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--border-radius-lg);
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: var(--spacing-md);
}

.resource-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    line-height: 1.3;
}

.resource-description {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
    line-height: 1.6;
}

.resource-meta {
    display: flex;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    font-size: 0.9rem;
    color: var(--text-muted);
    flex-wrap: wrap;
}

.resource-meta span {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.resource-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
}

.tech-tag {
    padding: var(--spacing-xs) var(--spacing-md);
    background: rgba(99, 102, 241, 0.2);
    color: var(--primary-light);
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: var(--border-radius-lg);
}

.resource-rating {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
}

.rating-stars {
    display: flex;
    gap: 2px;
}

.rating-stars i {
    color: #fbbf24;
    font-size: 0.9rem;
}

.rating-text {
    color: var(--text-muted);
    font-size: 0.9rem;
}

.resource-links {
    display: flex;
    gap: var(--spacing-md);
}

.resource-btn {
    flex: 1;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition-normal);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    text-decoration: none;
    font-size: 0.9rem;
    border: none;
}

.resource-btn.primary {
    background: var(--gradient-primary);
    color: var(--text-primary);
}

.resource-btn.secondary {
    background: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
}

.resource-btn:hover {
    transform: translateY(-2px);
}

.resource-btn.primary:hover {
    box-shadow: var(--shadow-lg);
}

.resource-btn.secondary:hover {
    background: var(--primary-color);
    color: var(--text-primary);
}

/* All Resources */
.all-resources {
    padding: var(--spacing-4xl) 0;
    background: var(--bg-primary);
}

.resource-count {
    color: var(--text-muted);
    font-size: 0.9rem;
}

.resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-2xl);
}

.resources-grid.list-view {
    grid-template-columns: 1fr;
}

.resource-card {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-xl);
    overflow: hidden;
    transition: var(--transition-normal);
    position: relative;
}

.resource-card:hover {
    transform: translateY(-5px);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: var(--shadow-lg);
}

.resource-card.list-view {
    display: grid;
    grid-template-columns: 150px 1fr auto;
    gap: var(--spacing-lg);
    align-items: center;
    padding: var(--spacing-lg);
}

.resource-card.list-view .resource-image {
    height: 100px;
    width: 150px;
    border-radius: var(--border-radius-md);
}

.resource-card.list-view .resource-content {
    padding: 0;
}

.resource-card.list-view .resource-links {
    flex-direction: column;
    min-width: 120px;
}

/* Learning Paths */
.learning-paths {
    padding: var(--spacing-4xl) 0;
    background: var(--bg-secondary);
}

.paths-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--spacing-xl);
}

.path-card {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-xl);
    padding: var(--spacing-xl);
    transition: var(--transition-normal);
    position: relative;
    overflow: hidden;
}

.path-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.05), transparent);
    transition: var(--transition-slow);
}

.path-card:hover::before {
    left: 100%;
}

.path-card:hover {
    transform: translateY(-10px);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: var(--shadow-xl);
}

.path-icon {
    width: 60px;
    height: 60px;
    background: var(--gradient-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-lg);
    font-size: 1.5rem;
    color: var(--text-primary);
}

.path-card h4 {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
}

.path-card p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
    line-height: 1.6;
}

.path-stats {
    display: flex;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    font-size: 0.9rem;
    color: var(--text-muted);
    flex-wrap: wrap;
}

.path-stats span {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.path-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
}

.path-btn {
    width: 100%;
    background: var(--gradient-primary);
    color: var(--text-primary);
    border: none;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition-normal);
}

.path-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

/* Resource Contribution */
.resource-contribution {
    padding: var(--spacing-4xl) 0;
    background: var(--bg-primary);
}

.contribution-content {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--spacing-2xl);
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;
}

.contribution-text h3 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
}

.contribution-text p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-lg);
}

.contribution-benefits {
    display: flex;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
}

.benefit {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-muted);
    font-size: 0.9rem;
}

.benefit i {
    color: var(--primary-color);
    font-size: 1.1rem;
}

.contribution-actions {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    min-width: 200px;
}

/* Loading Spinner */
.loading-spinner {
    display: none;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-xl);
    color: var(--text-secondary);
}

.loading-spinner.show {
    display: flex;
}

/* Pagination */
.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-2xl);
}

.pagination {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
}

.pagination button {
    background: var(--bg-glass);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-primary);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: var(--transition-normal);
    min-width: 40px;
}

.pagination button:hover {
    background: var(--primary-color);
    border-color: var(--primary-color);
}

.pagination button.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
}

.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .filters-container {
        justify-content: flex-start;
    }
    
    .search-group {
        order: -1;
        max-width: 100%;
    }
    
    .view-controls {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .resources-hero {
        padding-top: 100px;
        min-height: 60vh;
    }
    
    .resources-hero .hero-stats {
        gap: var(--spacing-2xl);
    }
    
    .filters-container {
        flex-direction: column;
        align-items: stretch;
        gap: var(--spacing-md);
    }
    
    .filter-group,
    .sort-group {
        justify-content: space-between;
    }
    
    .view-controls {
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md);
    }
    
    .categories-grid {
        grid-template-columns: 1fr;
    }
    
    .featured-resources-grid {
        grid-template-columns: 1fr;
    }
    
    .resources-grid {
        grid-template-columns: 1fr;
    }
    
    .resource-card.list-view {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .resource-card.list-view .resource-image {
        width: 100%;
        height: 150px;
    }
    
    .resource-card.list-view .resource-links {
        flex-direction: row;
        min-width: auto;
    }
    
    .paths-grid {
        grid-template-columns: 1fr;
    }
    
    .contribution-content {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .contribution-benefits {
        justify-content: center;
    }
    
    .contribution-actions {
        flex-direction: row;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .resource-filters {
        position: static;
    }
    
    .resource-meta {
        flex-direction: column;
        gap: var(--spacing-sm);
    }
    
    .resource-links {
        flex-direction: column;
    }
    
    .path-stats {
        flex-direction: column;
        gap: var(--spacing-sm);
    }
    
    .contribution-actions {
        flex-direction: column;
    }
    
    .contribution-benefits {
        flex-direction: column;
        align-items: center;
    }
}

/* Animation for resource cards */
@keyframes resourceCardAppear {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.resource-card,
.featured-resource-card,
.category-card,
.path-card {
    animation: resourceCardAppear 0.5s ease-out;
}

/* Loading states */
.resources-grid.loading,
.featured-resources-grid.loading,
.categories-grid.loading {
    opacity: 0.7;
    pointer-events: none;
}

/* Difficulty badges */
.difficulty-badge {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.difficulty-badge.beginner {
    background: rgba(16, 185, 129, 0.2);
    color: var(--success-color);
}

.difficulty-badge.intermediate {
    background: rgba(245, 158, 11, 0.2);
    color: var(--warning-color);
}

.difficulty-badge.advanced {
    background: rgba(239, 68, 68, 0.2);
    color: var(--danger-color);
}