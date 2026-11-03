import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Lock,
  Sun,
  Moon,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  Activity,
  Cpu,
  GraduationCap,
  Briefcase,
  HelpCircle,
  Mail,
  Palette,
  ExternalLink,
  ArrowLeft,
  Image as ImageIcon,
  FolderOpen,
  Workflow
} from 'lucide-react';
import './AdminPage.css';

/**
 * Reusable Image Upload & Preview Field
 * Allows uploading any local image file or entering an image URL / path with live preview
 */
function ImageUploadField({ label, value, onChange, placeholder = "Enter /images/... path or upload file" }) {
  const { uploadImage } = usePortfolio();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const res = await uploadImage(file);
      if (res.success) {
        onChange(res.url);
      } else {
        setUploadError(res.error || 'Upload failed');
      }
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="admin-input-group admin-image-field">
      <label className="admin-label">{label}</label>

      {/* Live Preview */}
      <div className="admin-image-preview-wrap">
        {value ? (
          <img
            src={value}
            alt="Preview"
            className="admin-image-preview-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`admin-image-placeholder ${value ? 'hidden' : ''}`} style={{ display: value ? 'none' : 'flex' }}>
          <ImageIcon size={28} />
          <span>No image selected</span>
        </div>
      </div>

      {/* Action Buttons & Manual Input */}
      <div className="admin-image-actions">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <button
          type="button"
          className={`admin-upload-btn ${isUploading ? 'uploading' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload size={14} />
          <span>{isUploading ? 'Uploading Image...' : 'Upload Image File'}</span>
        </button>

        {value && (
          <button
            type="button"
            className="admin-remove-image-btn"
            onClick={() => onChange('')}
          >
            <Trash2 size={13} />
            <span>Remove</span>
          </button>
        )}
      </div>

      {uploadError && (
        <span style={{ fontSize: '12px', color: 'var(--adm-danger)' }}>{uploadError}</span>
      )}

      {/* Manual URL Input */}
      <input
        type="text"
        className="admin-input"
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function AdminPage() {
  const {
    content,
    theme,
    setTheme,
    saveContent,
    resetToDefaults,
    exportJSON,
    importJSON,
    isAdminLoggedIn,
    login,
    logout
  } = usePortfolio();

  const [draft, setDraft] = useState(content);
  const [activeTab, setActiveTab] = useState('general');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [inquiries, setInquiries] = useState([]);

  // Login form state
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sync draft with content
  useEffect(() => {
    setDraft(content);
  }, [content]);

  // Load contact inquiries when on the FAQ/Inquiries tab
  useEffect(() => {
    if (isAdminLoggedIn && activeTab === 'faq') {
      fetch('/api/contact')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setInquiries(data);
        })
        .catch(() => {});
    }
  }, [isAdminLoggedIn, activeTab]);

  // Handle Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const res = await login(userId, password);
    setLoginLoading(false);

    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials');
    } else {
      setUserId('');
      setPassword('');
    }
  };

  // Handle Save
  const handleSave = () => {
    saveContent(draft);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Handle Reset to Defaults
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all portfolio content to factory defaults?')) {
      resetToDefaults();
      setDraft(content);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  // Handle JSON Import
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const res = importJSON(evt.target?.result);
      if (res.success) {
        alert('Configuration imported and saved successfully!');
      } else {
        alert('Failed to import configuration: ' + res.error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Delete Contact Inquiry
  const handleDeleteInquiry = async (id) => {
    try {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      setInquiries(prev => prev.filter(m => m.id !== id));
    } catch {}
  };

  // =========================================================================
  // VIEW 1: STANDALONE LOGIN SCREEN
  // =========================================================================
  if (!isAdminLoggedIn) {
    return (
      <div className="admin-page-root">
        <div className="admin-login-screen">
          <a href="/" className="admin-login-back-link">
            <ArrowLeft size={16} />
            <span>Return to Portfolio</span>
          </a>

          <div className="admin-login-card">
            <div className="admin-login-icon-wrap">
              <Lock size={26} />
            </div>

            <h1 className="admin-login-title">Portfolio CMS Admin</h1>
            <p className="admin-login-subtitle">
              Dedicated administrative console to manage portfolio content, images, telemetry, and live theme.
            </p>

            <form onSubmit={handleLoginSubmit} className="admin-login-form">
              {loginError && (
                <div className="admin-error-box">
                  <AlertCircle size={18} />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="admin-input-group">
                <label className="admin-label">Administrator ID</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Enter User ID (e.g. pranavj93)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Password</label>
                <div className="admin-password-box">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="admin-input"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="admin-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="admin-submit-btn"
                disabled={loginLoading}
              >
                {loginLoading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
              </button>

              <div className="admin-hints-row">
                <span>Preset ID: <strong>pranavj93</strong></span>
                <span>•</span>
                <span>Password: <strong>pranav03</strong></span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULL STANDALONE DASHBOARD
  // =========================================================================
  return (
    <div className="admin-page-root">
      {/* Top Navigation Bar */}
      <header className="admin-navbar">
        <div className="admin-nav-left">
          <a href="/" className="admin-brand">
            <Sparkles size={18} className="text-cyan" />
            <span>PRANAV CMS</span>
            <span className="admin-brand-pill">ADMIN</span>
          </a>
          <div className="admin-user-tag">
            <span className="admin-user-dot" />
            <span>pranavj93</span>
          </div>
        </div>

        <div className="admin-nav-right">
          {/* View Live Portfolio Link */}
          <a href="/" className="admin-btn admin-btn-outline" target="_blank" rel="noreferrer" title="Open live portfolio in a new tab">
            <span>View Live Portfolio</span>
            <ExternalLink size={14} />
          </a>

          {/* Theme Switcher */}
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() => {
              const newTheme = draft.theme === 'light' ? 'dark' : 'light';
              setDraft(prev => ({ ...prev, theme: newTheme }));
              setTheme(newTheme);
            }}
            title="Toggle between Dark and White theme"
          >
            {draft.theme === 'light' ? (
              <>
                <Sun size={15} style={{ color: '#0284c7' }} />
                <span>White Theme</span>
              </>
            ) : (
              <>
                <Moon size={15} style={{ color: '#38bdf8' }} />
                <span>Dark Theme</span>
              </>
            )}
          </button>

          {/* Save & Publish Button */}
          <button
            type="button"
            className={`admin-btn admin-btn-primary ${saveSuccess ? 'saved' : ''}`}
            onClick={handleSave}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 size={15} />
                <span>Published!</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save &amp; Publish</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={handleReset}
            title="Reset all content to defaults"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          {/* Export JSON */}
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={exportJSON}
            title="Export JSON backup"
          >
            <Download size={14} />
          </button>

          {/* Import JSON */}
          <label className="admin-btn admin-btn-outline" style={{ cursor: 'pointer' }} title="Import JSON config">
            <Upload size={14} />
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              style={{ display: 'none' }}
            />
          </label>

          {/* Logout */}
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={logout}
            title="Log out of Admin Panel"
          >
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="admin-body">
        {/* Sidebar Tabs */}
        <aside className="admin-sidebar">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Palette size={16} />
            <span>General &amp; Theme</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <Sparkles size={16} />
            <span>Hero Section</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'statement' ? 'active' : ''}`}
            onClick={() => setActiveTab('statement')}
          >
            <Layers size={16} />
            <span>Lotus &amp; Statement</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'impact' ? 'active' : ''}`}
            onClick={() => setActiveTab('impact')}
          >
            <Activity size={16} />
            <span>Impact &amp; Telemetry</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FolderOpen size={16} />
            <span>Projects &amp; Images</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'automation' ? 'active' : ''}`}
            onClick={() => setActiveTab('automation')}
          >
            <Workflow size={16} />
            <span>Automation (5 Panels)</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'toolkit' ? 'active' : ''}`}
            onClick={() => setActiveTab('toolkit')}
          >
            <Cpu size={16} />
            <span>Engineering Toolkit</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <Briefcase size={16} />
            <span>Experience &amp; Bio</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            <HelpCircle size={16} />
            <span>FAQ &amp; Inquiries</span>
          </button>
        </aside>

        {/* Content Pane */}
        <main className="admin-content">
          {/* =========================================================
              TAB 1: GENERAL & THEME
             ========================================================= */}
          {activeTab === 'general' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">General &amp; Theme Settings</h2>
                <p className="admin-section-desc">Manage site identity, global theme mode, and social endpoints.</p>
              </div>

              <div className="admin-card">
                <h3 className="admin-card-title">Site Identity &amp; Global Theme</h3>
                <div className="admin-form-grid">
                  <div className="admin-input-group">
                    <label className="admin-label">Site Title (Browser Tab)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.general?.siteTitle || ''}
                      onChange={(e) => setDraft(prev => ({ ...prev, general: { ...prev.general, siteTitle: e.target.value } }))}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Site Tagline</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.general?.siteTagline || ''}
                      onChange={(e) => setDraft(prev => ({ ...prev, general: { ...prev.general, siteTagline: e.target.value } }))}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Active Theme Mode</label>
                    <select
                      className="admin-input"
                      value={draft.theme || 'dark'}
                      onChange={(e) => {
                        const newT = e.target.value;
                        setDraft(prev => ({ ...prev, theme: newT }));
                        setTheme(newT);
                      }}
                    >
                      <option value="dark">Dark Theme (Obsidian &amp; Neon)</option>
                      <option value="light">White Theme (Porcelain Minimalist)</option>
                    </select>
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Accent Color Code</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.general?.accentColor || '#00f0ff'}
                      onChange={(e) => setDraft(prev => ({ ...prev, general: { ...prev.general, accentColor: e.target.value } }))}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h3 className="admin-card-title">Social Links &amp; Contact</h3>
                <div className="admin-form-grid">
                  <div className="admin-input-group">
                    <label className="admin-label">Contact Email</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={draft.general?.contactEmail || ''}
                      onChange={(e) => setDraft(prev => ({ ...prev, general: { ...prev.general, contactEmail: e.target.value } }))}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">GitHub Profile URL</label>
                    <input
                      type="url"
                      className="admin-input"
                      value={draft.general?.githubUrl || ''}
                      onChange={(e) => setDraft(prev => ({ ...prev, general: { ...prev.general, githubUrl: e.target.value } }))}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">HuggingFace Hub URL</label>
                    <input
                      type="url"
                      className="admin-input"
                      value={draft.general?.huggingFaceUrl || ''}
                      onChange={(e) => setDraft(prev => ({ ...prev, general: { ...prev.general, huggingFaceUrl: e.target.value } }))}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      className="admin-input"
                      value={draft.general?.linkedinUrl || ''}
                      onChange={(e) => setDraft(prev => ({ ...prev, general: { ...prev.general, linkedinUrl: e.target.value } }))}
                    />
                  </div>
                </div>
              </div>

              {/* Signature Image Upload Field */}
              <div className="admin-card">
                <h3 className="admin-card-title">Signature &amp; Branding Images</h3>
                <ImageUploadField
                  label="Signature Vector Image"
                  value={draft.general?.signatureImage || '/images/signature.svg'}
                  onChange={(url) => setDraft(prev => ({ ...prev, general: { ...prev.general, signatureImage: url } }))}
                  placeholder="/images/signature.svg or upload your signature"
                />
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 2: HERO SECTION
             ========================================================= */}
          {activeTab === 'hero' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">Hero Section Settings</h2>
                <p className="admin-section-desc">Manage primary greeting, role badge, and rotating headings.</p>
              </div>

              <div className="admin-card">
                <h3 className="admin-card-title">Greetings &amp; CTA</h3>
                <div className="admin-form-grid">
                  <div className="admin-input-group">
                    <label className="admin-label">Brand Name in Navbar</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.hero?.navBrand || 'PranavJadhav'}
                      onChange={(e) => setDraft(prev => ({ ...prev, hero: { ...prev.hero, navBrand: e.target.value } }))}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Main Greeting Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.hero?.mainGreeting || "I'm Pranav"}
                      onChange={(e) => setDraft(prev => ({ ...prev, hero: { ...prev.hero, mainGreeting: e.target.value } }))}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Role Badge Pill</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.hero?.roleBadge || 'Production ML & LLMOps Engineer'}
                      onChange={(e) => setDraft(prev => ({ ...prev, hero: { ...prev.hero, roleBadge: e.target.value } }))}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Contact Button Label</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.hero?.contactButtonText || 'Contact'}
                      onChange={(e) => setDraft(prev => ({ ...prev, hero: { ...prev.hero, contactButtonText: e.target.value } }))}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h3 className="admin-card-title">Rotating Headline Strings</h3>
                {(draft.hero?.rotatingHeadings || []).map((heading, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={heading}
                      onChange={(e) => {
                        const updated = [...draft.hero.rotatingHeadings];
                        updated[idx] = e.target.value;
                        setDraft(prev => ({ ...prev, hero: { ...prev.hero, rotatingHeadings: updated } }));
                      }}
                    />
                    <button
                      type="button"
                      className="admin-delete-btn"
                      onClick={() => {
                        const updated = draft.hero.rotatingHeadings.filter((_, i) => i !== idx);
                        setDraft(prev => ({ ...prev, hero: { ...prev.hero, rotatingHeadings: updated } }));
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="admin-add-btn"
                  onClick={() => {
                    const updated = [...(draft.hero?.rotatingHeadings || []), 'NEW SPECIALTY.'];
                    setDraft(prev => ({ ...prev, hero: { ...prev.hero, rotatingHeadings: updated } }));
                  }}
                >
                  <Plus size={16} />
                  <span>Add Rotating Heading</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 3: LOTUS & STATEMENT
             ========================================================= */}
          {activeTab === 'statement' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">3D Lotus &amp; Statement</h2>
                <p className="admin-section-desc">Manage the illuminated words that appear over the lotus flower stem.</p>
              </div>

              <div className="admin-card">
                <h3 className="admin-card-title">Statement Words (Exact 3-Line Arrangement)</h3>
                <p style={{ fontSize: '13px', color: 'var(--adm-text-secondary)', marginBottom: '16px' }}>
                  Current words: {draft.statement?.words?.join(' ')}
                </p>

                <div className="admin-input-group">
                  <label className="admin-label">Edit Statement as Full Text</label>
                  <textarea
                    className="admin-input admin-textarea"
                    rows={4}
                    value={draft.statement?.words ? draft.statement.words.join(' ') : ''}
                    onChange={(e) => {
                      const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                      setDraft(prev => ({ ...prev, statement: { ...prev.statement, words } }));
                    }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--adm-text-muted)' }}>
                    Words will automatically format into 3 balanced lines across the stem.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 4: IMPACT & TELEMETRY
             ========================================================= */}
          {activeTab === 'impact' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">Impact &amp; Telemetry Section</h2>
                <p className="admin-section-desc">Configure the single-line 3 bullet points, and the 8 telemetry metrics for 3D Orbit &amp; Detailed Grid.</p>
              </div>

              {/* 3 Bullet Points */}
              <div className="admin-card">
                <h3 className="admin-card-title">Header 3 Bullet Points</h3>
                <div className="admin-form-grid">
                  {(draft.marquee || [
                    "Sub-50ms p50 Latency Budgets",
                    "1M+ Vector Scale Retrieval",
                    "Automated Dual-Judge Verification"
                  ]).slice(0, 3).map((item, idx) => (
                    <div key={idx} className="admin-input-group">
                      <label className="admin-label">Bullet Point 0{idx + 1}</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={item}
                        onChange={(e) => {
                          const updated = [...(draft.marquee || [])];
                          updated[idx] = e.target.value;
                          setDraft(prev => ({ ...prev, marquee: updated }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 8 Telemetry Metrics */}
              <div className="admin-card">
                <h3 className="admin-card-title">8 Production Telemetry Metrics</h3>
                <div className="admin-form-grid">
                  {(draft.impact?.metrics || []).map((m, idx) => (
                    <div key={idx} className="admin-item-card" style={{ padding: '16px' }}>
                      <div className="admin-item-topbar" style={{ marginBottom: '10px' }}>
                        <span className="admin-item-index">METRIC #{idx + 1}</span>
                      </div>
                      <div className="admin-input-group" style={{ marginBottom: '8px' }}>
                        <label className="admin-label">Number / Metric</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={m.number}
                          onChange={(e) => {
                            const updated = [...draft.impact.metrics];
                            updated[idx] = { ...updated[idx], number: e.target.value };
                            setDraft(prev => ({ ...prev, impact: { ...prev.impact, metrics: updated } }));
                          }}
                        />
                      </div>
                      <div className="admin-input-group" style={{ marginBottom: '8px' }}>
                        <label className="admin-label">Category Tag</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={m.tag || ''}
                          onChange={(e) => {
                            const updated = [...draft.impact.metrics];
                            updated[idx] = { ...updated[idx], tag: e.target.value };
                            setDraft(prev => ({ ...prev, impact: { ...prev.impact, metrics: updated } }));
                          }}
                        />
                      </div>
                      <div className="admin-input-group">
                        <label className="admin-label">Label / Description</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={m.label}
                          onChange={(e) => {
                            const updated = [...draft.impact.metrics];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setDraft(prev => ({ ...prev, impact: { ...prev.impact, metrics: updated } }));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 5: PROJECTS & CASE STUDIES (WITH IMAGE UPLOAD!)
             ========================================================= */}
          {activeTab === 'projects' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">Projects &amp; Case Studies</h2>
                <p className="admin-section-desc">Manage project titles, descriptions, technical metrics, and <strong>upload or change project images</strong>.</p>
              </div>

              {(draft.projects || []).map((project, idx) => (
                <div key={project.id || idx} className="admin-item-card">
                  <div className="admin-item-topbar">
                    <span className="admin-item-index">PROJECT #{idx + 1} · {project.title}</span>
                    <button
                      type="button"
                      className="admin-delete-btn"
                      onClick={() => {
                        const updated = draft.projects.filter((_, i) => i !== idx);
                        setDraft(prev => ({ ...prev, projects: updated }));
                      }}
                      title="Delete this project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-input-group">
                      <label className="admin-label">Project Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={project.title || ''}
                        onChange={(e) => {
                          const updated = [...draft.projects];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setDraft(prev => ({ ...prev, projects: updated }));
                        }}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label className="admin-label">Eyebrow / Subcategory</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={project.eyebrow || ''}
                        onChange={(e) => {
                          const updated = [...draft.projects];
                          updated[idx] = { ...updated[idx], eyebrow: e.target.value };
                          setDraft(prev => ({ ...prev, projects: updated }));
                        }}
                      />
                    </div>

                    <div className="admin-input-group admin-full-width">
                      <label className="admin-label">Tagline</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={project.tagline || ''}
                        onChange={(e) => {
                          const updated = [...draft.projects];
                          updated[idx] = { ...updated[idx], tagline: e.target.value };
                          setDraft(prev => ({ ...prev, projects: updated }));
                        }}
                      />
                    </div>

                    <div className="admin-input-group admin-full-width">
                      <label className="admin-label">Project Description</label>
                      <textarea
                        className="admin-input admin-textarea"
                        rows={3}
                        value={project.description || ''}
                        onChange={(e) => {
                          const updated = [...draft.projects];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setDraft(prev => ({ ...prev, projects: updated }));
                        }}
                      />
                    </div>

                    {/* PROJECT IMAGE UPLOAD FIELD */}
                    <div className="admin-full-width" style={{ marginTop: '8px', marginBottom: '8px' }}>
                      <ImageUploadField
                        label={`Project Image / Diagram for "${project.title || `Project #${idx + 1}`}"`}
                        value={project.image || ''}
                        onChange={(newUrl) => {
                          const updated = [...draft.projects];
                          updated[idx] = { ...updated[idx], image: newUrl };
                          setDraft(prev => ({ ...prev, projects: updated }));
                        }}
                        placeholder="Click 'Upload Image File' or enter /images/... URL"
                      />
                    </div>

                    <div className="admin-input-group">
                      <label className="admin-label">GitHub Repository Link</label>
                      <input
                        type="url"
                        className="admin-input"
                        value={project.links?.github || ''}
                        onChange={(e) => {
                          const updated = [...draft.projects];
                          updated[idx] = { ...updated[idx], links: { ...updated[idx].links, github: e.target.value } };
                          setDraft(prev => ({ ...prev, projects: updated }));
                        }}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label className="admin-label">Live Demo / Documentation Link</label>
                      <input
                        type="url"
                        className="admin-input"
                        value={project.links?.live || ''}
                        onChange={(e) => {
                          const updated = [...draft.projects];
                          updated[idx] = { ...updated[idx], links: { ...updated[idx].links, live: e.target.value } };
                          setDraft(prev => ({ ...prev, projects: updated }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="admin-add-btn"
                onClick={() => {
                  const newProj = {
                    id: `proj_${Date.now()}`,
                    number: `0${(draft.projects?.length || 0) + 1}`,
                    title: "New ML Project",
                    eyebrow: "Production LLMOps",
                    tagline: "Scalable ML microservice with high throughput",
                    description: "End-to-end production pipeline with low latency and automated evaluation.",
                    image: "/images/project_grgpt.png",
                    links: { github: "https://github.com/shreecloudai", live: "" }
                  };
                  setDraft(prev => ({ ...prev, projects: [...(prev.projects || []), newProj] }));
                }}
              >
                <Plus size={16} />
                <span>Add New Project</span>
              </button>
            </div>
          )}

                    {/* =========================================================
              TAB: PRODUCTION AUTOMATION PIPELINES (5 PANELS)
             ========================================================= */}
          {activeTab === 'automation' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">Production Automation Pipelines (5 Panels)</h2>
                <p className="admin-section-desc">Manage the 5 interactive cards displayed in the 3D Scroll-Split deck under the blue mountain cover.</p>
              </div>

              <div className="admin-card">
                <h3 className="admin-card-title">Section Header</h3>
                <div className="admin-form-grid">
                  <div className="admin-input-group">
                    <label className="admin-label">Section Tag</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.automation?.sectionTag || ''}
                      onChange={(e) => setDraft(prev => ({ ...prev, automation: { ...prev.automation, sectionTag: e.target.value } }))}
                    />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-label">Main Heading</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.automation?.heading || ''}
                      onChange={(e) => setDraft(prev => ({ ...prev, automation: { ...prev.automation, heading: e.target.value } }))}
                    />
                  </div>
                  <div className="admin-input-group admin-full-width">
                    <label className="admin-label">Subtitle</label>
                    <textarea
                      className="admin-input admin-textarea"
                      rows={2}
                      value={draft.automation?.subtitle || ''}
                      onChange={(e) => setDraft(prev => ({ ...prev, automation: { ...prev.automation, subtitle: e.target.value } }))}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h3 className="admin-card-title">Automation Cards ({(draft.automation?.items || []).length} Panels)</h3>
                {(draft.automation?.items || []).map((card, idx) => (
                  <div key={card.id || idx} className="admin-item-card" style={{ marginBottom: '16px' }}>
                    <div className="admin-item-topbar" style={{ marginBottom: '10px' }}>
                      <span className="admin-item-index">PANEL #{idx + 1} · {card.badge || card.id}</span>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-input-group">
                        <label className="admin-label">Card Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={card.title || ''}
                          onChange={(e) => {
                            const updated = [...(draft.automation?.items || [])];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setDraft(prev => ({ ...prev, automation: { ...prev.automation, items: updated } }));
                          }}
                        />
                      </div>

                      <div className="admin-input-group">
                        <label className="admin-label">Badge Label</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={card.badge || ''}
                          onChange={(e) => {
                            const updated = [...(draft.automation?.items || [])];
                            updated[idx] = { ...updated[idx], badge: e.target.value };
                            setDraft(prev => ({ ...prev, automation: { ...prev.automation, items: updated } }));
                          }}
                        />
                      </div>

                      <div className="admin-input-group">
                        <label className="admin-label">Metric Highlight</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={card.metric || ''}
                          onChange={(e) => {
                            const updated = [...(draft.automation?.items || [])];
                            updated[idx] = { ...updated[idx], metric: e.target.value };
                            setDraft(prev => ({ ...prev, automation: { ...prev.automation, items: updated } }));
                          }}
                        />
                      </div>

                      <div className="admin-input-group">
                        <label className="admin-label">Card Background Color</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={card.bgColor || ''}
                          onChange={(e) => {
                            const updated = [...(draft.automation?.items || [])];
                            updated[idx] = { ...updated[idx], bgColor: e.target.value };
                            setDraft(prev => ({ ...prev, automation: { ...prev.automation, items: updated } }));
                          }}
                        />
                      </div>

                      <div className="admin-input-group admin-full-width">
                        <label className="admin-label">Description</label>
                        <textarea
                          className="admin-input admin-textarea"
                          rows={3}
                          value={card.description || ''}
                          onChange={(e) => {
                            const updated = [...(draft.automation?.items || [])];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setDraft(prev => ({ ...prev, automation: { ...prev.automation, items: updated } }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 6: COMPLETE ENGINEERING TOOLKIT
             ========================================================= */}
          {activeTab === 'toolkit' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">Complete Engineering Toolkit</h2>
                <p className="admin-section-desc">Manage the 8 categories and tool tags rendered in the clean 8-card grid.</p>
              </div>

              <div className="admin-form-grid">
                {(draft.toolkitCategories || [
                  { category: "Languages", items: ["Python", "SQL", "Bash"] },
                  { category: "LLM & NLP", items: ["HuggingFace Transformers", "PEFT/LoRA", "BERT", "DistilBERT", "Llama", "Mistral", "Phi-3", "RAG", "Embeddings", "Semantic Search", "spaCy"] },
                  { category: "RAG & Vector Search", items: ["Qdrant", "FAISS", "BM25", "Sentence-BERT", "Hybrid Retrieval", "LangChain"] },
                  { category: "LLMOps & Evaluation", items: ["LLM-as-Judge", "Hallucination Detection", "Evidently AI", "Drift Detection", "Model Observability", "Auto Fine-Tune Triggers"] },
                  { category: "MLOps & DevOps", items: ["MLflow", "DVC", "Docker", "Docker Compose", "GitHub Actions", "W&B"] },
                  { category: "Model Optimization", items: ["ONNX Runtime", "INT8 Quantization", "FP16", "4-bit Quantization", "vLLM", "Locust"] },
                  { category: "Cloud & Infrastructure", items: ["AWS EC2", "AWS S3", "AWS Lambda", "AWS SageMaker", "GCP Vertex AI", "Nginx"] },
                  { category: "Data Engineering", items: ["Pandas", "NumPy", "PySpark", "Delta Lake", "DuckDB"] }
                ]).map((cat, idx) => (
                  <div key={idx} className="admin-item-card">
                    <div className="admin-item-topbar" style={{ marginBottom: '10px' }}>
                      <span className="admin-item-index">{cat.category.toUpperCase()}</span>
                    </div>

                    <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                      <label className="admin-label">Category Name</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={cat.category}
                        onChange={(e) => {
                          const updated = [...(draft.toolkitCategories || [])];
                          updated[idx] = { ...updated[idx], category: e.target.value };
                          setDraft(prev => ({ ...prev, toolkitCategories: updated }));
                        }}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label className="admin-label">Comma-Separated Tool Names</label>
                      <textarea
                        className="admin-input admin-textarea"
                        rows={3}
                        value={cat.items ? cat.items.join(', ') : ''}
                        onChange={(e) => {
                          const items = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          const updated = [...(draft.toolkitCategories || [])];
                          updated[idx] = { ...updated[idx], items };
                          setDraft(prev => ({ ...prev, toolkitCategories: updated }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 7: EXPERIENCE & BIO (WITH PROFILE PHOTO UPLOAD)
             ========================================================= */}
          {activeTab === 'experience' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">Experience &amp; Bio Settings</h2>
                <p className="admin-section-desc">Manage career narrative, education credentials, and <strong>profile photo</strong>.</p>
              </div>

              {/* Profile Photo Upload Field */}
              <div className="admin-card">
                <h3 className="admin-card-title">Profile Photo</h3>
                <ImageUploadField
                  label="Portrait Profile Photo"
                  value={draft.about?.photo || '/images/pranav-profile.jpg'}
                  onChange={(url) => setDraft(prev => ({ ...prev, about: { ...prev.about, photo: url } }))}
                  placeholder="/images/pranav-profile.jpg or upload your portrait"
                />
              </div>

              <div className="admin-card">
                <h3 className="admin-card-title">Narrative &amp; Bio</h3>
                <div className="admin-form-grid">
                  <div className="admin-input-group admin-full-width">
                    <label className="admin-label">Main Narrative Headline</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={draft.about?.narrative || 'Engineer behind high-throughput LLM architectures.'}
                      onChange={(e) => setDraft(prev => ({ ...prev, about: { ...prev.about, narrative: e.target.value } }))}
                    />
                  </div>

                  <div className="admin-input-group admin-full-width">
                    <label className="admin-label">Bio Description</label>
                    <textarea
                      className="admin-input admin-textarea"
                      rows={4}
                      value={draft.about?.narrativeSub || ''}
                      onChange={(e) => setDraft(prev => ({ ...prev, about: { ...prev.about, narrativeSub: e.target.value } }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 8: FAQ & CONTACT INQUIRIES
             ========================================================= */}
          {activeTab === 'faq' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">FAQ &amp; Contact Inquiries</h2>
                <p className="admin-section-desc">Manage frequently asked questions, and review messages submitted through your portfolio contact form.</p>
              </div>

              {/* Received Contact Messages */}
              <div className="admin-card">
                <h3 className="admin-card-title">Received Inquiries ({inquiries.length})</h3>
                {inquiries.length === 0 ? (
                  <p style={{ fontSize: '13.5px', color: 'var(--adm-text-secondary)', margin: 0 }}>
                    No contact inquiries received yet. When recruiters or visitors message you through the contact form, they will appear here.
                  </p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-inquiries-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Sender</th>
                          <th>Company / Role</th>
                          <th>Message</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.map((inq) => (
                          <tr key={inq.id}>
                            <td style={{ whiteSpace: 'nowrap', color: 'var(--adm-text-muted)' }}>
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{inq.name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--adm-accent-cyan)' }}>{inq.email}</div>
                            </td>
                            <td>
                              <div>{inq.company || inq.who}</div>
                              <div style={{ fontSize: '12px', color: 'var(--adm-text-muted)' }}>{inq.role || inq.timeline}</div>
                            </td>
                            <td style={{ maxWidth: '300px', lineHeight: 1.4 }}>{inq.message}</td>
                            <td>
                              <button
                                type="button"
                                className="admin-delete-btn"
                                onClick={() => handleDeleteInquiry(inq.id)}
                                title="Delete inquiry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* FAQ Editor */}
              <div className="admin-card">
                <h3 className="admin-card-title">Frequently Asked Questions</h3>
                {(draft.faq || []).map((faq, idx) => (
                  <div key={idx} className="admin-item-card" style={{ marginBottom: '14px' }}>
                    <div className="admin-item-topbar" style={{ marginBottom: '10px' }}>
                      <span className="admin-item-index">QUESTION #{idx + 1}</span>
                      <button
                        type="button"
                        className="admin-delete-btn"
                        onClick={() => {
                          const updated = draft.faq.filter((_, i) => i !== idx);
                          setDraft(prev => ({ ...prev, faq: updated }));
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                      <label className="admin-label">Question</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={faq.q || faq.question || ''}
                        onChange={(e) => {
                          const updated = [...draft.faq];
                          updated[idx] = { ...updated[idx], q: e.target.value, question: e.target.value };
                          setDraft(prev => ({ ...prev, faq: updated }));
                        }}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label className="admin-label">Short Answer</label>
                      <textarea
                        className="admin-input admin-textarea"
                        rows={2}
                        value={faq.shortAnswer || faq.a || ''}
                        onChange={(e) => {
                          const updated = [...draft.faq];
                          updated[idx] = { ...updated[idx], a: e.target.value, shortAnswer: e.target.value };
                          setDraft(prev => ({ ...prev, faq: updated }));
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="admin-add-btn"
                  onClick={() => {
                    const newFaq = { q: "New Question?", a: "Short, crisp answer." };
                    setDraft(prev => ({ ...prev, faq: [...(prev.faq || []), newFaq] }));
                  }}
                >
                  <Plus size={16} />
                  <span>Add FAQ Item</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

