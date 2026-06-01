// ShopNav — Shared Barcode Scanner Module
// Powered by html5-qrcode library

let scannerInstance = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadQRScannerScript() {
  return loadScript('https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js');
}

function openBarcodeScanner() {
  // Inject laser style if not present
  if (!document.getElementById('scannerLaserStyle')) {
    const style = document.createElement('style');
    style.id = 'scannerLaserStyle';
    style.innerHTML = `
      @keyframes laserScan {
        0% { top: 0%; opacity: 0.3; }
        50% { top: 100%; opacity: 0.8; }
        100% { top: 0%; opacity: 0.3; }
      }
      .scanner-laser {
        position: absolute;
        left: 0;
        right: 0;
        height: 3px;
        background: #34d399;
        box-shadow: 0 0 8px #34d399, 0 0 16px #34d399;
        animation: laserScan 2.5s linear infinite;
        pointer-events: none;
        z-index: 5;
      }
      .scanner-target-box {
        position: absolute;
        top: 30%;
        bottom: 30%;
        left: 8%;
        right: 8%;
        border: 2px dashed rgba(255, 255, 255, 0.5);
        border-radius: 8px;
        pointer-events: none;
        z-index: 4;
      }
      #barcodeScannerReader video {
        object-fit: cover !important;
        width: 100% !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'barcodeScannerOverlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.backgroundColor = 'rgba(28, 28, 26, 0.7)';
  overlay.style.backdropFilter = 'blur(12px)';
  overlay.style.webkitBackdropFilter = 'blur(12px)';
  overlay.style.zIndex = '99999';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.color = 'var(--cream)';
  overlay.style.fontFamily = "'Inter', sans-serif";
  overlay.style.animation = 'fadeIn 0.25s ease';

  overlay.innerHTML = `
    <div style="background: var(--white); color: var(--ink); border: 1px solid var(--sand); border-radius: var(--radius-lg); padding: 2.2rem 1.8rem; width: 90%; max-width: 420px; box-shadow: var(--shadow-xl); text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; position: relative;">
      
      <!-- Close Button -->
      <button id="closeScannerBtn" style="position: absolute; top: 1rem; right: 1rem; width: 32px; height: 32px; border-radius: 50%; background: var(--warm); color: var(--ink); display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; transition: background var(--transition);" title="Close">✕</button>

      <h3 style="font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--forest); margin: 0;">📲 ${t('qr_scan_title')}</h3>
      <p style="font-size: 0.85rem; color: var(--muted); margin: 0;">${t('qr_scan_desc')}</p>
      
      <!-- Video Container -->
      <div style="width: 100%; max-width: 320px; aspect-ratio: 1; border-radius: var(--radius); overflow: hidden; background: #000; border: 2.5px solid var(--forest); box-shadow: var(--shadow); position: relative;">
        <div id="barcodeScannerReader" style="width: 100%; height: 100%;"></div>
        <div class="scanner-laser"></div>
        <div class="scanner-target-box"></div>
      </div>

      <!-- Status Indicator -->
      <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
        <div id="scannerPulseDot" style="width: 8px; height: 8px; border-radius: 50%; background: var(--success); animation: pulse 1.5s ease infinite;"></div>
        <span id="scannerStatusText" style="font-size: 0.85rem; font-weight: 500; color: var(--muted);">Camera starting...</span>
      </div>
      
      <!-- Simulation Controls -->
      <div style="width: 100%; border-top: 1px solid var(--sand); padding-top: 1rem; margin-top: 0.25rem;">
        <label style="font-size: 0.78rem; font-weight: 600; color: var(--muted); display: block; margin-bottom: 0.4rem;">Testing Tool (Simulate Scan)</label>
        <select id="simulateBarcodeSelect" style="width: 100%; max-width: 280px; font-size: 0.82rem; padding: 0.45rem 0.8rem; border-radius: 100px; border: 1.5px solid var(--sand); background: var(--white); outline: none; cursor: pointer;">
          <option value="">-- Choose barcode to test --</option>
          <option value="4607085790121">🥛 Whole Milk 1L (4607085790121)</option>
          <option value="5449000000996">🥤 Coca-Cola 1.5L (5449000000996)</option>
          <option value="3348901250146">🧴 Dior Sauvage (3348901250146)</option>
          <option value="4007900002161">🪥 Colgate Toothpaste (4007900002161)</option>
          <option value="8712561386159">🧼 Dove Shampoo (8712561386159)</option>
          <option value="4060800125651">🥤 Pepsi 1.5L (4060800125651)</option>
        </select>
      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('closeScannerBtn').onclick = closeBarcodeScanner;
  
  document.getElementById('simulateBarcodeSelect').onchange = function() {
    const val = this.value;
    if (val) {
      handleSuccessfulScan(val);
    }
  };

  loadQRScannerScript()
    .then(() => {
      startCameraScanner();
    })
    .catch(err => {
      console.error("Failed to load html5-qrcode library:", err);
      document.getElementById('scannerStatusText').textContent = 'Failed to load scanner library.';
    });
}

async function startCameraScanner() {
  try {
    scannerInstance = new Html5Qrcode("barcodeScannerReader");
    
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      handleSuccessfulScan(decodedText);
    };
    
    const config = {
      fps: 15,
      qrbox: (width, height) => {
        return { width: Math.round(width * 0.85), height: Math.round(height * 0.4) };
      }
    };
    
    try {
      await scannerInstance.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback
      );
      document.getElementById('scannerStatusText').textContent = 'Scan product barcode';
    } catch (envErr) {
      console.warn("Environmental camera failed, falling back to front camera", envErr);
      await scannerInstance.start(
        { facingMode: "user" },
        config,
        qrCodeSuccessCallback
      );
      document.getElementById('scannerStatusText').textContent = 'Scan product barcode';
    }
  } catch (err) {
    console.error("Failed to start barcode scanner:", err);
    document.getElementById('scannerStatusText').textContent = 'Camera start failed. Check permissions.';
  }
}

function closeBarcodeScanner() {
  stopBarcodeScanner();
  const overlay = document.getElementById('barcodeScannerOverlay');
  if (overlay) overlay.remove();
}

async function stopBarcodeScanner() {
  if (scannerInstance) {
    try {
      await scannerInstance.stop();
    } catch (e) {
      console.error("Error stopping scanner:", e);
    }
    scannerInstance = null;
  }
}

function handleSuccessfulScan(barcode) {
  closeBarcodeScanner();
  
  let matchedProduct = null;
  if (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) {
    matchedProduct = PRODUCTS.find(p => p.barcode === barcode);
  }
  
  // Check if we are on search.html
  const isSearchPage = window.location.pathname.includes('search.html');
  
  if (isSearchPage) {
    if (typeof executeBarcodeSearch === 'function') {
      executeBarcodeSearch(matchedProduct, barcode);
    } else {
      document.getElementById('mainInput').value = matchedProduct ? matchedProduct.name : barcode;
      currentQuery = matchedProduct ? matchedProduct.name : barcode;
      applyFilters();
    }
  } else {
    // Redirect to search.html with barcode parameter
    window.location.href = `search.html?barcode=${encodeURIComponent(barcode)}&source=qr`;
  }
}
