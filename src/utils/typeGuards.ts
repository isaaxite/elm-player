import { VideoFileSummaryInfoListItem, TinyDirItem } from "../types";

export function isTinyDirItem(item: VideoFileSummaryInfoListItem): item is TinyDirItem {
  return Object.keys(item as TinyDirItem).includes('directory');
}
