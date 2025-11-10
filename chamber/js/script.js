// js/script.js
const membersContainer = document.getElementById('members-container');
const gridBtn = document.getElementById('grid-btn');
const listBtn = document.getElementById('list-btn');

let membersData = [];
let currentView = 'grid'; // grid | list

async function loadMembers() {
    try {
        const resp = await fetch('data/members.json');
        if (!resp.ok) throw new Error('Error cargando members.json');
        membersData = await resp.json();
        renderMembers();
    } catch (err) {
        membersContainer.innerHTML = `<p class="error">No se pudo cargar la lista de miembros. ${err.message}</p>`;
        console.error(err);
    }
}

function membershipBadge(membership) {
    switch (membership) {
        case 3:
            return `<span class="membership-badge membership-3" title="Gold member">GOLD</span>`;
        case 2:
            return `<span class="membership-badge membership-2" title="Silver member">SILVER</span>`;
        default:
            return `<span class="membership-badge membership-1" title="Member">MEMBER</span>`;
    }
}

function renderMembers() {
    membersContainer.classList.toggle('grid-view', currentView === 'grid');
    membersContainer.classList.toggle('list-view', currentView === 'list');

    if (!membersData || membersData.length === 0) {
        membersContainer.innerHTML = '<p>No hay miembros para mostrar.</p>';
        return;
    }

    if (currentView === 'list') {
        // simple list (sin imágenes) según rubrica
        membersContainer.innerHTML = membersData.map(m => `
      <article class="member-card list" role="article">
        <div class="member-info">
          <h3>${escapeHtml(m.name)} ${membershipBadge(m.membership)}</h3>
          <p class="meta">${escapeHtml(m.tagline || '')}</p>
          <p class="meta">${escapeHtml(m.address)} • ${escapeHtml(m.phone)}</p>
          <p><a href="${m.website}" target="_blank" rel="noopener">Visitar sitio</a></p>
        </div>
      </article>
    `).join('');
    } else {
        // grid with image cards
        membersContainer.innerHTML = membersData.map(m => `
      <article class="member-card" role="article">
        <img src="${m.image}" alt="${escapeHtml(m.name)} logo" loading="lazy" width="80" height="80"/>
        <div class="member-info">
          <h3>${escapeHtml(m.name)} ${membershipBadge(m.membership)}</h3>
          <p class="meta">${escapeHtml(m.tagline || '')}</p>
          <p class="meta">${escapeHtml(m.address)}</p>
          <p class="meta">${escapeHtml(m.phone)}</p>
          <p><a href="${m.website}" target="_blank" rel="noopener">Visitar sitio</a></p>
        </div>
      </article>
    `).join('');
    }
}

gridBtn.addEventListener('click', () => {
    currentView = 'grid';
    gridBtn.setAttribute('aria-pressed', 'true');
    listBtn.setAttribute('aria-pressed', 'false');
    renderMembers();
});

listBtn.addEventListener('click', () => {
    currentView = 'list';
    gridBtn.setAttribute('aria-pressed', 'false');
    listBtn.setAttribute('aria-pressed', 'true');
    renderMembers();
});

function setFooterDates() {
    const copyrightEl = document.getElementById('copyright');
    const lastEl = document.getElementById('last-modified');

    const year = new Date().getFullYear();
    copyrightEl.textContent = `© ${year} Alianza Empresarial San Salvador`;

    const last = new Date(document.lastModified);
    lastEl.textContent = `Última modificación: ${last.toLocaleString()}`;
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
    setFooterDates();

    // improved nav toggle for mobile: toggle .open on .main-nav
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            mainNav.classList.toggle('open');
            // when opening, focus first link for accessibility
            if (!expanded) {
                const firstLink = mainNav.querySelector('.nav-list a');
                firstLink && firstLink.focus();
            }
        });
    }
});
