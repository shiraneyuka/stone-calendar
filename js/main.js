'use strict'

const data = new Date();
const year = data.getFullYear();
const monthName = data.getMonth();
const monthNumber = data.getMonth() + 1;
const firstDate = new Date(year, monthNumber - 1, 1);
const firstDay = firstDate.getDay(); //曜日のデータ
const lastDate = new Date(year, monthNumber, 0);
const lastDayCount = lastDate.getDate();

// 今日の日付
const todayDate = data.getDate();

// 月名を配列で用意
const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

let dayCount = 1;
let createHtml = '';

// 月ヘッダー
createHtml = '<div class="month">' + '<h1>' + monthNames[monthName] + '</h1>' + '<h2>' + monthNumber + '</h2>' + '</div>';

// 曜日ヘッダー
createHtml += '<table>' + '<tr>';
const weeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
for (let i = 0; i < weeks.length; i++) {
    createHtml += '<td class="week">' + weeks[i] + '</td>';
}
createHtml += '</tr>';

// 日付セル
for (let n = 0; n < 6; n++) {
    createHtml += '<tr>';
    for (let d = 0; d < 7; d++) {
        if (n == 0 && d < firstDay) {
            createHtml += '<td class="day"></td>';
        } else if (dayCount > lastDayCount) {
            createHtml += '<td class="day"></td>';
        } else {
            // 今日の日付か判断して.todayを付与
            const classes = (dayCount === todayDate) ? 'day today' : 'day';
            createHtml += `<td class="${classes}">${dayCount}</td>`;
            dayCount++
        }
    }

    createHtml += '</tr>';
}
createHtml += '</table>';

document.querySelector('#calendar').innerHTML = createHtml;

console.log(data);

// 和風月名を配列で用意
const japanNames = [
    '睦月', '如月', '弥生', '卯月',
    '皐月', '水無月', '文月', '葉月',
    '長月', '神無月', '霜月', '師走'
];

// 和風月名を表示する
const japanEl = document.querySelector('#japan-month');
japanEl.textContent = japanNames[monthName];

// 時刻を表示する
const clockEl = document.querySelector('#clock');

// 時刻を更新する関数
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = '(' + `${hours}:${minutes}:${seconds}` + ')';
}

// 1秒ごとに更新
setInterval(updateClock, 1000);

// ページ読み込み直後にも一度実行
updateClock();


// ==== 石を積む処理 ====
const stonesContainer = document.querySelector('#stones');
let stoneCount = monthNumber;

// 保存データの確認
const saved = JSON.parse(localStorage.getItem('stonesData')) || { lastYear: 0, lastMonth: 0 };
let isNewMonth = false;

// 年が変わったらリセット
if (saved.lastYear !== year) {
    isNewMonth = true;
    saved.lastYear = year;
    saved.lastMonth = monthNumber;
    localStorage.setItem('stonesData', JSON.stringify(saved));
} else if (saved.lastMonth !== monthNumber) {
    isNewMonth = true;
    saved.lastYear = year;
    saved.lastMonth = monthNumber;
    localStorage.setItem('stonesData', JSON.stringify(saved));
}

// ==== 12種類の画像を用意 ====
const stoneImages = [
    'stone1.png', 'stone2.png', 'stone3.png', 'stone4.png',
    'stone5.png', 'stone6.png', 'stone7.png', 'stone8.png',
    'stone9.png', 'stone10.png', 'stone11.png', 'stone12.png'
];

// ==== 積み上げ ====
let currentHeight = 0;
let stoneElements = [];

addStoneSequentially(0);

function addStoneSequentially(i) {
    if (i >= stoneCount) return;

    const animate = (i === stoneCount - 1 && isNewMonth);
    const stone = document.createElement('img');
    stone.src = stoneImages[i % 12];
    stone.className = 'stone';
    stonesContainer.appendChild(stone);

    stone.onload = () => {
        const displayHeight = stone.clientHeight;

        const finalBottom = currentHeight;
        currentHeight += displayHeight;

        const containerWidth = stonesContainer.clientWidth;
        const stoneLeft = (containerWidth - stone.clientWidth) / 2;

        stone.style.bottom = animate ? '600px' : finalBottom + 'px';

        if (animate) {
            setTimeout(() => {
                stone.style.bottom = finalBottom + 'px';
            }, 100);
        }

        stoneElements.push(stone);

        addStoneSequentially(i + 1);
    };
}

// ==== 画面リサイズ対応 ====
window.addEventListener('resize', recalcStones);

function recalcStones() {
    let heightSum = 0;
    const containerWidth = stonesContainer.clientWidth;

    stoneElements.forEach(stone => {
        const displayHeight = stone.clientHeight;
        const stoneLeft = (containerWidth - stone.clientWidth) / 2;

        stone.style.bottom = heightSum + 'px';

        heightSum += displayHeight;
    });
}
