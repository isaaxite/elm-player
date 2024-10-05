import fs from "fs";
import path from "path"
import { app, BrowserWindow, ipcMain } from "electron";
import { FileList } from "./types";
import { getVideoFileInfo, getVideoFilesTinyTree } from "./utils/readLocalMediaFiles";
import { setApplicationMenu } from "./menu";

function getLocalFiles(directory: string): Promise<FileList[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        return reject(err);
      } else {
        const fileList = files.map(file => {
          return {
            name: file,
            path: path.join(directory, file),
            isDirectory: fs.statSync(path.join(directory, file)).isDirectory()
          };
        });
        return resolve(fileList);
      }
    });
  });
}

let win: BrowserWindow;
const createWindow = () => {
  win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    darkTheme: true
  });
  
  win.webContents.openDevTools();

  win.loadFile(path.join(__dirname, 'index.html'));
  setApplicationMenu({ win });
  
  const onWindowResizeHandler = () => {
    win.webContents.send('window-resize');
  };
  // linux
  win.on('resize', onWindowResizeHandler);
  // macos or windows
  win.on('resized', onWindowResizeHandler);


  ipcMain.handle('get-local-files', async (event, directory) => {
    try {
      const files = await getLocalFiles(directory);
      return files;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });


  ipcMain.handle('update-window-size', (e, { width, height }) => {
    win.setSize(width, height);
  });

  ipcMain.handle('get-video-file-tiny-tree', async (e, directory) => {
    return getVideoFilesTinyTree(directory);
  });

  ipcMain.handle('get-media-file-detail', async (e, mediaFilepath) => {
    return getVideoFileInfo(mediaFilepath);
  });
};

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
