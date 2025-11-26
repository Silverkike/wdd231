// scripts/script.js
'use strict';

/* -------------------------
   DOM helpers and globals
------------------------- */
const membersContainer = document.getElementById('members-container');
const gridBtn = document.getElementById('grid-btn');
const listBtn = document.getElementById('list-btn');

let membersData = [];
let currentView = 'grid'; // grid | list

/* -------------------------
   MEMBERS / RENDERING
------------------------- */
async function loadMembers() {
    try {
        const resp = await fetch('data/members.json', { cache: "no-store" });
        if (!resp.ok) throw new Error('Error cargando members.json');
        membersData = await resp.json();
        renderMembers();
    } catch (err) {
        if (membersContainer) {
            membersContainer.innerHTML = `<p class="error">No se pudo cargar la lista de miembros. ${err.message}</p>`;
        }
        console.error(err);
    }
}

function membershipBadge(membership) {
    const m = typeof membership === 'string' ? parseInt(membership, 10) : membership;
    switch (m) {
        case 3:
            return `<span class="membership-badge membership-3" title="Gold member">GOLD</span>`;
        case 2:
            return `<span class="membership-badge membership-2" title="Silver member">SILVER</span>`;
        default:
            return `<span class="membership-badge membership-1" title="Member">MEMBER</span>`;
    }
}

function renderMembers() {
    if (!membersContainer) return;

    membersContainer.classList.toggle('grid-view', currentView === 'grid');
    membersContainer.classList.toggle('list-view', currentView === 'list');

    if (!membersData || membersData.length === 0) {
        membersContainer.innerHTML = '<p>No hay miembros para mostrar.</p>';
        return;
    }

    if (currentView === 'list') {
        membersContainer.innerHTML = membersData.map(m => `
      <article class="member-card list" role="article">
        <div class="member-info">
          <h3>${escapeHtml(m.name)} ${membershipBadge(m.membership)}</h3>
          <p class="meta">${escapeHtml(m.tagline || '')}</p>
          <p class="meta">${escapeHtml(m.address || '')} • ${escapeHtml(m.phone || '')}</p>
          <p><a href="${escapeHtml(m.website || '#')}" target="_blank" rel="noopener">Visitar sitio</a></p>
        </div>
      </article>
    `).join('');
    } else {
        membersContainer.innerHTML = membersData.map(m => `
      <article class="member-card" role="article">
        <img src="${escapeHtml(m.image || 'images/placeholder.png')}" alt="${escapeHtml(m.name)} logo" loading="lazy"/>
        <div class="member-info">
          <h3>${escapeHtml(m.name)} ${membershipBadge(m.membership)}</h3>
          <p class="meta">${escapeHtml(m.tagline || '')}</p>
          <p class="meta">${escapeHtml(m.address || '')}</p>
          <p class="meta">${escapeHtml(m.phone || '')}</p>
          <p><a href="${escapeHtml(m.website || '#')}" target="_blank" rel="noopener">Visitar sitio</a></p>
        </div>
      </article>
    `).join('');
    }
}

/* -------------------------
   UI: view toggles
------------------------- */
if (gridBtn) gridBtn.setAttribute('aria-pressed', currentView === 'grid' ? 'true' : 'false');
if (listBtn) listBtn.setAttribute('aria-pressed', currentView === 'list' ? 'true' : 'false');

gridBtn && gridBtn.addEventListener('click', () => {
    currentView = 'grid';
    gridBtn.setAttribute('aria-pressed', 'true');
    listBtn && listBtn.setAttribute('aria-pressed', 'false');
    renderMembers();
});

listBtn && listBtn.addEventListener('click', () => {
    currentView = 'list';
    gridBtn && gridBtn.setAttribute('aria-pressed', 'false');
    listBtn.setAttribute('aria-pressed', 'true');
    renderMembers();
});

/* -------------------------
   Utilities
------------------------- */
function setFooterDates() {
    const copyrightEl = document.getElementById('copyright');
    const lastEl = document.getElementById('last-modified');

    const year = new Date().getFullYear();
    if (copyrightEl) {
        copyrightEl.textContent = `© ${year} Alianza Empresarial San Salvador`;
    }

    if (lastEl) {
        const last = new Date(document.lastModified);
        lastEl.textContent = `Última modificación: ${last.toLocaleString('es-ES')}`;
    }
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[m]));
}

/* -----------------------------------------------------------
   WEATHER (unchanged)
------------------------------------------------------------ */

