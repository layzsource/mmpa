console.log("🌍 hudCommunity.js loaded");

/**
 * MMPA Community Browser - Phase 5.2
 *
 * UI for discovering and experiencing shared anchors from the ecosystem.
 * This is where individual memory becomes collective culture.
 */

import { fetchSharedAnchors, voteOnAnchor, checkServerStatus, getUserId } from './communityAPI.js';
import { loadAnchor } from './anchorSystem.js';
import { importAnchor } from './anchorSystem.js';

/**
 * Create Community HUD section
 */
export function createCommunityHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section mmpa-community';
  section.style.borderLeft = '3px solid #00ff88'; // Green accent for community

  // Title
  const title = document.createElement('h3');
  title.textContent = '🌍 Community (Ecosystem)';
  title.style.color = '#00ff88';
  section.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Discover shared moments of resonance';
  subtitle.style.fontSize = '12px';
  subtitle.style.color = '#888';
  subtitle.style.marginBottom = '12px';
  section.appendChild(subtitle);

  // Server status indicator
  const statusDiv = document.createElement('div');
  statusDiv.style.padding = '8px';
  statusDiv.style.marginBottom = '12px';
  statusDiv.style.borderRadius = '5px';
  statusDiv.style.fontSize = '12px';
  statusDiv.id = 'community-status';
  section.appendChild(statusDiv);

  // Sort controls
  const sortContainer = document.createElement('div');
  sortContainer.style.marginBottom = '12px';

  const sortLabel = document.createElement('label');
  sortLabel.textContent = 'Sort by:';
  sortLabel.style.display = 'block';
  sortLabel.style.marginBottom = '5px';
  sortLabel.style.color = '#aaa';
  sortLabel.style.fontSize = '12px';
  sortContainer.appendChild(sortLabel);

  const sortSelect = document.createElement('select');
  sortSelect.style.width = '100%';
  sortSelect.style.padding = '5px';
  sortSelect.style.backgroundColor = '#222';
  sortSelect.style.color = '#fff';
  sortSelect.style.border = '1px solid #555';
  sortSelect.style.borderRadius = '3px';

  ['recent', 'resonance', 'votes'].forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value.charAt(0).toUpperCase() + value.slice(1);
    sortSelect.appendChild(option);
  });

  sortSelect.addEventListener('change', () => {
    loadCommunityAnchors(statusDiv, anchorList, sortSelect.value);
  });

  sortContainer.appendChild(sortSelect);
  section.appendChild(sortContainer);

  // Refresh button
  const refreshButton = document.createElement('button');
  refreshButton.textContent = '🔄 Refresh';
  refreshButton.style.width = '100%';
  refreshButton.style.padding = '10px';
  refreshButton.style.marginBottom = '16px';
  refreshButton.style.backgroundColor = '#00ff88';
  refreshButton.style.color = '#000';
  refreshButton.style.border = 'none';
  refreshButton.style.borderRadius = '5px';
  refreshButton.style.cursor = 'pointer';
  refreshButton.style.fontWeight = 'bold';

  refreshButton.addEventListener('click', () => {
    loadCommunityAnchors(statusDiv, anchorList, sortSelect.value);
  });

  section.appendChild(refreshButton);

  // Divider
  const divider = document.createElement('hr');
  divider.style.border = 'none';
  divider.style.borderTop = '1px solid #333';
  divider.style.margin = '16px 0';
  section.appendChild(divider);

  // Community anchor list
  const listTitle = document.createElement('h4');
  listTitle.textContent = 'Shared Anchors';
  listTitle.style.color = '#aaa';
  listTitle.style.marginBottom = '8px';
  section.appendChild(listTitle);

  const anchorList = document.createElement('div');
  anchorList.className = 'community-anchor-list';
  section.appendChild(anchorList);

  // Initial load
  loadCommunityAnchors(statusDiv, anchorList, 'recent');

  container.appendChild(section);
  return section;
}

/**
 * Load community anchors from server
 */
async function loadCommunityAnchors(statusDiv, listContainer, sortBy = 'recent') {
  // Check server status
  statusDiv.textContent = '⏳ Checking server...';
  statusDiv.style.backgroundColor = '#333';
  statusDiv.style.color = '#fff';

  const serverOnline = await checkServerStatus();

  if (!serverOnline) {
    statusDiv.textContent = '❌ Ecosystem server offline';
    statusDiv.style.backgroundColor = '#441111';
    statusDiv.style.color = '#ff8888';

    listContainer.innerHTML = '';
    const msg = document.createElement('p');
    msg.innerHTML = 'Server offline.<br><br>To start:<br>1. Open terminal<br>2. cd ecosystem-server<br>3. npm start';
    msg.style.color = '#666';
    msg.style.textAlign = 'center';
    msg.style.padding = '20px';
    msg.style.fontSize = '12px';
    listContainer.appendChild(msg);
    return;
  }

  statusDiv.textContent = '✅ Connected to ecosystem';
  statusDiv.style.backgroundColor = '#113311';
  statusDiv.style.color = '#88ff88';

  // Fetch anchors
  try {
    listContainer.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">Loading...</p>';

    const result = await fetchSharedAnchors({ limit: 20, sortBy });

    listContainer.innerHTML = '';

    if (result.anchors.length === 0) {
      const msg = document.createElement('p');
      msg.textContent = 'No shared anchors yet.\n\nBe the first to share a moment of resonance!';
      msg.style.color = '#666';
      msg.style.textAlign = 'center';
      msg.style.padding = '20px';
      msg.style.fontSize = '12px';
      listContainer.appendChild(msg);
      return;
    }

    // Render anchors
    result.anchors.forEach(sharedAnchor => {
      const item = createCommunityAnchorItem(sharedAnchor);
      listContainer.appendChild(item);
    });

  } catch (error) {
    statusDiv.textContent = '⚠️ Failed to load';
    statusDiv.style.backgroundColor = '#443311';
    statusDiv.style.color = '#ffaa88';

    listContainer.innerHTML = '';
    const msg = document.createElement('p');
    msg.textContent = `Error: ${error.message}`;
    msg.style.color = '#ff8888';
    msg.style.textAlign = 'center';
    msg.style.padding = '20px';
    msg.style.fontSize = '12px';
    listContainer.appendChild(msg);
  }
}

