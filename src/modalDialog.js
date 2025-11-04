// src/modalDialog.js
// Simple modal dialog system to replace prompt(), alert(), confirm()

console.log("💬 modalDialog.js loaded");

/**
 * Show a custom prompt dialog
 */
export function showPrompt(message, defaultValue = '') {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: #1a1a1a;
      border: 2px solid #00ffff;
      border-radius: 8px;
      padding: 24px;
      min-width: 400px;
      max-width: 600px;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    `;

    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
      color: white;
      font-size: 14px;
      margin-bottom: 16px;
      font-family: 'Courier New', monospace;
    `;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = defaultValue;
    input.style.cssText = `
      width: 100%;
      padding: 8px;
      font-size: 14px;
      background: #000;
      color: #00ffff;
      border: 1px solid #00ffff;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      margin-bottom: 16px;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.cssText = `
      padding: 8px 16px;
      background: #00ffff;
      color: #000;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      font-size: 12px;
    `;

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
      padding: 8px 16px;
      background: #333;
      color: white;
      border: 1px solid #666;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;

    const cleanup = () => {
      document.body.removeChild(overlay);
    };

    okButton.onclick = () => {
      const value = input.value.trim();
      cleanup();
      resolve(value || null);
    };

    cancelButton.onclick = () => {
      cleanup();
      resolve(null);
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        okButton.click();
      } else if (e.key === 'Escape') {
        cancelButton.click();
      }
    };

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(okButton);

    dialog.appendChild(messageEl);
    dialog.appendChild(input);
    dialog.appendChild(buttonContainer);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Auto-focus input
    setTimeout(() => input.focus(), 100);
  });
}

/**
 * Show a custom alert dialog
 */
export function showAlert(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: #1a1a1a;
      border: 2px solid #00ffff;
      border-radius: 8px;
      padding: 24px;
      min-width: 400px;
      max-width: 600px;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    `;

    const messageEl = document.createElement('div');
    messageEl.innerHTML = message.replace(/\n/g, '<br>');
    messageEl.style.cssText = `
      color: white;
      font-size: 14px;
      margin-bottom: 16px;
      font-family: 'Courier New', monospace;
      white-space: pre-wrap;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: flex-end;
    `;

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.cssText = `
      padding: 8px 16px;
      background: #00ffff;
      color: #000;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      font-size: 12px;
    `;

    const cleanup = () => {
      document.body.removeChild(overlay);
    };

    okButton.onclick = () => {
      cleanup();
      resolve();
    };

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        okButton.click();
      }
    };

    buttonContainer.appendChild(okButton);
    dialog.appendChild(messageEl);
    dialog.appendChild(buttonContainer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Auto-focus button
    setTimeout(() => okButton.focus(), 100);
  });
}

/**
 * Show a custom confirm dialog
 */
export function showConfirm(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: #1a1a1a;
      border: 2px solid #ffaa00;
      border-radius: 8px;
      padding: 24px;
      min-width: 400px;
      max-width: 600px;
      box-shadow: 0 0 20px rgba(255, 170, 0, 0.5);
    `;

    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
      color: white;
      font-size: 14px;
      margin-bottom: 16px;
      font-family: 'Courier New', monospace;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;

    const yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.style.cssText = `
      padding: 8px 16px;
      background: #00ff00;
      color: #000;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      font-size: 12px;
    `;

    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.style.cssText = `
      padding: 8px 16px;
      background: #ff3333;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      font-size: 12px;
    `;

    const cleanup = () => {
      document.body.removeChild(overlay);
    };

    yesButton.onclick = () => {
      cleanup();
      resolve(true);
    };

    noButton.onclick = () => {
      cleanup();
      resolve(false);
    };

    buttonContainer.appendChild(noButton);
    buttonContainer.appendChild(yesButton);

    dialog.appendChild(messageEl);
    dialog.appendChild(buttonContainer);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Auto-focus yes button
    setTimeout(() => yesButton.focus(), 100);
  });
}

console.log("💬 Modal dialog system ready");
