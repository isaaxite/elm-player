import { BrowserWindow, Menu, dialog } from "electron";
import { AudioMenuType, PlaybackType } from "./types";
import { IELECTRON_EVENT_TYPES, ELECTRON_KEYBOARD_KEYS } from "./constant";

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
          accelerator: ELECTRON_KEYBOARD_KEYS.equal,
          click: () => {
            // todo
            win.webContents.send(IELECTRON_EVENT_TYPES.audio, AudioMenuType.INCREASE_VOLUME);
          }
        },
        {
          label: 'Decrease Volume',
          accelerator: ELECTRON_KEYBOARD_KEYS.dash,
          click: () => {
            // todo
            win.webContents.send(IELECTRON_EVENT_TYPES.audio, AudioMenuType.DECREASE_VOLUME);
          }
        },
        {
          label: 'Mute Volume',
          accelerator: ELECTRON_KEYBOARD_KEYS.m,
          click: () => {
            // todo
            win.webContents.send(IELECTRON_EVENT_TYPES.audio, AudioMenuType.MUTE_VOLUME);
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
          accelerator: ELECTRON_KEYBOARD_KEYS.arrowRight,
          click: () => {
            win.webContents.send(IELECTRON_EVENT_TYPES.playback, PlaybackType.JUMP_FORWARD);
          }
        },
        {
          label: 'Jump Backward',
          accelerator: ELECTRON_KEYBOARD_KEYS.arrowLeft,
          click: () => {
            win.webContents.send(IELECTRON_EVENT_TYPES.playback, PlaybackType.JUMP_BACKWARD);
          }
        },
        {
          label: 'Prevrious',
          accelerator: ELECTRON_KEYBOARD_KEYS.p,
          click: () => {
            win.webContents.send('prev-media');
          }
        },
        {
          label: 'Next',
          accelerator: ELECTRON_KEYBOARD_KEYS.n,
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
          accelerator: ELECTRON_KEYBOARD_KEYS.l,
          click: () => {
            win.webContents.send('switch-playlist');
          }
        },
        {
          label: 'Fullscreen',
          accelerator: ELECTRON_KEYBOARD_KEYS.enter,
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
