import React from 'react';
import VideoJS from './VideoJS';
import { VideoJsPlayer } from 'video.js';


const Media  = () => {
  const playerRef: React.MutableRefObject<VideoJsPlayer | null> = React.useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: 'file:///home/isaac/Workspace/elm-player/dist/assets/oceans.mp4',
      type: 'video/mp4'
    }]
  };

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
    <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
  );
};

export default Media;
