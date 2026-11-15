(function() {
    'use strict';

    /* ==========================================
       РЕЕСТР ТЕМ ОТ 4ERNYSH
       ========================================== */
    const themesRegistry = [
        {
            id: 'red_cybercore',
            name: '4ernysh Red cybercore theme',
            apply: function() {
                initRedCybercoreLogic();
            }
        }
    ];

    function getActiveThemeIndex() {
        const themeSelect = document.getElementById('themes');
        if (!themeSelect) return -1;

        const selectedOption = themeSelect.options[themeSelect.selectedIndex];
        const themeText = selectedOption ? selectedOption.text.toLowerCase() : '';
        const themeVal = themeSelect.value.toLowerCase();

        for (let i = 0; i < themesRegistry.length; i++) {
            const themeId = themesRegistry[i].id.toLowerCase();

            if (themeText.includes('4ernysh') || themeText.includes(themeId) ||
                themeVal.includes('4ernysh') || themeVal.includes(themeId)) {
                return i;
            }
        }
        return -1;
    }

    /* ==========================================
       ИНТЕРФЕЙС РАСШИРЕНИЯ (НАТИВНЫЙ АККОРДЕОН)
       ========================================== */
    function createExtensionUI() {
        if (document.getElementById('ernysh_theme_manager_settings')) return;

        const extensionsSettings = document.getElementById('extensions_settings') || document.querySelector('.extensions_settings');
        if (!extensionsSettings) return;

        const panel = document.createElement('div');
        panel.id = 'ernysh_theme_manager_settings';
        panel.className = 'inline-drawer';
        panel.style.cssText = 'margin-bottom: 10px; border-radius: 4px; overflow: hidden;';
        
        panel.innerHTML = `
            <div class="inline-drawer-toggle inline-drawer-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span><b>[ 4ernysh Theme Manager ]</b></span>
                <i class="fa-solid fa-chevron-down inline-drawer-icon"></i>
            </div>
            <div class="inline-drawer-content" style="display: none;">
                <p style="margin: 0 0 10px 0; font-size: 11px;">Управление темами и скриптами от черныша :3</p>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button id="ernysh_check_btn" class="menu_button">Проверить статус!</button>
                    <span id="ernysh_status_label" style="font-size: 11px;">Статус: не проверено D:</span>
                </div>
            </div>
        `;

        extensionsSettings.appendChild(panel);

        document.getElementById('ernysh_check_btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const activeIdx = getActiveThemeIndex();
            const statusLabel = document.getElementById('ernysh_status_label');

            if (activeIdx !== -1 && themesRegistry[activeIdx]) {
                statusLabel.innerText = `АКТИВНА (${themesRegistry[activeIdx].name}) [Индекс: ${activeIdx}]`;
                statusLabel.style.color = '#52c252';

                if (typeof window.ernyshForceRescan === 'function') {
                    window.ernyshForceRescan();
                } else {
                    themesRegistry[activeIdx].apply();
                }
            } else {
                statusLabel.innerText = 'НЕ ВКЛЮЧЕНА (Выбрана другая тема)';
                statusLabel.style.color = '#c25252';
            }
        });
    }

    /* ==========================================
       ЛОГИКА ТЕМЫ ИНДЕКС 0 (Red cybercore)
       ========================================== */
    function initRedCybercoreLogic() {
        console.log('[Red Cybercore] Initializing button restructuring logic...');

        function setupMesActions(messageElement) {
            const actionsBar = messageElement.querySelector('.mes_actions');
            if (!actionsBar || actionsBar.dataset.assembled === 'true') return;

            const btnHide = messageElement.querySelector('.mes_hide');
            const btnCheck = messageElement.querySelector('.mes_create_bookmark');
            const btnTree = messageElement.querySelector('.mes_create_branch');
            const btnDelete = messageElement.querySelector('.mes_edit_delete');
            const btnEdit = messageElement.querySelector('.mes_edit');
            const btnPrev = messageElement.querySelector('.mes_stmb_start');
            const btnNext = messageElement.querySelector('.mes_stmb_end');

            // --- ДЕБАГ ЛОГИ ДЛЯ ПРОВЕРКИ КНОПОК ---
            console.log('[Red Cybercore Debug] === АНАЛИЗ ПАНЕЛИ СООБЩЕНИЯ ===');
            console.log('[Red Cybercore Debug] actionsBar HTML:', actionsBar.innerHTML);
            console.log('[Red Cybercore Debug] btnHide (.mes_hide):', !!btnHide, btnHide);
            console.log('[Red Cybercore Debug] btnCheck (.mes_create_bookmark):', !!btnCheck, btnCheck);
            console.log('[Red Cybercore Debug] btnTree (.mes_create_branch):', !!btnTree, btnTree);
            console.log('[Red Cybercore Debug] btnDelete (.mes_edit_delete):', !!btnDelete, btnDelete);
            console.log('[Red Cybercore Debug] btnEdit (.mes_edit):', !!btnEdit, btnEdit);
            console.log('[Red Cybercore Debug] btnPrev (.mes_stmb_start):', !!btnPrev, btnPrev);
            console.log('[Red Cybercore Debug] btnNext (.mes_stmb_end):', !!btnNext, btnNext);
            console.log('[Red Cybercore Debug] ================================');
            // ------------------------------------

            const buttonsConfig = [
                { el: btnHide, text: 'hide' },
                { el: btnCheck, text: 'check' },
                { el: btnTree, text: 'tree' },
                { el: btnDelete, text: 'delete' },
                { el: btnEdit, text: 'edit' },
                { el: btnPrev, text: '<' },
                { el: btnNext, text: '>' }
            ];

            actionsBar.innerHTML = '';

            buttonsConfig.forEach(cfg => {
                if (cfg.el) {
                    const oldText = cfg.el.querySelector('.terminal-btn-text');
                    if (oldText) oldText.remove();

                    const span = document.createElement('span');
                    span.className = 'terminal-btn-text';
                    span.innerText = cfg.text;
                    cfg.el.appendChild(span);

                    actionsBar.appendChild(cfg.el);
                }
            });

            actionsBar.dataset.assembled = 'true';
        }

        window.ernyshForceRescan = function() {
            console.log('[Red Cybercore] Force-rescan triggered!');
            document.querySelectorAll('.mes').forEach(messageElement => {
                const actionsBar = messageElement.querySelector('.mes_actions');
                if (actionsBar) {
                    delete actionsBar.dataset.assembled;
                }
                setupMesActions(messageElement);
            });
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.matches('.mes')) setupMesActions(node);
                        node.querySelectorAll('.mes').forEach(setupMesActions);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        window.ernyshForceRescan();
    }

    // Авто-инициализация UI панели расширений
    const uiObserver = new MutationObserver((mutations, obs) => {
        const extensionsSettings = document.getElementById('extensions_settings') || document.querySelector('.extensions_settings');
        if (extensionsSettings) {
            createExtensionUI();
            obs.disconnect();
        }
    });
    uiObserver.observe(document.body, { childList: true, subtree: true });

    setTimeout(createExtensionUI, 1000);

    // Инициализатор темы при появлении #themes
    const themeCheckObserver = new MutationObserver((mutations, obs) => {
        const activeIdx = getActiveThemeIndex();
        if (activeIdx !== -1 && themesRegistry[activeIdx]) {
            themesRegistry[activeIdx].apply();
            obs.disconnect();
        }
    });
    themeCheckObserver.observe(document.body, { childList: true, subtree: true });

    const immediateIdx = getActiveThemeIndex();
    if (immediateIdx !== -1 && themesRegistry[immediateIdx]) {
        themesRegistry[immediateIdx].apply();
        themeCheckObserver.disconnect();
    }

    document.addEventListener('change', (e) => {
        if (e.target && e.target.id === 'themes') {
            const activeIdx = getActiveThemeIndex();
            if (activeIdx !== -1 && themesRegistry[activeIdx]) {
                themesRegistry[activeIdx].apply();
            }
        }
    });
})();
