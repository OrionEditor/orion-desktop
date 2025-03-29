import {openPath, revealItemInDir} from "@tauri-apps/plugin-opener";

export async function OpenInExplorer(filePath: string){
    await revealItemInDir(filePath);
}