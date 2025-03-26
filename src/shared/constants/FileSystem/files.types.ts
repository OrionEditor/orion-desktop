export const FILE_TYPES = {
    MD: 'md',
    TXT: 'txt',
    HTML: 'html',
    PDF: 'pdf',
    IMAGE: {
        JPG: 'jpg',
        JPEG: 'jpeg',
        PNG: 'png',
        WEBP: 'webp',
        SVG: 'svg',
        IMG: 'image'
    },
    VIDEO: {
        MP4: 'mp4',
        VIDEO: 'video'
    },
    OTHER: {
        XML: 'xml'
    }
}

export const getExtensionWithDot = (fileType: string) => `.${fileType}`;