document.addEventListener('DOMContentLoaded', function () {
    const addScheduleButton = document.getElementById('add-schedule');
    const scheduleInputs = document.getElementById('schedule-inputs');
    const generateButton = document.getElementById('generate');
    const outputText = document.getElementById('output-text');
    const backgroundImageInput = document.getElementById('background-image');
    const selectBackgroundButton = document.getElementById('select-background');
    const scheduleOutput = document.getElementById('schedule-output');
    const fontSelector = document.getElementById('font-selector');
    const textColor = document.getElementById('text-color');
    const titleColor = document.getElementById('title-color');
    const notesColor = document.getElementById('notes-color');
    const showMinutes = document.getElementById('show-minutes');
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

    // 分表示の制御
    showMinutes.addEventListener('change', function () {
        const timeInputs = document.querySelectorAll('.time-input');
        timeInputs.forEach(input => {
            input.step = this.checked ? '300' : '3600'; // 5分単位または1時間単位
        });
    });

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
    function addScheduleRow() {
        const row = document.createElement('div');
        row.className = 'schedule-row';


        row.innerHTML = `
            <input type="date" class="date-input">
            <input type="time" class="time-input" value="00:00">
            <span>～</span>
            <input type="time" class="time-input" value="00:00">
            <input type="text" class="note-input" maxlength="5" placeholder="備考">
        `;
        scheduleInputs.appendChild(row);
    }

    // 予定を追加ボタンのイベントリスナー
    addScheduleButton.addEventListener('click', addScheduleRow);

    // 画像生成ボタンのイベントリスナー
    generateButton.addEventListener('click', function () {
        const rows = document.querySelectorAll('.schedule-row');
        let scheduleText = '';

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

                let line = `${month}月${day}日（${weekday}）${startTime}～${endTime}`;
                if (noteInput.value) {
                    line += ` ${noteInput.value}`;
                }
                scheduleText += line + '\n';
            }
        });

        outputText.textContent = scheduleText;
        notesDisplay.textContent = notes.value;
    });

    // 初期の予定行を追加
    addScheduleRow();

    // オーバーレイの透明度を制御
    const overlayOpacity = document.getElementById('overlay-opacity');
    const opacityValue = document.getElementById('opacity-value');
    const backgroundOverlay = document.getElementById('background-overlay');

    overlayOpacity.addEventListener('input', function () {
        const value = this.value;
        opacityValue.textContent = value + '%';
        backgroundOverlay.style.opacity = value / 100;
    });
});

document.getElementById("download").addEventListener("click", () => {
    html2canvas(document.getElementById("schedule-output")).then(canvas => {
        const link = document.createElement("a");
        link.download = "itsuiru-schedule.png";
        link.href = canvas.toDataURL();
        link.click();
    });
});
