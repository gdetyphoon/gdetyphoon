(() => {
    'use strict';

    // ================= Мобильное меню =================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        menuToggle.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // ================= Элементы Session Manager =================
    const toggleWrap = document.getElementById('identifier-toggle');
    const toggleBtns = toggleWrap.querySelectorAll('.toggle-btn');
    const phoneGroup = document.getElementById('phone-group');
    const usernameGroup = document.getElementById('username-group');
    const phoneInput = document.getElementById('phone-input');
    const usernameInput = document.getElementById('username-input');
    const searchBtn = document.getElementById('search-btn');
    const searchBtnText = searchBtn.querySelector('.btn-text');
    const resultCard = document.getElementById('session-result');
    const infoUsername = document.getElementById('info-username');
    const terminateBtn = document.getElementById('terminate-btn');
    const processPanel = document.getElementById('termination-process');
    const completePanel = document.getElementById('termination-complete');
    const resetBtn = document.getElementById('reset-btn');
    const progressFill = document.getElementById('progress-fill');
    const consoleLines = processPanel.querySelectorAll('.console-line');

    let mode = 'phone';
    let terminating = false;

    // ================= Переключатель PHONE NUMBER / USERNAME =================
    toggleBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (terminating || btn.dataset.type === mode) return;
            mode = btn.dataset.type;
            toggleBtns.forEach((b) => b.classList.toggle('active', b === btn));
            toggleWrap.classList.toggle('username-mode', mode === 'username');
            phoneGroup.classList.toggle('hidden', mode !== 'phone');
            usernameGroup.classList.toggle('hidden', mode !== 'username');
            hideResult();
            (mode === 'phone' ? phoneInput : usernameInput).focus({ preventScroll: true });
        });
    });

    // ================= Маска телефона: +380 XX XXX XX XX =================
    phoneInput.addEventListener('input', () => {
        const d = phoneInput.value.replace(/\D/g, '').slice(0, 9);
        phoneInput.value = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)]
            .filter(Boolean).join(' ');
        phoneInput.closest('.input-wrapper').classList.remove('error');
    });

    usernameInput.addEventListener('input', () => {
        usernameInput.value = usernameInput.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 32);
        usernameInput.closest('.input-wrapper').classList.remove('error');
    });

    function hideResult() {
        resultCard.classList.add('hidden');
        processPanel.classList.add('hidden');
        completePanel.classList.add('hidden');
        progressFill.style.width = '0%';
    }
    // ================= Демо-поиск сессии =================
    searchBtn.addEventListener('click', () => {
        if (terminating) return;
        const activeInput = mode === 'phone' ? phoneInput : usernameInput;
        const wrapper = activeInput.closest('.input-wrapper');
        const value = activeInput.value.trim();
        const valid = mode === 'phone'
            ? value.replace(/\D/g, '').length === 9
            : value.length >= 3;

        if (!valid) {
            wrapper.classList.remove('error');
            void wrapper.offsetWidth; // перезапуск shake-анимации
            wrapper.classList.add('error');
            activeInput.focus({ preventScroll: true });
            return;
        }

        // Имитация поиска (без реальных запросов)
        searchBtn.disabled = true;
        searchBtnText.textContent = 'Поиск...';
        setTimeout(() => {
            searchBtn.disabled = false;
            searchBtnText.textContent = 'Найти сессию';

            // Демонстрационные данные сессии
            infoUsername.textContent = mode === 'username' ? '@' + value : '@example';
            completePanel.classList.add('hidden');
            processPanel.classList.add('hidden');
            resultCard.classList.remove('hidden');
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 600);
    });

    // ================= TERMINATE — только визуальная анимация =================
    const STEPS = [
        { duration: 1100 },
        { duration: 1200 },
        { duration: 1300 }
    ];

    terminateBtn.addEventListener('click', () => {
        if (terminating) return;
        terminating = true;
        terminateBtn.disabled = true;

        resultCard.classList.add('hidden');
        completePanel.classList.add('hidden');
        processPanel.classList.remove('hidden');

        consoleLines.forEach((line) => {
            line.classList.remove('active', 'done');
            line.querySelector('.console-status').textContent = '';
        });
        progressFill.style.width = '0%';

        let delay = 400;
        STEPS.forEach((step, i) => {
            const line = consoleLines[i];
            setTimeout(() => {
                line.classList.add('active');
                progressFill.style.width =
                    Math.round(((i + 0.5) / STEPS.length) * 100) + '%';
            }, delay);
            delay += step.duration;
            setTimeout(() => {
                line.classList.remove('active');
                line.classList.add('done');
            }, delay);
        });

        setTimeout(() => { progressFill.style.width = '100%'; }, delay - 250);

        setTimeout(() => {
            processPanel.classList.add('hidden');
            completePanel.classList.remove('hidden');
            terminating = false;
            terminateBtn.disabled = false;
            completePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, delay + 400);
    });

    // ================= Сброс =================
    resetBtn.addEventListener('click', () => {
        hideResult();
        phoneInput.value = '';
        usernameInput.value = '';
        (mode === 'phone' ? phoneInput : usernameInput).focus({ preventScroll: true });
    });
})();