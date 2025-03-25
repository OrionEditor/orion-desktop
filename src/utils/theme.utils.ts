// theme-observer.ts

export function observeThemeChanges() {
    const observer = new MutationObserver(() => {
        const isDark = document.body.classList.contains('dark');
        document.documentElement.style.setProperty('--background-color', isDark ? '#222020' : 'white');
        document.documentElement.style.setProperty('--text-color', isDark ? '#ffffff' : 'black');
    });

    // Наблюдаем за изменениями атрибутов body
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

export function setDarkTheme(){
    document.body.classList.add("dark");
    document.documentElement.style.setProperty('--background-color','#121212');
    document.documentElement.style.setProperty('--text-color','#ffffff');
}