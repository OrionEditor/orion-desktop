// export const ImageMarkdownTemplate = (src: string, id: string) => `
//   <div class="image-container" id="${id}" onmouseenter="document.querySelector('#${id} .controls').style.display = 'flex';" onmouseleave="document.querySelector('#${id} .controls').style.display = 'none';">
//     <img src="${src}" alt="Markdown Image" class="markdown-image" />
//     <div class="controls" style="display: none;">
//       <button onclick="imageMarkdown_${id}.openLink('${src}')" title="Open in browser">
//         <img src="assets/icons/svg/link.svg" alt="Open" />
//       </button>
//       <button onclick="imageMarkdown_${id}.copyLink('${src}')" title="Copy link">
//         <img src="assets/icons/svg/copy.svg" alt="Copy" />
//       </button>
//       <button onclick="imageMarkdown_${id}.deleteImage('${src}', '${id}')" title="Delete image">
//         <img src="assets/icons/svg/delete.svg" alt="Delete" />
//       </button>
//       <div class="size-controls">
//         <label>
//           Width (%):
//           <input type="number" value="100" min="20" max="100" onchange="imageMarkdown_${id}.updateWidth(this.value, '${id}')" />
//         </label>
//         <label>
//           Height (%):
//           <input type="number" value="100" min="20" max="100" onchange="imageMarkdown_${id}.updateHeight(this.value, '${id}')" />
//         </label>
//       </div>
//     </div>
//     <script>
//       const imageMarkdown_${id} = {
//         openLink(src) {
//           if (src.startsWith('http://') || src.startsWith('https://')) {
//             // Используем Tauri API для открытия ссылки
//             window.__TAURI__.shell.open(src).catch(err => console.error('Failed to open link:', err));
//           }
//         },
//         copyLink(src) {
//           // Используем Tauri API для копирования в буфер обмена
//           window.__TAURI__.clipboard.writeText(src)
//             .then(() => console.log('Link copied to clipboard:', src))
//             .catch(err => console.error('Failed to copy link:', err));
//         },
//         deleteImage(src, id) {
//           console.log('Deleting image:', src);
//           // Отправляем событие для удаления изображения
//           window.dispatchEvent(new CustomEvent('deleteImage', { detail: src }));
//         },
//         updateWidth(value, id) {
//           const img = document.querySelector('#' + id + ' .markdown-image');
//           if (img) {
//             const width = Math.max(20, Math.min(100, parseInt(value, 10)));
//             img.style.width = width + '%';
//             console.log('Updated width:', width);
//           }
//         },
//         updateHeight(value, id) {
//           const img = document.querySelector('#' + id + ' .markdown-image');
//           if (img) {
//             const height = Math.max(20, Math.min(100, parseInt(value, 10)));
//             img.style.height = height + '%';
//             console.log('Updated height:', height);
//           }
//         }
//       };
//     </script>
//     <style>
//       .image-container#${id} {
//         position: relative;
//         display: inline-block;
//         margin: 10px 0;
//         max-width: 100%;
//       }
//       .image-container#${id} .markdown-image {
//         max-width: 100%;
//         max-height: 500px;
//         height: auto;
//         display: block;
//         object-fit: contain;
//       }
//       .image-container#${id} .controls {
//         position: absolute;
//         top: 10px;
//         right: 10px;
//         background: rgba(0, 0, 0, 0.7);
//         border-radius: 4px;
//         padding: 8px;
//         display: none;
//         flex-direction: column;
//         gap: 8px;
//       }
//       .image-container#${id} .controls button {
//         background: none;
//         border: none;
//         cursor: pointer;
//         padding: 4px;
//       }
//       .image-container#${id} .controls button img {
//         width: 20px;
//         height: 20px;
//         filter: invert(1);
//       }
//       .image-container#${id} .size-controls {
//         display: flex;
//         flex-direction: column;
//         gap: 4px;
//         color: white;
//         font-size: 12px;
//       }
//       .image-container#${id} .size-controls label {
//         display: flex;
//         align-items: center;
//         gap: 4px;
//       }
//       .image-container#${id} .size-controls input {
//         width: 60px;
//         padding: 2px;
//         background: rgba(255, 255, 255, 0.1);
//         border: 1px solid rgba(255, 255, 255, 0.3);
//         color: white;
//         border-radius: 4px;
//       }
//     </style>
//   </div>
// `;

export const ImageMarkdownTemplate = (src: string, id: string) => `
  <div class="image-container" id="${id}">
    <img src="${src}" alt="Markdown Image" class="markdown-image" />
    <style>
      .image-container#${id} {
        position: relative;
        display: inline-block;
        margin: 10px 0;
        max-width: 100%;
      }
      .image-container#${id} .markdown-image {
        max-width: 100%;
        max-height: 500px;
        height: auto;
        display: block;
        object-fit: contain;
        transition: filter 0.3s ease;
      }
      .image-container#${id}:hover .markdown-image {
        filter: brightness(70%);
      }
      .image-container#${id}::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(76, 175, 80, 0); /* Зелёный с прозрачностью 0 */
        transition: background 0.3s ease;
        pointer-events: none;
        z-index: 1;
      }
      .image-container#${id}:hover::before {
        background: rgba(76, 175, 80, 0.1);
      }
    </style>
  </div>
`;