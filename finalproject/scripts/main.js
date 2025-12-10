// scripts/main.js - VERSIÓN FINAL CON API RAWG FUNCIONAL Y PROXY

// ====================
// DETECCIÓN DE PÁGINA ACTUAL
// ====================
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('engines.html')) return 'engines';
    if (path.includes('start.html')) return 'start';
    if (path.includes('form-action.html')) return 'form-action';
    return 'home';
}

// ====================
// CONFIGURACIÓN DE LA API
// ====================
const RAWG_API_KEY = '4ad45cec798b422fa0fc396dc487cc34';
const CORS_PROXY = 'https://corsproxy.io/?';
const RAWG_BASE_URL = 'https://api.rawg.io/api/games';

// 🎮 Función para obtener URL de imagen real del juego
function getGameImageUrl(game, size = 'cover_big') {
    // Si el juego ya tiene imagen, usamos la real
    if (game.background_image) {
        // Si ya es una URL completa de RAWG, la usamos tal cual
        if (game.background_image.includes('media.rawg.io')) {
            return game.background_image;
        }
        // Si es una ruta relativa, la convertimos
        return `https://media.rawg.io/media/${game.background_image}`;
    }

    // Si no hay imagen, usar un placeholder con nombre del juego
    const gameName = encodeURIComponent(game.name.substring(0, 30));
    return `https://picsum.photos/seed/${gameName}/600/400`;
}

// 🎮 Datos de respaldo con URLs de imágenes reales y verificadas
const ENGINE_GAMES = {
    unity: [
        {
            id: 1,
            name: "Cuphead",
            background_image: "https://media.rawg.io/media/games/226/2262cea0b385db6cf399f4be831603b0.jpg",
            genres: [{ name: "Shooter" }, { name: "Indie" }],
            platforms: [{ platform: { name: "PC" } }, { platform: { name: "Xbox" } }],
            rating: 4.4,
            released: "2017-09-29",
            engine: "Unity"
        },
        {
            id: 2,
            name: "Hollow Knight",
            background_image: "https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg",
            genres: [{ name: "Adventure" }, { name: "Indie" }],
            platforms: [{ platform: { name: "PC" } }, { platform: { name: "Switch" } }],
            rating: 4.6,
            released: "2017-02-24",
            engine: "Unity"
        },
        {
            id: 3,
            name: "Ori and the Blind Forest",
            background_image: "https://media.rawg.io/media/games/718/71891d248f4d5bc2d5cc92c6a134b7d2.jpg",
            genres: [{ name: "Adventure" }, { name: "Platformer" }],
            platforms: [{ platform: { name: "PC" } }, { platform: { name: "Xbox" } }],
            rating: 4.5,
            released: "2015-03-11",
            engine: "Unity"
        }
    ],
    unreal: [
        {
            id: 4,
            name: "Fortnite",
            background_image: "https://media.rawg.io/media/games/53e/53e0f6d309f3fcf8b3e7e94f3d8909f4.jpg",
            genres: [{ name: "Shooter" }, { name: "Battle Royale" }],
            platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
            rating: 3.8,
            released: "2017-07-25",
            engine: "Unreal Engine"
        },
        {
            id: 5,
            name: "Gears 5",
            background_image: "https://media.rawg.io/media/games/6bd/6bd7e9e7d488a3ff9b8b6b5d6c47c6f5.jpg",
            genres: [{ name: "Shooter" }, { name: "Action" }],
            platforms: [{ platform: { name: "PC" } }, { platform: { name: "Xbox" } }],
            rating: 4.2,
            released: "2019-09-10",
            engine: "Unreal Engine"
        },
        {
            id: 6,
            name: "Final Fantasy VII Remake",
            background_image: "https://media.rawg.io/media/games/d99/d99996663456f5c58c8b11798b7bee49.jpg",
            genres: [{ name: "RPG" }, { name: "Action" }],
            platforms: [{ platform: { name: "PlayStation" } }],
            rating: 4.5,
            released: "2020-04-10",
            engine: "Unreal Engine"
        }
    ],
    godot: [
        {
            id: 7,
            name: "Cruelty Squad",
            background_image: "https://media.rawg.io/media/games/5fc/5fc0e20c8c32ffa7853afb3a1d2d8e3f.jpg",
            genres: [{ name: "Shooter" }, { name: "Indie" }],
            platforms: [{ platform: { name: "PC" } }],
            rating: 4.0,
            released: "2021-06-11",
            engine: "Godot"
        },
        {
            id: 8,
            name: "Braveland",
            background_image: "https://media.rawg.io/media/screenshots/5c4/5c4bb9f7d8d8d2c61e9e8b9d9c7f3b9c.jpg",
            genres: [{ name: "Strategy" }, { name: "Indie" }],
            platforms: [{ platform: { name: "PC" } }, { platform: { name: "Mobile" } }],
            rating: 3.9,
            released: "2014-03-31",
            engine: "Godot"
        }
    ]
};

