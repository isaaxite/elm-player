import React, { useRef, useEffect } from 'react';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-playlist';
import './VideoJS.scss';
import { usePlayListStore } from '../store';

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
  onReady: (player: VideoJsPlayer) => void;
}

export const VideoJS = (props: VideoJSProps) => {
  const videoRef: React.LegacyRef<HTMLDivElement> | undefined = React.useRef(null);
  const playerRef: React.MutableRefObject<null | VideoJsPlayer> = React.useRef(null);
  const {
    options,
    onReady
  }: VideoJSProps = props;

  const { showPlaylist } = usePlayListStore(s => s);

  const playlistNode = useRef(null);

  const initPlayer = () => {
    const videoElement = document.createElement("video-js");

    videoElement.classList.add('elm-vjs__video-wraper');
    videoRef.current!.appendChild(videoElement);
    
    const player = videojs(videoElement, options, () => {
      console.log('player is ready');

      // renderPlaylist(player);
      onReady && onReady(player);
    });

    return player;
  };

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = initPlayer();
    }

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
      <div id="elm-vjs" className='elm-vjs' data-vjs-player>
        <div className='elm-vjs__wraper' ref={videoRef} />
      </div>
      <div ref={playlistNode} className="vjs-playlist" />
    </>
  );
}

export default VideoJS;
