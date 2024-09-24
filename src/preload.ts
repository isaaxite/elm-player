import { contextBridge, ipcRenderer } from "electron";
import { PlaybackType, VideoFileSummaryInfoTreeDirNode } from "./types";
import { IELECTRON_EVENT_TYPES } from "./constant";


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
  onWindowResize: ipcRendererHandlerFactory('window-resize'),
  onPlayback: (handler: (type: PlaybackType) => void) => {
    return ipcRenderer.on(IELECTRON_EVENT_TYPES.playback, (e, type) => {
      handler(type);
    });
  }
});
