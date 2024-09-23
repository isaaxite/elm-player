import React, { useEffect, useMemo, useRef } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import './Playlist.scss';
import { usePlayListStore } from '../store';
import { VideoFileSummaryInfoTreeDirNode, VideoFileTreeSummaryInfoFileNode } from '../../types';
import { range } from '../../utils';
interface VideoSource {
  src: string;
  type: string;
}

export interface VideoInfo {
  sources: Array<VideoSource>;
  poster: string;
}

interface PlaylistProps {
  classlist?: Array<string>;
  enableKeySwitch?: boolean;
  onDoubleClickDirItem?: (args: {
    dirItem: VideoFileSummaryInfoTreeDirNode, 
    idx: number,
  }) => void;
  onDoubleClickFileItem?: (args: {
    fileItem: VideoFileTreeSummaryInfoFileNode, 
    idx: number,
  }) => void;
};

const Playlist = (props: PlaylistProps) => {
  const scrollContainerRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
  const perfectScrollbarRef: React.MutableRefObject<null | PerfectScrollbar> = useRef(null);
  const {
    onDoubleClickDirItem,
    onDoubleClickFileItem,
  } = props;

  const {
    rootDir,
    selectedIdx,
    highlightIdx,
    showPlaylist,
    activePlaylist,
    playlist: rootPlaylist,
    setSelectedIdx,
    setHidePlaylist,
    updateActivePlayList,
    setHighlightIdxForward,
    setHighlightIdxBackward,
  } = usePlayListStore(s => s);

  const isShowPreDirBtn = useMemo(() => activePlaylist.fullpath !== rootPlaylist.fullpath, [
    activePlaylist.fullpath,
    rootPlaylist.fullpath,
  ]);

  const getActiveStyleClass = (idx: number) => {
    return idx === selectedIdx
      ? 'elm-playlist__item--selected'
      : idx === highlightIdx
        ? 'elm-playlist__item--highlight'
        : '';
  };

  const dirItemDoubleClickHandler = (
    dirItem: VideoFileSummaryInfoTreeDirNode,
    idx: number
  ) => {
    setSelectedIdx(-1);
    updateActivePlayList(dirItem);
    onDoubleClickDirItem && onDoubleClickDirItem({ dirItem, idx });
  };
  const fileItemDoubleClickHandler = (
    fileItem: VideoFileTreeSummaryInfoFileNode,
    idx: number
  ) => {
    onDoubleClickFileItem && onDoubleClickFileItem({ fileItem, idx });
    setSelectedIdx(idx);
  };

  useEffect(() => {
    const elmPlaylistContainerEle = document.getElementById('elm-playlist') as HTMLDivElement;
    if (elmPlaylistContainerEle) {
      const HIDDEN_CLASSNAME = 'elm-playlist--hide';
      if (showPlaylist) {
        elmPlaylistContainerEle.classList.remove(HIDDEN_CLASSNAME);
      } else {
        elmPlaylistContainerEle.classList.add(HIDDEN_CLASSNAME);
      }
    }
  }, [showPlaylist]);

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    perfectScrollbarRef.current = new PerfectScrollbar(scrollContainerRef.current!);
  }, [scrollContainerRef]);

  useEffect(() => {
    if (!scrollContainerRef.current || !perfectScrollbarRef.current) {
      return console.info({
        'scrollContainerRef.current': !!scrollContainerRef.current,
        'perfectScrollbarRef.current': !!perfectScrollbarRef.current,
      });
    }

    perfectScrollbarRef.current.update();
  }, [
    perfectScrollbarRef,
    scrollContainerRef,
    activePlaylist,
  ]);

  useEffect(() => {
    const switchToNewMedia = (type: 'PREV' | 'NEXT') => {
      const state = usePlayListStore.getState();
      const ranger = range(state.activePlaylist.directories.length, state.activePlaylist.directories.length + state.activePlaylist.files.length - 1);

      if (ranger.isOutside(state.selectedIdx)) {
        return;
      }

      const newIdx = type === 'PREV' 
        ? ranger.getPrevIdxBy(state.selectedIdx)
        : ranger.getNextIdxBy(state.selectedIdx);
      const newFileItem = state.activePlaylist.files[newIdx % state.activePlaylist.directories.length];
      fileItemDoubleClickHandler(newFileItem, newIdx);
    };

    window.electronAPI.onPrevMedia(() => switchToNewMedia('PREV'));
    window.electronAPI.onNextMedia(() => switchToNewMedia('NEXT'));
  }, []);

  useEffect(() => {
    function submitHighlightIdx() {
      const state = usePlayListStore.getState();
      const highlightIdx = state.highlightIdx;

      if (range(0, state.activePlaylist.directories.length + state.activePlaylist.files.length - 1).isOutside(highlightIdx)) {
        return;
      }

      if (
        state.activePlaylist.directories.length
        && highlightIdx < state.activePlaylist.directories.length
      ) {
        dirItemDoubleClickHandler(state.activePlaylist.directories[highlightIdx], highlightIdx);
        return;
      }

      if (state.activePlaylist.files.length) {
        setSelectedIdx(highlightIdx);
        fileItemDoubleClickHandler(state.activePlaylist.files[highlightIdx % state.activePlaylist.directories.length], highlightIdx);
      }
    }
    function keyPressHandler(event: KeyboardEvent) {
      switch (event.key) {
        case 'ArrowUp':
          setHighlightIdxBackward();
          break;
        case 'ArrowDown':
          setHighlightIdxForward();
          break;
        case 'Enter':
          submitHighlightIdx();
          break; 
        default:
          console.info(`key down ${event.key}`);
      }
    };
    window.addEventListener('keydown', keyPressHandler);
    return () => {
      window.removeEventListener('keydown', keyPressHandler);
    };
  }, []);

  const prevDirBtnClickHandler = () => {
    updateActivePlayList(activePlaylist.parentRef!);
  };

  const genListDirItemEle = (dirItem: VideoFileSummaryInfoTreeDirNode, idx: number) => {
    return (
      <li
        key={dirItem.fullpath}
        className={[
          'elm-playlist__item',
          ...[getActiveStyleClass(idx)],
        ].join(' ')}
        onDoubleClick={() => dirItemDoubleClickHandler(dirItem, idx)}
      >
        <span className='elm-playlist__item-tag'>D </span>
        <span className='elm-playlist__item-title'>{dirItem.directoryName}</span>
      </li>
    );
  };

  const genListFileItemEle = (fileItem: VideoFileTreeSummaryInfoFileNode, idx: number) => {
    return (
      <li
        key={fileItem.filePath}
        className={[
          'elm-playlist__item',
          ...[getActiveStyleClass(idx)],
        ].join(' ')}
        onDoubleClick={() => fileItemDoubleClickHandler(fileItem, idx)}
      >
        <span className='elm-playlist__item-tag'>F </span>
        <span className='elm-playlist__item-title'>{fileItem.fileName}</span>
      </li>
    );
  };

  return showPlaylist ? (
    <>
      <div
        className='elm-playlist__mask'
        onClick={() => {
          setHidePlaylist();
        }}
      />
      <div className='elm-playlist__bg' />
      {isShowPreDirBtn ? (
        <button
          id='elm-playlist__prev-dir-btn'
          onClick={prevDirBtnClickHandler}
        >Prev Directory</button>
      ) : (<></>)}
      <div className={[
        'elm-playlist__container',
        ...[isShowPreDirBtn ? 'elm-playlist__container--show-pre-btn': ''],
      ].join(' ')}
        ref={scrollContainerRef}
        data-mdb-perfect-scrollbar='true'
      >
        <ul>
          {activePlaylist.directories.map(genListDirItemEle)}
          {activePlaylist.files.map((item, idx) => genListFileItemEle(item, idx + activePlaylist.directories.length))}
        </ul>
      </div>
    </>
  ) : (<></>);
};

export default Playlist;
