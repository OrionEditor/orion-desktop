// import 'zone.js';
// import 'zone.js/testing';
// import 'jest-preset-angular/setup-jest';
// import { getTestBed } from '@angular/core/testing';
// import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
// import { mockIPC } from '@tauri-apps/api/mocks';
//
// // Инициализируем TestBed только если он ещё не инициализирован
// if (!getTestBed().platform) {
//     getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
// }
//
// mockIPC((command) => {
//     switch (command) {
//         case 'get_file_structure':
//             return [
//                 {
//                     name: 'test',
//                     path: '/test',
//                     expanded: false,
//                     type_id: 'folder',
//                     isDirectory: true,
//                     created: 1697059200000,
//                     last_modified: 1697059200000
//                 }
//             ];
//         case 'create_directory':
//             return true;
//         case 'create_file':
//             return true;
//         case 'delete_file':
//             return true;
//         case 'rename_file':
//             return true;
//         case 'move_folder':
//             return true;
//         default:
//             throw new Error(`Unknown command: ${command}`);
//     }
// });

import 'zone.js';
import 'zone.js/testing';
import 'jest-preset-angular/setup-jest';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { mockIPC } from '@tauri-apps/api/mocks';

if (!getTestBed().platform) {
    getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
}

mockIPC((cmd, args) => {
    console.log('mockIPC called with:', { cmd, args }); // Отладка
    if (cmd === 'plugin:event|listen') {
        return Promise.resolve(() => {});
    }

    switch (cmd) {
        // Команды для FileSystemService
        case 'get_file_structure':
            return [
                {
                    name: 'test',
                    path: '/test',
                    expanded: false,
                    type_id: 'folder',
                    isDirectory: true,
                    created: 1697059200000,
                    last_modified: 1697059200000,
                },
            ];
        case 'create_directory':
        case 'create_file':
        case 'delete_file':
        case 'rename_file':
        case 'move_folder':
            return true;

        // Команды для ConfigService
        case 'get_recent_projects':
            return [
                { path: '/project1', name: 'Project 1' },
                { path: '/project2', name: 'Project 2' },
            ];
        case 'get_theme':
            return 'dark';
        case 'get_last_opened':
            return '/project1';
        case 'get_language':
            return 'en';
        case 'toggle_theme':
        case 'set_language':
        case 'set_last_opened':
            return undefined;

        default:
            throw new Error(`Unknown command: ${cmd}`);
    }
});