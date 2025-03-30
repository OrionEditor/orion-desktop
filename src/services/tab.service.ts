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
        const existingTab = this.tabs.find(tab => tab.filePath === filePath);
        if (existingTab) {
            this.setActiveTab(existingTab.id);
        } else {
            const id = this.generateUniqueId();
            const newTab: Tab = {
                id,
                fileName,
                filePath,
                isActive: true,
                isPinned: false
            };

            this.tabs.forEach(tab => tab.isActive = false);
            this.tabs.push(newTab);
            this.updateTabs();
        }
    }

    closeTab(id: string): void {
        const index = this.tabs.findIndex(tab => tab.id === id);
        if (index !== -1 && !this.tabs[index].isPinned) {
            const wasActive = this.tabs[index].isActive;
            this.tabs.splice(index, 1);
            if (wasActive && this.tabs.length > 0) {
                this.tabs[0].isActive = true;
            }
            this.updateTabs();
        }
    }

    setActiveTab(id: string, tabs: Tab[] = this.tabs): void {
        this.tabs.forEach(tab => tab.isActive = tab.id === id);
        this.updateTabs(tabs);
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

    private updateTabs(tabs: Tab[] = this.tabs): void {
        this.tabsSubject.next([...tabs]);
    }

    pinTab(id: string): void {
        const tab = this.tabs.find(tab => tab.id === id);
        if (tab) {
            tab.isPinned = true;
            this.updateTabs();
        }
    }

    unpinTab(id: string): void {
        const tab = this.tabs.find(tab => tab.id === id);
        if (tab) {
            tab.isPinned = false;
            this.updateTabs();
        }
    }

    closeOtherTabs(currentTabId: string): void {
        this.tabs = this.tabs.filter(tab => tab.id === currentTabId || tab.isPinned);
        this.setActiveTab(currentTabId);
        this.updateTabs();
    }

    closeAllTabs(): void {
        this.tabs = [];
        this.updateTabs();
    }
}