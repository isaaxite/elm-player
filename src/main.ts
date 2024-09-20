import fs from "fs";
import path from "path"
import { app, BrowserWindow, ipcMain, Menu, dialog } from "electron";
import { FileList } from "./types";
import { getVideoFilesTinyTree } from "./utils/readLocalMediaFiles";

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

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // win.setFullScreen(true);
  
  
  win.webContents.openDevTools()

  win.loadFile(path.join(__dirname, 'index.html'));

  const menu = Menu.buildFromTemplate([
    {
      label: 'Open Dir',
      click: async () => {
        const result = await dialog.showOpenDialog(win, {
          properties: ['openDirectory']
        });
        if (!result.canceled) {
          win.webContents.send('selected-directory', result.filePaths[0]);
        }
      }
    },
    {
      label: 'Prev',
      accelerator: 'P',
      click: () => {
        win.webContents.send('prev-media');
      }
    },
    {
      label: 'Next',
      accelerator: 'N',
      click: () => {
        win.webContents.send('next-media');
      }
    },
    {
      label: 'Playlist',
      accelerator: 'L',
      click: () => {
        win.webContents.send('switch-playlist');
      }
    }
  ]);

  Menu.setApplicationMenu(menu);

  ipcMain.handle('get-local-files', async (event, directory) => {
    try {
      const files = await getLocalFiles(directory);
      return files;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('get-video-file-tiny-tree', async (e, directory) => {
    return getVideoFilesTinyTree(directory);
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
