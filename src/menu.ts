import { BrowserWindow, Menu, dialog } from "electron";
import { PlaybackType } from "./types";
import { IELECTRON_EVENT_TYPES } from "./constant";

export function setApplicationMenu(props: { win: BrowserWindow }) {
  const { win } = props;

  const menu = Menu.buildFromTemplate([
    {
      label: 'Media',
      submenu: [
        {
          label: 'Open Directory',
          accelerator: 'D',
          click: async () => {
            const result = await dialog.showOpenDialog(win, {
              properties: ['openDirectory']
            });
            if (!result.canceled) {
              win.webContents.send('selected-directory', result.filePaths[0]);
            }
          }
        }
      ]
    },
    {
      label: 'Audio',
      submenu: [
        {
          label: 'Audio Track',
        },
        {
          label: 'Increase Volume',
          accelerator: '=',
          click: () => {
            // todo
          }
        },
        {
          label: 'Decrease Volume',
          accelerator: '-',
          click: () => {
            // todo
          }
        }
      ]
    },
    {
      label: 'Playback',
      submenu: [
        {
          label: 'Play/Pause',
          accelerator: 'Space',
          click: () => {
            // todo
          }
        },
        {
          label: 'Stop',
          click: () => {
            // todo
          }
        },
        {
          label: 'Jump Forward',
          accelerator: '',
          click: () => {
            win.webContents.send(IELECTRON_EVENT_TYPES.playback, PlaybackType.JUMP_FORWARD);
          }
        },
        {
          label: 'Jump Backward',
          accelerator: '',
          click: () => {
            win.webContents.send(IELECTRON_EVENT_TYPES.playback, PlaybackType.JUMP_BACKWARD);
          }
        },
        {
          label: 'Prevrious',
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
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Playlist',
          accelerator: 'L',
          click: () => {
            win.webContents.send('switch-playlist');
          }
        },
        {
          label: 'Fullscreen',
          accelerator: 'Enter',
          click: () => {
            // todo
          }
        },
        {
          label: 'Quit',
          click: () => {
            // todo
          }
        }
      ],
    }
  ]);

  win.setAutoHideMenuBar(true);
  win.setMenuBarVisibility(false)
  Menu.setApplicationMenu(menu);
};
