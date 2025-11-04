// src/portalBuilder/portalMapUI.js
// Portal Map UI - Visual graph navigation for portals
// 2D/3D overview of all destinations and connections

console.log("🗺️ portalMapUI.js loaded");

/**
 * Portal Map UI
 * Displays portal graph with nodes and edges
 */
export class PortalMapUI {
  constructor(portalManager) {
    this.portalManager = portalManager;

    // Canvas for 2D map
    this.canvas = null;
    this.ctx = null;

    // Map state
    this.zoom = 1.0;
    this.pan = { x: 0, y: 0 };
    this.selectedPortalId = null;
    this.hoveredPortalId = null;

    // Mouse state
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };

    console.log("🗺️ PortalMapUI initialized");
  }

  /**
   * Create 2D map canvas
   */
  createMapCanvas(container, width = 600, height = 400) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.cssText = `
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      cursor: grab;
    `;

    this.ctx = this.canvas.getContext('2d');

    // Add mouse events
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('wheel', this.onWheel.bind(this));
    this.canvas.addEventListener('click', this.onClick.bind(this));

    container.appendChild(this.canvas);

    // Start render loop
    this.render();

    console.log('🗺️ Portal map canvas created');
    return this.canvas;
  }

  /**
   * Render portal map
   */
  render() {
    if (!this.ctx) return;

    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get portal graph
    const graph = this.portalManager.getPortalGraph();

    // Calculate transform
    const centerX = width / 2 + this.pan.x;
    const centerY = height / 2 + this.pan.y;

    // Draw edges first
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
    ctx.lineWidth = 2;

    graph.edges.forEach(edge => {
      const sourceNode = graph.nodes.find(n => n.id === edge.source);
      const targetNode = graph.nodes.find(n => n.id === edge.target);

      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(
          centerX + sourceNode.position.x * this.zoom,
          centerY + sourceNode.position.y * this.zoom
        );
        ctx.lineTo(
          centerX + targetNode.position.x * this.zoom,
          centerY + targetNode.position.y * this.zoom
        );
        ctx.stroke();
      }
    });

    // Draw nodes
    graph.nodes.forEach(node => {
      const x = centerX + node.position.x * this.zoom;
      const y = centerY + node.position.y * this.zoom;
      const radius = 20;

      // Node background
      const isActive = this.portalManager.activePortalId === node.id;
      const isSelected = this.selectedPortalId === node.id;
      const isHovered = this.hoveredPortalId === node.id;

      if (isActive) {
        ctx.fillStyle = 'rgba(50, 255, 50, 0.5)';
      } else if (isSelected) {
        ctx.fillStyle = 'rgba(255, 200, 50, 0.5)';
      } else if (isHovered) {
        ctx.fillStyle = 'rgba(100, 200, 255, 0.5)';
      } else {
        ctx.fillStyle = node.visited ? 'rgba(100, 150, 200, 0.3)' : 'rgba(80, 80, 80, 0.3)';
      }

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Node border
      ctx.strokeStyle = node.locked ? 'rgba(255, 100, 100, 0.8)' : 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name, x, y + radius + 12);

      // Type indicator
      ctx.fillStyle = this.getTypeColor(node.type);
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Continue render loop
    requestAnimationFrame(() => this.render());
  }

  /**
   * Get color for portal type
   */
  getTypeColor(type) {
    const colors = {
      'Natural': '#32CD32',
      'Cosmic': '#9370DB',
      'Architectural': '#FFD700',
      'Mythic': '#FF69B4',
      'Abstract': '#00CED1'
    };

    return colors[type] || '#FFFFFF';
  }

  /**
   * Mouse event handlers
   */
  onMouseDown(e) {
    this.isDragging = true;
    this.dragStart = {
      x: e.offsetX - this.pan.x,
      y: e.offsetY - this.pan.y
    };
    this.canvas.style.cursor = 'grabbing';
  }

  onMouseMove(e) {
    if (this.isDragging) {
      this.pan.x = e.offsetX - this.dragStart.x;
      this.pan.y = e.offsetY - this.dragStart.y;
    } else {
      // Check hover
      this.hoveredPortalId = this.getPortalAtPosition(e.offsetX, e.offsetY);
    }
  }

  onMouseUp(e) {
    this.isDragging = false;
    this.canvas.style.cursor = 'grab';
  }

  onWheel(e) {
    e.preventDefault();

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    this.zoom *= delta;
    this.zoom = Math.max(0.1, Math.min(3.0, this.zoom));
  }

  onClick(e) {
    const portalId = this.getPortalAtPosition(e.offsetX, e.offsetY);

    if (portalId) {
      this.selectedPortalId = portalId;

      // Emit selection event
      if (this.onPortalSelected) {
        this.onPortalSelected(portalId);
      }
    }
  }

  /**
   * Get portal at mouse position
   */
  getPortalAtPosition(mouseX, mouseY) {
    const graph = this.portalManager.getPortalGraph();
    const centerX = this.canvas.width / 2 + this.pan.x;
    const centerY = this.canvas.height / 2 + this.pan.y;
    const radius = 20;

    for (const node of graph.nodes) {
      const x = centerX + node.position.x * this.zoom;
      const y = centerY + node.position.y * this.zoom;

      const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);

      if (dist <= radius) {
        return node.id;
      }
    }

    return null;
  }

  /**
   * Center view on portal
   */
  centerOnPortal(portalId) {
    const portal = this.portalManager.getPortal(portalId);
    if (!portal) return;

    this.pan.x = -portal.position.x * this.zoom;
    this.pan.y = -portal.position.y * this.zoom;
  }

  /**
   * Auto-layout portals in a circle
   */
  autoLayoutCircle() {
    const portals = this.portalManager.getAllPortals();
    const radius = 150;

    portals.forEach((portal, index) => {
      const angle = (index / portals.length) * Math.PI * 2;

      this.portalManager.updatePortal(portal.id, {
        position: {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius
        }
      });
    });

    console.log('🗺️ Portals arranged in circle');
  }

  /**
   * Auto-layout portals in a grid
   */
  autoLayoutGrid() {
    const portals = this.portalManager.getAllPortals();
    const cols = Math.ceil(Math.sqrt(portals.length));
    const spacing = 100;

    portals.forEach((portal, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      this.portalManager.updatePortal(portal.id, {
        position: {
          x: (col - cols / 2) * spacing,
          y: (row - cols / 2) * spacing
        }
      });
    });

    console.log('🗺️ Portals arranged in grid');
  }

  /**
   * Reset view
   */
  resetView() {
    this.zoom = 1.0;
    this.pan = { x: 0, y: 0 };
  }
}

console.log("🗺️ Portal Map UI ready");
