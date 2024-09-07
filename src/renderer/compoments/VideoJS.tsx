import React, { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import Playlist from './Playlist';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import 'video.js/dist/video-js.css';
// import * as playlist from 'videojs-playlist';
import 'videojs-playlist';
// import 'videojs-playlist-ui';
// import 'videojs-playlist-ui/dist/videojs-playlist-ui.css';
import './VideoJS.scss';

interface VideoSource {
  src: string;
  type: string;
}

export interface VideoInfo {
  sources: Array<VideoSource>;
  poster: string;
}

export interface VideoJSProps {
  options: VideoJsPlayerOptions;
  videoList: Array<VideoInfo>;
  onReady: (player: VideoJsPlayer) => void;
}

export const VideoJS = (props: VideoJSProps) => {
  const videoRef: React.LegacyRef<HTMLDivElement> | undefined = React.useRef(null);
  const playerRef: React.MutableRefObject<null | VideoJsPlayer> = React.useRef(null);
  const {
    options,
    onReady,
    videoList,
  }: VideoJSProps = props;

  const playlistNode = useRef(null);

  // todo
  const handleKeyupSwitchMidea = () => {}
  const handleDoubleClickListItem = (playerCuttent: VideoJsPlayer, videoInfo: VideoInfo, idx: number) => {
    console.info({
      videoInfo, idx
    })

    playerCuttent.playlist.currentItem(idx);
  };
  const renderPlaylist = (playerCuttent: VideoJsPlayer) => {
    const playlistWraper = document.createElement('div');
    playlistWraper.id = 'elm-playlist';
    playerCuttent.el().appendChild(playlistWraper);

    createRoot(document.getElementById(playlistWraper.id) as HTMLDivElement).render(
      <Playlist onDoubleClickListItem={(e, videoInfo, idx) => {
        handleDoubleClickListItem(playerCuttent, videoInfo, idx);
      }} videoList={videoList} />
    );
  }


  const initPlayer = () => {
    const videoElement = document.createElement("video-js");

    videoElement.classList.add('elm-vjs__video-wraper');
    videoRef.current!.appendChild(videoElement);
    
    const player = videojs(videoElement, options, () => {
      console.log('player is ready');

      renderPlaylist(player);
      onReady && onReady(player);
    });

    return player;
  };

  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = initPlayer();
    }

    if (playerRef.current && videoList) {
      playerRef.current.playlist(videoList);
      // playerRef.current.playlistUi(playlistNode.current);
      // playerRef.current.videoList.autoadvance(0); // 自动播放下一个视频
    }
  }, [videoList]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <>
      <div className='elm-vjs' data-vjs-player>
        <div className='elm-vjs__wraper' ref={videoRef} />
      </div>
      <div ref={playlistNode} className="vjs-playlist" />
    </>
  );
}

export default VideoJS;
