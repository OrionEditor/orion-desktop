import {openUrl} from "@tauri-apps/plugin-opener";

// Функция для перехвата кликов по ссылкам и открытия их во внешнем браузере
export function handleExternalLinks(event: Event): void {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');

    if (anchor && anchor.href) {
        event.preventDefault();
        const url = anchor.href;

        openUrl(url).catch((error) => {
            console.error('Failed to open URL:', error);
        });
    }
}

// Функция для инициализации перехвата ссылок в контейнере
export function initializeLinkHandler(container: HTMLElement): void {
    container.addEventListener('click', handleExternalLinks);
}

// Функция для очистки обработчика (если нужно удалить)
export function cleanupLinkHandler(container: HTMLElement): void {
    container.removeEventListener('click', handleExternalLinks);
}