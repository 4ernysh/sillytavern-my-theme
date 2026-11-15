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

    // Честная проверка: активна ли тема (без ложных срабатываний по сообщениям)
    function getActiveThemeIndex() {
        const themeSelect = document.getElementById('themes');
        if (!themeSelect) return -1;

        // Получаем текст выбранной опции (например, "4ernysh Red cybercore theme")
        const selectedOption = themeSelect.options[themeSelect.selectedIndex];
        const themeText = selectedOption ? selectedOption.text.toLowerCase() : '';
        const themeVal = themeSelect.value.toLowerCase();

        for (let i = 0; i < themesRegistry.length; i++) {
            const themeId = themesRegistry[i].id.toLowerCase();
            const themeName = themesRegistry[i].name.toLowerCase();

            // Если в тексте или значении селекта есть наше имя — тема активна!
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
        
        // Используем .inline-drawer-icon — Таверна сама ожидает этот класс для анимации стрелочки
        panel.innerHTML = `
            <div class="inline-drawer-toggle inline-drawer-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span><b>[ 4ernysh Theme Manager ]</b></span>
                <i class="fa-solid fa-chevron-down inline-drawer-icon"></i>
            </div>
            <div class="inline-drawer-content" style="display: none;">
                <p style="margin: 0 0 10px 0; font-size: 11px;">Управление темами и скриптами от черныша :3</p>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button id="ernysh_check_btn" class="menu_button"> Проверить статус!</button>
                    <span id="ernysh_status_label" style="font-size: 11px;">Статус: не проверено D:</span>
                </div>
            </div>
        `;

        extensionsSettings.appendChild(panel);

        // Кнопка проверки статуса (клик не должен вызывать багов с аккордеоном)
        document.getElementById('ernysh_check_btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const activeIdx = getActiveThemeIndex();
            const statusLabel = document.getElementById('ernysh_status_label');

            if (activeIdx !== -1 && themesRegistry[activeIdx]) {
                statusLabel.innerText = `АКТИВНА (${themesRegistry[activeIdx].name}) [Индекс: ${activeIdx}]`;
                statusLabel.style.color = '#52c252';
            } else {
                statusLabel.innerText = 'НЕ ВКЛЮЧЕНА (Темы не найдены!)';
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

            // 1. Находим родные кнопки Силли Таверны внутри сообщения
            const btnHide = messageElement.querySelector('.mes_hide');
            const btnCheck = messageElement.querySelector('.mes_create_bookmark');
            const btnTree = messageElement.querySelector('.mes_create_branch');
            const btnDelete = messageElement.querySelector('.mes_edit_delete');
            const btnEdit = messageElement.querySelector('.mes_edit');
            const btnPrev = messageElement.querySelector('.mes_stmb_start');
            const btnNext = messageElement.querySelector('.mes_stmb_end');

            // 2. Настраиваем нашу терминальную конфигурацию
            const buttonsConfig = [
                { el: btnHide, text: 'hide' },
                { el: btnCheck, text: 'check' },
                { el: btnTree, text: 'tree' },
                { el: btnDelete, text: 'delete' },
                { el: btnEdit, text: 'edit' },
                { el: btnPrev, text: '<' },
                { el: btnNext, text: '>' }
            ];

            // 3. Очищаем стандартный контейнер действий
            actionsBar.innerHTML = '';

            // 4. Переносим кнопки и стилизуем их под киберпанк-терминал
            buttonsConfig.forEach(cfg => {
                if (cfg.el) {
                    // Убираем старый текст, если скрипт сработал повторно
                    const oldText = cfg.el.querySelector('.terminal-btn-text');
                    if (oldText) oldText.remove();

                    const span = document.createElement('span');
                    span.className = 'terminal-btn-text';
                    span.innerText = cfg.text;
                    cfg.el.appendChild(span);

                    actionsBar.appendChild(cfg.el);
                }
            });

            // 5. Ставим флаг, что этот блок мы уже собрали
            actionsBar.dataset.assembled = 'true';
        }

        // Наблюдатель следит за чатом: как только подгружается новое сообщение — перестраиваем его кнопки
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

        // Сразу обрабатываем все сообщения, которые уже есть на экране
        document.querySelectorAll('.mes').forEach(setupMesActions);
    }
