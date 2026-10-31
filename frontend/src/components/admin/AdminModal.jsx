import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  X,
  Lock,
  Unlock,
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
  Palette
} from 'lucide-react';
import './AdminModal.css';

export default function AdminModal() {
  const {
    content,
    theme,
    setTheme,
    saveContent,
    resetToDefaults,
    exportJSON,
    importJSON,
    isAdminOpen,
    setIsAdminOpen,
    isAdminLoggedIn,
    login,
    logout
  } = usePortfolio();

  // Local draft state for editing before saving
  const [draft, setDraft] = useState(content);
  const [activeTab, setActiveTab] = useState('theme');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Login form fields
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sync draft when content changes
  useEffect(() => {
    setDraft(content);
  }, [content]);

  // Reset login error when opened
  useEffect(() => {
    if (isAdminOpen) {
      setLoginError('');
      setSaveSuccess(false);
    }
  }, [isAdminOpen]);

  if (!isAdminOpen) return null;

  // Handle Login
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
    setTimeout(() => setSaveSuccess(false), 2400);
  };

  // Handle Reset Defaults
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all portfolio content to factory defaults?')) {
      resetToDefaults();
      setDraft(content);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2400);
    }
  };

  // Handle Import
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const res = importJSON(evt.target?.result);
      if (res.success) {
        alert('Configuration imported successfully!');
      } else {
        alert('Failed to import configuration: ' + res.error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="adm-overlay" onClick={() => setIsAdminOpen(false)}>
      <div className="adm-container" onClick={(e) => e.stopPropagation()}>
        {/* ============================================================
            1. LOGIN VIEW (If not logged in)
           ============================================================ */}
        {!isAdminLoggedIn ? (
          <div className="adm-login-box">
            <button className="adm-close-btn" onClick={() => setIsAdminOpen(false)}>
              <X size={20} />
            </button>

            <div className="adm-login-icon">
              <Lock size={32} />
            </div>

            <h2 className="adm-login-title">Portfolio CMS Admin</h2>
            <p className="adm-login-subtitle">
              Enter your administrator credentials to manage all portfolio content, cards, and theme settings.
            </p>

            <form onSubmit={handleLoginSubmit} className="adm-login-form">
              {loginError && (
                <div className="adm-error-badge">
                  <AlertCircle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="adm-field-group">
                <label className="adm-label">Administrator ID</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="Enter User ID (e.g. pranavj93)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="adm-field-group">
                <label className="adm-label">Password</label>
                <div className="adm-password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="adm-input"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="adm-pwd-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="adm-btn adm-btn-primary adm-btn-full"
                disabled={loginLoading}
              >
                {loginLoading ? 'Authenticating...' : 'Sign In to Admin Panel'}
              </button>

              <div className="adm-credentials-hint">
                <span>Preset ID: <strong>pranavj93</strong></span>
                <span>•</span>
                <span>Password: <strong>pranav03</strong></span>
              </div>
            </form>
          </div>
        ) : (
          /* ============================================================
              2. DASHBOARD VIEW (When Authenticated)
             ============================================================ */
          <div className="adm-dashboard">
            {/* Top Navigation Bar */}
            <div className="adm-topbar">
              <div className="adm-topbar-left">
                <div className="adm-logo-badge">
                  <Sparkles size={16} className="text-cyan" />
                  <span>PRANAV CMS</span>
                </div>
                <div className="adm-auth-pill">
                  <span className="adm-auth-dot" />
                  <span>pranavj93</span>
                </div>
              </div>

              <div className="adm-topbar-actions">
                {/* Theme Switcher Toggle */}
                <button
                  type="button"
                  className={`adm-theme-toggle ${draft.theme === 'light' ? 'light' : 'dark'}`}
                  onClick={() => {
                    const newTheme = draft.theme === 'light' ? 'dark' : 'light';
                    setDraft(prev => ({ ...prev, theme: newTheme }));
                    setTheme(newTheme);
                  }}
                  title="Switch Theme (Dark / Light)"
                >
                  {draft.theme === 'light' ? (
                    <>
                      <Sun size={15} className="adm-theme-icon" />
                      <span>White Theme</span>
                    </>
                  ) : (
                    <>
                      <Moon size={15} className="adm-theme-icon" />
                      <span>Dark Theme</span>
                    </>
                  )}
                </button>

                {/* Save & Publish Button */}
                <button
                  type="button"
                  className={`adm-btn adm-btn-primary adm-btn-save ${saveSuccess ? 'saved' : ''}`}
                  onClick={handleSave}
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Published!</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save &amp; Publish</span>
                    </>
                  )}
                </button>

                {/* Reset to Factory Defaults */}
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  onClick={handleReset}
                  title="Reset to Factory Defaults"
                >
                  <RotateCcw size={15} />
                  <span>Reset</span>
                </button>

                {/* Export JSON */}
                <button
                  type="button"
                  className="adm-btn adm-btn-icon"
                  onClick={exportJSON}
                  title="Export Backup JSON"
                >
                  <Download size={15} />
                </button>

                {/* Import JSON */}
                <label className="adm-btn adm-btn-icon adm-file-label" title="Import JSON Config">
                  <Upload size={15} />
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
                  className="adm-btn adm-btn-danger"
                  onClick={logout}
                  title="Logout"
                >
                  <Unlock size={15} />
                  <span>Logout</span>
                </button>

                {/* Close Modal */}
                <button
                  type="button"
                  className="adm-close-btn"
                  onClick={() => setIsAdminOpen(false)}
                  title="Close Admin Panel"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Content Layout (Sidebar Tabs + Content Body) */}
            <div className="adm-main-body">
              {/* Sidebar Tabs */}
              <div className="adm-sidebar">
                <button
                  className={`adm-tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
                  onClick={() => setActiveTab('theme')}
                >
                  <Palette size={16} />
                  <span>Theme &amp; Style</span>
                </button>

                <button
                  className={`adm-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
                  onClick={() => setActiveTab('hero')}
                >
                  <Sparkles size={16} />
                  <span>Hero &amp; Statement</span>
                </button>

                <button
                  className={`adm-tab-btn ${activeTab === 'impact' ? 'active' : ''}`}
                  onClick={() => setActiveTab('impact')}
                >
                  <Activity size={16} />
                  <span>Impact &amp; Telemetry</span>
                </button>

                <button
                  className={`adm-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                  onClick={() => setActiveTab('projects')}
                >
                  <Layers size={16} />
                  <span>Projects (Flip Stack)</span>
                </button>

                <button
                  className={`adm-tab-btn ${activeTab === 'automation' ? 'active' : ''}`}
                  onClick={() => setActiveTab('automation')}
                >
                  <Cpu size={16} />
                  <span>Automation Pipelines</span>
                </button>

                <button
                  className={`adm-tab-btn ${activeTab === 'toolkit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('toolkit')}
                >
                  <Briefcase size={16} />
                  <span>Engineering Toolkit</span>
                </button>

                <button
                  className={`adm-tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                  onClick={() => setActiveTab('experience')}
                >
                  <Briefcase size={16} />
                  <span>Experience &amp; Bio</span>
                </button>

                <button
                  className={`adm-tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                  onClick={() => setActiveTab('education')}
                >
                  <GraduationCap size={16} />
                  <span>Education</span>
                </button>

                <button
                  className={`adm-tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
                  onClick={() => setActiveTab('faq')}
                >
                  <HelpCircle size={16} />
                  <span>FAQ &amp; Orbit Stack</span>
                </button>
              </div>

              {/* Form Content Pane */}
              <div className="adm-form-pane">
                {/* 1. THEME & STYLE TAB */}
                {activeTab === 'theme' && (
                  <div className="adm-tab-panel">
                    <div className="adm-panel-header">
                      <h3>Theme &amp; Visual Appearance</h3>
                      <p>Switch between dark obsidian mode and bright clean white mode for the live site.</p>
                    </div>

                    <div className="adm-card-box">
                      <div className="adm-theme-picker-row">
                        <div
                          className={`adm-theme-card ${draft.theme !== 'light' ? 'selected' : ''}`}
                          onClick={() => {
                            setDraft(prev => ({ ...prev, theme: 'dark' }));
                            setTheme('dark');
                          }}
                        >
                          <div className="adm-theme-preview dark-preview">
                            <div className="preview-top" />
                            <div className="preview-card" />
                          </div>
                          <div className="adm-theme-meta">
                            <h4>Dark Theme (Obsidian)</h4>
                            <p>Pitch-black canvas, neon accents, specular sheen cards.</p>
                          </div>
                        </div>

                        <div
                          className={`adm-theme-card ${draft.theme === 'light' ? 'selected' : ''}`}
                          onClick={() => {
                            setDraft(prev => ({ ...prev, theme: 'light' }));
                            setTheme('light');
                          }}
                        >
                          <div className="adm-theme-preview light-preview">
                            <div className="preview-top" />
                            <div className="preview-card" />
                          </div>
                          <div className="adm-theme-meta">
                            <h4>White Theme (Porcelain)</h4>
                            <p>Clean white background, high contrast obsidian text, subtle glass shadows.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="adm-card-box">
                      <h4 className="adm-box-title">Global Contact &amp; Social Links</h4>
                      <div className="adm-grid-2">
                        <div className="adm-field-group">
                          <label className="adm-label">Contact Email</label>
                          <input
                            type="email"
                            className="adm-input"
                            value={draft.general?.contactEmail || ''}
                            onChange={(e) => setDraft(prev => ({
                              ...prev,
                              general: { ...prev.general, contactEmail: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="adm-field-group">
                          <label className="adm-label">GitHub Profile URL</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={draft.general?.githubUrl || ''}
                            onChange={(e) => setDraft(prev => ({
                              ...prev,
                              general: { ...prev.general, githubUrl: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="adm-field-group">
                          <label className="adm-label">LinkedIn Profile URL</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={draft.general?.linkedinUrl || ''}
                            onChange={(e) => setDraft(prev => ({
                              ...prev,
                              general: { ...prev.general, linkedinUrl: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="adm-field-group">
                          <label className="adm-label">HuggingFace Profile URL</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={draft.general?.huggingFaceUrl || ''}
                            onChange={(e) => setDraft(prev => ({
                              ...prev,
                              general: { ...prev.general, huggingFaceUrl: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. HERO & STATEMENT TAB */}
                {activeTab === 'hero' && (
                  <div className="adm-tab-panel">
                    <div className="adm-panel-header">
                      <h3>Hero Section &amp; Statement</h3>
                      <p>Modify the landing titles, rotating serif headings, and the 3D flower reveal text.</p>
                    </div>

                    <div className="adm-card-box">
                      <h4 className="adm-box-title">Hero Titles</h4>
                      <div className="adm-grid-2">
                        <div className="adm-field-group">
                          <label className="adm-label">Nav Brand Name</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={draft.hero?.navBrand || ''}
                            onChange={(e) => setDraft(prev => ({
                              ...prev,
                              hero: { ...prev.hero, navBrand: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="adm-field-group">
                          <label className="adm-label">Main Greeting</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={draft.hero?.mainGreeting || ''}
                            onChange={(e) => setDraft(prev => ({
                              ...prev,
                              hero: { ...prev.hero, mainGreeting: e.target.value }
                            }))}
                          />
                        </div>
                      </div>

                      <div className="adm-field-group">
                        <label className="adm-label">Role Badge Text</label>
                        <input
                          type="text"
                          className="adm-input"
                          value={draft.hero?.roleBadge || ''}
                          onChange={(e) => setDraft(prev => ({
                            ...prev,
                            hero: { ...prev.hero, roleBadge: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="adm-field-group">
                        <label className="adm-label">Rotating Headings (Instrument Serif)</label>
                        {(draft.hero?.rotatingHeadings || []).map((heading, idx) => (
                          <div key={idx} className="adm-array-row">
                            <input
                              type="text"
                              className="adm-input"
                              value={heading}
                              onChange={(e) => {
                                const updated = [...draft.hero.rotatingHeadings];
                                updated[idx] = e.target.value;
                                setDraft(prev => ({
                                  ...prev,
                                  hero: { ...prev.hero, rotatingHeadings: updated }
                                }));
                              }}
                            />
                            <button
                              type="button"
                              className="adm-btn-icon-del"
                              onClick={() => {
                                const updated = draft.hero.rotatingHeadings.filter((_, i) => i !== idx);
                                setDraft(prev => ({
                                  ...prev,
                                  hero: { ...prev.hero, rotatingHeadings: updated }
                                }));
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="adm-btn adm-btn-secondary"
                          style={{ marginTop: '8px' }}
                          onClick={() => {
                            setDraft(prev => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                rotatingHeadings: [...(prev.hero.rotatingHeadings || []), 'NEW HEADING.']
                              }
                            }));
                          }}
                        >
                          <Plus size={14} /> Add Rotating Heading
                        </button>
                      </div>
                    </div>

                    <div className="adm-card-box">
                      <h4 className="adm-box-title">3D Lotus Reveal Statement (Text Repel)</h4>
                      <div className="adm-field-group">
                        <label className="adm-label">Full Statement Text</label>
                        <textarea
                          rows={3}
                          className="adm-textarea"
                          value={draft.statement?.words ? draft.statement.words.join(' ') : ''}
                          onChange={(e) => {
                            const newWords = e.target.value.split(/\s+/).filter(Boolean);
                            setDraft(prev => ({
                              ...prev,
                              statement: { words: newWords }
                            }));
                          }}
                        />
                        <span className="adm-field-tip">
                          Words automatically receive interactive physics repel repulsion when hovered.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. IMPACT & TELEMETRY TAB */}
                {activeTab === 'impact' && (
                  <div className="adm-tab-panel">
                    <div className="adm-panel-header">
                      <h3>Impact &amp; Telemetry Section</h3>
                      <p>Edit the 3 top anchor boxes and all revolving Orbit metric cards.</p>
                    </div>

                    <div className="adm-card-box">
                      <h4 className="adm-box-title">3 Anchor Highlight Boxes</h4>
                      {(draft.impact?.pillars || []).map((pillar, idx) => (
                        <div key={idx} className="adm-item-box">
                          <div className="adm-item-box-header">
                            <span className="adm-badge">Box 0{idx + 1}</span>
                          </div>
                          <div className="adm-grid-2">
                            <div className="adm-field-group">
                              <label className="adm-label">Header Tag</label>
                              <input
                                type="text"
                                className="adm-input"
                                value={pillar.tag || ''}
                                onChange={(e) => {
                                  const updated = [...draft.impact.pillars];
                                  updated[idx] = { ...updated[idx], tag: e.target.value };
                                  setDraft(prev => ({
                                    ...prev,
                                    impact: { ...prev.impact, pillars: updated }
                                  }));
                                }}
                              />
                            </div>
                            <div className="adm-field-group">
                              <label className="adm-label">Box Title</label>
                              <input
                                type="text"
                                className="adm-input"
                                value={pillar.title || ''}
                                onChange={(e) => {
                                  const updated = [...draft.impact.pillars];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  setDraft(prev => ({
                                    ...prev,
                                    impact: { ...prev.impact, pillars: updated }
                                  }));
                                }}
                              />
                            </div>
                          </div>
                          <div className="adm-field-group">
                            <label className="adm-label">Description / Subtitle</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={pillar.desc || ''}
                              onChange={(e) => {
                                const updated = [...draft.impact.pillars];
                                updated[idx] = { ...updated[idx], desc: e.target.value };
                                setDraft(prev => ({
                                  ...prev,
                                  impact: { ...prev.impact, pillars: updated }
                                }));
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="adm-card-box">
                      <div className="adm-box-header-row">
                        <h4 className="adm-box-title">Orbit Metric Cards (Revolving 3D Arch)</h4>
                        <button
                          type="button"
                          className="adm-btn adm-btn-secondary"
                          onClick={() => {
                            setDraft(prev => ({
                              ...prev,
                              impact: {
                                ...prev.impact,
                                metrics: [
                                  ...(prev.impact.metrics || []),
                                  { number: "99.9%", label: "New Production Metric", tag: "SLA" }
                                ]
                              }
                            }));
                          }}
                        >
                          <Plus size={14} /> Add Metric Card
                        </button>
                      </div>

                      <div className="adm-items-list">
                        {(draft.impact?.metrics || []).map((metric, idx) => (
                          <div key={idx} className="adm-item-box">
                            <div className="adm-item-box-header">
                              <span className="adm-badge">Card 0{idx + 1}</span>
                              <button
                                type="button"
                                className="adm-btn-icon-del"
                                onClick={() => {
                                  const updated = draft.impact.metrics.filter((_, i) => i !== idx);
                                  setDraft(prev => ({
                                    ...prev,
                                    impact: { ...prev.impact, metrics: updated }
                                  }));
                                }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <div className="adm-grid-3">
                              <div className="adm-field-group">
                                <label className="adm-label">Metric Number</label>
                                <input
                                  type="text"
                                  className="adm-input"
                                  value={metric.number || ''}
                                  onChange={(e) => {
                                    const updated = [...draft.impact.metrics];
                                    updated[idx] = { ...updated[idx], number: e.target.value };
                                    setDraft(prev => ({
                                      ...prev,
                                      impact: { ...prev.impact, metrics: updated }
                                    }));
                                  }}
                                />
                              </div>
                              <div className="adm-field-group">
                                <label className="adm-label">Category Tag</label>
                                <input
                                  type="text"
                                  className="adm-input"
                                  value={metric.tag || ''}
                                  onChange={(e) => {
                                    const updated = [...draft.impact.metrics];
                                    updated[idx] = { ...updated[idx], tag: e.target.value };
                                    setDraft(prev => ({
                                      ...prev,
                                      impact: { ...prev.impact, metrics: updated }
                                    }));
                                  }}
                                />
                              </div>
                              <div className="adm-field-group">
                                <label className="adm-label">Production Label</label>
                                <input
                                  type="text"
                                  className="adm-input"
                                  value={metric.label || ''}
                                  onChange={(e) => {
                                    const updated = [...draft.impact.metrics];
                                    updated[idx] = { ...updated[idx], label: e.target.value };
                                    setDraft(prev => ({
                                      ...prev,
                                      impact: { ...prev.impact, metrics: updated }
                                    }));
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <div className="adm-tab-panel">
                    <div className="adm-panel-header">
                      <h3>Selected Projects (Case Study Flip Stack)</h3>
                      <p>Manage all flagship engineering projects, metrics, tech tags, and links.</p>
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary"
                        style={{ marginTop: '10px' }}
                        onClick={() => {
                          const newProject = {
                            id: `proj_${Date.now()}`,
                            number: `0${(draft.projects?.length || 0) + 1}`,
                            eyebrow: "Production ML",
                            title: "New Flagship System",
                            tagline: "High-Throughput ML Microservice",
                            category: "MLOps · Engineering",
                            description: "Comprehensive production implementation with sub-50ms latency budgets and continuous verification pipelines.",
                            metricHighlight: "99.9% Uptime",
                            image: "/images/project_grgpt.png",
                            link: "https://github.com/shreecloudai",
                            technologies: ["PyTorch", "FastAPI", "Docker"],
                            accentColor: "#00f0ff",
                            background: "linear-gradient(135deg, rgba(6, 135, 155, 0.45) 0%, rgba(10, 24, 30, 0.88) 55%, rgba(6, 12, 16, 0.96) 100%)"
                          };
                          setDraft(prev => ({
                            ...prev,
                            projects: [...(prev.projects || []), newProject]
                          }));
                        }}
                      >
                        <Plus size={14} /> Add New Project
                      </button>
                    </div>

                    {(draft.projects || []).map((project, idx) => (
                      <div key={project.id || idx} className="adm-card-box">
                        <div className="adm-item-box-header">
                          <span className="adm-badge">{project.number || `0${idx + 1}`} · {project.title}</span>
                          <button
                            type="button"
                            className="adm-btn-icon-del"
                            onClick={() => {
                              const updated = draft.projects.filter((_, i) => i !== idx);
                              setDraft(prev => ({ ...prev, projects: updated }));
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="adm-grid-3">
                          <div className="adm-field-group">
                            <label className="adm-label">Number</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={project.number || ''}
                              onChange={(e) => {
                                const updated = [...draft.projects];
                                updated[idx] = { ...updated[idx], number: e.target.value };
                                setDraft(prev => ({ ...prev, projects: updated }));
                              }}
                            />
                          </div>
                          <div className="adm-field-group">
                            <label className="adm-label">Eyebrow</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={project.eyebrow || ''}
                              onChange={(e) => {
                                const updated = [...draft.projects];
                                updated[idx] = { ...updated[idx], eyebrow: e.target.value };
                                setDraft(prev => ({ ...prev, projects: updated }));
                              }}
                            />
                          </div>
                          <div className="adm-field-group">
                            <label className="adm-label">Accent Color</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={project.accentColor || '#00f0ff'}
                              onChange={(e) => {
                                const updated = [...draft.projects];
                                updated[idx] = { ...updated[idx], accentColor: e.target.value };
                                setDraft(prev => ({ ...prev, projects: updated }));
                              }}
                            />
                          </div>
                        </div>

                        <div className="adm-grid-2">
                          <div className="adm-field-group">
                            <label className="adm-label">Project Title</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={project.title || ''}
                              onChange={(e) => {
                                const updated = [...draft.projects];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setDraft(prev => ({ ...prev, projects: updated }));
                              }}
                            />
                          </div>
                          <div className="adm-field-group">
                            <label className="adm-label">Metric Highlight</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={project.metricHighlight || ''}
                              onChange={(e) => {
                                const updated = [...draft.projects];
                                updated[idx] = { ...updated[idx], metricHighlight: e.target.value };
                                setDraft(prev => ({ ...prev, projects: updated }));
                              }}
                            />
                          </div>
                        </div>

                        <div className="adm-field-group">
                          <label className="adm-label">Description</label>
                          <textarea
                            rows={3}
                            className="adm-textarea"
                            value={project.description || ''}
                            onChange={(e) => {
                              const updated = [...draft.projects];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setDraft(prev => ({ ...prev, projects: updated }));
                            }}
                          />
                        </div>

                        <div className="adm-grid-2">
                          <div className="adm-field-group">
                            <label className="adm-label">Image Path / URL</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={project.image || ''}
                              onChange={(e) => {
                                const updated = [...draft.projects];
                                updated[idx] = { ...updated[idx], image: e.target.value };
                                setDraft(prev => ({ ...prev, projects: updated }));
                              }}
                            />
                          </div>
                          <div className="adm-field-group">
                            <label className="adm-label">Project GitHub / Live Link</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={project.link || ''}
                              onChange={(e) => {
                                const updated = [...draft.projects];
                                updated[idx] = { ...updated[idx], link: e.target.value };
                                setDraft(prev => ({ ...prev, projects: updated }));
                              }}
                            />
                          </div>
                        </div>

                        <div className="adm-field-group">
                          <label className="adm-label">Technologies (Comma Separated)</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={(project.technologies || []).join(', ')}
                            onChange={(e) => {
                              const updated = [...draft.projects];
                              updated[idx] = {
                                ...updated[idx],
                                technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                              };
                              setDraft(prev => ({ ...prev, projects: updated }));
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. AUTOMATION TAB */}
                {activeTab === 'automation' && (
                  <div className="adm-tab-panel">
                    <div className="adm-panel-header">
                      <h3>Automation Projects (Scroll Split Cards)</h3>
                      <p>Modify autonomous engineering pipelines and self-healing system cards.</p>
                    </div>

                    <div className="adm-card-box">
                      <div className="adm-grid-2">
                        <div className="adm-field-group">
                          <label className="adm-label">Section Tag</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={draft.automation?.sectionTag || ''}
                            onChange={(e) => setDraft(prev => ({
                              ...prev,
                              automation: { ...prev.automation, sectionTag: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="adm-field-group">
                          <label className="adm-label">Section Heading</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={draft.automation?.heading || ''}
                            onChange={(e) => setDraft(prev => ({
                              ...prev,
                              automation: { ...prev.automation, heading: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                      <div className="adm-field-group">
                        <label className="adm-label">Subtitle</label>
                        <input
                          type="text"
                          className="adm-input"
                          value={draft.automation?.subtitle || ''}
                          onChange={(e) => setDraft(prev => ({
                            ...prev,
                            automation: { ...prev.automation, subtitle: e.target.value }
                          }))}
                        />
                      </div>
                    </div>

                    {(draft.automation?.items || []).map((item, idx) => (
                      <div key={item.id || idx} className="adm-card-box">
                        <div className="adm-item-box-header">
                          <span className="adm-badge">Automation 0{idx + 1} · {item.title}</span>
                        </div>
                        <div className="adm-grid-2">
                          <div className="adm-field-group">
                            <label className="adm-label">Title</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={item.title || ''}
                              onChange={(e) => {
                                const updated = [...draft.automation.items];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setDraft(prev => ({ ...prev, automation: { ...prev.automation, items: updated } }));
                              }}
                            />
                          </div>
                          <div className="adm-field-group">
                            <label className="adm-label">Subtitle</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={item.subtitle || ''}
                              onChange={(e) => {
                                const updated = [...draft.automation.items];
                                updated[idx] = { ...updated[idx], subtitle: e.target.value };
                                setDraft(prev => ({ ...prev, automation: { ...prev.automation, items: updated } }));
                              }}
                            />
                          </div>
                        </div>

                        <div className="adm-field-group">
                          <label className="adm-label">Description</label>
                          <textarea
                            rows={3}
                            className="adm-textarea"
                            value={item.description || ''}
                            onChange={(e) => {
                              const updated = [...draft.automation.items];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setDraft(prev => ({ ...prev, automation: { ...prev.automation, items: updated } }));
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 6. TOOLKIT TAB */}
                {activeTab === 'toolkit' && (
                  <div className="adm-tab-panel">
                    <div className="adm-panel-header">
                      <h3>Engineering Toolkit (Tumble Wall &amp; Carousel)</h3>
                      <p>Add, edit, or remove any of the 29 physics tokens tumbling across the stage floor.</p>
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary"
                        style={{ marginTop: '10px' }}
                        onClick={() => {
                          const newTool = {
                            name: "New Tool",
                            category: "Languages",
                            logo: "/images/tools/python.svg",
                            accent: "#00f0ff",
                            desc: "Production ML framework"
                          };
                          setDraft(prev => ({
                            ...prev,
                            toolkit: [...(prev.toolkit || []), newTool]
                          }));
                        }}
                      >
                        <Plus size={14} /> Add Tool Token
                      </button>
                    </div>

                    <div className="adm-tools-grid">
                      {(draft.toolkit || []).map((tool, idx) => (
                        <div key={idx} className="adm-tool-card">
                          <div className="adm-tool-card-header">
                            <div className="adm-tool-badge" style={{ borderColor: tool.accent || '#38bdf8' }}>
                              <img src={tool.logo} alt="" className="adm-tool-logo" onError={(e) => e.target.style.display = 'none'} />
                              <span>{tool.name}</span>
                            </div>
                            <button
                              type="button"
                              className="adm-btn-icon-del"
                              onClick={() => {
                                const updated = draft.toolkit.filter((_, i) => i !== idx);
                                setDraft(prev => ({ ...prev, toolkit: updated }));
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="adm-field-group">
                            <label className="adm-label">Tool Name</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={tool.name || ''}
                              onChange={(e) => {
                                const updated = [...draft.toolkit];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                setDraft(prev => ({ ...prev, toolkit: updated }));
                              }}
                            />
                          </div>

                          <div className="adm-grid-2">
                            <div className="adm-field-group">
                              <label className="adm-label">Category</label>
                              <select
                                className="adm-input"
                                value={tool.category || 'Languages'}
                                onChange={(e) => {
                                  const updated = [...draft.toolkit];
                                  updated[idx] = { ...updated[idx], category: e.target.value };
                                  setDraft(prev => ({ ...prev, toolkit: updated }));
                                }}
                              >
                                <option value="Languages">Languages</option>
                                <option value="LLM & NLP">LLM & NLP</option>
                                <option value="RAG & Vectors">RAG & Vectors</option>
                                <option value="MLOps & DevOps">MLOps & DevOps</option>
                                <option value="Optimization">Optimization</option>
                                <option value="Cloud & Infra">Cloud & Infra</option>
                                <option value="Data Engineering">Data Engineering</option>
                              </select>
                            </div>
                            <div className="adm-field-group">
                              <label className="adm-label">Accent Hex</label>
                              <input
                                type="text"
                                className="adm-input"
                                value={tool.accent || '#38bdf8'}
                                onChange={(e) => {
                                  const updated = [...draft.toolkit];
                                  updated[idx] = { ...updated[idx], accent: e.target.value };
                                  setDraft(prev => ({ ...prev, toolkit: updated }));
                                }}
                              />
                            </div>
                          </div>

                          <div className="adm-field-group">
                            <label className="adm-label">SVG Logo Path</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={tool.logo || ''}
                              onChange={(e) => {
                                const updated = [...draft.toolkit];
                                updated[idx] = { ...updated[idx], logo: e.target.value };
                                setDraft(prev => ({ ...prev, toolkit: updated }));
                              }}
                            />
                          </div>

                          <div className="adm-field-group">
                            <label className="adm-label">Description / Spec</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={tool.desc || ''}
                              onChange={(e) => {
                                const updated = [...draft.toolkit];
                                updated[idx] = { ...updated[idx], desc: e.target.value };
                                setDraft(prev => ({ ...prev, toolkit: updated }));
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. EXPERIENCE & BIO TAB */}
                {activeTab === 'experience' && (
                  <div className="adm-tab-panel">
                    <div className="adm-panel-header">
                      <h3>Experience &amp; About Pranav</h3>
                      <p>Edit internship role, company details, bullet accomplishments, and personal narrative.</p>
                    </div>

                    <div className="adm-card-box">
                      <h4 className="adm-box-title">Professional Experience (Fourise Software Solutions)</h4>
                      <div className="adm-grid-2">
                        <div className="adm-field-group">
                          <label className="adm-label">Company Name</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={draft.experience?.company || ''}
                            onChange={(e) => setDraft(prev => ({
                              ...prev,
                              experience: { ...prev.experience, company: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="adm-field-group">
                          <label className="adm-label">Role Title</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={draft.experience?.role || ''}
                            onChange={(e) => setDraft(prev => ({
                              ...prev,
                              experience: { ...prev.experience, role: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="adm-field-group">
                          <label className="adm-label">Location</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={draft.experience?.location || ''}
                            onChange={(e) => setDraft(prev => ({
                              ...prev,
                              experience: { ...prev.experience, location: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="adm-field-group">
                          <label className="adm-label">Period / Duration</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={draft.experience?.period || ''}
                            onChange={(e) => setDraft(prev => ({
                              ...prev,
                              experience: { ...prev.experience, period: e.target.value }
                            }))}
                          />
                        </div>
                      </div>

                      <div className="adm-field-group">
                        <label className="adm-label">Lead Summary</label>
                        <input
                          type="text"
                          className="adm-input"
                          value={draft.experience?.leadSummary || ''}
                          onChange={(e) => setDraft(prev => ({
                            ...prev,
                            experience: { ...prev.experience, leadSummary: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="adm-field-group">
                        <label className="adm-label">Achievement Bullets</label>
                        {(draft.experience?.bullets || []).map((bullet, idx) => (
                          <div key={idx} className="adm-array-row">
                            <input
                              type="text"
                              className="adm-input"
                              value={bullet}
                              onChange={(e) => {
                                const updated = [...draft.experience.bullets];
                                updated[idx] = e.target.value;
                                setDraft(prev => ({
                                  ...prev,
                                  experience: { ...prev.experience, bullets: updated }
                                }));
                              }}
                            />
                            <button
                              type="button"
                              className="adm-btn-icon-del"
                              onClick={() => {
                                const updated = draft.experience.bullets.filter((_, i) => i !== idx);
                                setDraft(prev => ({
                                  ...prev,
                                  experience: { ...prev.experience, bullets: updated }
                                }));
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="adm-card-box">
                      <h4 className="adm-box-title">About Narrative</h4>
                      <div className="adm-field-group">
                        <label className="adm-label">Headline</label>
                        <textarea
                          rows={2}
                          className="adm-textarea"
                          value={draft.about?.headline || ''}
                          onChange={(e) => setDraft(prev => ({
                            ...prev,
                            about: { ...prev.about, headline: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="adm-field-group">
                        <label className="adm-label">Extended Story Description</label>
                        <textarea
                          rows={3}
                          className="adm-textarea"
                          value={draft.about?.description || ''}
                          onChange={(e) => setDraft(prev => ({
                            ...prev,
                            about: { ...prev.about, description: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. EDUCATION TAB */}
                {activeTab === 'education' && (
                  <div className="adm-tab-panel">
                    <div className="adm-panel-header">
                      <h3>Education Background</h3>
                      <p>Manage degree titles, universities, study periods, and badges.</p>
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary"
                        style={{ marginTop: '10px' }}
                        onClick={() => {
                          setDraft(prev => ({
                            ...prev,
                            education: [
                              ...(prev.education || []),
                              {
                                degreeType: "Degree Type",
                                degree: "Degree Title",
                                institution: "University Name",
                                field: "Field of Study",
                                period: "2024 – 2026",
                                accentColor: "#38bdf8"
                              }
                            ]
                          }));
                        }}
                      >
                        <Plus size={14} /> Add Degree Card
                      </button>
                    </div>

                    {(draft.education || []).map((edu, idx) => (
                      <div key={idx} className="adm-card-box">
                        <div className="adm-item-box-header">
                          <span className="adm-badge">{edu.degreeType}</span>
                          <button
                            type="button"
                            className="adm-btn-icon-del"
                            onClick={() => {
                              const updated = draft.education.filter((_, i) => i !== idx);
                              setDraft(prev => ({ ...prev, education: updated }));
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="adm-grid-2">
                          <div className="adm-field-group">
                            <label className="adm-label">Degree Type (e.g. Postgraduate)</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={edu.degreeType || ''}
                              onChange={(e) => {
                                const updated = [...draft.education];
                                updated[idx] = { ...updated[idx], degreeType: e.target.value };
                                setDraft(prev => ({ ...prev, education: updated }));
                              }}
                            />
                          </div>
                          <div className="adm-field-group">
                            <label className="adm-label">Accent Color</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={edu.accentColor || '#38bdf8'}
                              onChange={(e) => {
                                const updated = [...draft.education];
                                updated[idx] = { ...updated[idx], accentColor: e.target.value };
                                setDraft(prev => ({ ...prev, education: updated }));
                              }}
                            />
                          </div>
                        </div>

                        <div className="adm-field-group">
                          <label className="adm-label">Degree Full Name</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={edu.degree || ''}
                            onChange={(e) => {
                              const updated = [...draft.education];
                              updated[idx] = { ...updated[idx], degree: e.target.value };
                              setDraft(prev => ({ ...prev, education: updated }));
                            }}
                          />
                        </div>

                        <div className="adm-grid-2">
                          <div className="adm-field-group">
                            <label className="adm-label">Institution / Campus</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={edu.institution || ''}
                              onChange={(e) => {
                                const updated = [...draft.education];
                                updated[idx] = { ...updated[idx], institution: e.target.value };
                                setDraft(prev => ({ ...prev, education: updated }));
                              }}
                            />
                          </div>
                          <div className="adm-field-group">
                            <label className="adm-label">Field &amp; Period</label>
                            <input
                              type="text"
                              className="adm-input"
                              value={edu.period || ''}
                              onChange={(e) => {
                                const updated = [...draft.education];
                                updated[idx] = { ...updated[idx], period: e.target.value };
                                setDraft(prev => ({ ...prev, education: updated }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 9. FAQ & ORBIT STACK TAB */}
                {activeTab === 'faq' && (
                  <div className="adm-tab-panel">
                    <div className="adm-panel-header">
                      <h3>FAQ (Orbit Card Stack)</h3>
                      <p>Manage questions and answers displayed in the fanning card stack.</p>
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary"
                        style={{ marginTop: '10px' }}
                        onClick={() => {
                          setDraft(prev => ({
                            ...prev,
                            faq: [
                              ...(prev.faq || []),
                              {
                                question: "New Question?",
                                shortAnswer: "Direct short answer to the question."
                              }
                            ]
                          }));
                        }}
                      >
                        <Plus size={14} /> Add FAQ Card
                      </button>
                    </div>

                    {(draft.faq || []).map((faqItem, idx) => (
                      <div key={idx} className="adm-card-box">
                        <div className="adm-item-box-header">
                          <span className="adm-badge">Question 0{idx + 1}</span>
                          <button
                            type="button"
                            className="adm-btn-icon-del"
                            onClick={() => {
                              const updated = draft.faq.filter((_, i) => i !== idx);
                              setDraft(prev => ({ ...prev, faq: updated }));
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="adm-field-group">
                          <label className="adm-label">Question</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={faqItem.question || ''}
                            onChange={(e) => {
                              const updated = [...draft.faq];
                              updated[idx] = { ...updated[idx], question: e.target.value };
                              setDraft(prev => ({ ...prev, faq: updated }));
                            }}
                          />
                        </div>

                        <div className="adm-field-group">
                          <label className="adm-label">Short Answer</label>
                          <textarea
                            rows={2}
                            className="adm-textarea"
                            value={faqItem.shortAnswer || ''}
                            onChange={(e) => {
                              const updated = [...draft.faq];
                              updated[idx] = { ...updated[idx], shortAnswer: e.target.value };
                              setDraft(prev => ({ ...prev, faq: updated }));
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
