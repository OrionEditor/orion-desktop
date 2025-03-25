// tab.service.ts
import { Injectable } from '@angular/core';
import {Tab} from "../interfaces/components/tab.interface";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TabService {
    private tabs: Tab[] = [];
    private tabsSubject = new BehaviorSubject<Tab[]>([]);
    tabs$ = this.tabsSubject.asObservable();

    constructor() {}

    createTab(filePath: string, fileName: string): void {
        const id = this.generateUniqueId();
        const newTab: Tab = {
            id,
            fileName,
            filePath,
            isActive: true
        };

        // Деактивируем все остальные табы
        this.tabs.forEach(tab => tab.isActive = false);
        this.tabs.push(newTab);
        this.updateTabs();
    }

    closeTab(id: string): void {
        const index = this.tabs.findIndex(tab => tab.id === id);
        if (index !== -1) {
            const wasActive = this.tabs[index].isActive;
            this.tabs.splice(index, 1);

            // Если закрытый таб был активным, активируем первый оставшийся
            if (wasActive && this.tabs.length > 0) {
                this.tabs[0].isActive = true;
            }
            this.updateTabs();
        }
    }

    setActiveTab(id: string): void {
        this.tabs.forEach(tab => tab.isActive = tab.id === id);
        this.updateTabs();
    }

    getTab(id: string): Tab | undefined {
        return this.tabs.find(tab => tab.id === id);
    }

    getAllTabs(): Tab[] {
        return [...this.tabs];
    }

    private generateUniqueId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private updateTabs(): void {
        this.tabsSubject.next([...this.tabs]);
    }
}