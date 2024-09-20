import { VIDEO_MINE_TYPES } from "./constant";

export interface IElectronAPI {
  getLocalFiles: (directory: string) => Promise<FileList[]>;
  onPrevMedia: (handler: () => void) => Promise<void>;
  onNextMedia: (handler: () => void) => Promise<void>;
  onSwitchPlaylist: (handler: () => void) => Promise<void>;
  onSelectedDirectory: (handler: (dirPath: string) => void) => Promise<void>;
  getVideoFileSummaryInfoList: (directory: string) => Promise<VideoFileSummaryInfoList>,
}

export interface FileList {
  name: string;
  path: string;
  isDirectory: boolean;
}

export type VideoMimeType = typeof VIDEO_MINE_TYPES[keyof typeof VIDEO_MINE_TYPES] | 'video/unknown';

export interface TinyFileItem {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: VideoMimeType;
}

export interface TinyDirItem {
  directory: string;
  directoryPath: string;
  files: VideoFileSummaryInfoList;
}

export type VideoFileSummaryInfoListItem = TinyFileItem | TinyDirItem;
export type VideoFileSummaryInfoList = Array<TinyFileItem | TinyDirItem>;