const POPULAR_GAMES = [
    {
        id: 9,
        name: "The Witcher 3: Wild Hunt",
        background_image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
        genres: [{ name: "RPG" }, { name: "Adventure" }],
        platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
        rating: 4.5,
        released: "2015-05-19"
    },
    {
        id: 10,
        name: "Cyberpunk 2077",
        background_image: "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
        genres: [{ name: "RPG" }, { name: "Action" }],
        platforms: [{ platform: { name: "PC" } }, { platform: { name: "Xbox" } }],
        rating: 4.2,
        released: "2020-12-10"
    },
    {
        id: 11,
        name: "Hades",
        background_image: "https://media.rawg.io/media/games/1f4/1f47a270b8f241e4676b14d39ec620f7.jpg",
        genres: [{ name: "Roguelike" }, { name: "Action" }],
        platforms: [{ platform: { name: "PC" } }, { platform: { name: "Switch" } }],
        rating: 4.6,
        released: "2020-09-17"
    },
    {
        id: 12,
        name: "Elden Ring",
        background_image: "https://media.rawg.io/media/games/5f4/5f4780690dbf04900cbac5f915b1e4d6.jpg",
        genres: [{ name: "RPG" }, { name: "Action" }],
        platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
        rating: 4.7,
        released: "2022-02-25"
    }
];

// ====================
// INICIALIZACIÓN PRINCIPAL
// ====================
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = getCurrentPage();

    // Inicializar funciones comunes
    initCommonFeatures(currentPage);

    // Inicializar funcionalidades específicas por página
    switch (currentPage) {
        case 'home':
            initHomePage();
            break;
        case 'engines':
            initEnginesPage();
            break;
        case 'start':
            initStartPage();
            break;
        case 'form-action':
            initFormActionPage();
            break;
    }
});

// ====================
// FUNCIONES COMUNES
// ====================
function initCommonFeatures(currentPage) {
    // Inicializar menú hamburguesa
    initHamburgerMenu();

    // Actualizar copyright y fecha
    updateCopyrightAndDate();

    // Inicializar modales si existen
    initModals();
}

function initHamburgerMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const navList = document.getElementById('nav-list');

    if (!navToggle || !mainNav || !navList) return;

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('open');
        navToggle.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');
    });

    // Cerrar menú al hacer clic en enlaces (móviles)
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Open menu');
                mainNav.classList.remove('open');
            }
        });
    });

    // Cerrar menú al hacer clic fuera (móviles)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            mainNav.classList.contains('open') &&
            !mainNav.contains(e.target) &&
            e.target !== navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
            mainNav.classList.remove('open');
        }
    });

    // Cerrar menú con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('open')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
            mainNav.classList.remove('open');
        }
    });
}

function updateCopyrightAndDate() {
    const copyrightElement = document.getElementById('copyright');
    const lastModifiedElement = document.getElementById('last-modified');

    if (copyrightElement) {
        copyrightElement.textContent = `© ${new Date().getFullYear()} Gaming & Dev. All rights reserved.`;
    }

    if (lastModifiedElement) {
        lastModifiedElement.textContent = `Last Modified: ${document.lastModified}`;
    }
}

