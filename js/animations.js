/**
 * animations.js — Minimal version
 * Kept only toast notifications and empty fallback hooks for compatibility.
 * All GSAP, Lenis, and complex entrance animations removed for maximum performance.
 */

/* ════════════════════════════════════════════════════════════════
   GLOBAL TOAST NOTIFICATION SYSTEM
   ════════════════════════════════════════════════════════════════ */
(function initToastContainer() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createContainer);
  } else {
    createContainer();
  }
  function createContainer() {
    if (document.getElementById('shopnav-toasts')) return;
    const container = document.createElement('div');
    container.id = 'shopnav-toasts';
    document.body.appendChild(container);
  }
})();

/**
 * Show a toast notification (bottom-right).
 * @param {string} message  - HTML or text to display
 * @param {'success'|'error'|'warn'|'info'} type
 * @param {number} duration - Auto-dismiss ms (default 3000)
 */
window.showToast = function(message, type = 'success', duration = 3000) {
  let container = document.getElementById('shopnav-toasts');
  if (!container) {
    container = document.createElement('div');
    container.id = 'shopnav-toasts';
    document.body.appendChild(container);
  }

  // Keep max 3 toasts visible
  while (container.children.length >= 3) {
    container.removeChild(container.firstChild);
  }

  const icons = { success: '✅', error: '❌', warn: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `sn-toast sn-toast-${type}`;
  toast.innerHTML = `<span class="sn-toast-icon">${icons[type] || icons.info}</span><span class="sn-toast-msg">${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
  }, duration);
};

/* Empty fallback hooks to prevent JS errors if called in HTML */
window.animateDynamicElements = () => {};
window.animateCartItems = () => {};
window.animateRemoveElement = (el, cb) => { if (cb) cb(); };

