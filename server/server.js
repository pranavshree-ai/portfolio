const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '25mb' }));

// Data directories
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Uploads directory inside frontend/public/uploads so Vite serves it instantly
const UPLOADS_DIR = path.join(__dirname, '../frontend/public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use('/uploads', express.static(UPLOADS_DIR));

const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// Helper to read JSON
function readJSON(file, fallback = null) {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
  return fallback;
}

// Helper to write JSON
function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err.message);
    return false;
  }
}

// In-memory or persisted contact inquiries
let contactMessages = readJSON(CONTACTS_FILE, []);

// Admin credentials specified by user:
// ID: pranavj93
// Password: pranav03
const ADMIN_CREDENTIALS = {
  id: 'pranavj93',
  password: 'pranav03'
};

// Health Check
app.get('/api/portfolio/health', (req, res) => {
  res.json({
    status: 'UP',
    server: 'Pranav Jadhav Portfolio Node.js Express API',
    port: PORT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) {
    return res.status(400).json({ success: false, error: 'User ID and Password are required.' });
  }

  if (id.trim() === ADMIN_CREDENTIALS.id && password.trim() === ADMIN_CREDENTIALS.password) {
    return res.json({
      success: true,
      message: 'Authentication successful. Welcome, Pranav!',
      token: 'pranav_admin_token_' + Date.now(),
      user: {
        id: ADMIN_CREDENTIALS.id,
        name: 'Pranav Jadhav',
        role: 'Administrator'
      }
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid credentials. Please verify your User ID and Password.'
  });
});

// Get Full Portfolio Content
app.get('/api/portfolio/content', (req, res) => {
  const content = readJSON(CONTENT_FILE, null);
  res.json({
    success: true,
    content
  });
});

// Update Full Portfolio Content
app.post('/api/portfolio/content', (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, error: 'Content payload is required.' });
  }

  const success = writeJSON(CONTENT_FILE, content);
  if (success) {
    console.log(`[Admin] Portfolio content updated successfully at ${new Date().toISOString()}`);
    return res.json({
      success: true,
      message: 'Portfolio content saved and published successfully.'
    });
  } else {
    return res.status(500).json({
      success: false,
      error: 'Failed to write content to storage.'
    });
  }
});

// Reset Content to Default (Deletes override file)
app.post('/api/portfolio/reset', (req, res) => {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      fs.unlinkSync(CONTENT_FILE);
    }
    console.log('[Admin] Portfolio content reset to factory defaults.');
    res.json({ success: true, message: 'Content reset to defaults.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Image Upload Endpoint (Base64 payload)
app.post('/api/admin/upload-image', (req, res) => {
  const { fileName, base64Data } = req.body;
  if (!fileName || !base64Data) {
    return res.status(400).json({ success: false, error: 'fileName and base64Data are required.' });
  }

  try {
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');
    
    // Clean and timestamp filename
    const ext = path.extname(fileName) || '.png';
    const base = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeName = `${Date.now()}_${base}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, safeName);
    
    fs.writeFileSync(targetPath, buffer);
    console.log(`[Admin] Image uploaded: ${safeName} (${(buffer.length / 1024).toFixed(1)} KB)`);

    const publicUrl = `/uploads/${safeName}`;
    return res.json({
      success: true,
      url: publicUrl,
      fileName: safeName
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Contact Inquiries (POST)
app.post('/api/contact', (req, res) => {
  const { name, email, message, who, timeline, company, role, projectType } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and message are required fields.'
    });
  }

  const newEntry = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    who: who || 'Hiring Manager / Recruiter',
    timeline: timeline || 'Immediate',
    company: company || '',
    role: role || projectType || 'Machine Learning Engineer',
    message,
    createdAt: new Date().toISOString()
  };

  contactMessages.unshift(newEntry);
  writeJSON(CONTACTS_FILE, contactMessages);

  console.log(`[Contact] Inquiry from ${name} (${email}) - ${newEntry.who} / ${newEntry.company}`);

  res.status(201).json({
    success: true,
    message: "Thank you! Pranav has received your message and will respond promptly.",
    data: newEntry
  });
});

// View Contact Inquiries (GET)
app.get('/api/contact', (req, res) => {
  res.json(contactMessages);
});

// Clear Contact Inquiries
app.delete('/api/contact/:id', (req, res) => {
  const { id } = req.params;
  contactMessages = contactMessages.filter(m => m.id !== id);
  writeJSON(CONTACTS_FILE, contactMessages);
  res.json({ success: true, message: 'Message deleted' });
});

app.listen(PORT, () => {
  console.log(`🚀 Pranav Jadhav Portfolio Node.js API running on http://localhost:${PORT}`);
});