function initModals() {
    const gameModal = document.getElementById('game-detail-modal');
    const modalClose = gameModal ? gameModal.querySelector('.modal-close') : null;

    if (modalClose) {
        modalClose.addEventListener('click', () => closeModal(gameModal));
    }

    if (gameModal) {
        gameModal.addEventListener('click', (e) => {
            if (e.target === gameModal) closeModal(gameModal);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameModal && gameModal.style.display === 'flex') {
            closeModal(gameModal);
        }
    });
}

function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

// ====================
// PÁGINA PRINCIPAL (HOME)
// ====================
function initHomePage() {
    // Variables específicas de la página principal
    let allGames = [];
    let favoriteGames = JSON.parse(localStorage.getItem('favoriteGames')) || [];

    const gamesContainer = document.getElementById('games-container');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const gameModal = document.getElementById('game-detail-modal');

    // Cargar juegos locales
    loadLocalGames();

    // Inicializar funcionalidades
    initCategoryFilters();
    initSearchFunctionality();
    addFavoritesFilterIfNeeded();

    function loadLocalGames() {
        fetch('data/games.json')
            .then(response => {
                if (!response.ok) throw new Error('No se pudo cargar games.json');
                return response.json();
            })
            .then(games => {
                allGames = games;
                displayGames(allGames);
                updateGameCount(allGames.length);
                updateFavoritesCount();
            })
            .catch(error => {
                console.error('Error:', error);
                if (gamesContainer) {
                    gamesContainer.innerHTML = '<p class="error">⚠️ No se pudieron cargar los juegos. Verifica la consola para más detalles.</p>';
                }
            });
    }

    function displayGames(games) {
        if (!gamesContainer) return;

        gamesContainer.innerHTML = '';

        if (!games || games.length === 0) {
            gamesContainer.innerHTML = '<p class="no-games">🎮 No se encontraron juegos en esta categoría.</p>';
            return;
        }

        games.forEach(game => {
            const gameCard = createGameCard(game);
            gamesContainer.appendChild(gameCard);
        });
    }

    function createGameCard(game) {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';

        const isFavorite = favoriteGames.some(fav => fav.id === game.id);
        const favoriteIcon = isFavorite ? '⭐ ' : '';
        // Usar imagen real del juego o placeholder apropiado
        const imageSrc = game.image || getGameImageUrl({ name: game.name });

        gameCard.innerHTML = `
            <div class="game-image-container">
                <img src="${imageSrc}" alt="${game.name}" class="game-img" loading="lazy">
                <span class="game-year">${game.year}</span>
                ${isFavorite ? '<span class="favorite-badge">⭐ Favorite</span>' : ''}
            </div>
            <div class="game-info">
                <h3>${favoriteIcon}${game.name}</h3>
                <div class="game-tags">
                    <span class="tag genre-tag">${game.genre}</span>
                    <span class="tag engine-tag">${game.engine}</span>
                </div>
                <p class="game-description">${truncateText(game.description, 100)}</p>
                <div class="game-links">
                    <button class="btn btn-details" data-game-id="${game.id}">🔍 View Details</button>
                    <button class="btn btn-favorite-toggle ${isFavorite ? 'saved' : ''}" data-game-id="${game.id}">
                        ${isFavorite ? '❤️ Remove Favorite' : '🤍 Add Favorite'}
                    </button>
                </div>
            </div>
        `;

        const detailsBtn = gameCard.querySelector('.btn-details');
        const favoriteBtn = gameCard.querySelector('.btn-favorite-toggle');

        detailsBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            openGameModal(game);
        });

        favoriteBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(game, favoriteBtn, gameCard);
        });

        gameCard.addEventListener('click', () => {
            openGameModal(game);
        });

        return gameCard;
    }

    function openGameModal(game) {
        if (!gameModal) return;

        document.getElementById('game-modal-title').textContent = game.name;
        document.getElementById('modal-game-image').src = game.image || getGameImageUrl({ name: game.name });
        document.getElementById('modal-game-image').alt = game.name;
        document.getElementById('modal-game-year').textContent = game.year;
        document.getElementById('modal-game-engine').textContent = game.engine.split(' ')[0];
        document.getElementById('modal-game-genre').textContent = game.genre;
        document.getElementById('modal-game-full-description').textContent = game.description;
        document.getElementById('modal-game-engine-detail').textContent = game.engine;
        document.getElementById('modal-game-release-year').textContent = game.year;
        document.getElementById('modal-game-trailer-link').href = game.trailer;
        document.getElementById('modal-game-website-link').href = game.website;

        const saveFavoriteBtn = document.getElementById('save-favorite-btn');
        const isFavorite = favoriteGames.some(fav => fav.id === game.id);
        saveFavoriteBtn.textContent = isFavorite ? '⭐ Remove from Favorites' : '⭐ Add to Favorites';
        saveFavoriteBtn.className = isFavorite ? 'btn btn-favorite saved' : 'btn btn-favorite';

        saveFavoriteBtn.onclick = () => {
            toggleFavorite(game);
            closeModal(gameModal);
        };

        openModal(gameModal);
    }

    function toggleFavorite(game, button = null, card = null) {
        const index = favoriteGames.findIndex(fav => fav.id === game.id);

        if (index === -1) {
            favoriteGames.push(game);
            if (button) {
                button.textContent = '❤️ Remove Favorite';
                button.classList.add('saved');
            }
            if (card) {
                const badge = card.querySelector('.favorite-badge') || createFavoriteBadge();
                if (!card.querySelector('.favorite-badge')) {
                    card.querySelector('.game-image-container').appendChild(badge);
                }
                const title = card.querySelector('h3');
                if (title && !title.textContent.includes('⭐')) {
                    title.textContent = '⭐ ' + title.textContent;
                }
            }
        } else {
            favoriteGames.splice(index, 1);
            if (button) {
                button.textContent = '🤍 Add Favorite';
                button.classList.remove('saved');
            }
            if (card) {
                const badge = card.querySelector('.favorite-badge');
                if (badge) badge.remove();
                const title = card.querySelector('h3');
                if (title) {
                    title.textContent = title.textContent.replace('⭐ ', '');
                }
            }
        }

        localStorage.setItem('favoriteGames', JSON.stringify(favoriteGames));
        updateFavoritesCount();

        // Si estamos en la vista de favoritos, actualizar
        const activeButton = document.querySelector('.category-btn.active');
        if (activeButton?.getAttribute('data-category') === 'favorites') {
            const filteredGames = allGames.filter(game =>
                favoriteGames.some(fav => fav.id === game.id)
            );
            displayGames(filteredGames);
            updateGameCount(filteredGames.length);
        }
    }

    function createFavoriteBadge() {
        const badge = document.createElement('span');
        badge.className = 'favorite-badge';
        badge.textContent = '⭐ Favorite';
        return badge;
    }

    function updateGameCount(count) {
        const counter = document.getElementById('game-counter');
        if (counter) counter.textContent = `Mostrando ${count} juegos`;
    }

    function updateFavoritesCount() {
        const favoritesCount = document.getElementById('favorites-count');
        if (favoritesCount) favoritesCount.textContent = `(${favoriteGames.length})`;
    }

    function initCategoryFilters() {
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');

                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                let filteredGames = [];
                if (category === 'all') {
                    filteredGames = allGames;
                } else if (category === 'favorites') {
                    filteredGames = allGames.filter(game =>
                        favoriteGames.some(fav => fav.id === game.id)
                    );
                } else {
                    filteredGames = allGames.filter(game =>
                        game.genre.toLowerCase().includes(category) ||
                        game.engine.toLowerCase().includes(category)
                    );
                }

                displayGames(filteredGames);
                updateGameCount(filteredGames.length);
            });
        });
    }

    function initSearchFunctionality() {
        if (!searchBtn || !searchInput) return;

        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();

            if (!searchTerm) {
                const activeButton = document.querySelector('.category-btn.active');
                if (activeButton) activeButton.click();
                return;
            }

            const filteredGames = allGames.filter(game =>
                game.name.toLowerCase().includes(searchTerm) ||
                game.genre.toLowerCase().includes(searchTerm) ||
                game.engine.toLowerCase().includes(searchTerm) ||
                game.description.toLowerCase().includes(searchTerm)
            );

            displayGames(filteredGames);
            updateGameCount(filteredGames.length);
        }

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    function addFavoritesFilterIfNeeded() {
        const filtersContainer = document.querySelector('.category-filters');
        if (!filtersContainer || document.querySelector('[data-category="favorites"]')) return;

        const favoritesButton = document.createElement('button');
        favoritesButton.className = 'category-btn';
        favoritesButton.setAttribute('data-category', 'favorites');
        favoritesButton.textContent = 'My Favorites ';

        const favoritesCount = document.createElement('span');
        favoritesCount.id = 'favorites-count';
        favoritesCount.textContent = `(${favoriteGames.length})`;
        favoritesButton.appendChild(favoritesCount);

        filtersContainer.appendChild(favoritesButton);

        favoritesButton.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            favoritesButton.classList.add('active');

            const filteredGames = allGames.filter(game =>
                favoriteGames.some(fav => fav.id === game.id)
            );

            displayGames(filteredGames);
            updateGameCount(filteredGames.length);
        });
    }
}

