import {Injectable} from "@angular/core";
import {SortNodes} from "../../shared/enums/sort.enum";
import {BehaviorSubject} from "rxjs";
import {ContextMenuItem} from "../../interfaces/context-menu-item.interface";

@Injectable({
    providedIn: 'root'
})
export class FileSystemSortingContextMenuService {
    private initialMenu: ContextMenuItem[] = [
        {
            id: SortNodes.SORT_NAME_ASC,
            text: 'По имени файла (от А до Я, от A до Z)',
            select: true,
            possibleSelect: true,
            action: () => this.ascName()
        },
        {
            id: SortNodes.SORT_NAME_DESC,
            text: 'По имени файла (от Я до А, от Z до A)',
            select: false,
            possibleSelect: true,
            action: () => this.descName()
        },
        {
            id: SortNodes.SORT_DATE_CHANGE_DESC,
            text: 'По времени последнего изменения (от новых к старым)',
            select: false,
            possibleSelect: true,
            action: () => this.ascLastChange()
        },
        {
            id: SortNodes.SORT_DATE_CHANGE_ASC,
            text: 'По времени последнего изменения (от старых к новым)',
            select: false,
            possibleSelect: true,
            action: () => this.descLastChange()
        },
        {
            id: SortNodes.SORT_DATE_DESC,
            text: 'По времени создания (от новых к старым)',
            select: false,
            possibleSelect: true,
            action: () => this.ascDate()
        },
        {
            id: SortNodes.SORT_DATE_ASC,
            text: 'По времени создания (от старых к новым)',
            select: false,
            possibleSelect: true,
            action: () => this.descDate()
        }
    ];

    public menuSubject = new BehaviorSubject<ContextMenuItem[]>(this.initialMenu);
    public menu$ = this.menuSubject.asObservable();

    public setActive(index: number) {
        const updatedMenu = this.menuSubject.value.map((item, i) => ({
            ...item,
            select: i === index
        }));
        this.menuSubject.next(updatedMenu);
    }

    // Методы сортировки
    ascName() {
        this.setActive(0);
    }

    descName() {
        this.setActive(1);
    }

    ascLastChange() {
        this.setActive(2);
    }

    descLastChange() {
        this.setActive(3);
    }

    ascDate() {
        this.setActive(4);
    }

    descDate() {
        this.setActive(5);
    }

    getActiveSortId(): string {
        const activeItem = this.menuSubject.value.find((item) => item.select);
        return activeItem ? activeItem.id : SortNodes.SORT_NAME_ASC;
    }
}