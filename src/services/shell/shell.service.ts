import { Injectable } from '@angular/core';
import { Child, Command } from '@tauri-apps/plugin-shell';

@Injectable({
    providedIn: 'root'
})
export class ShellService {
    async startCmd(workingDir: string): Promise<Child> {
        const command = Command.create('cmd', ['/K', 'cd /d ' + workingDir], { cwd: workingDir });
        return command.spawn();
    }

    async sendCommand(child: Child, input: string): Promise<void> {
        await child.write(input + '\n');
    }
}