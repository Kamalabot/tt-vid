/**
 * NEXUS ENGINE v4.0 - ADVANCED TELEMETRY
 * Powered by GSAP Core, Draggable, MotionPathPlugin, Observer, Flip, and TextPlugin.
 */

import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Observer } from 'gsap/Observer';
import { Flip } from 'gsap/Flip';
import { TextPlugin } from 'gsap/TextPlugin';
import { createIcons, icons } from 'lucide';

gsap.registerPlugin(Draggable, MotionPathPlugin, Observer, Flip, TextPlugin);

const CONFIG = {
    canvasWidth: 1800,
    canvasHeight: 1200,
    colors: {
        human: '#00f2ff',
        synthetic: '#bf00ff',
        ai: '#ff7b00',
        diffusion: 'rgba(249, 115, 22, 0.6)'
    }
};

const UI = {
    zoomContainer: document.getElementById('zoom-container'),
    svgLayer: document.getElementById('svg-connections'),
    terminal: document.getElementById('terminal-output'),
    portalOverlay: document.getElementById('portal-overlay')
};

let state = {
    scale: 1,
    activePortal: null,
    flowsMap: new Map() // Stores drawn paths by ID
};

/**
 * CORE INITIALIZATION
 */
function init() {
    createIcons({ icons });
    
    setupResponsiveness();
    setupBackgroundGridObserver();
    setupInteractions();
    
    // Draw flows and animate them on first load
    requestAnimationFrame(() => {
        updateFlows(true);
        // Start automated tour
        setTimeout(startDemoTour, 2000);
    });
    
    // Sci-fi Entry Animation
    gsap.from(".node-card", {
        opacity: 0,
        scale: 0.8,
        y: 100,
        stagger: 0.1,
        duration: 1.5,
        ease: "power4.out",
        onUpdate: () => updateFlows(false), // Update without re-triggering path drawing
        onComplete: () => {
            logTelemetry("ALL_NODES_ONLINE", true);
            // Trigger initial motion burst across all connected flows
            ['role-tw', 'role-se', 'role-ba'].forEach(id => sendDataPacket(id, true));
            setTimeout(() => {
                sendDataPacket('neural-nexus', true); // Bursts to all Horizon nodes
            }, 800);
        }
    });

    gsap.from("#neural-nexus", {
        scale: 0,
        opacity: 0,
        duration: 2,
        ease: "expo.out",
        onUpdate: () => updateFlows(false)
    });
    
    logTelemetry("SYSTEM_BOOT_SEQUENCE_COMPLETE", true);
}

/**
 * AUTOMATED DEMO TOUR
 */
function startDemoTour() {
    if (state.tourKilled) return;

    // Create fake cursor
    const cursor = document.createElement('div');
    cursor.className = 'demo-cursor';
    cursor.id = 'demo-cursor';
    // Standard arrow icon
    cursor.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="var(--cyan-glow)" stroke="#fff" stroke-width="1.5"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>`;
    document.body.appendChild(cursor);

    // Initial position center
    gsap.set(cursor, { x: window.innerWidth / 2, y: window.innerHeight / 2, opacity: 0 });

    state.demoTl = gsap.timeline({ repeat: -1 });

    // Helper to move cursor to a node and simulate hover
    const getTargetPos = (id) => {
        // Try to target the title (h3) or the icon-box for precision
        const el = document.querySelector(`#${id} h3`) || document.querySelector(`#${id} .icon-box`) || document.getElementById(id);
        if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    };

    const moveToNode = (id, duration, hoverDelay = 1) => {
        return state.demoTl.to(cursor, {
            duration,
            opacity: 1,
            ease: "power2.inOut",
            x: () => getTargetPos(id).x,
            y: () => getTargetPos(id).y,
            onComplete: () => {
                if (state.tourKilled) return;
                const el = document.getElementById(id);
                gsap.to(el, { scale: 1.05, boxShadow: "0 0 30px rgba(0, 242, 255, 0.4)", duration: 0.3 });
                
                // Simulate hover mechanics and fire packet motion
                if (id === 'role-se') {
                    UI.zoomContainer.classList.add('show-circuits');
                    ['tag-cloud', 'tag-sec', 'tag-ml', 'tag-ux'].forEach(tag => sendDataPacket(tag, true));
                } else if (id.startsWith('role-')) {
                    sendDataPacket(id, true);
                }
            }
        })
        .to(cursor, { duration: hoverDelay }) // Wait
        .add(() => { // Unhover
            if (state.tourKilled) return;
            const el = document.getElementById(id);
            gsap.to(el, { scale: 1, boxShadow: "var(--card-shadow)", duration: 0.3 });
            if (id === 'role-se') UI.zoomContainer.classList.remove('show-circuits');
        });
    };

    // ~20-second sweeping loop:
    // Smooth vertical flow down legacy
    moveToNode('role-tw', 1.5, 0.5);
    moveToNode('role-se', 1.5, 2.5); // Hover SE longer to show circuits
    moveToNode('role-ba', 1.5, 0.5);
    
    // Sweep across Nexus and flow down Horizon 2026 side
    moveToNode('role-val', 2.0, 0.5);
    moveToNode('role-ops', 1.0, 0.2);
    moveToNode('role-arch', 1.0, 0.2);
    moveToNode('role-sys', 1.0, 0.2);
    moveToNode('role-strat', 1.0, 0.2);
    moveToNode('role-vstream', 1.0, 1.0);
    
    state.demoTl.to(cursor, { opacity: 0, duration: 1 }); // Fade out before repeat
}

