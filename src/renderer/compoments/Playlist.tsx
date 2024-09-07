import React, { useEffect, useRef } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import './Playlist.scss';

interface VideoSource {
  src: string;
  type: string;
}

export interface VideoInfo {
  sources: Array<VideoSource>;
  poster: string;
}

interface PlaylistProps {
  videoList: Array<VideoInfo>;
  onDoubleClickListItem?: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>, 
    videoInfo: VideoInfo, 
    idx: number
  ) => void;
};

const Playlist = (props: PlaylistProps) => {
  const scrollContainerRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
  const {
    videoList,
    onDoubleClickListItem,
  } = props;


  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    const ps = new PerfectScrollbar(scrollContainerRef.current!);
  }, [scrollContainerRef]);

  const handleDoubleClickListItem = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    videoInfo: VideoInfo,
    idx: number
  ) => {
    // console.info(event.)
    if (onDoubleClickListItem) {
      onDoubleClickListItem(e, videoInfo, idx);
    }
  };

  const genListItemEle = (videoInfo: VideoInfo, idx: number) => {
    return (<li onDoubleClick={(e) => handleDoubleClickListItem(e, videoInfo, idx)} className='elm-playlist__item'>{idx} {videoInfo.sources[0].src}</li>)
  };

  return (
    <div className='elm-playlist__container' ref={scrollContainerRef} data-mdb-perfect-scrollbar='true'>
      <ul>
        {videoList.map(genListItemEle)}
      </ul>
    </div>
  );
};

export default Playlist;