// scripts/script.js - ARCHIVO COMPLETO FUSIONADO
'use strict';

/* =============== FUNCIONES GENERALES (Todas las páginas) =============== */

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

function capitalize(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
}

/* -------------------------
   NAVEGACIÓN MÓVIL MEJORADA - VERSIÓN DEFINITIVA CORREGIDA
------------------------- */
function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const navList = document.getElementById('nav-list');

    if (!navToggle || !mainNav || !navList) {
        console.log('Elementos de navegación no encontrados o página sin menú móvil');
        return;
    }

    console.log('Inicializando navegación móvil mejorada...');

    // Variable para rastrear el estado del menú
    let isMenuOpen = false;

    // Función para abrir el menú
    function openMenu() {
        isMenuOpen = true;
        navToggle.setAttribute('aria-expanded', 'true');
        mainNav.classList.add('open');
        navList.style.display = 'flex';
        console.log('Menú ABIERTO');
    }

    // Función para cerrar el menú
    function closeMenu() {
        if (!isMenuOpen) return;

        isMenuOpen = false;
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
        navList.style.display = 'none';
        console.log('Menú CERRADO');
    }

    // Función para alternar (abrir/cerrar) el menú
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // 1. EVENTO: Click en el botón hamburguesa
    navToggle.addEventListener('click', function (e) {
        e.stopPropagation(); // Evita que el clic se propague
        e.preventDefault(); // Previene comportamiento por defecto
        console.log('Botón hamburguesa clickeado');
        toggleMenu();
    });

    // 2. EVENTO: Click en cualquier enlace del menú (CIERRA el menú)
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            console.log('Enlace del menú clickeado:', this.textContent);
            // Permitir que el enlace navegue normalmente
            // El menú se cerrará automáticamente porque la página se recargará

            // Pero también cerramos el menú inmediatamente para feedback visual
            closeMenu();

            // Nota: No usamos e.preventDefault() aquí para permitir la navegación
        });
    });

    // 3. EVENTO: Click fuera del menú (CIERRA el menú)
    document.addEventListener('click', function (e) {
        // Si el menú está abierto Y el clic NO es en el menú NI en el botón
        if (isMenuOpen && !mainNav.contains(e.target) && e.target !== navToggle) {
            console.log('Clic fuera del menú detectado');
            closeMenu();
        }
    });

    // 4. EVENTO: Tecla Escape (CIERRA el menú)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isMenuOpen) {
            console.log('Tecla Escape presionada');
            closeMenu();
        }
    });

    // 5. EVENTO: Cambio de tamaño de ventana (CIERRA menú si pasa a desktop)
    window.addEventListener('resize', function () {
        const isMobile = window.innerWidth <= 640;

        if (!isMobile && isMenuOpen) {
            console.log('Cambio a vista desktop, cerrando menú');
            closeMenu();
        }
    });

    // 6. Asegurar estado inicial correcto
    const isMobileView = window.innerWidth <= 640;
    if (isMobileView) {
        // En móvil: menú cerrado por defecto
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
        navList.style.display = 'none';
    } else {
        // En desktop: menú siempre visible
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
        navList.style.display = 'flex';
    }

    console.log('Navegación móvil inicializada correctamente');
}

/* -------------------------
   MODAL SYSTEM (para join.html)
------------------------- */
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

/* -------------------------
   ANIMAR MEMBERSHIP CARDS (para join.html)
------------------------- */
function animateMembershipCards() {
    const cards = document.querySelectorAll('.membership-card');
    if (!cards || cards.length === 0) return;

    cards.forEach((card, i) => {
        const delay = 120 * i;
        setTimeout(() => {
            card.classList.add('visible');
        }, delay + 180);
    });
}

/* =============== FUNCIONES PARA DIRECTORY PAGE =============== */

/* -------------------------
   MEMBERS / RENDERING (directory.html)
------------------------- */
async function loadMembers() {
    const membersContainer = document.getElementById('members-container');
    if (!membersContainer) return; // No está en esta página

    const gridBtn = document.getElementById('grid-btn');
    const listBtn = document.getElementById('list-btn');

    let membersData = [];
    let currentView = 'grid';

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
        if (!membersData || membersData.length === 0) {
            membersContainer.innerHTML = '<p>No hay miembros para mostrar.</p>';
            return;
        }

        membersContainer.classList.toggle('grid-view', currentView === 'grid');
        membersContainer.classList.toggle('list-view', currentView === 'list');

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

    // UI: view toggles
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

    // Cargar datos
    try {
        const resp = await fetch('data/members.json', { cache: "no-store" });
        if (!resp.ok) throw new Error('Error cargando members.json');
        membersData = await resp.json();
        renderMembers();
    } catch (err) {
        membersContainer.innerHTML = `<p class="error">No se pudo cargar la lista de miembros. ${err.message}</p>`;
        console.error(err);
    }
}

/* =============== FUNCIONES PARA HOME PAGE =============== */

