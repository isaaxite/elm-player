import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import VideoJS from './VideoJS';
import { VideoJsPlayer } from 'video.js';
import './Media.scss';
import { useMediaStore, usePlayListStore } from '../store';
import Playlist from './Playlist';
import { PlaybackType, VideoFileSummaryInfoTreeDirNode, VideoFileTreeSummaryInfoFileNode } from '../../types';


const Media  = () => {
  const playerRef: React.MutableRefObject<VideoJsPlayer | null> = React.useRef(null);
  const {
    rootDir,
    playlist,
    togglePlaylist,
    setShowPlaylist,
    setSelectedIdx,
  } = usePlayListStore(s => s);
  const setPlayer = useMediaStore(s => s.setPlayer);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    // controlBar: {
    //   skipButtons: {
    //     forward: 5,
    //     backward: 5
    //   }
    // },
    disablePictureInPicture: true,
    experimentalSvgIcons: true,
    preferFullWindow: true,
  };

  useEffect(() => {
    if (!playerRef.current || !rootDir) {
      return console.log({
        'playerRef.current': !!playerRef.current,
        rootDir,
      });
    }

    setSelectedIdx(-1);
    playerRef.current.pause();
    playerRef.current.reset();
  }, [
    rootDir,
    playerRef,
  ]);

  // shotcut
  useEffect(() => {
    window.electronAPI.onPlayback((playbackType) => {
      const seek = (sec: number) => {
        const currentTime = playerRef.current!.currentTime();
        const ret = playerRef.current!.currentTime(currentTime + sec);
        console.info({ currentTime, ret });
      };
      switch (playbackType) {
        case PlaybackType.JUMP_BACKWARD:
          seek(-5);
          break;
        case PlaybackType.JUMP_FORWARD:
          seek(5);
          break;
        default:
          console.info(playbackType)
      }
      
    });
  }, []);

  const handleKeyupSwitchMidea = () => {}
  const handleDoubleClickDirItem = (
    playerCuttent: VideoJsPlayer,
    dirItem: VideoFileSummaryInfoTreeDirNode
  ) => {
    console.info({dirItem})
  };
  const handleDoubleClickFileItem = (
    playerCuttent: VideoJsPlayer,
    fileItem: VideoFileTreeSummaryInfoFileNode
  ) => {
    if (playerCuttent.currentSrc()) {
      playerCuttent.pause();
      playerCuttent.reset();
    }

    playerCuttent.src({
      src: fileItem.filePath,
      type: fileItem.mimeType
    });
  };

  const appendPlaylistWraper = (playerCuttent: VideoJsPlayer) => {
    const playlistWraper = document.createElement('div');
    playlistWraper.id = 'elm-playlist';

    playerCuttent.el().appendChild(playlistWraper);

    return playlistWraper;
  };

  const renderPlaylist = (playerCuttent: VideoJsPlayer) => {
    const playlistWraper = appendPlaylistWraper(playerCuttent);
    setShowPlaylist();
    createRoot(document.getElementById(playlistWraper.id) as HTMLDivElement).render(
      <Playlist
        onDoubleClickFileItem={({ fileItem }) => handleDoubleClickFileItem(playerCuttent, fileItem)}
        onDoubleClickDirItem={({ dirItem }) => handleDoubleClickDirItem(playerCuttent, dirItem)}
      />
    );
  }

  const handlePlayerReady = (player: VideoJsPlayer) => {
    setPlayer(player);
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });

    (player.getChild as any)('ControlBar').addChild('button', {
      controlText: 'Playlist',
      className: 'vjs-visible-text',
      clickHandler() {
        console.info('ControlBar-toggle-playlist click');
        togglePlaylist();
      }
    });

    renderPlaylist(player);
  };

  return (
    <VideoJS
      options={videoJsOptions}
      onReady={handlePlayerReady}
    />
  );
};

export default Media;
