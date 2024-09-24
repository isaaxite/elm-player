import { contextBridge, ipcRenderer } from "electron";
import { AudioMenuType, PlaybackType, VideoFileSummaryInfoTreeDirNode } from "./types";
// todo: error
// import { IELECTRON_EVENT_TYPES } from "./constant";

const IELECTRON_EVENT_TYPES = {
  playback: 'native_menu_emit_playback',
  audio: 'native_menu_emit_audio',
} as const;


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
  onPlaybackNativeMenuClick: (handler: (type: PlaybackType) => void) => {
    return ipcRenderer.on(IELECTRON_EVENT_TYPES.playback, (e, type) => {
      handler(type);
    });
  },
  onAudioNativeMenuClick: (handler: (type: AudioMenuType) => void) => {
    return ipcRenderer.on(IELECTRON_EVENT_TYPES.audio, (e, type) => {
      handler(type);
    });
  }
});
