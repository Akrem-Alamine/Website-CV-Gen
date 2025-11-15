const grokService = require('./grokService');

/**
 * Generate a complete personal website from CV data
 */
async function generateWebsite(cvData) {
  // Get AI-suggested design
  const design = await grokService.generateDesignSuggestions(cvData);
  
  const html = generateHTML(cvData, design);
  const css = generateCSS(design);
  
  return {
    html,
    css,
    design
  };
}

/**
 * Generate HTML for the personal website
 */
function generateHTML(data, design) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo?.fullName || 'Personal Website'}</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">${personalInfo?.fullName || 'Portfolio'}</div>
            <ul class="nav-menu">
                <li><a href="#about">About</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#education">Education</a></li>
                <li><a href="#skills">Skills</a></li>
                ${projects?.length ? '<li><a href="#projects">Projects</a></li>' : ''}
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">${personalInfo?.fullName || 'Your Name'}</h1>
                <p class="hero-subtitle">${personalInfo?.title || 'Professional'}</p>
                <p class="hero-location">
                    <i class="fas fa-map-marker-alt"></i> ${personalInfo?.location || ''}
                </p>
                <div class="social-links">
                    ${personalInfo?.email ? `<a href="mailto:${personalInfo.email}" class="social-link"><i class="fas fa-envelope"></i></a>` : ''}
                    ${personalInfo?.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank" class="social-link"><i class="fab fa-linkedin"></i></a>` : ''}
                    ${personalInfo?.github ? `<a href="${personalInfo.github}" target="_blank" class="social-link"><i class="fab fa-github"></i></a>` : ''}
                    ${personalInfo?.website ? `<a href="${personalInfo.website}" target="_blank" class="social-link"><i class="fas fa-globe"></i></a>` : ''}
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <p class="about-text">${summary || 'A passionate professional dedicated to excellence.'}</p>
        </div>
    </section>

    <!-- Experience Section -->
    ${experience?.length ? `
    <section id="experience" class="section section-alt">
        <div class="container">
            <h2 class="section-title">Experience</h2>
            <div class="timeline">
                ${experience.map(exp => `
                <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <h3 class="timeline-title">${exp.position}</h3>
                        <h4 class="timeline-company">${exp.company}</h4>
                        <p class="timeline-date">${exp.startDate} - ${exp.endDate}</p>
                        <p class="timeline-description">${exp.description || ''}</p>
                        ${exp.achievements?.length ? `
                        <ul class="achievements">
                            ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
                        </ul>
                        ` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Education Section -->
    ${education?.length ? `
    <section id="education" class="section">
        <div class="container">
            <h2 class="section-title">Education</h2>
            <div class="education-grid">
                ${education.map(edu => `
                <div class="education-card">
                    <h3 class="education-degree">${edu.degree}</h3>
                    <h4 class="education-field">${edu.field}</h4>
                    <p class="education-institution">${edu.institution}</p>
                    <p class="education-date">${edu.startDate} - ${edu.endDate}</p>
                    ${edu.gpa ? `<p class="education-gpa">GPA: ${edu.gpa}</p>` : ''}
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Skills Section -->
    ${skills ? `
    <section id="skills" class="section section-alt">
        <div class="container">
            <h2 class="section-title">Skills</h2>
            <div class="skills-grid">
                ${skills.technical?.length ? `
                <div class="skill-category">
                    <h3 class="skill-category-title">Technical Skills</h3>
                    <div class="skill-tags">
                        ${skills.technical.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                ${skills.soft?.length ? `
                <div class="skill-category">
                    <h3 class="skill-category-title">Soft Skills</h3>
                    <div class="skill-tags">
                        ${skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                ${skills.languages?.length ? `
                <div class="skill-category">
                    <h3 class="skill-category-title">Languages</h3>
                    <div class="skill-tags">
                        ${skills.languages.map(lang => `<span class="skill-tag">${lang}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Projects Section -->
    ${projects?.length ? `
    <section id="projects" class="section">
        <div class="container">
            <h2 class="section-title">Projects</h2>
            <div class="projects-grid">
                ${projects.map(proj => `
                <div class="project-card">
                    <h3 class="project-title">${proj.name}</h3>
                    <p class="project-description">${proj.description}</p>
                    ${proj.technologies?.length ? `
                    <div class="project-tech">
                        ${proj.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                    </div>
                    ` : ''}
                    ${proj.link ? `<a href="${proj.link}" target="_blank" class="project-link">View Project <i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Certifications Section -->
    ${certifications?.length ? `
    <section id="certifications" class="section section-alt">
        <div class="container">
            <h2 class="section-title">Certifications</h2>
            <div class="certifications-grid">
                ${certifications.map(cert => `
                <div class="certification-card">
                    <i class="fas fa-certificate cert-icon"></i>
                    <h3 class="cert-name">${cert.name}</h3>
                    <p class="cert-issuer">${cert.issuer}</p>
                    <p class="cert-date">${cert.date}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Contact Section -->
    <section id="contact" class="section">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-info">
                ${personalInfo?.email ? `
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
                </div>
                ` : ''}
                ${personalInfo?.phone ? `
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <a href="tel:${personalInfo.phone}">${personalInfo.phone}</a>
                </div>
                ` : ''}
                ${personalInfo?.linkedin ? `
                <div class="contact-item">
                    <i class="fab fa-linkedin"></i>
                    <a href="${personalInfo.linkedin}" target="_blank">LinkedIn Profile</a>
                </div>
                ` : ''}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${personalInfo?.fullName || 'Portfolio'}. Generated with AI.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
}

/**
 * Generate CSS for the personal website
 */
function generateCSS(design) {
  const { colorScheme } = design;

  return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: ${colorScheme.primary};
    --secondary: ${colorScheme.secondary};
    --accent: ${colorScheme.accent};
    --background: ${colorScheme.background};
    --text: ${colorScheme.text};
    --light-gray: #f3f4f6;
    --gray: #6b7280;
    --dark-gray: #374151;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: var(--text);
    background: var(--background);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 1rem 0;
}

.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    text-decoration: none;
    color: var(--text);
    font-weight: 500;
    transition: color 0.3s;
}

.nav-menu a:hover {
    color: var(--primary);
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    padding: 6rem 0;
    text-align: center;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    animation: fadeInUp 0.8s ease-out;
}

.hero-subtitle {
    font-size: 1.5rem;
    font-weight: 300;
    margin-bottom: 1rem;
    animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.hero-location {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    animation: fadeInUp 0.8s ease-out 0.4s backwards;
}

.social-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    animation: fadeInUp 0.8s ease-out 0.6s backwards;
}

.social-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: white;
    font-size: 1.5rem;
    text-decoration: none;
    transition: all 0.3s;
}

.social-link:hover {
    background: white;
    color: var(--primary);
    transform: translateY(-5px);
}

/* Sections */
.section {
    padding: 5rem 0;
}

.section-alt {
    background: var(--light-gray);
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    color: var(--primary);
    position: relative;
}

.section-title::after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: var(--accent);
    margin: 1rem auto 0;
    border-radius: 2px;
}

/* About Section */
.about-text {
    max-width: 800px;
    margin: 0 auto;
    font-size: 1.2rem;
    line-height: 1.8;
    text-align: center;
    color: var(--dark-gray);
}

/* Timeline (Experience) */
.timeline {
    position: relative;
    padding-left: 2rem;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--accent);
}

.timeline-item {
    position: relative;
    margin-bottom: 3rem;
    padding-left: 2rem;
}

.timeline-marker {
    position: absolute;
    left: -2.5rem;
    top: 0;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent);
    border: 4px solid var(--background);
    z-index: 1;
}

.timeline-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 0.5rem;
}

.timeline-company {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--dark-gray);
    margin-bottom: 0.5rem;
}

.timeline-date {
    color: var(--gray);
    margin-bottom: 1rem;
}

.timeline-description {
    margin-bottom: 1rem;
    color: var(--dark-gray);
}

.achievements {
    list-style: none;
    padding-left: 0;
}

.achievements li {
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
    position: relative;
}

.achievements li::before {
    content: '▹';
    position: absolute;
    left: 0;
    color: var(--accent);
    font-weight: bold;
}

/* Education */
.education-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.education-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.education-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.education-degree {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 0.5rem;
}

.education-field {
    font-size: 1.1rem;
    color: var(--dark-gray);
    margin-bottom: 0.5rem;
}

.education-institution {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.education-date {
    color: var(--gray);
}

/* Skills */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 3rem;
}

.skill-category-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 1rem;
}

.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.skill-tag {
    background: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 500;
    color: var(--dark-gray);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.skill-tag:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-2px);
}

/* Projects */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
}

.project-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.project-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 1rem;
}

.project-description {
    color: var(--dark-gray);
    margin-bottom: 1rem;
}

.project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.tech-badge {
    background: var(--light-gray);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    color: var(--dark-gray);
}

.project-link {
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
}

.project-link:hover {
    color: var(--secondary);
}

/* Certifications */
.certifications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}

.certification-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.certification-card:hover {
    transform: translateY(-5px);
}

.cert-icon {
    font-size: 3rem;
    color: var(--accent);
    margin-bottom: 1rem;
}

.cert-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 0.5rem;
}

.cert-issuer {
    color: var(--dark-gray);
    margin-bottom: 0.5rem;
}

.cert-date {
    color: var(--gray);
    font-size: 0.9rem;
}

/* Contact */
.contact-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.2rem;
}

.contact-item i {
    color: var(--primary);
    font-size: 1.5rem;
}

.contact-item a {
    color: var(--dark-gray);
    text-decoration: none;
    transition: color 0.3s;
}

.contact-item a:hover {
    color: var(--primary);
}

/* Footer */
.footer {
    background: var(--dark-gray);
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.2rem;
    }
    
    .section-title {
        font-size: 2rem;
    }
    
    .timeline {
        padding-left: 1rem;
    }
    
    .timeline-item {
        padding-left: 1.5rem;
    }
}`;
}

module.exports = {
  generateWebsite
};
