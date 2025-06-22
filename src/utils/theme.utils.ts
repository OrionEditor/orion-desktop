export function observeThemeChanges() {
    const observer = new MutationObserver(() => {
        const isDark = document.body.classList.contains('dark');
        applyTheme(isDark);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

export function setDarkTheme() {
    document.body.classList.add('dark');
    applyTheme(true);
}

export function applyTheme(isDark: boolean) {
    if (isDark) {
        document.documentElement.style.setProperty('--background-color', '#112211');
        document.documentElement.style.setProperty('--text-color', '#E0E0E0');
        document.documentElement.style.setProperty('--base-container-color', '#E0E0E0');
        document.documentElement.style.setProperty('--base-hover-color', '#2F75337F');
        document.documentElement.style.setProperty('--modal-background-color', '#152713');
        document.documentElement.style.setProperty('--span-bg', '#212529');
        document.documentElement.style.setProperty('--choose-bg', '#E0E0E0');
    } else {
        document.documentElement.style.setProperty('--background-color', '#e2ede2');
        document.documentElement.style.setProperty('--text-color', '#222020');
        document.documentElement.style.setProperty('--base-container-color', '#11300d');
        document.documentElement.style.setProperty('--base-hover-color', 'rgba(47,117,51,0.7)');
        document.documentElement.style.setProperty('--modal-background-color', '#b9e4b3');
        document.documentElement.style.setProperty('--span-bg', '#c5c8ca');
        document.documentElement.style.setProperty('--choose-bg', '#c5c8ca');
    }
}