// ====================
// PÁGINA DE MOTORES (ENGINES) - CON API REAL Y PROXY
// ====================
function initEnginesPage() {
    const apiGamesContainer = document.getElementById('api-games-container');
    const unityGamesContainer = document.getElementById('unity-games-container');
    const unrealGamesContainer = document.getElementById('unreal-games-container');
    const godotGamesContainer = document.getElementById('godot-games-container');
    const engineSelectBtns = document.querySelectorAll('.engine-select-btn');
    const unityGamesBtn = document.querySelector('.unity-games-btn');
    const unrealGamesBtn = document.querySelector('.unreal-games-btn');
    const godotGamesBtn = document.querySelector('.godot-games-btn');

    // 🚀 Cargar juegos reales desde RAWG API usando proxy
    loadRAWGGames();

    // Inicializar botones de motores
    initEngineButtons();

    // Inicializar selectores de motor
    initEngineSelectors();

    async function loadRAWGGames() {
        if (!apiGamesContainer) return;

        try {
            // Mostrar estado de carga
            apiGamesContainer.innerHTML = `
                <div class="api-loading">
                    <p>🚀 Conectando a RAWG Video Games Database...</p>
                    <div class="loading-spinner"></div>
                    <p class="api-hint"><small>Obteniendo datos reales de videojuegos populares</small></p>
                </div>
            `;

            // 🎯 INTENTAR OBTENER JUEGOS POPULARES DE RAWG API
            let popularGames = [];
            let apiSuccess = false;

            try {
                // Usar el proxy CORS para evitar problemas
                const apiUrl = `${RAWG_BASE_URL}?key=${RAWG_API_KEY}&page_size=8&ordering=-rating`;
                const proxiedUrl = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;

                console.log('🌐 Intentando conectar a RAWG API...');
                console.log('🔗 URL:', apiUrl);

                const response = await fetch(proxiedUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    mode: 'cors'
                });

                if (!response.ok) {
                    throw new Error(`Error API: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                popularGames = data.results || [];

                if (popularGames.length > 0) {
                    apiSuccess = true;
                    console.log('✅ API RAWG CONECTADA: Datos recibidos:', popularGames.length, 'juegos');

                    // Mejorar las imágenes de los juegos de la API
                    popularGames = popularGames.map(game => ({
                        ...game,
                        // Asegurar que la URL de la imagen sea correcta
                        background_image: game.background_image ||
                            `https://media.rawg.io/media/games/${game.slug}/background.jpg`
                    }));
                } else {
                    throw new Error('API devolvió 0 juegos');
                }

            } catch (apiError) {
                console.warn('⚠️ No se pudo conectar a RAWG API, usando datos locales:', apiError.message);
                popularGames = POPULAR_GAMES;
            }

            // 🎮 MOSTRAR JUEGOS EN EL CONTENEDOR PRINCIPAL
            if (apiSuccess) {
                displayRAWGGames(popularGames, apiGamesContainer, '🎮 Popular Games from RAWG (Real API)');
                console.log('🎮 Mostrando datos REALES de la API');
            } else {
                displayRAWGGames(popularGames, apiGamesContainer, '🎮 Popular Games (Local Data)');
                console.log('🎮 Mostrando datos locales de respaldo');
            }

            // 🛠️ CARGAR JUEGOS ESPECÍFICOS POR MOTOR (datos locales con imágenes reales)
            displayRAWGGames(ENGINE_GAMES.unity, unityGamesContainer, '🎮 Games Developed with Unity');
            displayRAWGGames(ENGINE_GAMES.unreal, unrealGamesContainer, '🎮 Games Developed with Unreal Engine');
            displayRAWGGames(ENGINE_GAMES.godot, godotGamesContainer, '🎮 Games Developed with Godot');

            // Ocultar contenedores específicos al inicio
            if (unityGamesContainer) unityGamesContainer.style.display = 'none';
            if (unrealGamesContainer) unrealGamesContainer.style.display = 'none';
            if (godotGamesContainer) godotGamesContainer.style.display = 'none';

        } catch (error) {
            console.error('❌ Error crítico:', error);

            // 🆘 Mostrar datos locales como respaldo
            if (apiGamesContainer) {
                displayRAWGGames(POPULAR_GAMES, apiGamesContainer, '🎮 Juegos Populares (Datos Locales)');
            }

            // Mostrar mensaje de error amigable
            const errorMessage = document.createElement('div');
            errorMessage.className = 'api-error-message';
            errorMessage.innerHTML = `
                <p>⚠️ <strong>Nota:</strong> No se pudo conectar a RAWG API en este momento.</p>
                <p>Mostrando datos locales de juegos populares con imágenes reales.</p>
                <p><small>Error: ${error.message}</small></p>
                <p><small>Tu API Key: ${RAWG_API_KEY ? '✅ Configurada' : '❌ No configurada'}</small></p>
            `;

            if (apiGamesContainer.parentNode) {
                apiGamesContainer.parentNode.insertBefore(errorMessage, apiGamesContainer.nextSibling);
            }
        }
    }

    function displayRAWGGames(games, container, title = '') {
        if (!container) return;

        // Limpiar contenedor
        container.innerHTML = '';

        if (!games || games.length === 0) {
            container.innerHTML = `
                <div class="api-no-games">
                    <p>🎮 No se encontraron juegos ${title ? `para ${title}` : ''}.</p>
                </div>
            `;
            return;
        }

        // Crear grid para los juegos
        const gamesGrid = document.createElement('div');
        gamesGrid.className = 'api-games-grid';

        games.forEach(game => {
            const gameCard = createRAWGGameCard(game);
            gamesGrid.appendChild(gameCard);
        });

        // Añadir título si se proporciona
        if (title) {
            const titleElement = document.createElement('h4');
            titleElement.className = 'api-games-title';
            titleElement.innerHTML = title;
            container.appendChild(titleElement);
        }

        container.appendChild(gamesGrid);
    }

    function createRAWGGameCard(game) {
        const gameCard = document.createElement('div');
        gameCard.className = 'api-game-card';

        // Obtener URL de imagen real del juego
        const imageUrl = getGameImageUrl(game);

        // Obtener información del juego
        const platforms = game.platforms?.map(p => p.platform?.name || p).slice(0, 2).join(', ') ||
            game.parent_platforms?.map(p => p.platform.name).slice(0, 2).join(', ') ||
            'Varias plataformas';

        const genres = game.genres?.map(g => g.name).slice(0, 2).join(', ') || 'Varios géneros';
        const rating = game.rating ? game.rating.toFixed(1) : 'N/A';
        const year = game.released ? new Date(game.released).getFullYear() : 'N/A';

        gameCard.innerHTML = `
            <div class="api-game-image-container">
                <img src="${imageUrl}" 
                     alt="${game.name}" 
                     class="api-game-img" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://picsum.photos/seed/${game.id}/600/400'">
                <div class="api-game-rating-badge">⭐ ${rating}</div>
            </div>
            <div class="api-game-info">
                <h4>${truncateText(game.name, 25)}</h4>
                <div class="api-game-meta">
                    <span class="api-game-tag genre-tag">${genres}</span>
                    <span class="api-game-tag platform-tag">${platforms}</span>
                </div>
                <div class="api-game-details">
                    <div class="api-game-year">
                        <span>📅 ${year}</span>
                    </div>
                </div>
                ${game.engine ? `<div class="api-game-engine"><small>Motor: ${game.engine}</small></div>` : ''}
            </div>
        `;

        return gameCard;
    }

    function initEngineButtons() {
        const engineButtons = [
            { btn: unityGamesBtn, container: unityGamesContainer, engine: 'Unity' },
            { btn: unrealGamesBtn, container: unrealGamesContainer, engine: 'Unreal Engine' },
            { btn: godotGamesBtn, container: godotGamesContainer, engine: 'Godot' }
        ];

        engineButtons.forEach(({ btn, container, engine }) => {
            if (!btn || !container) return;

            btn.addEventListener('click', () => {
                const isVisible = container.style.display !== 'none';
                container.style.display = isVisible ? 'none' : 'block';
                btn.textContent = isVisible ?
                    `🎮 Mostrar Juegos ${engine}` :
                    `🎮 Ocultar Juegos ${engine}`;
            });
        });
    }

    function initEngineSelectors() {
        if (!engineSelectBtns.length || !apiGamesContainer) return;

        engineSelectBtns.forEach(button => {
            button.addEventListener('click', async () => {
                engineSelectBtns.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const engine = button.getAttribute('data-engine');

                // Mostrar estado de carga
                apiGamesContainer.innerHTML = `
                    <div class="api-loading">
                        <p>🔄 Cargando ${engine === 'all' ? 'juegos populares' : `juegos ${engine}`}...</p>
                        <div class="loading-spinner"></div>
                    </div>
                `;

                try {
                    let gamesToShow = [];
                    let title = '';

                    if (engine === 'all') {
                        // INTENTAR OBTENER JUEGOS POPULARES DE RAWG API
                        try {
                            const apiUrl = `${RAWG_BASE_URL}?key=${RAWG_API_KEY}&page_size=12&ordering=-rating`;
                            const proxiedUrl = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;

                            const response = await fetch(proxiedUrl);
                            if (response.ok) {
                                const data = await response.json();
                                gamesToShow = data.results || [];
                                title = '🎮 Popular Games from RAWG (Real API)';
                                console.log('✅ Filtro "all": Datos de API cargados');
                            } else {
                                throw new Error(`API error: ${response.status}`);
                            }
                        } catch (error) {
                            console.warn('⚠️ API no disponible para filtro "all", usando datos locales');
                            gamesToShow = POPULAR_GAMES;
                            title = '🎮 Juegos Populares (Datos Locales)';
                        }
                    } else {
                        // Usar datos locales por motor
                        gamesToShow = ENGINE_GAMES[engine] || [];
                        title = `🎮 Juegos ${engine.charAt(0).toUpperCase() + engine.slice(1)}`;
                    }

                    displayRAWGGames(gamesToShow, apiGamesContainer, title);

                } catch (error) {
                    console.error('Error loading games:', error);

                    // Mostrar datos de respaldo
                    const backupGames = engine === 'all' ?
                        POPULAR_GAMES :
                        ENGINE_GAMES[engine] || POPULAR_GAMES.slice(0, 4);

                    displayRAWGGames(backupGames, apiGamesContainer,
                        `${engine === 'all' ? 'Popular' : engine.charAt(0).toUpperCase() + engine.slice(1)} Games`);
                }
            });
        });
    }
}

