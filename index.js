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

    function getContextSafe() {
        const getContext = window?.SillyTavern?.getContext;
        return typeof getContext === 'function' ? getContext() : null;
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
                themesRegistry[activeIdx].apply();
            } else {
                statusLabel.innerText = 'НЕ ВКЛЮЧЕНА (Выбрана другая тема)';
                statusLabel.style.color = '#c25252';
            }
        });
    }

    /* ==========================================
       ЛОГИКА ТЕМЫ ИНДЕКС 0 (Red cybercore)
       ========================================== */
    async function initRedCybercoreLogic() {
        console.log('[Red Cybercore] Initializing clean terminal theme & importing external module...');

        const MONTHS_GENITIVE = {
            'января': '01',
            'февраля': '02',
            'марта': '03',
            'апреля': '04',
            'мая': '05',
            'июня': '06',
            'июля': '07',
            'августа': '08',
            'сентября': '09',
            'октября': '10',
            'ноября': '11',
            'декабря': '12',
        };

        function pad2(n) {
            return String(n).padStart(2, '0');
        }

        function formatTimestampText(rawText) {
            // Ищем: день, месяц в родительном падеже, год, часы:минуты
            const match = rawText.trim().match(
                /(\d{1,2})\s+([а-яё]+)\s+(\d{4})\s*(?:г\.?)?\s*(\d{1,2}):(\d{2})/i
            );

            if (!match) return null;

            const day = pad2(match[1]);
            const monthName = match[2].toLowerCase();
            const year = match[3];
            const hours = pad2(match[4]);
            const minutes = pad2(match[5]);

            const month = MONTHS_GENITIVE[monthName];
            if (!month) return null;

            return `${day}.${month}.${year} ${hours}:${minutes}`;
        }

        function updateTimestamps() {
            document.querySelectorAll('#sheld #chat .mes .timestamp').forEach((el) => {
                // Берём только текстовые узлы самого .timestamp, чтобы не затереть вложенные элементы/псевдоэлементы
                const textNode = Array.from(el.childNodes).find(
                    (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()
                );

                if (!textNode) return;

                const formatted = formatTimestampText(textNode.nodeValue);
                if (formatted) {
                    textNode.nodeValue = formatted;
                }
            });
        }

        updateTimestamps();

        function updateVrDatesForAllMessages() {
            const messages = document.querySelectorAll('#sheld #chat .mes:not([is_user="true"])');

            messages.forEach((mesEl) => {
                const firstP = mesEl.querySelector('.mes_block .mes_text p');
                const timestampEl = mesEl.querySelector('.timestamp');
                if (!timestampEl) return;

                let vrValue = 'VR: Unknown';

                if (firstP) {
                    const paragraphText = firstP.innerText.trim();
                    const match = paragraphText.match(/\b(\d{2}\.\d{2}\.\d{4})\b/);
                    if (match) {
                        vrValue = `VR: ${match[1]}`;
                    }
                }

                let vrTag = mesEl.querySelector('.vr-date-tag');

                if (!vrTag) {
                    vrTag = document.createElement('span');
                    vrTag.className = 'vr-date-tag';
                    timestampEl.after(vrTag);
                }

                vrTag.textContent = vrValue;

                // Стили прямо из JS (с поддержкой !important через setProperty)
                const styles = {
                    'position': 'absolute',
                    'bottom': '0',
                    'height': '20px',
                    'line-height': '20px',
                    'white-space': 'nowrap',
                    'font-weight': 'normal',
                    'color': '#8e3b3c',
                    'font-size': '11px',
                    'z-index': '2',
                    'pointer-events': 'none',
                    'background': 'transparent',
                    'box-shadow': 'none',
                    'margin': '0',
                    'padding': '0'
                };

                for (const [prop, val] of Object.entries(styles)) {
                    vrTag.style.setProperty(prop, val, 'important');
                }
            });
        }

        updateVrDatesForAllMessages();
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
