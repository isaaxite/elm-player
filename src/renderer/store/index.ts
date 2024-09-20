import { VideoFileSummaryInfoListItem } from '../../types';
import { VideoJsPlayer } from 'video.js';
import { create } from 'zustand';

interface PlayListState {
  selectedIdx: number;
  showPlaylist: boolean;
  playlist: Array<VideoFileSummaryInfoListItem>;
  rootDir: string;
  activePlaylist: Array<VideoFileSummaryInfoListItem>;
}

interface PlalistAction {
  initPlayList: (playlist: Array<VideoFileSummaryInfoListItem>) => void;
  updateActivePlayList: (activePlaylist: Array<VideoFileSummaryInfoListItem>) => void;
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
    playlist: [],
    activePlaylist: [],
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