function killDemoTour() {
    if (!state.tourKilled) {
        state.tourKilled = true;
        if (state.demoTl) state.demoTl.kill();
        const cursor = document.getElementById('demo-cursor');
        if (cursor) {
            gsap.to(cursor, { opacity: 0, duration: 0.3, onComplete: () => cursor.remove() });
        }
        logTelemetry("USER_INTERVENTION_DETECTED: Demo aborted.");
        
        // Reset all hover states
        gsap.to('.node-card', { scale: 1, boxShadow: "var(--card-shadow)", duration: 0.3 });
        UI.zoomContainer.classList.remove('show-circuits');
    }
}

/**
 * TELEMETRY LOGGING (TextPlugin)
 */
function logTelemetry(message, highlight = false) {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const line = document.createElement('div');
    line.className = 'log-line';
    UI.terminal.appendChild(line);
    
    const prefix = `> [${time}] `;
    const fullText = highlight ? `<span class="highlight">${prefix}${message}</span>` : `${prefix}${message}`;
    
    // Typewriter effect
    gsap.to(line, {
        duration: Math.min(message.length * 0.05, 1.5),
        text: fullText,
        ease: "none",
        onComplete: () => {
            UI.terminal.scrollTop = UI.terminal.scrollHeight;
        }
    });

    // Keep terminal clean
    if (UI.terminal.children.length > 8) {
        UI.terminal.removeChild(UI.terminal.children[0]);
    }
}

/**
 * MAGNETIC GRID (Observer)
 */
function setupBackgroundGridObserver() {
    Observer.create({
        target: window,
        type: "pointer",
        onMove: (e) => {
            // Kill demo if user interacts significantly
            if (!state.tourKilled && (Math.abs(e.velocityX) > 50 || Math.abs(e.velocityY) > 50)) {
                killDemoTour();
            }

            if (state.activePortal) return;
            // Calculate mouse position relative to center (-1 to 1)
            const x = (e.x / window.innerWidth - 0.5) * 2;
            const y = (e.y / window.innerHeight - 0.5) * 2;
            
            // Subtle 3D parallax on the main container
            gsap.to(UI.zoomContainer, {
                rotationY: x * 2,
                rotationX: -y * 2,
                xPercent: -50 + (x * 1.5), // Pan slightly
                y: y * 15,
                ease: "power2.out",
                duration: 1
            });
            
            // Parallax the background grid
            gsap.to('.grid-background', {
                backgroundPosition: `${50 + x * 2}% ${50 + y * 2}%`,
                ease: "power2.out",
                duration: 1
            });
        }
    });
}

/**
 * RESPONSIVENESS
 */
