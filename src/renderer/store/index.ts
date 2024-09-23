import { VideoFileSummaryInfoTreeDirNode } from '../../types';
import { VideoJsPlayer } from 'video.js';
import { create } from 'zustand';

interface PlayListState {
  highlightIdx: number;
  selectedIdx: number;
  showPlaylist: boolean;
  playlist: VideoFileSummaryInfoTreeDirNode;
  rootDir: string;
  activePlaylist: VideoFileSummaryInfoTreeDirNode;
}

interface PlalistAction {
  initPlayList: (playlist: VideoFileSummaryInfoTreeDirNode) => void;
  updateActivePlayList: (activePlaylist: VideoFileSummaryInfoTreeDirNode) => void;
  setRootDir: (rootDir: string) => void;
  pureSetSelectedIdx: (selectedIdx: number) => void;
  setSelectedIdx: (selectedIdx: number) => void;
  setHighlightIdx: (highlightIdx: number) => void;
  setHighlightIdxForward: () => void;
  setHighlightIdxBackward: () => void;
  togglePlaylist: () => void;
  setShowPlaylist: () => void;
  setHidePlaylist: () => void;
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

export const usePlayListStore = create<PlayListState & PlalistAction>()(
  (set) => ({
    selectedIdx: -1,
    highlightIdx: -1,
    showPlaylist: false,
    rootDir: '',
    // root playlist
    playlist: genEmptyDirNode(),
    // current display playlist
    activePlaylist: genEmptyDirNode(),
    pureSetSelectedIdx: (selectedIdx) => set(() => ({ selectedIdx })),
    setSelectedIdx: (selectedIdx) => set(() => ({ selectedIdx, highlightIdx: selectedIdx })),
    setHighlightIdx: (highlightIdx) => set(() => ({ highlightIdx })),
    setHighlightIdxForward: () => set((s) => {
      const maxIdx = s.activePlaylist.directories.length + s.activePlaylist.files.length - 1;
      const newHighlightIdx = s.highlightIdx >= maxIdx ? maxIdx : s.highlightIdx + 1;
      return { highlightIdx: newHighlightIdx };
    }),
    setHighlightIdxBackward: () => set((s) => {
      const newHighlightIdx = s.highlightIdx > 0 ? s.highlightIdx - 1 : 0;
      return { highlightIdx: newHighlightIdx };
    }),
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
