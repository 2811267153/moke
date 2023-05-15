import { readdirSync } from 'fs';
import { ListItem } from '@/components';

export function FindFiles(filesPatch: string): any{
  const musicList: { url: string; artist: string; name: string; }[] = [];
  const musicDir = filesPatch;
  const files = readdirSync(musicDir);
  const musicFiles = files.filter((file: any) => /\.(mp3|wav|ogg|flac)$/i.test(file));
  // 发送搜索请求
  const searchValues = musicFiles
    .filter((file: string) => {
      const filenameWithoutExtension = file.substring(0, file.lastIndexOf('.'));
      const [artistName, songTitle] = filenameWithoutExtension.split(' - ');
      return songTitle && songTitle.length !== 0;
    })
    .map((file: string) => {
      const filenameWithoutExtension = file.substring(0, file.lastIndexOf('.'));
      const [artistName, songTitle] = filenameWithoutExtension.split(' - ');
      const value = songTitle + ' ' + artistName;
      return value;
    });


  // 将歌曲添加到musicList中
  musicFiles.forEach((file: string) => {
    const musicUrl = `${musicDir}/${file}`;
    // const fileExtension = file.split('.').pop();
    const filenameWithoutExtension = file.substring(0, file.lastIndexOf('.')); // 去掉文件格式后缀名
    const [artistName, songTitle] = filenameWithoutExtension.split(' - '); // 分解为艺术家和歌曲名称
    const music = {
      url: musicUrl,
      artist: artistName,
      name: songTitle
    };
    musicList.push(music);
  });

  return {
    musicList,
    searchValues
  }
}
const list:ListItem[]  = []
export function getMusicListByIds(musicList: ListItem): any {
  const newList = [...list, musicList];
  console.log("musicList---abc",newList);
}
function addMusicList(musicList: any,) {
  // const list = useSelector(state => state.musicDetailPage.searchSongs)
  console.log("musicList----list", musicList);
}