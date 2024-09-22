import React, { useEffect, useRef } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import './Playlist.scss';
import { usePlayListStore } from '../store';
import { VideoFileSummaryInfoTreeDirNode, VideoFileTreeSummaryInfoFileNode } from '../../types';
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
    event: React.MouseEvent<HTMLLIElement, MouseEvent>, 
    dirItem: VideoFileSummaryInfoTreeDirNode, 
    idx: number,
  }) => void;
  onDoubleClickFileItem?: (args: {
    event: React.MouseEvent<HTMLLIElement, MouseEvent>, 
    fileItem: VideoFileTreeSummaryInfoFileNode, 
    idx: number,
  }) => void;
};

const Playlist = (props: PlaylistProps) => {
  const scrollContainerRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
  const {
    onDoubleClickDirItem,
    onDoubleClickFileItem,
  } = props;

  const {
    selectedIdx,
    showPlaylist,
    activePlaylist,
    setSelectedIdx,
    setHidePlaylist,
  } = usePlayListStore(s => s);

  useEffect(() => {
    console.info({showPlaylist})
    const elmPlaylistContainerEle = document.getElementById('elm-playlist') as HTMLDivElement;
    if (elmPlaylistContainerEle) {
      const HIDDEN_CLASSNAME = 'elm-playlist--hide';
      if (showPlaylist) {
        elmPlaylistContainerEle.classList.remove(HIDDEN_CLASSNAME);
      } else {
        elmPlaylistContainerEle.classList.add(HIDDEN_CLASSNAME);
      }
    }
  }, [showPlaylist])

  useEffect(() => {
    console.info({activePlaylist})
  }, [activePlaylist])


  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    const ps = new PerfectScrollbar(scrollContainerRef.current!);
  }, [scrollContainerRef]);

  const genListDirItemEle = (dirItem: VideoFileSummaryInfoTreeDirNode, idx: number) => {
    return (
      <li
        key={dirItem.fullpath}
        className={[
          'elm-playlist__item',
          ...[idx === selectedIdx ? 'elm-playlist__item--selected' : ''],
        ].join(' ')}
        onDoubleClick={(event) => {
          onDoubleClickDirItem && onDoubleClickDirItem({ event, dirItem, idx });
          setSelectedIdx(idx);
        }}
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
          ...[idx === selectedIdx ? 'elm-playlist__item--selected' : ''],
        ].join(' ')}
        onDoubleClick={(event) => {
          onDoubleClickFileItem && onDoubleClickFileItem({ event, fileItem, idx });
          setSelectedIdx(idx);
        }}
      >
        <span className='elm-playlist__item-tag'>F </span>
        <span className='elm-playlist__item-title'>{fileItem.fileName}</span>
      </li>
    );
  };

  return showPlaylist ? (
    <>
      <div className='elm-playlist__mask' onClick={() => {
        setHidePlaylist();
      }} />
      <div className={'elm-playlist__container'}
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