/* -------------------------
   WEATHER (index.html)
------------------------- */
async function loadWeather() {
    const weatherTemp = document.getElementById('weather-temp');
    if (!weatherTemp) return; // No está en esta página

    const apiKey = "113adf1f93cd1f5156e9da6535d553b0";
    const lat = 13.6929;
    const lon = -89.2182;

    const weatherDesc = document.getElementById('weather-desc');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherForecast = document.getElementById('weather-forecast');
    const weatherChill = document.getElementById('weather-chill');
    const weatherLocation = document.getElementById('weather-location');

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

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

/* -------------------------
   SPOTLIGHTS (index.html)
------------------------- */
async function loadSpotlights() {
    const spotContainer = document.getElementById('spotlights-container');
    if (!spotContainer) return; // No está en esta página

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

/* =============== FUNCIONES PARA DISCOVER PAGE =============== */

/* -------------------------
   LOCALSTORAGE PARA MENSAJE DE VISITA (discover.html)
------------------------- */
function displayVisitMessage() {
    const visitMessageEl = document.getElementById('visit-message');
    if (!visitMessageEl) return; // No está en esta página

    const lastVisit = localStorage.getItem('lastVisitDiscover');
    const now = Date.now();

    if (!lastVisit) {
        visitMessageEl.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const lastVisitTime = parseInt(lastVisit, 10);
        const timeDiff = now - lastVisitTime;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
            const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
            if (hoursDiff < 24) {
                visitMessageEl.textContent = "Back so soon! Awesome!";
            } else {
                visitMessageEl.textContent = "Back today! Good to see you!";
            }
        } else if (daysDiff === 1) {
            visitMessageEl.textContent = "Your last visit was 1 day ago.";
        } else {
            visitMessageEl.textContent = `Your last visit was ${daysDiff} days.`;
        }
    }

    localStorage.setItem('lastVisitDiscover', now.toString());
}

/* -------------------------
   LAZY LOADING DE IMÁGENES (discover.html)
------------------------- */
function lazyLoadImages() {
    const images = document.querySelectorAll('.discover-card img[data-src]');

    images.forEach((img) => {
        const src = img.dataset.src;

        // Cargar inmediatamente
        img.src = src;
        img.classList.add('loaded');

        img.onerror = function () {
            console.error(`Error cargando imagen: ${src}`);
            img.src = 'https://via.placeholder.com/300x200.webp?text=Imagen+no+disponible';
        };
    });
}

/* -------------------------
   RENDERIZAR LAS TARJETAS (discover.html)
------------------------- */
async function renderDiscoverCards() {
    const discoverContainer = document.getElementById('discover-container');
    if (!discoverContainer) return; // No está en esta página

    try {
        // Importar dinámicamente los datos de discover
        const placesModule = await import('../data/places.mjs');
        const places = placesModule.default;

        discoverContainer.innerHTML = places.map(place => `
            <article id="card-${place.id}" class="discover-card" role="article">
                <figure>
                    <img 
                        src="images/placeholder.png" 
                        data-src="${escapeHtml(place.photo_url)}" 
                        alt="${escapeHtml(place.name)}" 
                        width="300" 
                        height="200"
                        loading="lazy"
                    >
                    <figcaption>${escapeHtml(place.cost)}</figcaption>
                </figure>
                
                <div class="card-content">
                    <h2>${escapeHtml(place.name)}</h2>
                    <address>${escapeHtml(place.address)}</address>
                    <p>${escapeHtml(place.description)}</p>
                    <button class="learn-more-btn" aria-label="Aprender más sobre ${escapeHtml(place.name)}">
                        Learn More
                    </button>
                </div>
            </article>
        `).join('');

        // Inicializar lazy loading
        setTimeout(lazyLoadImages, 100);

        // Agregar event listeners a los botones
        document.querySelectorAll('.learn-more-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const cardTitle = this.closest('.discover-card').querySelector('h2').textContent;
                alert(`Más información sobre ${cardTitle} próximamente.`);
            });
        });
    } catch (err) {
        console.error('Error cargando datos de discover:', err);
        discoverContainer.innerHTML = '<p>Error cargando los lugares de interés.</p>';
    }
}

/* =============== INICIALIZACIÓN PRINCIPAL =============== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('script.js fusionado cargado correctamente');

    // Funciones que se ejecutan en TODAS las páginas
    setFooterDates();
    initMobileNavigation();
    initModals();

    // Funciones específicas por página - se ejecutan solo si los elementos existen
    loadMembers(); // directory.html - solo si existe #members-container
    loadWeather(); // index.html - solo si existe #weather-temp
    loadSpotlights(); // index.html - solo si existe #spotlights-container
    animateMembershipCards(); // join.html - solo si existen .membership-card

    // TIMESTAMP para formularios (si existe)
    const ts = document.getElementById("timestamp");
    if (ts) {
        ts.value = new Date().toISOString();
    }

    // Funciones para discover.html - se ejecutan solo si los elementos existen
    const discoverContainer = document.getElementById('discover-container');
    if (discoverContainer) {
        // Solo ejecutar en discover.html
        displayVisitMessage();
        renderDiscoverCards();
    }
});

/* =============== FUNCIÓN DE SEGURIDAD PARA EL MENÚ =============== */
(function ensureNavPanelFits() {
    const nav = document.getElementById('main-nav');
    const navList = document.getElementById('nav-list');
    if (!nav || !navList) return;

    // Cuando nav opens, force the nav-list to match viewport width and not overflow
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