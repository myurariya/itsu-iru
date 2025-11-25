document.addEventListener('DOMContentLoaded', function () {
    const addScheduleButton = document.getElementById('add-schedule');
    const scheduleInputs = document.getElementById('schedule-inputs');
    const outputText = document.getElementById('output-text');
    const backgroundImageInput = document.getElementById('background-image');
    const selectBackgroundButton = document.getElementById('select-background');
    const scheduleOutput = document.getElementById('schedule-output');
    const fontSelector = document.getElementById('font-selector');
    const textColor = document.getElementById('text-color');
    const titleColor = document.getElementById('title-color');
    const notesColor = document.getElementById('notes-color');
    const showMinutes = document.getElementById('show-minutes');
    const hideDate = document.getElementById('hide-date');
    const scheduleTitle = document.getElementById('schedule-title');
    const titleDisplay = document.getElementById('title-display');
    const notes = document.getElementById('notes');
    const notesDisplay = document.getElementById('notes-display');
    const titleStroke = document.getElementById('title-stroke');
    const textStroke = document.getElementById('text-stroke');
    const notesStroke = document.getElementById('notes-stroke');
    const titleStrokeSettings = document.getElementById('title-stroke-settings');
    const textStrokeSettings = document.getElementById('text-stroke-settings');
    const notesStrokeSettings = document.getElementById('notes-stroke-settings');
    const titleStrokeColor = document.getElementById('title-stroke-color');
    const textStrokeColor = document.getElementById('text-stroke-color');
    const notesStrokeColor = document.getElementById('notes-stroke-color');
    const holdHint = document.getElementById('hold-hint');
    const scheduleInputsContainer = document.querySelector('.schedule-inputs-container');

    // 画像の向きの切り替え
    const orientationInputs = document.querySelectorAll('input[name="orientation"]');
    orientationInputs.forEach(input => {
        input.addEventListener('change', function() {
            scheduleOutput.classList.remove('landscape', 'portrait');
            scheduleOutput.classList.add(this.value);
        });
    });

    // 初期状態を設定
    scheduleOutput.classList.add('landscape');

    // タイトルの縁取り設定
    titleStroke.addEventListener('change', function () {
        titleStrokeSettings.style.display = this.checked ? 'block' : 'none';
        updateTitleStroke();
    });

    function updateTitleStroke() {
        if (titleStroke.checked) {
            titleDisplay.classList.add('title-stroke');
            document.documentElement.style.setProperty('--title-stroke-color', titleStrokeColor.value);
        } else {
            titleDisplay.classList.remove('title-stroke');
        }
    }

    titleStrokeColor.addEventListener('change', updateTitleStroke);

    // 本文の縁取り設定
    textStroke.addEventListener('change', function () {
        textStrokeSettings.style.display = this.checked ? 'block' : 'none';
        updateTextStroke();
    });

    function updateTextStroke() {
        if (textStroke.checked) {
            outputText.classList.add('text-stroke');
            document.documentElement.style.setProperty('--text-stroke-color', textStrokeColor.value);
        } else {
            outputText.classList.remove('text-stroke');
        }
    }

    textStrokeColor.addEventListener('change', updateTextStroke);

    // 備考の縁取り設定
    notesStroke.addEventListener('change', function () {
        notesStrokeSettings.style.display = this.checked ? 'block' : 'none';
        updateNotesStroke();
    });

    function updateNotesStroke() {
        if (notesStroke.checked) {
            notesDisplay.classList.add('notes-stroke');
            document.documentElement.style.setProperty('--notes-stroke-color', notesStrokeColor.value);
        } else {
            notesDisplay.classList.remove('notes-stroke');
        }
    }

    notesStrokeColor.addEventListener('change', updateNotesStroke);

    // タイトル変更のイベントリスナー
    scheduleTitle.addEventListener('input', (e) => {
        titleDisplay.textContent = e.target.value;
    });

    // タイトルの文字色変更のイベントリスナー
    titleColor.addEventListener('change', (e) => {
        titleDisplay.style.color = e.target.value;
    });

    // 本文の文字色変更のイベントリスナー
    textColor.addEventListener('change', (e) => {
        outputText.style.color = e.target.value;
    });

    // 備考の文字色変更のイベントリスナー
    notesColor.addEventListener('change', (e) => {
        notesDisplay.style.color = e.target.value;
    });

    // 曜日の配列
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    // 予定表示を最新化
    function collectScheduleData() {
        const rows = document.querySelectorAll('.schedule-row');
        const scheduleData = [];

        rows.forEach(row => {
            const dateInput = row.querySelector('.date-input');
            const timeInputs = row.querySelectorAll('.time-input');
            const noteInput = row.querySelector('.note-input');

            if (dateInput.value && timeInputs[0].value && timeInputs[1].value) {
                const date = new Date(dateInput.value);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const weekday = weekdays[date.getDay()];

                let startTime = timeInputs[0].value;
                let endTime = timeInputs[1].value;

                if (!showMinutes.checked) {
                    startTime = startTime.substring(0, 2) + '時';
                    endTime = endTime.substring(0, 2) + '時';
                }

                const datePart = `${month}月${day}日（${weekday}）`;
                const timePart = `${startTime}～${endTime}`;
                let line = hideDate.checked ? timePart : `${datePart}${timePart}`;
                if (noteInput.value) {
                    line += ` ${noteInput.value}`;
                }

                scheduleData.push({
                    date: date,
                    text: line
                });
            }
        });

        scheduleData.sort((a, b) => a.date - b.date);
        return scheduleData;
    }

    function updateScheduleDisplay() {
        const scheduleData = collectScheduleData();
        outputText.textContent = scheduleData.map(item => item.text).join('\n');
        notesDisplay.textContent = notes.value;
    }

    scheduleInputs.addEventListener('input', updateScheduleDisplay);
    scheduleInputs.addEventListener('change', updateScheduleDisplay);
    notes.addEventListener('input', updateScheduleDisplay);

    const initialTimeInputs = document.querySelectorAll('.time-input');
    initialTimeInputs.forEach(input => {
        input.step = showMinutes.checked ? '300' : '3600';
    });

    // 分表示の制御
    showMinutes.addEventListener('change', function () {
        const timeInputs = document.querySelectorAll('.time-input');
        timeInputs.forEach(input => {
            input.step = this.checked ? '300' : '3600'; // 5分単位または1時間単位
        });
        updateScheduleDisplay();
    });

    hideDate.addEventListener('change', updateScheduleDisplay);

    // 背景画像選択ボタンのイベントリスナー
    selectBackgroundButton.addEventListener('click', () => {
        backgroundImageInput.click();
    });

    // 背景画像が選択されたときの処理
    backgroundImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                scheduleOutput.style.backgroundImage = `url(${e.target.result})`;
                scheduleOutput.style.backgroundSize = 'cover';
                scheduleOutput.style.backgroundPosition = 'center';
                scheduleOutput.style.backgroundRepeat = 'no-repeat';
            };
            reader.readAsDataURL(file);
        }
    });

    // フォント変更のイベントリスナー
    fontSelector.addEventListener('change', (e) => {
        const selectedFont = e.target.value;
        scheduleOutput.style.fontFamily = `'${selectedFont}', sans-serif`;
        titleDisplay.style.fontFamily = `'${selectedFont}', sans-serif`;
        outputText.style.fontFamily = `'${selectedFont}', sans-serif`;
        notesDisplay.style.fontFamily = `'${selectedFont}', sans-serif`;
    });

    // 新しい予定行を追加する関数
    const HOLD_DURATION = 1200;
    let holdState = null;
    let holdHintShown = false;
    let holdHintTimeoutId = null;

    function addScheduleRow() {
        const row = document.createElement('div');
        row.className = 'schedule-row';


        row.innerHTML = `
            <input type="date" class="date-input">
            <input type="time" class="time-input" value="00:00">
            <span>～</span>
            <input type="time" class="time-input" value="00:00">
            <input type="text" class="note-input" maxlength="5" placeholder="備考">
            <button type="button" class="remove-row-button" aria-label="この予定を削除">
                <i class="fa-solid fa-trash" aria-hidden="true"></i>
            </button>
        `;

        const timeInputs = row.querySelectorAll('.time-input');
        timeInputs.forEach(input => {
            input.step = showMinutes.checked ? '300' : '3600';
        });

        scheduleInputs.appendChild(row);
        updateRemoveButtons();
    }

    function removeScheduleRow(row) {
        if (!row) return;
        row.remove();
        updateScheduleDisplay();
        updateRemoveButtons();
    }

    function updateRemoveButtons() {
        const rows = scheduleInputs.querySelectorAll('.schedule-row');
        rows.forEach((row, index) => {
            const removeButton = row.querySelector('.remove-row-button');
            if (!removeButton) return;

            if (index === 0) {
                removeButton.classList.add('remove-row-button--hidden');
                removeButton.setAttribute('tabindex', '-1');
                removeButton.setAttribute('aria-hidden', 'true');
            } else {
                removeButton.classList.remove('remove-row-button--hidden');
                removeButton.removeAttribute('tabindex');
                removeButton.removeAttribute('aria-hidden');
            }
        });
    }

    function setDefaultFirstRowValues() {
        const firstRow = scheduleInputs.querySelector('.schedule-row');
        if (!firstRow) return;

        const dateInput = firstRow.querySelector('.date-input');
        const timeInputs = firstRow.querySelectorAll('.time-input');
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        if (dateInput && !dateInput.value) {
            dateInput.value = formattedDate;
        }

        if (timeInputs.length >= 2) {
            if (!timeInputs[0].value || timeInputs[0].value === '00:00') {
                timeInputs[0].value = '18:00';
            }
            if (!timeInputs[1].value || timeInputs[1].value === '00:00') {
                timeInputs[1].value = '21:00';
            }
        }
    }

    // 予定を追加ボタンのイベントリスナー
    addScheduleButton.addEventListener('click', addScheduleRow);

    function handleAutoAddOnLastDateInput(event) {
        if (!event.target.classList.contains('date-input')) return;

        const rows = Array.from(scheduleInputs.querySelectorAll('.schedule-row'));
        if (!rows.length) return;

        const lastRow = rows[rows.length - 1];
        if (lastRow.contains(event.target) && event.target.value) {
            addScheduleRow();
        }
    }

    scheduleInputs.addEventListener('change', handleAutoAddOnLastDateInput);

    function startRemoveHold(button, pointerId) {
        cancelRemoveHold();
        holdState = {
            button,
            pointerId,
            start: performance.now(),
            rafId: null
        };

        button.classList.add('remove-row-button--holding');
        button.style.setProperty('--hold-progress-visible', '1');
        button.style.setProperty('--hold-progress', '0deg');

        const step = () => {
            if (!holdState || holdState.button !== button) return;
            const elapsed = performance.now() - holdState.start;
            const progress = Math.min(elapsed / HOLD_DURATION, 1);
            button.style.setProperty('--hold-progress', `${progress * 360}deg`);

            if (progress >= 1) {
                const row = button.closest('.schedule-row');
                cancelRemoveHold(true);
                removeScheduleRow(row);
                return;
            }

            holdState.rafId = requestAnimationFrame(step);
        };

        holdState.rafId = requestAnimationFrame(step);
    }

    function showHoldHint(triggerButton) {
        if (!holdHint || holdHintShown) return;
        if (!triggerButton || !scheduleInputsContainer) return;
        holdHintShown = true;
        holdHint.textContent = '予定を削除するには長押ししてください';

        const containerRect = scheduleInputsContainer.getBoundingClientRect();
        const buttonRect = triggerButton.getBoundingClientRect();
        const hintHeight = holdHint.offsetHeight || 20;
        let top = buttonRect.top - containerRect.top + (buttonRect.height - hintHeight) / 2;
        top = Math.max(top, 0);
        holdHint.style.top = `${top}px`;
        holdHint.classList.add('hold-hint--visible');

        if (holdHintTimeoutId) {
            clearTimeout(holdHintTimeoutId);
        }

        holdHintTimeoutId = setTimeout(() => {
            holdHint.classList.remove('hold-hint--visible');
        }, 3000);
    }

    function cancelRemoveHold(completed = false) {
        if (!holdState) return;

        if (holdState.rafId) {
            cancelAnimationFrame(holdState.rafId);
        }

        const { button } = holdState;
        if (!completed) {
            button.style.removeProperty('--hold-progress');
            button.style.removeProperty('--hold-progress-visible');
            if (!holdHintShown) {
                showHoldHint(button);
            }
        }
        button.classList.remove('remove-row-button--holding');

        holdState = null;
    }

    function handlePointerUp(event) {
        if (!holdState || event.pointerId !== holdState.pointerId) return;
        cancelRemoveHold();
    }

    function handlePointerMove(event) {
        if (!holdState || event.pointerId !== holdState.pointerId) return;
        const button = holdState.button;
        const rect = button.getBoundingClientRect();
        const isInside = (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );

        if (!isInside) {
            cancelRemoveHold();
        }
    }

    function handlePointerDown(event) {
        const removeButton = event.target.closest('.remove-row-button');
        if (!removeButton || removeButton.classList.contains('remove-row-button--hidden')) return;

        event.preventDefault();
        startRemoveHold(removeButton, event.pointerId);
    }

    scheduleInputs.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);
    document.addEventListener('pointermove', handlePointerMove);

    // 初期の予定行を追加
    addScheduleRow();
    setDefaultFirstRowValues();
    updateScheduleDisplay();
    updateRemoveButtons();

    // オーバーレイの透明度を制御
    const overlayOpacity = document.getElementById('overlay-opacity');
    const opacityValue = document.getElementById('opacity-value');
    const backgroundOverlay = document.getElementById('background-overlay');

    // 初期状態でもデフォルト値を反映
    const defaultOpacity = overlayOpacity.value;
    opacityValue.textContent = `${defaultOpacity}%`;
    backgroundOverlay.style.opacity = defaultOpacity / 100;

    overlayOpacity.addEventListener('input', function () {
        const value = this.value;
        opacityValue.textContent = value + '%';
        backgroundOverlay.style.opacity = value / 100;
    });
});

document.getElementById("download").addEventListener("click", () => {
    html2canvas(document.getElementById("schedule-output")).then(canvas => {
        const link = document.createElement("a");
        const now = new Date();
        const dateStr = now.getFullYear() +
            ('0' + (now.getMonth() + 1)).slice(-2) +
            ('0' + now.getDate()).slice(-2) +
            ('0' + now.getHours()).slice(-2) +
            ('0' + now.getMinutes()).slice(-2);
        link.download = `itsu-iru-schedule-${dateStr}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
});
