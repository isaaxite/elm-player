import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import VideoJS from './VideoJS';
import { VideoJsPlayer } from 'video.js';
import { useMediaStore, usePlayListStore } from '../store';
import Playlist from './Playlist';
import { AudioMenuType, MediaFileDetail, PlaybackType, VideoFileSummaryInfoTreeDirNode, VideoFileTreeSummaryInfoFileNode } from '../../types';

import './Media.scss';
import 'videojs-font/css/videojs-icons.css'


const Media  = () => {
  const playerRef: React.MutableRefObject<VideoJsPlayer | null> = React.useRef(null);
  const {
    rootDir,
    togglePlaylist,
    setShowPlaylist,
    setSelectedIdx,
    updateFileItemDetailBy,
  } = usePlayListStore(s => s);
  const setPlayer = useMediaStore(s => s.setPlayer);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
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
    window.electronAPI.onPlaybackNativeMenuClick((playbackType) => {
      console.info(`emit onPlaybackNativeMenuClick, playbackType=${playbackType}`);
      const seek = (sec: number) => {
        const currentTime = playerRef.current!.currentTime();
        const ret = playerRef.current!.currentTime(currentTime + sec);
        console.info({ currentTime, ret });
      };
      const setPlayOrPause = () => {
        const playerRefCurrent = playerRef.current!
        if (playerRefCurrent.paused()) {
          playerRefCurrent.play();
          return;
        }
        playerRefCurrent.pause();
      }
      switch (playbackType) {
        case PlaybackType.JUMP_BACKWARD:
          seek(-5);
          break;
        case PlaybackType.JUMP_FORWARD:
          seek(5);
          break;
        case PlaybackType.PLAY_OR_PAUSE:
          setPlayOrPause();
          break;
        default:
          console.info(playbackType)
      }
      
    });

    let currentMuteState = false;
    window.electronAPI.onAudioNativeMenuClick((audioMenuType) => {
      const volumeIncrease = (percentNum: number) => {
        const currentVolume =  playerRef.current!.volume();
        const newVolume = Math.floor(currentVolume * 100 + percentNum) / 100;
        playerRef.current!.volume(newVolume);
      };
      switch (audioMenuType) {
        case AudioMenuType.INCREASE_VOLUME:
          volumeIncrease(5);
          break;
        case AudioMenuType.DECREASE_VOLUME:
          volumeIncrease(-5);
          break;
        case AudioMenuType.MUTE_VOLUME:
          // volumeIncrease(-10);
          currentMuteState = !currentMuteState;
          playerRef.current!.muted(currentMuteState);
          break;
        default:
          console.info(audioMenuType)
      }
    });
  }, []);

  const handleDoubleClickDirItem = (
    playerCuttent: VideoJsPlayer,
    dirItem: VideoFileSummaryInfoTreeDirNode
  ) => {
    console.info({dirItem})
  };

  const updateFileItemDetail = async (idx: number, fileItem: VideoFileTreeSummaryInfoFileNode) => {
    let detail = fileItem.detail;
    if (!detail) {
      try {
        detail = await window.electronAPI.getMediaDetail(fileItem.filePath);
        updateFileItemDetailBy(idx, detail);
      } catch (error) {
        console.error('electronAPI.getMediaDetail:', error);
      }
    }
    return detail;
  };
  const handleDoubleClickFileItem = async (
    playerCuttent: VideoJsPlayer,
    fileItem: VideoFileTreeSummaryInfoFileNode,
    idx: number,
  ) => {

    const detail = await updateFileItemDetail(idx, fileItem);

    if (detail && detail.resolution.isValid) {
      window.electronAPI.updateWindowSize(detail.resolution.width, detail.resolution.height);
    }

    try {
      if (playerCuttent.currentSrc()) {
        playerCuttent.pause();
        playerCuttent.reset();
      }
  
      playerCuttent.src({
        src: fileItem.filePath,
        type: fileItem.mimeType
      }); 
    } catch (error) {
      console.error('play err:', error);
    }
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
        onDoubleClickFileItem={({ fileItem , idx}) => handleDoubleClickFileItem(playerCuttent, fileItem, idx)}
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

    const elmVjsEle = document.getElementById('elm-vjs') as HTMLDivElement;
    player.on('play', () => {
      elmVjsEle.classList.remove('elm-vjs__big-play-button--show');
    });

    player.on('pause', () => {
      elmVjsEle.classList.add('elm-vjs__big-play-button--show');
    });

    const appendControlBarBtn = (props: { classList: Array<string>, clickHandler: () => void }) => {
      const { classList, clickHandler } = props;
      const controlBar = player.getChild('ControlBar')!
      controlBar.addChild('button', {
        className: ['vjs-visible-text', ...classList].join(' '),
        clickHandler,
      });
    };

    appendControlBarBtn({
      classList: ['elm-control-bar__playlist-btn', 'vjs-icon-chapters'],
      clickHandler: () => {
        console.info('ControlBar-toggle-playlist click');
        togglePlaylist();
      }
    });

    appendControlBarBtn({
      classList: ['elm-control-bar__prev-btn', 'vjs-icon-previous-item'],
      clickHandler: () => {
        console.info('ControlBar prev');
        const s = usePlayListStore.getState();
        const currentFileItemIdx = s.selectedIdx - s.activePlaylist.directories.length;
        if (currentFileItemIdx <= 0) {
          return console.warn(`currentFileItemIdx = ${currentFileItemIdx}`);
        }
        s.setSelectedIdx(s.selectedIdx - 1);
        const idx = currentFileItemIdx - 1;
        handleDoubleClickFileItem(player, s.activePlaylist.files[idx], idx);
      }
    });

    appendControlBarBtn({
      classList: ['elm-control-bar__next-btn', 'vjs-icon-next-item'],
      clickHandler: () => {
        console.info('ControlBar next');
        const s = usePlayListStore.getState();
        const currentFileItemIdx = s.selectedIdx - s.activePlaylist.directories.length;
        if (currentFileItemIdx >= s.activePlaylist.files.length - 1) {
          return console.warn(`currentFileItemIdx = ${currentFileItemIdx}, maxIdx = ${s.activePlaylist.files.length - 1}`);
        }
        const idx = currentFileItemIdx + 1;
        handleDoubleClickFileItem(player, s.activePlaylist.files[idx], idx);
        s.setSelectedIdx(s.selectedIdx + 1);
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