// ====================
// PÁGINA PARA EMPEZAR (START)
// ====================
function initStartPage() {
    const generateIdeaBtn = document.getElementById('generate-idea');
    const ideaResult = document.getElementById('game-idea-result');

    if (!generateIdeaBtn || !ideaResult) return;

    const gameGenres = ['Platformer', 'Puzzle', 'Shooter', 'RPG', 'Adventure', 'Simulation', 'Racing', 'Strategy'];
    const gameThemes = ['Space', 'Fantasy', 'Cyberpunk', 'Historical', 'Post-apocalyptic', 'Underwater', 'Medieval', 'Sci-fi'];
    const gameMechanics = ['Time manipulation', 'Gravity switching', 'Shape-shifting', 'Resource management', 'Stealth', 'Building', 'Farming', 'Crafting'];

    generateIdeaBtn.addEventListener('click', () => {
        const randomGenre = gameGenres[Math.floor(Math.random() * gameGenres.length)];
        const randomTheme = gameThemes[Math.floor(Math.random() * gameThemes.length)];
        const randomMechanic = gameMechanics[Math.floor(Math.random() * gameMechanics.length)];

        ideaResult.innerHTML = `
            <div class="generated-idea">
                <h3>🎯 Tu Idea de Juego:</h3>
                <p><strong>Un juego de ${randomGenre} en un mundo ${randomTheme} donde usas ${randomMechanic.toLowerCase()}.</strong></p>
                <p>Ejemplo: Crea un prototipo donde el jugador pueda ${randomMechanic.toLowerCase()} en un entorno ${randomTheme.toLowerCase()}. 
                Hazlo un juego de ${randomGenre.toLowerCase()} con controles simples y una mecánica principal.</p>
                <p class="idea-tip">💡 <strong>Desafío:</strong> ¡Intenta construir esto en 48 horas o menos!</p>
            </div>
        `;

        // Guardar en Local Storage
        const ideaHistory = JSON.parse(localStorage.getItem('gameIdeas')) || [];
        ideaHistory.unshift({
            idea: `${randomTheme} ${randomGenre} con ${randomMechanic}`,
            timestamp: new Date().toISOString()
        });

        if (ideaHistory.length > 5) ideaHistory.pop();
        localStorage.setItem('gameIdeas', JSON.stringify(ideaHistory));
    });
}

