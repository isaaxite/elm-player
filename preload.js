const { contextBridge, ipcRenderer } = require('electron');

function ipcRendererHandlerFactory(eventNmae) {
  return (handler) => {
    ipcRenderer.on(eventNmae, (e, command) => {
      handler();
    })
  };
}

contextBridge.exposeInMainWorld('electronAPI', {
  getLocalFiles: (directory) => ipcRenderer.invoke('get-local-files', directory),
  onPrevMedia: (handler) => {
    ipcRenderer.on('prev-media', (e, command) => {
      handler();
    })
  },
  onNextMedia: (handler) => {
    ipcRenderer.on('next-media', (e, command) => {
      handler();
    })
  },
  onSwitchPlaylist: ipcRendererHandlerFactory('switch-playlist'),
  onSelectedDirectory: (handler) => {
    ipcRenderer.on('selected-directory', (e, dirPath) => {
      handler(dirPath);
    })
  }
});
