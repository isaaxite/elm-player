import fs from 'fs-extra';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

const videoMimeTypes = {
  mp4: 'video/mp4',
  mkv: 'video/x-matroska',
  avi: 'video/x-msvideo',
  mov: 'video/quicktime',
  wmv: 'video/x-ms-wmv',
  flv: 'video/x-flv',
  webm: 'video/webm',
  mpeg: 'video/mpeg',
  mpg: 'video/mpeg'
} as const;

export type VideoMimeType = typeof videoMimeTypes[keyof typeof videoMimeTypes] | 'video/unknown';

const videoExtensions = /\.(mp4|mkv|avi|mov|wmv|flv|webm|mpeg|mpg)$/i;

export function getMimeTypeMediaPath(filePath: string) {
  const ext = path.extname(filePath).substring(1).toLowerCase();
  return (videoMimeTypes as any)[ext] || 'video/unknown';
}

// 获取视频文件的详细信息
export function getVideoFileInfo(filePath: string) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }

      const fileSize = fs.statSync(filePath).size;  // 获取文件大小

      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      const audioStreams = metadata.streams.filter(stream => stream.codec_type === 'audio');
      const subtitleStreams = metadata.streams.filter(stream => stream.codec_type === 'subtitle');

      // 获取文件扩展名，用于查找对应的MIME类型
      const ext = path.extname(filePath).substring(1).toLowerCase();
      const mimeType: VideoMimeType = (videoMimeTypes as any)[ext] || 'video/unknown';

      const fileInfo = {
        fileName: path.basename(filePath),
        filePath,  // 文件的绝对路径
        fileSize: fileSize,  // 文件大小（字节）
        resolution: videoStream ? `${videoStream.width}x${videoStream.height}` : 'unknown',
        mediaType: mimeType,  // <source> 标签中的 "type" (MIME 类型)
        audioTracks: audioStreams.map(audio => ({
          codec: audio.codec_name,
          channels: audio.channels,
          language: (audio.tags ? audio.tags.language : 'unknown') as string
        })),
        subtitles: subtitleStreams.map(sub => ({
          codec: sub.codec_name,
          language: (sub.tags ? sub.tags.language : 'unknown') as string
        }))
      };

      return resolve(fileInfo);
    });
  });
}

const getVideoFiles = async(dir: string) => {
  const structure = {};
  
  const files = await fs.readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      structure[file] = await getVideoFiles(fullPath);  // 递归处理子目录
    } else if (videoExtensions.test(file)) {
      const fileInfo = await getVideoFileInfo(fullPath);  // 获取视频文件详细信息
      structure[file] = fileInfo;
    }
  }
  
  return structure;
};

export interface TinyFileItem {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: VideoMimeType;
}

export type VideoFileSummaryInfoListItem = TinyFileItem | TinyDirItem;
export type VideoFileSummaryInfoList = Array<TinyFileItem | TinyDirItem>;

export interface TinyDirItem {
  directory: string;
  directoryPath: string;
  files: VideoFileSummaryInfoList;
}

export function isTinyDirItem(item: VideoFileSummaryInfoListItem): item is TinyDirItem {
  return Object.keys(item as TinyDirItem).includes('directory');
}

// 递归获取目录中的视频文件
export function getVideoFilesTinyTree(dir: string) {
  const fileTree: VideoFileSummaryInfoList = [];

  // 读取目录内容
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // 递归处理子目录
      const subDirTree = getVideoFilesTinyTree(fullPath);
      if (subDirTree.length > 0) {
        fileTree.push({
          directory: file,
          directoryPath: fullPath,
          files: subDirTree
        });
      }
    } else if (videoExtensions.test(file)) {
      // 只处理视频文件
      fileTree.push({
        fileName: file,
        mimeType: getMimeTypeMediaPath(fullPath),
        filePath: fullPath,
        fileSize: stats.size // 文件大小（字节）
      });
    }
  }

  return fileTree;
}


export default getVideoFiles;
