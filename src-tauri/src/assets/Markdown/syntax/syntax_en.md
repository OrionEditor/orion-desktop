# Markdown Cheatsheet

Markdown is a lightweight markup language that lets you format text using simple symbols. Below are the basic commands with examples.

## 1. Headings
Use the `#` symbol to create headings. The more `#` symbols, the smaller the heading level.

```
# Heading Level 1
## Heading Level 2
### Heading Level 3
#### Heading Level 4
```

**Result:**
# Heading Level 1
## Heading Level 2
### Heading Level 3
#### Heading Level 4

---

## 2. Text Emphasis
- **Bold**: Use `**` or `__`.
- *Italic*: Use `*` or `_`.

```
**Bold text**
*Italic text*
__Bold text__
_Italic text_
```

**Result:**  
**Bold text**  
*Italic text*  
__Bold text__  
_Italic text_

---

## 3. Lists
### Unordered List
Use `-`, `*`, or `+` before each item.

```
- Item 1
- Item 2
  - Subitem
* Item 3
+ Item 4
```

**Result:**
- Item 1
- Item 2
    - Subitem
* Item 3
+ Item 4

### Ordered List
Use numbers followed by a period.

```
1. First item
2. Second item
   1. Subitem
3. Third item
```

**Result:**
1. First item
2. Second item
    1. Subitem
3. Third item

---

## 4. Links
Create links using `[text](URL)`.

```
[Google](https://www.google.com)
```

**Result:**  
[Google](https://www.google.com)

---

## 5. Images
Add images using `![description](URL)`.

```
![Cat](https://example.com/cat.jpg)
```

**Result:**  
(The image will display if the URL is valid)

---

## 6. Blockquotes
Use `>` to create quotes.

```
> This is a quote.
> Second line of the quote.
```

**Result:**
> This is a quote.  
> Second line of the quote.

---

## 7. Code
### Inline Code
Use single backticks `` ` ``.

```
The `print("Hello, World!")` command outputs text.
```

**Result:**  
The `print("Hello, World!")` command outputs text.

### Code Block
Use triple backticks ``` with an optional language specifier.

```
```python
def hello():
    print("Hello, World!")
```
```

**Result:**  
```python
def hello():
    print("Hello, World!")
```

---

## 8. Horizontal Rule
Use `---` or `***`.

```
---
or
***
```

**Result:**
---

---

## 9. Tables
Create tables using `|` and `-`.

```
| Header 1    | Header 2    |
|-------------|-------------|
| Cell 1      | Cell 2      |
| Cell 3      | Cell 4      |
```

**Result:**  
| Header 1    | Header 2    |  
|-------------|-------------|  
| Cell 1      | Cell 2      |  
| Cell 3      | Cell 4      |

---

## 10. Escaping Characters
To use special characters as plain text, add `\`.

```
The symbols \* and \# won’t turn into italic or a heading.
```

**Result:**  
The symbols \* and \# won’t turn into italic or a heading.

---

This is a basic set of Markdown commands. Try them out in your editor to get comfortable!