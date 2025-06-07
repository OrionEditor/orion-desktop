import { CryptoAesGcmService } from './crypto-aes-gcm.service';

describe('CryptoAesGcmService', () => {
    let mockCrypto: Partial<SubtleCrypto>;

    beforeEach(() => {
        // Мокируем Web Crypto API с явной типизацией
        mockCrypto = {
            digest: jest.fn<(algorithm: AlgorithmIdentifier, data: BufferSource) => Promise<ArrayBuffer>>(),
            importKey: jest.fn<
                (
                    format: KeyFormat,
                    keyData: JsonWebKey | BufferSource,
                    algorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | AesKeyAlgorithm,
                    extractable: boolean,
                    keyUsages: readonly KeyUsage[]
                ) => Promise<CryptoKey>
            >(),
            encrypt: jest.fn<(algorithm: Algorithm, key: CryptoKey, data: BufferSource) => Promise<ArrayBuffer>>(),
            decrypt: jest.fn<(algorithm: Algorithm, key: CryptoKey, data: BufferSource) => Promise<ArrayBuffer>>(),
        };
        Object.defineProperty(global, 'crypto', {
            value: { subtle: mockCrypto },
            writable: true,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('должен быть доступен', () => {
        expect(CryptoAesGcmService).toBeTruthy();
    });

    it('должен преобразовывать строку в ArrayBuffer', () => {
        const input = 'test string';
        const result = CryptoAesGcmService['stringToArrayBuffer'](input);
        expect(result).toBeInstanceOf(ArrayBuffer);
        const uint8Array = new Uint8Array(result);
        expect(uint8Array).toEqual(new TextEncoder().encode(input));
    });

    it('должен преобразовывать ArrayBuffer в строку', () => {
        const input = 'test string';
        const buffer = new TextEncoder().encode(input).buffer;
        const result = CryptoAesGcmService['arrayBufferToString'](buffer);
        expect(result).toBe(input);
    });

    it('должен преобразовывать base64 в Uint8Array', () => {
        const input = btoa('hello');
        const result = CryptoAesGcmService['base64ToUint8Array'](input);
        expect(result).toBeInstanceOf(Uint8Array);
        expect(result).toEqual(new Uint8Array([104, 101, 108, 108, 111])); // 'hello' в ASCII
    });

    it('должен создавать CryptoKey из строки', async () => {
        const key = 'password';
        const keyBuffer = new TextEncoder().encode(key).buffer;
        const hashBuffer = new Uint8Array(32).buffer; // SHA-256 возвращает 32 байта
        const mockCryptoKey = { type: 'secret' } as CryptoKey;

        mockCrypto.digest.mockResolvedValue(hashBuffer);
        mockCrypto.importKey.mockResolvedValue(mockCryptoKey);

        const result = await CryptoAesGcmService['getCryptoKey'](key);

        expect(mockCrypto.digest).toHaveBeenCalledWith('SHA-256', keyBuffer);
        expect(mockCrypto.importKey).toHaveBeenCalledWith(
            'raw',
            hashBuffer,
            { name: 'AES-GCM' },
            false,
            ['encrypt', 'decrypt']
        );
        expect(result).toBe(mockCryptoKey);
    });

    it('должен шифровать строку', async () => {
        const plaintext = 'Hello, world!';
        const key = 'password';
        const ivBase64 = btoa('123456789012'); // 12 байт
        const iv = new Uint8Array([49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 49, 50]);
        const encryptedBuffer = new Uint8Array([1, 2, 3, 4]).buffer;
        const mockCryptoKey = { type: 'secret' } as CryptoKey;

        mockCrypto.digest.mockResolvedValue(new Uint8Array(32).buffer);
        mockCrypto.importKey.mockResolvedValue(mockCryptoKey);
        mockCrypto.encrypt.mockResolvedValue(encryptedBuffer);

        const result = await CryptoAesGcmService.encrypt(plaintext, key, ivBase64);

        expect(mockCrypto.encrypt).toHaveBeenCalledWith(
            { name: 'AES-GCM', iv, tagLength: 128 },
            mockCryptoKey,
            CryptoAesGcmService['stringToArrayBuffer'](plaintext)
        );
        expect(result).toBe(btoa(String.fromCharCode(1, 2, 3, 4))); // base64 от [1,2,3,4]
    });

    it('должен выбрасывать ошибку при шифровании с некорректным IV', async () => {
        const plaintext = 'Hello, world!';
        const key = 'password';
        const ivBase64 = 'invalid-base64';

        await expect(CryptoAesGcmService.encrypt(plaintext, key, ivBase64)).rejects.toThrow(
            'Ошибка при шифровании данных!'
        );
    });

    it('должен расшифровывать строку', async () => {
        const plaintext = 'Hello, world!';
        const key = 'password';
        const ivBase64 = btoa('123456789012'); // 12 байт
        const iv = new Uint8Array([49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 49, 50]);
        const ciphertext = btoa(String.fromCharCode(1, 2, 3, 4));
        const encryptedData = new Uint8Array([1, 2, 3, 4]);
        const decryptedBuffer = CryptoAesGcmService['stringToArrayBuffer'](plaintext);
        const mockCryptoKey = { type: 'secret' } as CryptoKey;

        mockCrypto.digest.mockResolvedValue(new Uint8Array(32).buffer);
        mockCrypto.importKey.mockResolvedValue(mockCryptoKey);
        mockCrypto.decrypt.mockResolvedValue(decryptedBuffer);

        const result = await CryptoAesGcmService.decrypt(ciphertext, key, ivBase64);

        expect(mockCrypto.decrypt).toHaveBeenCalledWith(
            { name: 'AES-GCM', iv, tagLength: 128 },
            mockCryptoKey,
            encryptedData
        );
        expect(result).toBe(plaintext);
    });

    it('должен выбрасывать ошибку при расшифровке с некорректным ключом', async () => {
        const ciphertext = btoa(String.fromCharCode(1, 2, 3, 4));
        const key = 'password';
        const ivBase64 = btoa('123456789012');
        const mockCryptoKey = { type: 'secret' } as CryptoKey;

        mockCrypto.digest.mockResolvedValue(new Uint8Array(32).buffer);
        mockCrypto.importKey.mockResolvedValue(mockCryptoKey);
        mockCrypto.decrypt.mockRejectedValue(new Error('Invalid key'));

        await expect(CryptoAesGcmService.decrypt(ciphertext, key, ivBase64)).rejects.toThrow(
            'Ошибка при расшифровке данных!'
        );
    });

    it('должен выбрасывать ошибку при расшифровке с некорректным ciphertext', async () => {
        const ciphertext = 'invalid-base64';
        const key = 'password';
        const ivBase64 = btoa('123456789012');

        await expect(CryptoAesGcmService.decrypt(ciphertext, key, ivBase64)).rejects.toThrow(
            'Ошибка при расшифровке данных!'
        );
    });
});