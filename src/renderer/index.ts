import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App";
import { FileList } from "../types";

interface Store {
  files: FileList[];
  curMediaIdx: number;
  showPlaylist: boolean;
}

const store: Store = {
  files: [],
  curMediaIdx: -1,
  showPlaylist: false
};

function updateMedia(mediaPath: string) {
  const videoTag = document.getElementById('player') as HTMLVideoElement | null;

  // todo
  if (!videoTag) {
    throw new Error();
  }

  videoTag.src = mediaPath;
  videoTag.load();
}

function getHtmlEleNumAttr(target: HTMLElement | EventTarget, attrName: string) {
  const numStr = (target as HTMLElement).getAttribute(attrName);
  return Number(numStr);
}

function updateByMediaIdx(idx: number) {
  store.curMediaIdx = idx;
  updateMedia(store.files[idx].path);
  console.info({
    idx,
    path: store.files[idx].path
  });
}

function updateFileList(files: FileList[]) {
  const fileList = document.getElementById('fileList');
  // todo
  if (!fileList) {
    throw new Error();
  }

  fileList.innerHTML = ''; // 清空现有列表

  files.forEach((file, idx) => {
    const itemTag = document.createElement('div');
    itemTag.textContent = `${file.name}`;
    itemTag.setAttribute('class', 'item');
    itemTag.setAttribute('media-idx', String(idx));
    itemTag.setAttribute('media-is-directory', String(Number(file.isDirectory)));
    itemTag.onclick = (ele) => {
      // todo
      if (!ele.target) {
        throw new Error();
      }

      const mediaIdx = getHtmlEleNumAttr(ele.target, 'media-idx');
      updateByMediaIdx(mediaIdx);
      togglePlaylist();
    };
    fileList.appendChild(itemTag);
  });
}

async function updatePlaylist(directory: string) {
  const files = await window.electronAPI.getLocalFiles(directory);
  store.files = files;
  updateByMediaIdx(0);
  updateFileList(files);
}

function togglePlaylist() {
  const playlistTag = document.getElementById('fileList');
  // todo
  if (!playlistTag) {
    throw new Error();
  }
  if (store.showPlaylist) {
    playlistTag.classList.add('hide-playlist');
    store.showPlaylist = false;
  } else {
    playlistTag.classList.remove('hide-playlist');
    store.showPlaylist = true;
  }
}

async function main() {
  await window.electronAPI.onPrevMedia(() => {
    const prevIdx = store.curMediaIdx > 0 ? store.curMediaIdx - 1 : 0;
    updateByMediaIdx(prevIdx);
  });
  await window.electronAPI.onNextMedia(() => {
    const nextIdx = store.curMediaIdx < store.files.length - 1 ? store.curMediaIdx + 1 : store.files.length - 1;
    updateByMediaIdx(nextIdx);
  });
  await window.electronAPI.onSwitchPlaylist(togglePlaylist);
  await window.electronAPI.onSelectedDirectory(updatePlaylist);

  createRoot(document.getElementById('app') as HTMLElement).render(React.createElement(App));
}

main();