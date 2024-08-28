export interface IElectronAPI {
  getLocalFiles: (directory: string) => Promise<FileList[]>;
  onPrevMedia: (handler: () => void) => Promise<void>;
  onNextMedia: (handler: () => void) => Promise<void>;
  onSwitchPlaylist: (handler: () => void) => Promise<void>;
  onSelectedDirectory: (handler: (dirPath: string) => void) => Promise<void>;
}

export interface FileList {
  name: string;
  path: string;
  isDirectory: boolean;
}
