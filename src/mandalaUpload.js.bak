// Phase 11.7.50: Mandala Upload Module
// Safe, modular PNG upload UI that mounts next to emoji selector

console.log("🖼️ mandalaUpload.js loaded");

/**
 * Mount upload controls after a given element
 * @param {HTMLElement} targetElement - Element to insert controls after
 */
export function mountMandalaUploadAfter(targetElement) {
  // Prevent duplicate mounting
  if (window.__mandalaUploadMounted) {
    console.warn("🖼️ Mandala upload already mounted, skipping");
    return;
  }

  // Create global hidden file input (once)
  if (!window.__mandalaUploadInput) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png,image/jpg,image/jpeg,image/webp";
    fileInput.style.display = "none";
    fileInput.id = "__mandalaUploadInput";

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const url = evt.target.result;

          // Dispatch custom event
          window.dispatchEvent(new CustomEvent('mandala:imageSelected', {
            detail: { url, name: file.name }
          }));

          console.log(`🖼️ Mandala image selected: ${file.name}`);
        };
        reader.readAsDataURL(file);
      } else {
        console.warn("🖼️ Invalid file type");
      }
    });

    document.body.appendChild(fileInput);
    window.__mandalaUploadInput = fileInput;
  }

  // Create upload UI container
  const uploadContainer = document.createElement("div");
  uploadContainer.style.cssText = 'display: flex; gap: 6px; margin-top: 8px; margin-bottom: 8px;';
  uploadContainer.id = "__mandalaUploadContainer";

  // Upload button
  const uploadBtn = document.createElement("button");
  uploadBtn.textContent = "📁 Upload PNG";
  uploadBtn.style.cssText = 'flex: 1; padding: 6px 10px; background: rgba(0,255,255,0.15); border: 1px solid #00ffff; color: #00ffff; cursor: pointer; border-radius: 4px; font-size: 11px;';
  uploadBtn.addEventListener("click", () => {
    window.__mandalaUploadInput.click();
  });

  // Clear button
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "🗑️ Clear";
  clearBtn.style.cssText = 'padding: 6px 10px; background: rgba(255,0,0,0.15); border: 1px solid #ff4444; color: #ff4444; cursor: pointer; border-radius: 4px; font-size: 11px;';
  clearBtn.addEventListener("click", () => {
    // Clear file input
    window.__mandalaUploadInput.value = '';

    // Dispatch clear event
    window.dispatchEvent(new CustomEvent('mandala:imageCleared'));

    // Update status
    if (window.__mandalaUploadStatus) {
      window.__mandalaUploadStatus.textContent = 'Using emoji texture';
      window.__mandalaUploadStatus.style.color = '#888';
    }

    console.log('🖼️ Mandala custom image cleared');
  });

  uploadContainer.appendChild(uploadBtn);
  uploadContainer.appendChild(clearBtn);

  // Status label
  const statusLabel = document.createElement("div");
  statusLabel.textContent = 'Using emoji texture';
  statusLabel.style.cssText = 'font-size: 10px; color: #888; margin-bottom: 8px; font-style: italic;';
  statusLabel.id = "__mandalaUploadStatus";
  window.__mandalaUploadStatus = statusLabel;

  // Listen for image selection to update status
  window.addEventListener('mandala:imageSelected', (e) => {
    const { name } = e.detail;
    statusLabel.textContent = `✓ ${name}`;
    statusLabel.style.color = '#00ff00';
  });

  // Insert after target element
  if (targetElement && targetElement.parentNode) {
    targetElement.parentNode.insertBefore(uploadContainer, targetElement.nextSibling);
    uploadContainer.parentNode.insertBefore(statusLabel, uploadContainer.nextSibling);

    window.__mandalaUploadMounted = true;
    console.log("🖼️ Mandala upload UI mounted");
  } else {
    console.error("🖼️ Cannot mount: target element not found");
  }
}
