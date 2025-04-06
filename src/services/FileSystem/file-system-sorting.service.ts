import { Injectable } from '@angular/core';
import {FileSystemNode} from "../../interfaces/filesystem/filesystem-node.interface";
import {SortNodes} from "../../shared/enums/sort.enum";

@Injectable({
    providedIn: 'root'
})
export class FileSystemSortingService {
    private currentSort: string = 'sort-name-asc';

    setSortCriteria(sortId: string) {
        this.currentSort = sortId;
    }

    getSortCriteria(): string {
        return this.currentSort;
    }

    sort(nodes: FileSystemNode[]): FileSystemNode[] {
        const sortedNodes = [...nodes]; // Создаём копию массива
        this.applySort(sortedNodes);
        return sortedNodes;
    }

    private applySort(nodes: FileSystemNode[]) {
        nodes.sort((a, b) => {
            switch (this.currentSort) {
                case SortNodes.SORT_NAME_ASC:
                    return a.name.localeCompare(b.name);
                case SortNodes.SORT_NAME_DESC:
                    return b.name.localeCompare(a.name);
                case SortNodes.SORT_DATE_CHANGE_ASC:
                    return (a.last_modified || 0) - (b.last_modified || 0);
                case SortNodes.SORT_DATE_CHANGE_DESC:
                    return (b.last_modified || 0) - (a.last_modified || 0);
                case SortNodes.SORT_DATE_ASC:
                    return (a.created || 0) - (b.created || 0);
                case SortNodes.SORT_DATE_DESC:
                    return (b.created || 0) - (a.created || 0);
                default:
                    return 0;
            }
        });

        nodes.forEach(node => {
            if (node.children && node.children.length > 0) {
                this.applySort(node.children);
            }
        });
    }
}