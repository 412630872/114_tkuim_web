# Week 14 - 淡江大學資訊管理學系網站重構 (TKU IM Department Website Redesign)

本專案為 Week 14 的練習作業，目標是根據淡江大學資管系的設計圖重新構建其官方網站首頁。

## 專案內容

本網頁包含完整的首頁結構，並實作了響應式設計 (RWD)，適用於桌面、平板及手機瀏覽。

### 功能特色 (Features)

1.  **響應式導覽列 (Responsive Navbar)**
    *   桌面版：橫向下拉式選單。
    *   手機版：漢堡選單 (Hamburger Menu) 與側滑抽屜效果。
    *   包含語言切換與搜尋介面。

2.  **主視覺輪播 (Hero Carousel)**
    *   全寬度圖片輪播。
    *   支援自動播放 (Auto-play)。
    *   手動切換功能 (上一張/下一張按鈕、底部圓點指示器)。

3.  **最新消息 (News Section)**
    *   **頁籤切換 (Tabs)**：支援「一般公告」、「活動公告」等分類切換，無需重新整理頁面。
    *   列表懸停效果。

4.  **學制介紹 (Programs)**
    *   卡片式設計展示大學部、碩士班、碩專班資訊。
    *   互動式 Hover 動畫效果。

5.  **活動花絮 (Activity Highlights)**
    *   網格圖片排版 (Grid Layout)。
    *   滑鼠懸停時顯示文字遮罩效果。

6.  **頁尾 (Footer)**
    *   包含聯絡資訊、快速連結與版權宣告。
    *   **回到頂端按鈕 (Back to Top)**：當頁面捲動時自動出現。

## 檔案結構 (File Structure)

```
Week14/
├── index.html      # 主網頁結構 (HTML5)
├── style.css       # 樣式表 (CSS3, Flexbox, Grid, RWD)
├── script.js       # 互動邏輯 (Mobile Menu, Carousel, Tabs)
├── todo.md         # 開發待辦事項列表
└── README.md       # 專案說明文件
```

## 使用方式 (Usage)

1.  確認資料夾中包含 `index.html`, `style.css`, `script.js`。
2.  使用瀏覽器 (Chrome, Edge, Firefox 等) 開啟 `index.html` 即可瀏覽。
3.  調整視窗大小可觀察 RWD 響應式效果。

## 技術棧 (Tech Stack)

*   **HTML5**: 語意化標籤。
*   **CSS3**: CSS Variables, Flexbox, Grid Layout, Media Queries, Keyframe Animations.
*   **JavaScript (Vanilla JS)**: DOM Manipulation, Event Listeners.
*   **External Libraries**:
    *   Font Awesome (Icons)
    *   Google Fonts (Noto Sans TC)

