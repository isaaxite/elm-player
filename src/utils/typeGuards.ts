import { VideoFileSummaryInfoTreeDirNode, VideoFileTreeSummaryInfoFileNode } from "../types";

export function isTinyDirItem(item: VideoFileSummaryInfoTreeDirNode | VideoFileTreeSummaryInfoFileNode): item is VideoFileSummaryInfoTreeDirNode {
  return Object.keys(item as VideoFileSummaryInfoTreeDirNode).includes('directory');
}