function setupResponsiveness() {
    const handleResize = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        
        const scaleX = vw / CONFIG.canvasWidth;
        const scaleY = (vh - 180) / CONFIG.canvasHeight;
        
        state.scale = Math.min(scaleX, scaleY, 1);
        
        gsap.set(UI.zoomContainer, {
            scale: state.scale,
            xPercent: -50,
            left: "50%",
            transformPerspective: 1000,
            transformOrigin: "center center"
        });
        
        updateFlows();
    };

    window.addEventListener('resize', handleResize);
    handleResize();
}

/**
 * INTERACTION SYSTEM & DATA PACKETS (MotionPath)
 */
function setupInteractions() {
    Draggable.create(".node-card, #neural-nexus", {
        type: "x,y",
        bounds: "#zoom-container",
        inertia: true,
        onDrag: () => updateFlows(false),
        onDragEnd: function() {
            updateFlows(false);
            logTelemetry(`NODE_REPOSITIONED: ${this.target.id}`);
        },
        onPress: function() {
            killDemoTour();
            gsap.to(this.target, { 
                scale: 1.05, 
                zIndex: 100, 
                duration: 0.3,
                boxShadow: "0 0 40px rgba(0, 242, 255, 0.4)"
            });
        },
        onRelease: function() {
            gsap.to(this.target, { 
                scale: 1, 
                zIndex: 50, 
                duration: 0.3,
                boxShadow: "none"
            });
        }
    });

    // Make the Telemetry Terminal Movable
    Draggable.create("#data-terminal", {
        type: "x,y",
        trigger: "#terminal-drag-handle",
        bounds: "body",
        inertia: true
    });

    // Terminal Minimize/Maximize Toggle
    let isTerminalMinimized = false;
    document.getElementById('terminal-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        killDemoTour();
        const terminal = document.getElementById('data-terminal');
        const output = document.getElementById('terminal-output');
        const toggleContainer = document.getElementById('terminal-toggle');
        
        if (isTerminalMinimized) {
            gsap.to(terminal, { height: 180, duration: 0.4, ease: "power3.out" });
            gsap.to(output, { autoAlpha: 1, duration: 0.3, delay: 0.1 });
            toggleContainer.innerHTML = '<i data-lucide="minus"></i>';
        } else {
            gsap.to(terminal, { height: 42, duration: 0.4, ease: "power3.inOut" });
            gsap.to(output, { autoAlpha: 0, duration: 0.2 });
            toggleContainer.innerHTML = '<i data-lucide="plus"></i>';
        }
        createIcons({ icons });
        isTerminalMinimized = !isTerminalMinimized;
    });

    // Special Hover Effect for Software Engineer -> Diffusion Paths
    const roleSe = document.getElementById('role-se');
    roleSe.addEventListener('mouseenter', () => {
        UI.zoomContainer.classList.add('show-circuits');
        
        if (!state.seHoverInterval) {
            // Spawn immediately on hover
            ['tag-cloud', 'tag-sec', 'tag-ml', 'tag-ux'].forEach(tag => sendDataPacket(tag, true));
            // Spawn continuously and more frequently
            state.seHoverInterval = setInterval(() => {
                ['tag-cloud', 'tag-sec', 'tag-ml', 'tag-ux'].forEach(tag => sendDataPacket(tag, true));
            }, 400); // Increased frequency from 1200ms to 400ms
        }
    });

    roleSe.addEventListener('mouseleave', () => {
        UI.zoomContainer.classList.remove('show-circuits');
        clearInterval(state.seHoverInterval);
        state.seHoverInterval = null;
    });

    document.querySelectorAll('.node-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.defaultPrevented) return;
            if (e.target.closest('.diffusion-item')) return;
            
            killDemoTour();
            
            // Send Data Packet along path
            sendDataPacket(card.id);
            
            // Flip Portal
            togglePortal(card);
        });
    });
    
    UI.portalOverlay.addEventListener('click', () => {
        if (state.activePortal) togglePortal(state.activePortal);
    });
}

/**
 * DATA PACKET ANIMATION (MotionPathPlugin)
 */