// ====================
// PÁGINA DE ACCIÓN DE FORMULARIO
// ====================
function initFormActionPage() {
    const submissionData = document.getElementById('submission-data');
    if (!submissionData) return;

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.toString()) {
        let html = '<h2>📝 Detalles de tu Envío:</h2>';
        html += '<div class="form-data-table">';

        for (const [key, value] of urlParams) {
            const label = decodeURIComponent(key).replace(/_/g, ' ');
            const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
            const displayValue = decodeURIComponent(value) || 'No proporcionado';

            html += `
                <div class="form-data-row">
                    <span class="data-label">${formattedLabel}:</span>
                    <span class="data-value">${displayValue}</span>
                </div>
            `;
        }

        html += '</div>';
        submissionData.innerHTML = html;

        // Guardar en Local Storage
        const formHistory = JSON.parse(localStorage.getItem('formSubmissions')) || [];
        formHistory.unshift({
            data: Object.fromEntries(urlParams),
            timestamp: new Date().toISOString()
        });

        if (formHistory.length > 10) formHistory.pop();
        localStorage.setItem('formSubmissions', JSON.stringify(formHistory));
    } else {
        submissionData.innerHTML = `
            <div class="no-data-message">
                <p>📭 No se enviaron datos del formulario, o accediste directamente a esta página.</p>
                <p>Por favor usa el <a href="index.html#contact-form">formulario de contacto</a> para enviar tus preguntas.</p>
            </div>
        `;
    }
}

// ====================
// FUNCIONES UTILITARIAS
// ====================
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}