export const VideoMarkdownTemplate = (src: string, id: string) => `
  <div class="video-container" id="${id}">
    <video src="${src}" controls class="markdown-video"></video>
    <style>
      .video-container#${id} {
        position: relative;
        display: inline-block;
        margin: 10px 0;
        max-width: 100%;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: #1a1a1a; /* Тёмный фон для контраста */
      }
      .video-container#${id} .markdown-video {
        max-width: 100%;
        height: auto;
        display: block;
      }
      /* Кастомизация элементов управления */
      .video-container#${id} .markdown-video::-webkit-media-controls-panel {
        background: linear-gradient(to bottom, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.4));
        border-radius: 0 0 8px 8px;
        padding: 4px;
      }
      .video-container#${id} .markdown-video::-webkit-media-controls-play-button,
      .video-container#${id} .markdown-video::-webkit-media-controls-volume-slider,
      .video-container#${id} .markdown-video::-webkit-media-controls-timeline {
        filter: brightness(1.2) hue-rotate(80deg); /* Зелёный акцент */
      }
      .video-container#${id} .markdown-video::-webkit-media-controls-current-time-display,
      .video-container#${id} .markdown-video::-webkit-media-controls-time-remaining-display {
        color: #ffffff;
        text-shadow: 0 0 4px rgba(76, 175, 80, 0.8);
      }
      /* Для Firefox и других браузеров */
      .video-container#${id} .markdown-video {
        border: 2px solid rgba(76, 175, 80, 0.3);
      }
    </style>
  </div>
`;