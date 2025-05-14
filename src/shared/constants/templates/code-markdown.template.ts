import {copyToClipboard} from "../../../utils/clipboard.utils";
export const CodeMarkdownTemplate = (code: string, language: string | null, id: string) => {
  const lines = code.split('\n');
  const lineNumbers = lines.map((_, i) => `<span>${i + 1}</span>`).join('');
const hljsLanguage = language ? language : 'plaintext';

console.log(hljsLanguage);

return `
    <div class="code-container" id="${id}">
        <div class="code-header">
        <span class="code-lang">${hljsLanguage}</span>
        <button class="copy-button" onclick="copyToClipboard('${code.replace(/'/g, "\\'")}')">
            <img src="assets/icons/svg/md-templates/copy.svg" alt="copy">
        </button>
        </div>
      <div class="line-numbers">${lineNumbers}</div>
      <pre><code class="hljs ${hljsLanguage}">${code}</code></pre>
      <style>
        .code-container#${id} {
          position: relative;
          display: block;
          margin: 10px 0;
          max-width: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          background: #1a1a1a;
          padding: 8px;
          font-family: 'Fira Code', monospace;
        }
        .code-container#${id} .line-numbers {
          position: absolute;
          left: 0;
          top: 0;
          width: 40px;
          padding: 8px 4px;
          background: #2a2a2a;
          color: #888;
          text-align: right;
          border-right: 2px solid rgba(76, 175, 80, 0.3);
          user-select: none;
          display: flex;
          flex-direction: column;
          line-height: 1.5em;
        }
        .code-container#${id} .line-numbers span {
          display: block;
        }
        .code-container#${id} pre {
          margin: 0;
          padding: 8px 8px 8px 48px;
          overflow-x: auto;
          background: transparent;
        }
        .code-container#${id} code {
          background: transparent;
          color: #ffffff;
          line-height: 1.5em;
        }
        
        .code-lang{
        color: #28a745;
        }
        
        .code-header{
        font-size: 10px;
                  position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          gap: 5px;
        }
        
        /* Кастомизация Highlight.js */
        .code-container#${id} .hljs-comment,
        .code-container#${id} .hljs-quote {
          color: #6a737d;
        }
        .code-container#${id} .hljs-keyword,
        .code-container#${id} .hljs-selector-tag,
        .code-container#${id} .hljs-meta-keyword {
          color: #bd93f9;
        }
        .code-container#${id} .hljs-string,
        .code-container#${id} .hljs-literal,
        .code-container#${id} .hljs-regexp,
        .code-container#${id} .hljs-title {
          color: #f1fa8c;
        }
        .code-container#${id} .hljs-number,
        .code-container#${id} .hljs-symbol,
        .code-container#${id} .hljs-bullet {
          color: #ff79c6;
        }
        .code-container#${id} .hljs-function,
        .code-container#${id} .hljs-built_in {
          color: #8be9fd;
        }
        .code-container#${id} .hljs-params,
        .code-container#${id} .hljs-variable {
          color: #50fa7b;
        }
        
        .code-container#${id} .copy-button {
          /*background: #4CAF50;*/
          /*color: #ffffff;*/
          border: none;
          border-radius: 4px;
          padding: 2px 4px;
          cursor: pointer;
          z-index: 2;
          margin-bottom: 50px;
        }
        
        .code-container#${id} .copy-button img{
        width: 10px;
        height: 10px;
        }
        
        .code-container#${id} .copy-button:hover {
          /*background: #45a049;*/
        }
      </style>
    </div>
  `;
};