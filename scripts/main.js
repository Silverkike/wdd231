/* main.js
 - controls hamburger nav and toggles icon to X when open
 - populates course lists and filters using the provided courses array
 - sets current year and last modified
 - updates credits using reduce
*/

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Responsive nav (icon toggle) ----------
    const menuBtn = document.getElementById('menuBtn');
    const menuIcon = document.getElementById('menuIcon');
    const primaryNav = document.getElementById('primaryNav');

    if (menuBtn && primaryNav) {
        menuBtn.addEventListener('click', () => {
            const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
            const ul = primaryNav.querySelector('ul');

            menuBtn.setAttribute('aria-expanded', String(!expanded));
            if (menuIcon) {
                menuIcon.textContent = expanded ? '☰' : '✕';
            }
            menuBtn.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

            if (ul) {
                if (expanded) {
                    ul.style.display = 'none';
                } else {
                    ul.style.display = 'flex';
                    ul.style.flexDirection = 'column';
                }
            }
        });

        const initialUl = primaryNav.querySelector('ul');
        if (initialUl) {
            if (window.getComputedStyle(initialUl).display !== 'flex') {
                initialUl.style.display = 'none';
            }
        }
        if (menuIcon) {
            menuIcon.textContent = '☰';
        }
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open navigation');
    }

    // ---------- Year and Last Modified ----------
    const yearSpan = document.getElementById('currentyear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const lastModSpan = document.getElementById('lastModified');
    if (lastModSpan) lastModSpan.textContent = 'Last Modified: ' + document.lastModified;

    // ---------- Courses array ----------
    const courses = [
        {
            subject: 'CSE',
            number: 110,
            title: 'Introduction to Programming',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
            technology: ['Python'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 130,
            title: 'Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
            technology: ['HTML', 'CSS'],
            completed: true
        },
        {
            subject: 'CSE',
            number: 111,
            title: 'Programming with Functions',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
            technology: ['Python'],
            completed: false
        },
        {
            subject: 'CSE',
            number: 210,
            title: 'Programming with Classes',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
            technology: ['C#'],
            completed: false
        },
        {
            subject: 'WDD',
            number: 131,
            title: 'Dynamic Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 231,
            title: 'Frontend Web Development I',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: false
        }
    ];

    // ---------- DOM references ----------
    const listAll = document.getElementById('listAll');
    const listCSE = document.getElementById('listCSE');
    const listWDD = document.getElementById('listWDD');
    const creditsNumber = document.getElementById('creditsNumber');

    const btnAll = document.getElementById('filterAll');
    const btnCSE = document.getElementById('filterCSE');
    const btnWDD = document.getElementById('filterWDD');

    const colAll = document.getElementById('colAll');
    const colCSE = document.getElementById('colCSE');
    const colWDD = document.getElementById('colWDD');

    // ---------- Modal reference ----------
    const courseDetails = document.getElementById("course-details");

    // ---------- Helper functions ----------
    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    // CREATE THE COURSE ITEM + MODAL CLICK EVENT
    function createCourseItem(course) {
        const div = document.createElement('div');
        div.className = 'course-item' + (course.completed ? ' completed' : '');
        const code = `${course.subject} ${course.number}`;
        div.innerHTML = `<strong>${code}</strong> — ${escapeHtml(course.title)} <span class="meta">(${course.credits} cr)</span>`;

        // 🔥 Add modal trigger here
        div.addEventListener('click', () => {
            displayCourseDetails(course);
        });

        return div;
    }

    // ---------- Modal function ----------
    function displayCourseDetails(course) {
        courseDetails.innerHTML = `
            <button id="closeModal">❌</button>
            <h2>${course.subject} ${course.number}</h2>
            <h3>${course.title}</h3>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <p><strong>Certificate:</strong> ${course.certificate}</p>
            <p>${course.description}</p>
            <p><strong>Technologies:</strong> ${course.technology.join(", ")}</p>
        `;

        courseDetails.showModal();

        const closeBtn = document.getElementById("closeModal");
        closeBtn.addEventListener("click", () => {
            courseDetails.close();
        });

        // close if clicking outside dialog
        courseDetails.addEventListener("click", (event) => {
            const rect = courseDetails.getBoundingClientRect();
            if (
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom
            ) {
                courseDetails.close();
            }
        });
    }

    // ---------- Render columns ----------
    function renderAllColumns() {
        if (listAll) {
            listAll.innerHTML = '';
            courses.forEach(c => listAll.appendChild(createCourseItem(c)));
        }
        if (listCSE) {
            listCSE.innerHTML = '';
            courses.filter(c => c.subject === 'CSE').forEach(c => listCSE.appendChild(createCourseItem(c)));
        }
        if (listWDD) {
            listWDD.innerHTML = '';
            courses.filter(c => c.subject === 'WDD').forEach(c => listWDD.appendChild(createCourseItem(c)));
        }
    }

    // ---------- Credits ----------
    function calcCreditsFor(filter) {
        let filtered = courses.slice();
        if (filter === 'CSE') filtered = filtered.filter(c => c.subject === 'CSE');
        if (filter === 'WDD') filtered = filtered.filter(c => c.subject === 'WDD');
        const total = filtered.reduce((sum, cur) => sum + (cur.credits || 0), 0);
        return total;
    }

    function updateCreditsDisplay(filter) {
        const total = calcCreditsFor(filter);
        if (creditsNumber) {
            creditsNumber.textContent = total;
        }
    }

    // ---------- Filter behavior ----------
    function setActiveFilter(filter) {
        if (colAll) colAll.classList.remove('hidden');
        if (colCSE) colCSE.classList.remove('hidden');
        if (colWDD) colWDD.classList.remove('hidden');

        if (filter === 'ALL') {
            if (colCSE) colCSE.classList.add('hidden');
            if (colWDD) colWDD.classList.add('hidden');
        } else if (filter === 'CSE') {
            if (colAll) colAll.classList.add('hidden');
            if (colWDD) colWDD.classList.add('hidden');
        } else if (filter === 'WDD') {
            if (colAll) colAll.classList.add('hidden');
            if (colCSE) colCSE.classList.add('hidden');
        }

        if (btnAll) btnAll.setAttribute('aria-pressed', filter === 'ALL' ? 'true' : 'false');
        if (btnCSE) btnCSE.setAttribute('aria-pressed', filter === 'CSE' ? 'true' : 'false');
        if (btnWDD) btnWDD.setAttribute('aria-pressed', filter === 'WDD' ? 'true' : 'false');

        [btnAll, btnCSE, btnWDD].forEach(b => b && b.classList.remove('active'));
        if (filter === 'ALL' && btnAll) btnAll.classList.add('active');
        if (filter === 'CSE' && btnCSE) btnCSE.classList.add('active');
        if (filter === 'WDD' && btnWDD) btnWDD.classList.add('active');

        updateCreditsDisplay(filter === 'ALL' ? 'all' : filter);
    }

    // ---------- Initial render ----------
    renderAllColumns();
    setActiveFilter('ALL');

    // ---------- Filter events ----------
    if (btnAll) btnAll.addEventListener('click', () => setActiveFilter('ALL'));
    if (btnCSE) btnCSE.addEventListener('click', () => setActiveFilter('CSE'));
    if (btnWDD) btnWDD.addEventListener('click', () => setActiveFilter('WDD'));

});
