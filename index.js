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

    function getActiveThemeIndex() {
        const savedTheme = localStorage.getItem('selected_theme') || localStorage.getItem('theme') || '';
        const customName = localStorage.getItem('current_theme_name') || '';

        for (let i = 0; i < themesRegistry.length; i++) {
            if (savedTheme.toLowerCase().includes('4ernysh') || 
                customName.toLowerCase().includes('4ernysh') ||
                document.querySelector('.mes') !== null) {
                return i;
            }
        }
        return -1;
    }

    /* ==========================================
       СОЗДАНИЕ ВЫПАДАЮЩЕГО БЛОКА (АККОРДЕОНА)
       В СТИЛЕ РОДНЫХ РАСШИРЕНИЙ СИЛЛИ ТАВЕРНЫ
       ========================================== */
    function createExtensionUI() {
        if (document.getElementById('ernysh_theme_manager_settings')) return;

        const extensionsSettings = document.getElementById('extensions_settings');
        if (!extensionsSettings) return;

        // Создаем контейнер в стиле родных элементов расширений
        const panel = document.createElement('div');
        panel.id = 'ernysh_theme_manager_settings';
        panel.className = 'inline-drawer'; // Родной класс Таверны для блоков
        panel.style.cssText = 'border: 1px solid #a10000; background: #0b0204; margin-bottom: 10px; border-radius: 4px; overflow: hidden;';
        
        panel.innerHTML = `
            <div id="ernysh_drawer_header" class="inline-drawer-toggle inline-drawer-header" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #130306; cursor: pointer; border-bottom: 1px solid #a10000; font-family: monospace; color: #e7abb5;">
                <span><b>[ 4ernysh Theme Manager ]</b></span>
                <i class="fa-solid fa-chevron-down inline-drawer-icon" style="transition: transform 0.2s;"></i>
            </div>
            <div id="ernysh_drawer_content" class="inline-drawer-content" style="display: none; padding: 12px; font-family: monospace; color: #e7abb5;">
                <p style="margin: 0 0 10px 0; font-size: 11px; color: #c25252;">Управление киберпанк-темами и скриптами.</p>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button id="ernysh_check_btn" style="background: #2b080c; color: #e7abb5; border: 1px solid #a10000; padding: 6px 12px; cursor: pointer; font-family: monospace; border-radius: 3px;">Проверить статус</button>
                    <span id="ernysh_status_label" style="font-size: 11px;">Статус: не проверено</span>
                </div>
            </div>
        `;

        extensionsSettings.appendChild(panel);

        // Логика сворачивания/разворачивания по клику на заголовок
        const header = document.getElementById('ernysh_drawer_header');
        const content = document.getElementById('ernysh_drawer_content');
        const icon = header.querySelector('.inline-drawer-icon');

        header.addEventListener('click', () => {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
            header.style.borderBottom = isHidden ? '1px solid #a10000' : 'none';
        });

        // Логика кнопки проверки статуса
        document.getElementById('ernysh_check_btn').addEventListener('click', (e) => {
            e.stopPropagation(); // Чтобы клик не сворачивал блок
            const activeIdx = getActiveThemeIndex();
            const statusLabel = document.getElementById('ernysh_status_label');

            if (activeIdx !== -1 && themesRegistry[activeIdx]) {
                statusLabel.innerText = `АКТИВНА (${themesRegistry[activeIdx].name}) [Индекс: ${activeIdx}]`;
                statusLabel.style.color = '#52c252';
            } else {
                statusLabel.innerText = 'НЕ ВКЛЮЧЕНА (Тема 4ernysh не найдена)';
                statusLabel.style.color = '#c25252';
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

    // Инициализация
    setTimeout(createExtensionUI, 1500);

    const activeIndex = getActiveThemeIndex();
    if (activeIndex !== -1 && themesRegistry[activeIndex]) {
        themesRegistry[activeIndex].apply();
    }
})();
