import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_PORTFOLIO_CONTENT } from './defaultPortfolioContent';

const PortfolioContext = createContext(null);

const STORAGE_KEY = 'pranav_portfolio_content_v4';
const AUTH_KEY = 'pranav_portfolio_admin_auth';

export function PortfolioProvider({ children }) {
  // Initialize content from localStorage or fallback to defaults
  const [content, setContent] = useState(() => {
    try {
      // Clear legacy storage keys if present
      localStorage.removeItem('pranav_portfolio_content');
      localStorage.removeItem('pranav_portfolio_content_v2');
      localStorage.removeItem('pranav_portfolio_content_v3');

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...DEFAULT_PORTFOLIO_CONTENT, ...parsed };
        if (!parsed.automation?.items || parsed.automation.items.length < 5) {
          merged.automation = DEFAULT_PORTFOLIO_CONTENT.automation;
        }
        if (!parsed.faq || parsed.faq.length < 10) {
          merged.faq = DEFAULT_PORTFOLIO_CONTENT.faq;
        }
        return merged;
      }
    } catch (e) {
      console.warn('Failed to parse portfolio content from localStorage:', e);
    }
    return DEFAULT_PORTFOLIO_CONTENT;
  });

  // Admin auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Admin modal open/close
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Active theme (derived from content or overridden)
  const theme = content.theme || 'dark';

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    } else {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  // Sync with backend on initial load if available
  useEffect(() => {
    let isMounted = true;
    async function loadBackendContent() {
      try {
        const res = await fetch('/api/portfolio/content');
        if (res.ok) {
          const data = await res.json();
          if (data && data.content && isMounted) {
            setContent(prev => ({
              ...DEFAULT_PORTFOLIO_CONTENT,
              ...prev,
              ...data.content
            }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prev, ...data.content }));
          }
        }
      } catch {
        // Backend offline or running in standalone mode, fallback to localStorage is seamless
      }
    }
    loadBackendContent();
    return () => { isMounted = false; };
  }, []);

  // Global keyboard shortcut to navigate to Admin Page: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/';
        } else {
          window.location.href = '/admin';
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Login handler
  const login = useCallback(async (id, password) => {
    const cleanId = (id || '').trim();
    const cleanPass = (password || '').trim();

    // Client-side instant check as fallback / fast-path
    if (cleanId === 'pranavj93' && cleanPass === 'pranav03') {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch {}

      // Also notify backend if reachable
      try {
        await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: cleanId, password: cleanPass })
        });
      } catch {}

      return { success: true };
    }

    return { success: false, error: 'Invalid ID or Password. Please try again.' };
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
  }, []);

  // Save full content
  const saveContent = useCallback(async (newContent) => {
    setContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    // Attempt backend save
    try {
      await fetch('/api/portfolio/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
      });
    } catch {}
  }, []);

  // Update specific section
  const updateSection = useCallback((sectionKey, sectionData) => {
    setContent(prev => {
      const updated = {
        ...prev,
        [sectionKey]: sectionData
      };
      saveContent(updated);
      return updated;
    });
  }, [saveContent]);

  // Set theme directly (Dark or Light)
  const setTheme = useCallback((newTheme) => {
    setContent(prev => {
      const updated = { ...prev, theme: newTheme };
      saveContent(updated);
      return updated;
    });
  }, [saveContent]);

  // Reset to factory defaults
  const resetToDefaults = useCallback(async () => {
    setContent(DEFAULT_PORTFOLIO_CONTENT);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    try {
      await fetch('/api/portfolio/reset', { method: 'POST' });
    } catch {}
  }, []);

  // Export JSON file
  const exportJSON = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pranav-portfolio-config-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [content]);

  // Import JSON file
  const importJSON = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      const merged = { ...DEFAULT_PORTFOLIO_CONTENT, ...parsed };
      saveContent(merged);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [saveContent]);

  // Upload image to backend
  const uploadImage = useCallback(async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target.result;
          const res = await fetch('/api/admin/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name, base64Data })
          });
          const json = await res.json();
          if (json.success) {
            resolve({ success: true, url: json.url, fileName: json.fileName });
          } else {
            resolve({ success: false, error: json.error || 'Upload failed' });
          }
        } catch (err) {
          resolve({ success: false, error: err.message });
        }
      };
      reader.onerror = () => resolve({ success: false, error: 'Could not read file' });
      reader.readAsDataURL(file);
    });
  }, []);

  const value = {
    content,
    theme,
    setTheme,
    updateSection,
    saveContent,
    resetToDefaults,
    exportJSON,
    importJSON,
    uploadImage,
    isAdminOpen,
    setIsAdminOpen,
    isAdminLoggedIn,
    login,
    logout
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return ctx;
}

