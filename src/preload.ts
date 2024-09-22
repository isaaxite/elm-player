import { contextBridge, ipcRenderer } from "electron";
import { VideoFileSummaryInfoTreeDirNode } from "./types";

function ipcRendererHandlerFactory(eventNmae: string) {
  return (handler: () => void) => {
    ipcRenderer.on(eventNmae, (e, command) => {
      handler();
    })
  };
}

contextBridge.exposeInMainWorld('electronAPI', {
  getLocalFiles: (directory: string): Promise<FileList[]> => ipcRenderer.invoke('get-local-files', directory),
  onPrevMedia: (handler: () => void) => {
    return ipcRenderer.on('prev-media', (e, command) => {
      handler();
    })
  },
  onNextMedia: (handler: () => void) => {
    return ipcRenderer.on('next-media', (e, command) => {
      handler();
    })
  },
  onSwitchPlaylist: ipcRendererHandlerFactory('switch-playlist'),
  onSelectedDirectory: (handler: (dirPath: string) => void) => {
    return ipcRenderer.on('selected-directory', (e, dirPath) => {
      handler(dirPath);
    })
  },
  getVideoFileSummaryInfoList: (directory: string): Promise<VideoFileSummaryInfoTreeDirNode> => ipcRenderer.invoke('get-video-file-tiny-tree', directory),
});
