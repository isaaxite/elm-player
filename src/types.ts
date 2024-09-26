import { VIDEO_MINE_TYPES } from "./constant";

export interface VideoFileTreeSummaryInfoFileNode {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: VideoMimeType;
}

export interface VideoFileSummaryInfoTreeDirNode {
  parentRef?: VideoFileSummaryInfoTreeDirNode;
  directoryName: string;
  fullpath: string;
  directories: Array<VideoFileSummaryInfoTreeDirNode>;
  files: Array<VideoFileTreeSummaryInfoFileNode>;
}

export enum PlaybackType {
  JUMP_BACKWARD = 'jump_backward',
  JUMP_FORWARD = 'jump_forward',
  PLAY_OR_PAUSE = 'play_or_pause',
};

export enum AudioMenuType {
  INCREASE_VOLUME = 'increase_volume',
  DECREASE_VOLUME = 'decrease_volume',
  MUTE_VOLUME = 'mute_volume',
}

export interface IElectronAPI {
  getLocalFiles: (directory: string) => Promise<FileList[]>;
  onPrevMedia: (handler: () => void) => Promise<void>;
  onNextMedia: (handler: () => void) => Promise<void>;
  onSwitchPlaylist: (handler: () => void) => Promise<void>;
  onSelectedDirectory: (handler: (dirPath: string) => void) => Promise<void>;
  getVideoFileSummaryInfoList: (directory: string) => Promise<VideoFileSummaryInfoTreeDirNode>;
  onWindowResize: (handler: () => void) => Promise<void>;
  onPlaybackNativeMenuClick: (handler: (type: PlaybackType) => void) => Promise<void>;
  onAudioNativeMenuClick: (handler: (type: AudioMenuType) => void) => Promise<void>;
}

export interface FileList {
  name: string;
  path: string;
  isDirectory: boolean;
}

export type VideoMimeType = typeof VIDEO_MINE_TYPES[keyof typeof VIDEO_MINE_TYPES] | 'video/unknown';
