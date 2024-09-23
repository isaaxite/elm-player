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

export interface IElectronAPI {
  getLocalFiles: (directory: string) => Promise<FileList[]>;
  onPrevMedia: (handler: () => void) => Promise<void>;
  onNextMedia: (handler: () => void) => Promise<void>;
  onSwitchPlaylist: (handler: () => void) => Promise<void>;
  onSelectedDirectory: (handler: (dirPath: string) => void) => Promise<void>;
  getVideoFileSummaryInfoList: (directory: string) => Promise<VideoFileSummaryInfoTreeDirNode>;
  onWindowResize: (handler: () => void) => Promise<void>;
}

export interface FileList {
  name: string;
  path: string;
  isDirectory: boolean;
}

export type VideoMimeType = typeof VIDEO_MINE_TYPES[keyof typeof VIDEO_MINE_TYPES] | 'video/unknown';
