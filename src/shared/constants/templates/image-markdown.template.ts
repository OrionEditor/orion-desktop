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