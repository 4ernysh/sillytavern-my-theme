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
        console.log('[Red Cybercore] Initializing pure CSS flex order layout (no DOM manipulation errors)...');

        // Инъецируем стили, которые делают все кнопки видимыми, убирают троеточие и расставляют порядок
        if (!document.getElementById('ernysh_cybercore_styles')) {
            const style = document.createElement('style');
            style.id = 'ernysh_cybercore_styles';
            style.innerHTML = `
                /* Превращаем блок имени в гибкий контейнер */
                .ch_name {
                    display: flex !important;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 6px;
                }

                /* Раскрываем контейнеры скрытых/дополнительных кнопок (троеточие) */
                .ch_name .extra_buttons,
                .ch_name .mes_extra_buttons_wrapper,
                .ch_name .menu_button_container {
                    display: flex !important;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 6px;
                    background: transparent !important;
                    box-shadow: none !important;
                    border: none !important;
                    padding: 0 !important;
                }

                /* Скрываем саму иконку троеточия / меню выпадашки */
                .ch_name .extra_buttons_ap,
                .ch_name .fa-ellipsis-v,
                .ch_name .fa-ellipsis-h {
                    display: none !important;
                }
                
                /* Принудительно показываем и делаем интерактивными все кнопки */
                .ch_name .menu_button,
                .ch_name .mes_hide,
                .ch_name .mes_create_bookmark,
                .ch_name .mes_create_branch,
                .ch_name .mes_copy,
                .ch_name .mes_edit_delete,
                .ch_name .mes_edit,
                .ch_name .mes_stmb_start,
                .ch_name .mes_stmb_end {
                    display: inline-flex !important;
                    align-items: center;
                    pointer-events: auto !important;
                    opacity: 1 !important;
                }

                /* Настраиваем точный порядок элементов через CSS order */
                .ch_name .mes_hide { order: 1; }
                .ch_name .mes_create_bookmark { order: 2; }
                .ch_name .mes_create_branch { order: 3; }
                .ch_name .mes_copy { order: 4; }
                .ch_name .mes_edit_delete { order: 5; }
                .ch_name .mes_edit { order: 6; }
                .ch_name .mes_stmb_start { order: 7; }
                .ch_name .mes_stmb_end { order: 8; }

                /* Добавляем терминальный текст к кнопкам через псевдоэлементы */
                .ch_name .mes_hide::after { content: ' hide'; font-family: monospace; font-size: 10px; margin-left: 3px; }
                .ch_name .mes_create_bookmark::after { content: ' check'; font-family: monospace; font-size: 10px; margin-left: 3px; }
                .ch_name .mes_create_branch::after { content: ' tree'; font-family: monospace; font-size: 10px; margin-left: 3px; }
                .ch_name .mes_copy::after { content: ' copy'; font-family: monospace; font-size: 10px; margin-left: 3px; }
                .ch_name .mes_edit_delete::after { content: ' delete'; font-family: monospace; font-size: 10px; margin-left: 3px; }
                .ch_name .mes_edit::after { content: ' edit'; font-family: monospace; font-size: 10px; margin-left: 3px; }
            `;
            document.head.appendChild(style);
        }

        window.ernyshForceRescan = function() {
            console.log('[Red Cybercore] Force-rescan triggered (CSS only)!');
        };
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
        e.target && e.target.id === 'themes' && getActiveThemeIndex() !== -1 && themesRegistry[getActiveThemeIndex()].apply();
    });
})();
