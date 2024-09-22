import React, { useEffect, useRef } from "react";
import Media from './compoments/Media';
import 'reset-css';
import './App.scss';
import { useMediaStore, usePlayListStore } from "./store";

export default () => {
  const {
    rootDir,
    activePlaylist,
    initPlayList,
    setRootDir,
    updateActivePlayList,
    togglePlaylist
 } = usePlayListStore(s => s);

  const activePlaylistRef = useRef(activePlaylist);
  const curPlayer = useMediaStore(s => s.player);

  useEffect(() => {
    activePlaylistRef.current = activePlaylist;
  }, [activePlaylist]);

  useEffect(() => {
    window.electronAPI.onSelectedDirectory(async (dir) => {
      setRootDir(dir);
      const playlist = await window.electronAPI.getVideoFileSummaryInfoList(dir);
      initPlayList(playlist);
      updateActivePlayList(playlist);
  
      if (curPlayer) {
        curPlayer.dispose();
      }
    });
  
    window.electronAPI.onSwitchPlaylist(() => {
      if (activePlaylistRef.current.length) {
        togglePlaylist();
        return;
      }
  
      console.warn('activePlaylist is empty!');
    });
  }, []);

  return rootDir ? (
    <Media />
  ) : (<></>);
}
