(function() {
    'use strict';

    console.log('[4ernysh Theme Manager] Script loaded successfully!');

    /* ==========================================
       ИНТЕРФЕЙС РАСШИРЕНИЯ (НАДЕЖНЫЙ АККОРДЕОН)
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
            <div class="inline-drawer-content" style="display: none; padding: 10px;">
                <p style="margin: 0 0 10px 0; font-size: 11px;">Управление темами и скриптами от черныша :3</p>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button id="ernysh_check_btn" class="menu_button">Проверить статус!</button>
                    <span id="ernysh_status_label" style="font-size: 11px; color: #52c252;">Статус: Активен (Red cybercore)</span>
                </div>
            </div>
        `;

        extensionsSettings.appendChild(panel);

        const checkBtn = document.getElementById('ernysh_check_btn');
        if (checkBtn) {
            checkBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const statusLabel = document.getElementById('ernysh_status_label');
                if (statusLabel) {
                    statusLabel.innerText = 'ПЕРЕСКАН ВЫПОЛНЕН!';
                }
                if (typeof window.ernyshForceRescan === 'function') {
                    window.ernyshForceRescan();
                }
            });
        }
    }

    // Постоянный мониторинг DOM для появления панели настроек расширений
    const uiObserver = new MutationObserver(() => {
        createExtensionUI();
    });
    uiObserver.observe(document.body, { childList: true, subtree: true });
    
    // Страховка таймером на случай раннего старта
    setTimeout(createExtensionUI, 1000);
    setTimeout(createExtensionUI, 3000);

    /* ==========================================
       ЛОГИКА КНОПОК ЧАТА (Red cybercore)
       ========================================== */
    function initRedCybercoreLogic() {
        console.log('[Red Cybercore] Initializing button restructuring logic...');

        function setupMesActions(messageElement) {
            if (messageElement.dataset.assembled === 'true') return;

            const chName = messageElement.querySelector('.ch_name');
            if (!chName) return;

            const btnHide = chName.querySelector('.mes_hide');
            const btnCheck = chName.querySelector('.mes_create_bookmark');
            const btnTree = chName.querySelector('.mes_create_branch');
            const btnDelete = chName.querySelector('.mes_edit_delete');
            const btnEdit = chName.querySelector('.mes_edit');
            const btnPrev = chName.querySelector('.mes_stmb_start');
            const btnNext = chName.querySelector('.mes_stmb_end');

            const buttonsConfig = [
                { el: btnHide, text: 'hide' },
                { el: btnCheck, text: 'check' },
                { el: btnTree, text: 'tree' },
                { el: btnDelete, text: 'delete' },
                { el: btnEdit, text: 'edit' },
                { el: btnPrev, text: '<' },
                { el: btnNext, text: '>' }
            ];

            let terminalBar = chName.querySelector('.ernysh_terminal_actions');
            if (!terminalBar) {
                terminalBar = document.createElement('div');
                terminalBar.className = 'ernysh_terminal_actions';
                terminalBar.style.cssText = 'display: flex; gap: 6px; align-items: center; flex-wrap: wrap; margin-top: 4px;';
                chName.appendChild(terminalBar);
            }

            terminalBar.innerHTML = '';

            buttonsConfig.forEach(cfg => {
                if (cfg.el) {
                    const oldText = cfg.el.querySelector('.terminal-btn-text');
                    if (oldText) oldText.remove();

                    const span = document.createElement('span');
                    span.className = 'terminal-btn-text';
                    span.style.cssText = 'margin-left: 4px; font-size: 10px; font-family: monospace;';
                    span.innerText = cfg.text;
                    cfg.el.appendChild(span);

                    terminalBar.appendChild(cfg.el);
                }
            });

            messageElement.dataset.assembled = 'true';
        }

        window.ernyshForceRescan = function() {
            console.log('[Red Cybercore] Force-rescan triggered!');
            const messages = document.querySelectorAll('.mes');
            console.log('[Red Cybercore Debug] Найдено блоков .mes:', messages.length);
            
            messages.forEach(messageElement => {
                delete messageElement.dataset.assembled;
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
        
        // Запускаем сканирование с задержками, чтобы чат успел отрендериться
        window.ernyshForceRescan();
        setTimeout(window.ernyshForceRescan, 600);
        setTimeout(window.ernyshForceRescan, 1500);
    }

    // Запускаем логику кнопок сразу при загрузке скрипта
    initRedCybercoreLogic();

})();
