
const store = {
  files: [],
  curMediaIdx: -1,
  showPlaylist: false
};

function updateMedia(mediaPath) {
  const videoTag = document.getElementById('player');
  videoTag.src = mediaPath;
  videoTag.load();
}

function updateByMediaIdx(idx) {
  store.curMediaIdx = idx;
  updateMedia(store.files[idx].path);
  console.info({
    idx,
    path: store.files[idx].path
  });
}

function updateFileList(files) {
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = ''; // 清空现有列表

  files.forEach((file, idx) => {
    const itemTag = document.createElement('div');
    itemTag.textContent = `${file.name}`;
    itemTag.setAttribute('class', 'item');
    itemTag.setAttribute('media-idx', idx);
    itemTag.setAttribute('media-is-directory', file.isDirectory);
    itemTag.onclick = (ele) => {
      const mediaIdx = ele.target.getAttribute('media-idx');
      updateByMediaIdx(mediaIdx);
      togglePlaylist();
    };
    fileList.appendChild(itemTag);
  });
}

async function updatePlaylist(directory) {
  const files = await window.electronAPI.getLocalFiles(directory);
  store.files = files;
  updateByMediaIdx(0)
  updateFileList(files);
}

function togglePlaylist() {
  const playlistTag = document.getElementById('fileList');
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
    const nextIdx = store.curMediaIdx < store.files.length - 1 ? store.curMediaIdx + 1 : files.length - 1;
    updateByMediaIdx(nextIdx);
  });
  await window.electronAPI.onSwitchPlaylist(togglePlaylist);
  await window.electronAPI.onSelectedDirectory(updatePlaylist);
}

main();