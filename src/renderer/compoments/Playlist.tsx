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

const Playlist = (props: { videoList: Array<VideoInfo>; }) => {
  const scrollContainerRef: React.MutableRefObject<null | HTMLUListElement> = useRef(null);
  const {
    videoList
  } = props;


  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    const ps = new PerfectScrollbar(scrollContainerRef.current!);
  }, [scrollContainerRef]);

  return (
    <div className='elm-playlist__container' ref={scrollContainerRef} data-mdb-perfect-scrollbar='true'>
      <ul>
        {[
          ...videoList,
          ...videoList,
          ...videoList,
          ...videoList,
          ...videoList,
          ...videoList,
          ...videoList,
          ...videoList,
          ...videoList,
          ...videoList,
          ...videoList,
          ...videoList,
          ...videoList,
          ...videoList,
        ].map((videoInfo, idx) => {
          return (<li className='elm-playlist__item'>{idx} {videoInfo.sources[0].src}</li>)
        })}
      </ul>
    </div>
  );
};

export default Playlist;