function sendDataPacket(fromId, silent = false) {
    const pathsToAnimate = [];
    for (let [key, info] of state.flowsMap.entries()) {
        if (key.startsWith(`${fromId}-`)) {
            pathsToAnimate.push({ key, ...info });
        }
    }
    
    if (pathsToAnimate.length === 0) return;

    if (!silent) logTelemetry(`DATA_EXTRACTED: Fetching telemetry from ${fromId}...`, true);

    pathsToAnimate.forEach(pathInfo => {
        const packet = document.createElement('div');
        packet.className = 'data-packet';
        packet.style.boxShadow = `0 0 15px ${pathInfo.color}, 0 0 30px ${pathInfo.color}`;
        packet.style.backgroundColor = pathInfo.color;
        
        if (pathInfo.type === 'circuit') {
            packet.style.width = '24px';
            packet.style.height = '8px';
            packet.style.borderRadius = '4px';
            packet.style.boxShadow = `0 0 20px ${pathInfo.color}, 0 0 40px ${pathInfo.color}`;
        }

        UI.zoomContainer.appendChild(packet);

        gsap.to(packet, {
            motionPath: {
                path: pathInfo.pathElement,
                align: pathInfo.pathElement,
                alignOrigin: [0.5, 0.5],
                autoRotate: pathInfo.type === 'circuit'
            },
            duration: pathInfo.type === 'circuit' ? 1.2 : 1.5,
            ease: "power2.inOut",
            onComplete: () => {
                packet.remove();
                if (!silent) {
                    logTelemetry(`NEURAL_TRAINING: Weights updated for ${fromId}`);
                    gsap.fromTo('.core-pulse', 
                        { scale: 2, filter: "blur(5px)" }, 
                        { scale: 1, filter: "blur(2px)", duration: 0.5 }
                    );
                }
            }
        });
    });
}

/**
 * FLIP PLUGIN - EXPANDABLE PORTAL
 */
function togglePortal(card) {
    const isExpanding = !card.classList.contains('portal-active');
    
    // 1. Get State
    const stateFlip = Flip.getState(card);
    
    // 2. Change DOM
    if (isExpanding) {
        state.activePortal = card;
        UI.portalOverlay.style.display = 'block';
        UI.portalOverlay.appendChild(card);
        card.classList.add('portal-active');
        logTelemetry(`INTENT_FOCUSED: Deep diving into ${card.id}`, true);
    } else {
        state.activePortal = null;
        UI.zoomContainer.appendChild(card); // Move back to zoom container
        card.classList.remove('portal-active');
        UI.portalOverlay.style.display = 'none';
        logTelemetry(`INTENT_RELEASED: Returning to overview`);
    }
    
    // 3. Animate Flip
    Flip.from(stateFlip, {
        duration: 0.6,
        ease: "expo.out",
        absolute: true,
        zIndex: 2000,
        onUpdate: () => {
            if (!isExpanding) updateFlows(); // Keep lines connected while shrinking back
        }
    });
}

/**
 * PRECISE COORDINATE HELPER
 * Calculates the exact internal coordinate of any element relative to zoom-container,
 * handling nested elements (like tags inside Software Engineer) and scale flawlessly.
 */
function getRelativeCenter(el) {
    if (!el) return { x: 0, y: 0 };
    
    // Ignore lines if it's currently fullscreen in Portal mode
    if (el.classList.contains('portal-active')) {
        return { x: 0, y: 0 }; 
    }

    const rect = el.getBoundingClientRect();
    const containerRect = UI.zoomContainer.getBoundingClientRect();

    // Convert viewport screen coordinates back into internal unscaled coordinates
    const x = ((rect.left + rect.right) / 2 - containerRect.left) / state.scale;
    const y = ((rect.top + rect.bottom) / 2 - containerRect.top) / state.scale;

    return { x, y };
}

/**
 * FLOW ENGINE (SVG RENDERER)
 */
