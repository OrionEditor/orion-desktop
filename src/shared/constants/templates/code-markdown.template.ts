export const CodeMarkdownTemplate = (code: string, language: string | null, id: string) => {
  const lineNumbers = code.split('\n').map((_, i) => i + 1).join('\n');
  const prismLanguage = language ? `language-${language}` : 'language-text';

  return `
<div class="code-container" id="${id}">
<div class="line-numbers">${lineNumbers}</div>
<pre><code class="${prismLanguage}">${code}</code></pre>
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
}
/* Кастомизация Prism.js */
.code-container#${id} .token.comment,
.code-container#${id} .token.prolog,
.code-container#${id} .token.doctype,
.code-container#${id} .token.cdata {
    color: #6a737d;
}
.code-container#${id} .token.punctuation {
    color: #ffffff;
}
.code-container#${id} .token.property,
.code-container#${id} .token.tag,
.code-container#${id} .token.constant,
.code-container#${id} .token.symbol,
.code-container#${id} .token.deleted {
    color: #ff79c6;
}
.code-container#${id} .token.number,
.code-container#${id} .token.boolean,
.code-container#${id} .token.selector,
.code-container#${id} .token.attr-name,
.code-container#${id} .token.string,
.code-container#${id} .token.char,
.code-container#${id} .token.builtin,
.code-container#${id} .token.inserted {
    color: #f1fa8c;
}
.code-container#${id} .token.operator,
.code-container#${id} .token.entity,
.code-container#${id} .token.url,
.code-container#${id} .token.variable {
    color: #50fa7b;
}
.code-container#${id} .token.atrule,
.code-container#${id} .token.attr-value,
.code-container#${id} .token.function,
.code-container#${id} .token.class-name {
    color: #8be9fd;
}
.code-container#${id} .token.keyword {
    color: #bd93f9;
}
.code-container#${id} .token.regex,
.code-container#${id} .token.important {
    color: #ffb86c;
}
</style>
</div>
    `;
};