async function loadWeather() {
    const apiKey = "113adf1f93cd1f5156e9da6535d553b0";
    const lat = 13.6929;
    const lon = -89.2182;

    const weatherTemp = document.getElementById('weather-temp');
    const weatherDesc = document.getElementById('weather-desc');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherForecast = document.getElementById('weather-forecast');
    const weatherChill = document.getElementById('weather-chill');
    const weatherLocation = document.getElementById('weather-location');

    if (!weatherTemp) return;

    const currentUrl =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

    const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

    try {
        const currentResp = await fetch(currentUrl);
        if (!currentResp.ok) throw new Error("Error obteniendo clima actual");
        const currentData = await currentResp.json();

        const temp = Math.round(currentData.main.temp);
        const desc = currentData.weather[0].description;
        const icon = currentData.weather[0].icon;
        const wind = currentData.wind.speed;

        weatherTemp.textContent = `${temp}°C`;
        weatherDesc.textContent = capitalize(desc);
        weatherLocation.textContent = "San Salvador, SV";

        if (weatherIcon) {
            weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            weatherIcon.alt = desc;
            weatherIcon.style.display = "inline-block";
        }

        let chillText = "N/A";
        if (temp <= 10 && wind > 4.8) {
            const chill = 13.12 + 0.6215 * temp - 11.37 * (wind ** 0.16) + 0.3965 * temp * (wind ** 0.16);
            chillText = `${Math.round(chill)}°C`;
        } else {
            chillText = `Viento: ${wind} m/s`;
        }
        if (weatherChill) weatherChill.textContent = chillText;

        const forecastResp = await fetch(forecastUrl);
        if (!forecastResp.ok) throw new Error("Error obteniendo pronóstico");
        const forecastData = await forecastResp.json();

        if (weatherForecast) weatherForecast.innerHTML = "";

        const next3 = forecastData.list.filter(f => f.dt_txt.includes("12:00:00")).slice(1, 4);

        next3.forEach(day => {
            const date = new Date(day.dt * 1000);
            const name = date.toLocaleDateString("es-ES", { weekday: "short" });

            const card = document.createElement("div");
            card.className = "weather-day";

            card.innerHTML = `
                <div class="day">${name}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"
                    alt="${day.weather[0].description}" width="40" height="40">
                <div class="temp">${Math.round(day.main.temp_max)}° / ${Math.round(day.main.temp_min)}°</div>
            `;

            weatherForecast.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        if (weatherTemp) weatherTemp.textContent = "--°";
        if (weatherDesc) weatherDesc.textContent = "No disponible";
        if (weatherIcon) weatherIcon.style.display = "none";
        if (weatherChill) weatherChill.textContent = "--";
    }
}

function capitalize(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
}

/* -----------------------------------------------------------
   SPOTLIGHTS (unchanged)
------------------------------------------------------------ */

async function loadSpotlights() {
    const spotContainer = document.getElementById('spotlights-container');
    if (!spotContainer) return;
    try {
        const resp = await fetch('data/members.json', { cache: "no-store" });
        if (!resp.ok) throw new Error("No se pudo cargar members.json");
        const data = await resp.json();

        const premium = data.filter(m => m.membership === 2 || m.membership === 3);
        const shuffled = premium.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(3, shuffled.length));

        spotContainer.innerHTML = selected.map(m => `
            <div class="spotlight-card">
                <img src="${m.image}" alt="${escapeHtml(m.name)} logo" loading="lazy">
                <h3>${escapeHtml(m.name)}</h3>
                <p>${escapeHtml(m.tagline || '')}</p>
                <a href="${m.website}" target="_blank">Visitar sitio</a>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}

/* -----------------------------------------------------------
   MODAL SYSTEM + TIMESTAMP
------------------------------------------------------------ */

function initModals() {
    // open buttons
    const openButtons = document.querySelectorAll('.learn-more');
    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.dataset.modal;
            const modal = document.getElementById(modalId);
            if (!modal) return;
            // open
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            // focus first focusable (close button)
            const close = modal.querySelector('[data-close]');
            if (close) close.focus();
            // lock scroll
            document.documentElement.style.overflow = 'hidden';
        });
    });

    // close buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (!modal) return;
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.documentElement.style.overflow = '';
        });
    });

    // click outside modal content
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
                modal.setAttribute('aria-hidden', 'true');
                document.documentElement.style.overflow = '';
            }
        });
    });

    // Escape to close all
    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') {
            document.querySelectorAll('.modal.open').forEach(m => {
                m.classList.remove('open');
                m.setAttribute('aria-hidden', 'true');
            });
            document.documentElement.style.overflow = '';
        }
    });
}

/* -----------------------------------------------------------
   INITIALIZATION
----------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
    setFooterDates();
    loadWeather();
    loadSpotlights();

    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            mainNav.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 640 && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && mainNav && mainNav.classList.contains('open')) {
            mainNav.classList.remove('open');
            navToggle && navToggle.setAttribute('aria-expanded', 'false');
            navToggle && navToggle.focus();
        }
    });

    // TIMESTAMP: set only if the field exists
    const ts = document.getElementById("timestamp");
    if (ts) {
        ts.value = new Date().toISOString();
    }

    // Initialize modals
    initModals();

    /* ---------------------------
       ADICIÓN: animar membership cards
       (staggered reveal)
    --------------------------- */
    function animateMembershipCards() {
        const cards = document.querySelectorAll('.membership-card');
        if (!cards || cards.length === 0) return;

        cards.forEach((card, i) => {
            const delay = 120 * i; // ms
            setTimeout(() => {
                card.classList.add('visible');
            }, delay + 180); // small initial pause for page to settle
        });
    }

    // run animation
    animateMembershipCards();

});

/* Defensive: ensure nav panel width equals viewport and avoid overflow when opened */
(function ensureNavPanelFits() {
    const nav = document.getElementById('main-nav');
    const navList = document.getElementById('nav-list');
    if (!nav || !navList) return;

    // When nav opens, force the nav-list to match viewport width and not overflow
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (m.attributeName === 'class') {
                const isOpen = nav.classList.contains('open');
                if (isOpen) {
                    // match viewport width and force no overflow horizontally
                    navList.style.width = '100%';
                    navList.style.maxWidth = '100%';
                    navList.style.boxSizing = 'border-box';
                } else {
                    // remove inline styles when closed to not interfere with CSS
                    navList.style.width = '';
                    navList.style.maxWidth = '';
                    navList.style.boxSizing = '';
                }
            }
        });
    });

    observer.observe(nav, { attributes: true });
})();

