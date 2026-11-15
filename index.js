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
                console.log('[4ernysh Manager] Loading theme [0]: 4ernysh Red cybercore theme');
                initRedCybercoreLogic();
            }
        }
        // Сюда потом добавятся новые темы по индексам: 1, 2, 3...
    ];

    // Функция проверки: какая тема сейчас включена
    function getActiveThemeIndex() {
        const savedTheme = localStorage.getItem('selected_theme') || localStorage.getItem('theme') || '';
        const customName = localStorage.getItem('current_theme_name') || '';

        for (let i = 0; i < themesRegistry.length; i++) {
            // Здесь мы проверяем, выбрана ли нужная тема
            // (в будущем сюда можно будет добавить точное сравнение по имени файла темы)
            if (savedTheme.toLowerCase().includes('4ernysh') || 
                customName.toLowerCase().includes('4ernysh') ||
                document.querySelector('.mes') !== null) {
                return i;
            }
        }
        return -1;
    }

    /* ==========================================
       СОЗДАНИЕ ПАНЕЛИ УПРАВЛЕНИЯ В РАСШИРЕНИЯХ
       ========================================== */
    function createExtensionUI() {
        // Проверяем, не создана ли панель уже
        if (document.getElementById('ernysh_theme_manager_settings')) return;

        // Ищем контейнер настроек расширений в Таверне
        const extensionsSettings = document.getElementById('extensions_settings');
        if (!extensionsSettings) return;

        // Создаем наш блок настроек расширения
        const panel = document.createElement('div');
        panel.id = 'ernysh_theme_manager_settings';
        panel.style.cssText = 'border: 2px solid #a10000; background: #0b0204; padding: 12px; margin-bottom: 10px; font-family: monospace; color: #e7abb5;';
        
        panel.innerHTML = `
            <h3 style="margin: 0 0 8px 0; color: #e7abb5; font-size: 14px;">[ 4ernysh Theme Manager ]</h3>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #c25252;">Управление киберпанк-темами и скриптами.</p>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                <button id="ernysh_check_btn" style="background: #2b080c; color: #e7abb5; border: 1px solid #a10000; padding: 4px 8px; cursor: pointer; font-family: monospace;">Проверить статус темы</button>
                <span id="ernysh_status_label" style="font-size: 11px;">Статус: не проверено</span>
            </div>
        `;

        extensionsSettings.appendChild(panel);

        // Вешаем логику на кнопку проверки статуса
        document.getElementById('ernysh_check_btn').addEventListener('click', () => {
            const activeIdx = getActiveThemeIndex();
            const statusLabel = document.getElementById('ernysh_status_label');

            if (activeIdx !== -1 && themesRegistry[activeIdx]) {
                statusLabel.innerText = `Статус: АКТИВНА (${themesRegistry[activeIdx].name}) [Индекс: ${activeIdx}]`;
                statusLabel.style.color = '#52c252'; // Зеленый
            } else {
                statusLabel.innerText = 'Статус: НЕ ВКЛЮЧЕНА (Тема 4ernysh не найдена)';
                statusLabel.style.color = '#c25252'; // Красный
            }
        });
    }

    /* ==========================================
       ЛОГИКА ТЕМЫ ИНДЕКС 0 (Red cybercore)
       ========================================== */
    function initRedCybercoreLogic() {
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
        document.querySelectorAll('.mes').forEach(setupMesActions);
    }

    // ==========================================
    // ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
    // ==========================================
    // Создаем UI в панели расширений Таверны
    setTimeout(createExtensionUI, 1500); // Небольшая задержка, чтобы меню расширений успело отрисоваться

    // Авто-запуск логики темы, если она активна
    const activeIndex = getActiveThemeIndex();
    if (activeIndex !== -1 && themesRegistry[activeIndex]) {
        themesRegistry[activeIndex].apply();
    } else {
        console.log('[4ernysh Manager] No matching 4ernysh theme active. Script skipped.');
    }
})();
