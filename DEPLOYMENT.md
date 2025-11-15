# 🌐 Deployment Guide

This guide will help you deploy your CV Website Generator to production.

## 📋 Deployment Options

1. [Local Deployment](#1-local-deployment)
2. [Heroku Deployment](#2-heroku-deployment)
3. [Railway Deployment](#3-railway-deployment)
4. [Vercel + Separate Backend](#4-vercel--separate-backend)
5. [DigitalOcean](#5-digitalocean)

---

## 1. Local Deployment

### For Development & Testing

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Configure environment
copy .env.example .env
# Add your GROK_API_KEY

# Run in development mode
npm run dev
```

Access at: http://localhost:3000

---

## 2. Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Create Heroku App**
```bash
heroku login
heroku create your-cv-generator
```

2. **Set Environment Variables**
```bash
heroku config:set GROK_API_KEY=your_api_key_here
heroku config:set NODE_ENV=production
```

3. **Create Procfile**
```
web: node server.js
```

4. **Update package.json**
```json
{
  "scripts": {
    "start": "node server.js",
    "heroku-postbuild": "cd client && npm install && npm run build"
  }
}
```

5. **Serve Static Files in Production**

Add to `server.js`:
```javascript
// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}
```

6. **Deploy**
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

7. **Open App**
```bash
heroku open
```

---

## 3. Railway Deployment

### Easiest Option!

1. **Visit Railway**
   - Go to: https://railway.app/
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment**
   - Add environment variables:
     - `GROK_API_KEY`: your_api_key
     - `NODE_ENV`: production
     - `PORT`: 3001

4. **Add Build Commands**
   - Build Command: `npm install && cd client && npm install && npm run build`
   - Start Command: `node server.js`

5. **Deploy**
   - Railway will automatically deploy
   - You'll get a public URL

---

## 4. Vercel + Separate Backend

### Frontend on Vercel, Backend Elsewhere

**Frontend (Vercel):**

1. **Prepare for Vercel**
```bash
cd client
```

2. **Install Vercel CLI**
```bash
npm i -g vercel
```

3. **Deploy**
```bash
vercel
```

4. **Update API URL**

In `client/src/App.jsx`:
```javascript
const API_URL = process.env.VITE_API_URL || 'https://your-backend.railway.app';
```

**Backend (Railway/Heroku):**

Deploy backend separately following Railway or Heroku guides above.

---

## 5. DigitalOcean

### For Full Control

1. **Create Droplet**
   - Go to DigitalOcean
   - Create Ubuntu droplet
   - SSH into server

2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install PM2**
```bash
sudo npm install -g pm2
```

4. **Clone & Setup**
```bash
git clone your-repo-url
cd cv-gen
npm install
cd client && npm install && npm run build && cd ..
```

5. **Configure Environment**
```bash
nano .env
# Add your GROK_API_KEY
```

6. **Start with PM2**
```bash
pm2 start server.js --name cv-generator
pm2 startup
pm2 save
```

7. **Setup Nginx**
```bash
sudo apt install nginx

sudo nano /etc/nginx/sites-available/cv-gen
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/cv-gen /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **SSL Certificate (Optional)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔐 Environment Variables for Production

### Required Variables

```env
# REQUIRED
GROK_API_KEY=your_actual_api_key

# API Configuration
GROK_API_URL=https://api.x.ai/v1/chat/completions

# Server
PORT=3001
NODE_ENV=production

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.txt
```

---

## ⚙️ Production Optimizations

### 1. Enable Compression

```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Add Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP
});

app.use('/api/', limiter);
```

### 3. Add Helmet for Security

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 4. CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000'
}));
```

### 5. Error Handling

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
```

---

## 📊 Monitoring

### 1. Add Logging

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Use in code
logger.info('CV processed successfully');
logger.error('Failed to process CV', { error: err.message });
```

### 2. Health Check Endpoint

Already implemented in `server.js`:

```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### 3. Analytics (Optional)

Consider adding:
- Google Analytics
- Mixpanel
- PostHog

---

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        npm install
        cd client && npm install
    
    - name: Build
      run: cd client && npm run build
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

---

## ✅ Pre-Deployment Checklist

- [ ] Environment variables set correctly
- [ ] GROK_API_KEY configured
- [ ] Build process tested locally
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Security headers added (Helmet)
- [ ] CORS configured properly
- [ ] File upload limits set
- [ ] Logging implemented
- [ ] Health check endpoint working
- [ ] SSL certificate configured (production)
- [ ] Backup strategy planned

---

## 🚀 Post-Deployment

### Testing

1. **Test File Upload**
   - Upload sample CV
   - Verify processing
   - Check generated website

2. **Test Error Handling**
   - Upload invalid file
   - Upload oversized file
   - Test with missing API key

3. **Performance Testing**
   - Test with multiple concurrent users
   - Monitor response times
   - Check memory usage

### Monitoring

1. **Set Up Alerts**
   - Server downtime
   - API errors
   - High memory usage

2. **Regular Checks**
   - Check logs daily
   - Monitor API usage
   - Review error rates

### Maintenance

1. **Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Update Node.js version

2. **Backups**
   - Database (if added)
   - Configuration files
   - Environment variables

---

## 📞 Support & Resources

- **Heroku Docs:** https://devcenter.heroku.com/
- **Railway Docs:** https://docs.railway.app/
- **Vercel Docs:** https://vercel.com/docs
- **DigitalOcean Tutorials:** https://www.digitalocean.com/community/tutorials

---

**Happy Deploying! 🚀**