function updateFlows(animateInitial = false) {
    // Only inject defs once if missing, preserving any existing filters
    if (!UI.svgLayer.querySelector('#arrowhead')) {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.innerHTML = `
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" fill="currentColor" />
            </marker>
        `;
        UI.svgLayer.appendChild(defs);
    }
    
    const flows = [
        { from: 'role-tw', to: 'neural-nexus', color: CONFIG.colors.human },
        { from: 'role-se', to: 'neural-nexus', color: CONFIG.colors.human },
        { from: 'role-ba', to: 'neural-nexus', color: CONFIG.colors.human },
        { from: 'neural-nexus', to: 'role-val', color: CONFIG.colors.ai },
        { from: 'neural-nexus', to: 'role-ops', color: CONFIG.colors.ai },
        { from: 'neural-nexus', to: 'role-arch', color: CONFIG.colors.ai },
        { from: 'neural-nexus', to: 'role-sys', color: CONFIG.colors.ai },
        { from: 'neural-nexus', to: 'role-strat', color: CONFIG.colors.ai },
        { from: 'neural-nexus', to: 'role-vstream', color: CONFIG.colors.ai }
    ];

    flows.forEach(flow => {
        renderCurve(flow.from, flow.to, flow.color, 'normal', animateInitial);
    });

    const diffFlows = [
        { from: 'tag-cloud', to: 'role-sys' },
        { from: 'tag-sec', to: 'role-val' },
        { from: 'tag-ml', to: 'role-ops' },
        { from: 'tag-ux', to: 'role-arch' }
    ];

    diffFlows.forEach(flow => {
        renderCurve(flow.from, flow.to, CONFIG.colors.diffusion, 'circuit', animateInitial);
    });
}

function renderCurve(fromId, toId, color, type = 'normal', animate = false) {
    const el1 = document.getElementById(fromId);
    const el2 = document.getElementById(toId);
    const start = getRelativeCenter(el1);
    const end = getRelativeCenter(el2);

    if (start.x === 0 && start.y === 0) return; // Skip if flipped

    let path, pulse;
    const pathId = `${fromId}-to-${toId}`;
    
    // Reuse existing DOM elements if they exist to prevent breaking MotionPath tweens!
    if (state.flowsMap.has(pathId)) {
        const cached = state.flowsMap.get(pathId);
        path = cached.pathElement;
        pulse = cached.pulseElement;
    } else {
        path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pulse = document.createElementNS("http://www.w3.org/2000/svg", "path");
        
        if (type === 'circuit') {
            path.setAttribute("class", "flow-path circuit-path");
            path.setAttribute("stroke-width", "4");
            
            pulse.setAttribute("class", "flow-pulse circuit-pulse");
            pulse.setAttribute("stroke-dasharray", "10 20");
            pulse.setAttribute("stroke-linecap", "round");
            pulse.setAttribute("stroke-width", "6");
        } else {
            path.setAttribute("class", "flow-path");
            pulse.setAttribute("class", "flow-pulse");
            pulse.setAttribute("marker-end", "url(#arrowhead)");
            pulse.style.color = color; 
        }

        path.setAttribute("stroke", color);
        pulse.setAttribute("stroke", color);

        UI.svgLayer.appendChild(path);
        UI.svgLayer.appendChild(pulse);
        
        state.flowsMap.set(pathId, { pathElement: path, pulseElement: pulse, color, type });

        // Initial Path Drawing Animation ONLY ON CREATION
        if (animate) {
            try {
                // Ensure we have a tiny delay so DOM layout computes length
                setTimeout(() => {
                    const length = path.getTotalLength() || 1500;
                    gsap.fromTo(path, 
                        { strokeDasharray: length, strokeDashoffset: length },
                        { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }
                    );
                }, 50);
            } catch(e) {}
        }
    }
    
    // Update coordinates dynamically
    let d = "";
    if (type === 'circuit') {
        const midX = start.x + (end.x - start.x) / 2;
        d = `M${start.x},${start.y} L${midX},${start.y} L${midX},${end.y} L${end.x},${end.y}`;
    } else {
        const dx = Math.abs(end.x - start.x) * 0.5;
        d = `M${start.x},${start.y} C${start.x + dx},${start.y} ${end.x - dx},${end.y} ${end.x},${end.y}`;
    }

    path.setAttribute("d", d);
    pulse.setAttribute("d", d);
}

window.addEventListener('DOMContentLoaded', init);
