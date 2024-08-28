import { IElectronAPI } from "./types.ts";

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