/**
 * Create community anchor list item
 */
function createCommunityAnchorItem(sharedAnchor) {
  const item = document.createElement('div');
  item.className = 'community-anchor-item';
  item.style.backgroundColor = '#1a1a1a';
  item.style.padding = '12px';
  item.style.marginBottom = '8px';
  item.style.borderRadius = '5px';
  item.style.border = '1px solid #00ff8844';

  // Name
  const name = document.createElement('div');
  name.textContent = sharedAnchor.name;
  name.style.fontWeight = 'bold';
  name.style.color = '#00ff88';
  name.style.marginBottom = '4px';
  item.appendChild(name);

  // Creator & timestamp
  const meta = document.createElement('div');
  meta.textContent = `by ${sharedAnchor.creator.substring(0, 12)}... • ${new Date(sharedAnchor.timestamp).toLocaleDateString()}`;
  meta.style.fontSize = '10px';
  meta.style.color = '#666';
  meta.style.marginBottom = '8px';
  item.appendChild(meta);

  // Description
  if (sharedAnchor.description) {
    const desc = document.createElement('div');
    desc.textContent = sharedAnchor.description;
    desc.style.fontSize = '12px';
    desc.style.color = '#aaa';
    desc.style.marginBottom = '8px';
    item.appendChild(desc);
  }

  // Tags
  if (sharedAnchor.tags && sharedAnchor.tags.length > 0) {
    const tagsContainer = document.createElement('div');
    tagsContainer.style.marginBottom = '8px';

    sharedAnchor.tags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.textContent = tag;
      tagSpan.style.display = 'inline-block';
      tagSpan.style.backgroundColor = '#003322';
      tagSpan.style.color = '#00ff88';
      tagSpan.style.padding = '2px 8px';
      tagSpan.style.marginRight = '4px';
      tagSpan.style.borderRadius = '3px';
      tagSpan.style.fontSize = '10px';
      tagsContainer.appendChild(tagSpan);
    });

    item.appendChild(tagsContainer);
  }

  // Stats
  const stats = document.createElement('div');
  stats.innerHTML = `⭐ ${sharedAnchor.resonanceScore.toFixed(1)} resonance • 👥 ${sharedAnchor.votes} votes`;
  stats.style.fontSize = '11px';
  stats.style.color = '#00ff88';
  stats.style.marginBottom = '8px';
  item.appendChild(stats);

  // Action buttons
  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '4px';

  // Load button
  const loadBtn = createCommunityActionButton('Load', '#00aa00', () => {
    // Import the anchor into local system
    importAnchor(JSON.stringify(sharedAnchor.anchor));
    // Then load it
    loadAnchor(sharedAnchor.anchor.id);
    alert(`✨ Loaded "${sharedAnchor.name}" from community!`);
  });

  // Vote buttons (1-5 stars)
  const voteContainer = document.createElement('div');
  voteContainer.style.flex = '1';
  voteContainer.style.display = 'flex';
  voteContainer.style.gap = '2px';
  voteContainer.style.justifyContent = 'center';
  voteContainer.style.alignItems = 'center';

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('button');
    star.textContent = '⭐';
    star.style.padding = '4px 6px';
    star.style.backgroundColor = '#222';
    star.style.color = '#ffaa00';
    star.style.border = '1px solid #555';
    star.style.borderRadius = '3px';
    star.style.cursor = 'pointer';
    star.style.fontSize = '10px';
    star.title = `Vote ${i} resonance`;

    star.addEventListener('click', async () => {
      try {
        const result = await voteOnAnchor(sharedAnchor.id, i);
        alert(`✅ Voted ${i} resonance!\n\nNew score: ${result.resonanceScore.toFixed(1)}`);

        // Update stats display
        stats.innerHTML = `⭐ ${result.resonanceScore.toFixed(1)} resonance • 👥 ${result.votes} votes`;
      } catch (error) {
        alert(`Failed to vote: ${error.message}`);
      }
    });

    voteContainer.appendChild(star);
  }

  actions.appendChild(loadBtn);
  actions.appendChild(voteContainer);
  item.appendChild(actions);

  return item;
}

/**
 * Create action button for community anchors
 */
function createCommunityActionButton(label, color, onClick) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.style.padding = '6px 12px';
  btn.style.backgroundColor = color;
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '3px';
  btn.style.cursor = 'pointer';
  btn.style.fontSize = '11px';
  btn.style.fontWeight = 'bold';
  btn.addEventListener('click', onClick);
  return btn;
}

console.log("🌍 hudCommunity.js ready");
