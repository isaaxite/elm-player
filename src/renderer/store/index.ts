import { VideoFileSummaryInfoTreeDirNode } from '../../types';
import { VideoJsPlayer } from 'video.js';
import { create } from 'zustand';

interface PlayListState {
  selectedIdx: number;
  showPlaylist: boolean;
  playlist: VideoFileSummaryInfoTreeDirNode;
  rootDir: string;
  activePlaylist: VideoFileSummaryInfoTreeDirNode;
}

function genEmptyDirNode () {
  return {
    directoryName: '',
    fullpath: '',
    parentRef: void(0),
    directories: [],
    files: [],
  } as VideoFileSummaryInfoTreeDirNode;
}

interface PlalistAction {
  initPlayList: (playlist: VideoFileSummaryInfoTreeDirNode) => void;
  updateActivePlayList: (activePlaylist: VideoFileSummaryInfoTreeDirNode) => void;
  setRootDir: (rootDir: string) => void;
  setSelectedIdx: (selectedIdx: number) => void;
  togglePlaylist: () => void;
  setShowPlaylist: () => void;
  setHidePlaylist: () => void;
}

export const usePlayListStore = create<PlayListState & PlalistAction>()(
  (set) => ({
    selectedIdx: -1,
    showPlaylist: false,
    rootDir: '',
    playlist: genEmptyDirNode(),
    activePlaylist: genEmptyDirNode(),
    setSelectedIdx: (selectedIdx) => set(() => ({ selectedIdx })),
    setRootDir: (rootDir) => set(() => ({ rootDir })),
    initPlayList: (playlist) => set(() => ({ playlist })),
    updateActivePlayList: (activePlaylist) => set(() => ({ activePlaylist })),
    togglePlaylist: () => set((state) => ({ showPlaylist: !state.showPlaylist })),
    setShowPlaylist: () => set(() => ({ showPlaylist: true })),
    setHidePlaylist: () => set(() => ({ showPlaylist: false })),
  })
);

interface MediaStoreState {
  player: VideoJsPlayer | undefined;
}

interface MediaStoreAction {
  setPlayer: (player: VideoJsPlayer) => void;
}

type MediaStore = MediaStoreState & MediaStoreAction;

export const useMediaStore = create<MediaStore>()((set) => ({
  player: void(0),
  setPlayer: (player) => set(() => ({ player })),
}));
