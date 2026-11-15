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
        console.log('[Red Cybercore] Initializing universal button harvester...');

        // Стили для терминальной панели и скрытия старых контейнеров
        if (!document.getElementById('ernysh_cybercore_styles')) {
            const style = document.createElement('style');
            style.id = 'ernysh_cybercore_styles';
            style.innerHTML = `
                .ernysh_terminal_bar {
                    display: flex !important;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 6px;
                    margin-top: 4px;
                }
                .ernysh_terminal_bar .menu_button,
                .ernysh_terminal_bar div,
                .ernysh_terminal_bar span {
                    display: inline-flex !important;
                    align-items: center;
                    pointer-events: auto !important;
                    opacity: 1 !important;
                }
                /* Прячем старые пустые обертки и меню */
                .ch_name .extraMesButtons,
                .ch_name .extra_buttons,
                .ch_name .mes_extra_buttons_wrapper,
                .ch_name .mes_edit_buttons,
                .ch_name .extra_buttons_ap {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }

        function setupMesActions(messageElement) {
            const chName = messageElement.querySelector('.ch_name');
            if (!chName) return;

            const mesButtons = chName.querySelector('.mes_buttons');
            if (!mesButtons) return;

            let terminalBar = mesButtons.querySelector('.ernysh_terminal_bar');
            if (!terminalBar) {
                terminalBar = document.createElement('div');
                terminalBar.className = 'ernysh_terminal_bar';
                mesButtons.appendChild(terminalBar);
            }

            // Собираем абсолютно все потенциальные элементы кнопок из всех возможных путей в сообщении
            const rawButtons = messageElement.querySelectorAll(
                '.mes_buttons .menu_button, .mes_buttons div, .extraMesButtons div, .extraMesButtons button, .mes_edit_buttons div, .mes_edit_buttons button, .mes_edit, .mes_hide, .mes_create_bookmark, .mes_create_branch, .mes_copy, .mes_edit_delete'
            );

            rawButtons.forEach(btn => {
                if (terminalBar.contains(btn) || btn.classList.contains('ernysh_terminal_bar')) return;

                let text = '';
                let isDelete = false;
                const cls = btn.className || '';

                // Распознаем тип кнопки по классам или вложенным иконкам FontAwesome
                if (cls.includes('mes_hide') || cls.includes('mes_block') || btn.querySelector('.fa-eye-slash')) {
                    text = 'hide';
                } else if (cls.includes('mes_create_bookmark') || cls.includes('bookmark') || btn.querySelector('.fa-bookmark')) {
                    text = 'check';
                } else if (cls.includes('mes_create_branch') || cls.includes('branch') || btn.querySelector('.fa-code-branch')) {
                    text = 'tree';
                } else if (cls.includes('mes_copy') || cls.includes('copy') || btn.querySelector('.fa-copy')) {
                    text = 'copy';
                } else if (cls.includes('mes_edit_delete') || cls.includes('mes_del') || btn.querySelector('.fa-trash')) {
                    text = 'delete';
                    isDelete = true;
                } else if (cls.includes('mes_edit') || cls.includes('edit') || btn.querySelector('.fa-pen') || btn.querySelector('.fa-pencil')) {
                    text = 'edit';
                } else if (cls.includes('mes_stmb_start') || btn.querySelector('.fa-chevron-left')) {
                    text = '<';
                } else if (cls.includes('mes_stmb_end') || btn.querySelector('.fa-chevron-right')) {
                    text = '>';
                }

                if (text) {
                    // Проверяем, чтобы текст не дублировался при повторном сканировании
                    if (!btn.querySelector('.terminal-btn-text')) {
                        const span = document.createElement('span');
                        span.className = 'terminal-btn-text';
                        span.style.cssText = 'margin-left: 4px; font-size: 10px; font-family: monospace;';
                        span.innerText = text;
                        btn.appendChild(span);
                    }

                    btn.style.display = 'inline-flex';
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';

                    // Обработка удаления через STscript для мгновенного эффекта
                    if (isDelete) {
                        btn.onclick = (e) => {
                            e.stopPropagation();
                            const mesId = messageElement.getAttribute('mesid');
                            if (mesId !== null && typeof SlashCommandParser !== 'undefined' && SlashCommandParser.parse) {
                                SlashCommandParser.parse(`/delete ${mesId}`);
                            } else {
                                btn.click();
                            }
                        };
                    }

                    terminalBar.appendChild(btn);
                }
            });
        }

        window.ernyshForceRescan = function() {
            console.log('[Red Cybercore] Universal harvester force-rescan triggered!');
            const messages = document.querySelectorAll('.mes');
            messages.forEach(messageElement => {
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
        
        setTimeout(() => {
            window.ernyshForceRescan();
        }, 500);
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
