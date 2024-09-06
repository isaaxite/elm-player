import React from 'react';
import VideoJS from './VideoJS';
import { VideoJsPlayer } from 'video.js';


const Media  = () => {
  const playerRef: React.MutableRefObject<VideoJsPlayer | null> = React.useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    // fluid: true,
    sources: [{
      src: 'file:///home/isaac/Workspace/elm-player/dist/assets/oceans.mp4',
      type: 'video/mp4'
    }]
  };

  const videoList = [
    {
      name: 'oceans',
      sources: [{
        src: 'file:///home/isaac/Workspace/elm-player/dist/assets/oceans.mp4',
        type: 'video/mp4'
      }],
      poster: 'file:///home/isaac/Workspace/elm-player/dist/assets/sintel_poster.png'
    },
    {
      name: 'trailer',
      sources: [{
        src: 'file:///home/isaac/Workspace/elm-player/dist/assets/trailer.mp4',
        type: 'video/mp4'
      }],
      poster: 'file:///home/isaac/Workspace/elm-player/dist/assets/bunny_poster.png'
    }
  ];

  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  };

  return (
    <VideoJS
      options={videoJsOptions}
      videoList={videoList}
      onReady={handlePlayerReady}
    />
  );
};

export default Media;
