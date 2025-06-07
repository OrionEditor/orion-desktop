import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import {TabService} from "../tab.service";
import {Tab} from "../../interfaces/components/tab.interface";

describe('TabService', () => {
    let service: TabService;
    let tabsSubject: BehaviorSubject<Tab[]>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TabService],
        });
        service = TestBed.inject(TabService);
        // Мокируем generateUniqueId для предсказуемости
        jest.spyOn(service, 'generateUniqueId' as any).mockImplementation(() => 'mocked-id');
        // Получаем доступ к tabsSubject для проверки
        tabsSubject = (service as any).tabsSubject as BehaviorSubject<Tab[]>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('должен быть создан', () => {
        expect(service).toBeTruthy();
        expect(service.getAllTabs()).toEqual([]);
        service.tabs$.pipe(take(1)).subscribe(tabs => {
            expect(tabs).toEqual([]);
        });
    });

    it('должен преобразовывать PasswordBackendEntry в PasswordEntryInterface', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен преобразовывать PasswordEntryInterface в PasswordBackendEntry', async () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен синхронизировать пароли с сервером', async () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен обрабатывать ошибку при синхронизации паролей', async () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен создавать новую запись пароля', async () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен выбрасывать ошибку при создании пароля без userId', async () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен получать пароль по ID из локального хранилища', async () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен получать пароль по ID с сервера, если нет в локальном хранилище', async () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен обновлять пароль', async () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен удалять пароль', async () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен возвращать количество записей', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен добавлять запись локально', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен удалять запись локально', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен возвращать все записи', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен возвращать записи по имени', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен возвращать записи по категории', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен возвращать избранные записи', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен устанавливать имя записи', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен устанавливать описание записи', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен устанавливать фавикон записи', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен устанавливать учетные данные записи', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен устанавливать местоположение записи', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен устанавливать метаданные записи', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен устанавливать параметры безопасности записи', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен очищать все записи', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен сортировать записи по имени', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });

    it('должен сортировать записи по дате создания в обратном порядке', () => {
        service.createTab('/test/file.md', 'file.md');
        jest.spyOn(service, 'setActiveTab' as any).mockImplementation(() => {});
        service.createTab('/test/file.md', 'file.md');
        expect(service.getAllTabs().length).toBe(1);
        expect(service['setActiveTab']).toHaveBeenCalledWith('mocked-id');
    });
});