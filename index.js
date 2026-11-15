/* ==========================================
       ЛОГИКА ТЕМЫ ИНДЕКС 0 (Red cybercore)
       ========================================== */
    async function initRedCybercoreLogic() {
        console.log('[Red Cybercore] Initializing clean terminal theme & importing external module...');

        // Подключаем отдельный файл без копипаста
        try {
            await import('./delete-mes-FROM-delete-and-resend.js');
        } catch (error) {
            console.error('[Red Cybercore] Failed to load external delete module:', error);
        }

        // Инъецируем стили только для панели действий (.mes_buttons и .extraMesButtons)
        if (!document.getElementById('ernysh_cybercore_styles')) {
            const style = document.createElement('style');
            style.id = 'ernysh_cybercore_styles';
            style.innerHTML = `
                /* Превращаем панель кнопок в единый гибкий ряд */
                .ch_name .mes_buttons {
                    display: flex !important;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 6px;
                }

                /* Раскрываем контейнер скрытых кнопок (троеточие) в общий ряд */
                .ch_name .extraMesButtons {
                    display: flex !important;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 6px;
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                }

                /* Скрываем иконку троеточия */
                .ch_name .extra_buttons_ap,
                .ch_name .fa-ellipsis-v,
                .ch_name .fa-ellipsis-h {
                    display: none !important;
                }

                /* Видимость нужных кнопок (панель редактирования .mes_edit_buttons вообще не трогаем) */
                .ch_name .mes_hide,
                .ch_name .mes_create_bookmark,
                .ch_name .mes_create_branch,
                .ch_name .mes_copy,
                .ch_name .mes_edit,
                .ch_name .mes_stmb_start,
                .ch_name .mes_stmb_end {
                    display: inline-flex !important;
                    align-items: center;
                    pointer-events: auto !important;
                    opacity: 1 !important;
                }

                /* Порядок кнопок через CSS order */
                .ch_name .mes_hide { order: 1; }
                .ch_name .mes_create_bookmark { order: 2; }
                .ch_name .mes_create_branch { order: 3; }
                .ch_name .mes_copy { order: 4; }
                .ch_name .mes_edit { order: 5; }
                .ch_name .mes_stmb_start { order: 6; }
                .ch_name .mes_stmb_end { order: 7; }

                /* Терминальный текст через псевдоэлементы */
                .ch_name .mes_hide::after { content: ' hide'; font-family: monospace; font-size: 10px; margin-left: 3px; }
                .ch_name .mes_create_bookmark::after { content: ' check'; font-family: monospace; font-size: 10px; margin-left: 3px; }
                .ch_name .mes_create_branch::after { content: ' tree'; font-family: monospace; font-size: 10px; margin-left: 3px; }
                .ch_name .mes_copy::after { content: ' copy'; font-family: monospace; font-size: 10px; margin-left: 3px; }
                .ch_name .mes_edit::after { content: ' edit'; font-family: monospace; font-size: 10px; margin-left: 3px; }
            `;
            document.head.appendChild(style);
        }
    }
