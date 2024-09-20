import React, { useEffect, useRef } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import './Playlist.scss';
import { usePlayListStore } from '../store';
import { VideoFileSummaryInfoListItem } from '../../types';
import { isTinyDirItem } from '../../utils/typeGuards';
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
  videoList: Array<VideoFileSummaryInfoListItem>;
  onDoubleClickListItem?: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>, 
    videoInfo: VideoFileSummaryInfoListItem, 
    idx: number
  ) => void;
};

const Playlist = (props: PlaylistProps) => {
  const scrollContainerRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
  const {
    classlist = [],
    onDoubleClickListItem,
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

  const handleDoubleClickListItem = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    videoInfo: VideoFileSummaryInfoListItem,
    idx: number,
  ) => {
    // console.info(event.)
    if (onDoubleClickListItem) {
      onDoubleClickListItem(e, videoInfo, idx);
    }

    setSelectedIdx(idx);
  };

  const genListItemEle = (videoInfo: VideoFileSummaryInfoListItem, idx: number) => {
    const [
      tag,
      name,
      key,
    ] = isTinyDirItem(videoInfo) ? ['D', videoInfo.directory, videoInfo.directoryPath] : ['M', videoInfo.fileName, videoInfo.filePath];

    return (
      <li
        key={key}
        className={[
          'elm-playlist__item',
          ...[idx === selectedIdx ? 'elm-playlist__item--selected' : ''],
        ].join(' ')}
        onDoubleClick={(e) => handleDoubleClickListItem(e, videoInfo, idx)}
      >
        <span className='elm-playlist__item-tag'>{tag} </span>
        <span className='elm-playlist__item-title'>{name}</span>
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
          {activePlaylist.map(genListItemEle)}
        </ul>
      </div>
    </>
  ) : (<></>);
};

export default Playlist;