export const AudioMarkdownTemplate = (src: string, id: string) => `
  <div class="audio-container" id="${id}">
    <audio src="${src}" controls class="markdown-audio"></audio>
    <style>
      .audio-container#${id} {
        position: relative;
        display: block;
        margin: 10px 0;
        max-width: 100%;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: #1a1a1a; /* Тёмный фон для контраста */
        padding: 8px;
      }
      .audio-container#${id} .markdown-audio {
        width: 100%;
        display: block;
        border: 2px solid rgba(76, 175, 80, 0.3); /* Зелёная рамка */
        border-radius: 6px;
      }
      /* Кастомизация элементов управления */
      .audio-container#${id} .markdown-audio::-webkit-media-controls-panel {
        background: linear-gradient(to right, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.4));
        border-radius: 6px;
        padding: 4px;
      }
      .audio-container#${id} .markdown-audio::-webkit-media-controls-play-button,
      .audio-container#${id} .markdown-audio::-webkit-media-controls-volume-slider,
      .audio-container#${id} .markdown-audio::-webkit-media-controls-timeline {
        filter: brightness(1.2) hue-rotate(80deg); /* Зелёный акцент */
      }
      .audio-container#${id} .markdown-audio::-webkit-media-controls-current-time-display,
      .audio-container#${id} .markdown-audio::-webkit-media-controls-time-remaining-display {
        color: #ffffff;
        text-shadow: 0 0 4px rgba(76, 175, 80, 0.8);
      }
      /* Для Firefox и других браузеров */
      .audio-container#${id} .markdown-audio::-moz-range-track {
        background: rgba(76, 175, 80, 0.3);
        border-radius: 4px;
      }
      .audio-container#${id} .markdown-audio::-moz-range-thumb {
        background: #4CAF50;
        border: none;
        border-radius: 50%;
      }
    </style>
  </div>
`;