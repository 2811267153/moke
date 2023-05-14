import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import styles from './index.module.scss';
import { List, ListItem } from '@/components';
import { addPlayingList, changeAudioPlay, deleteAllFromPlayingList, playingList } from '@/redux/audioDetail/slice';
import { useParams } from 'react-router-dom';
import { readdirSync } from 'fs';
import { songsSearch_c } from '@/redux/musicDetailProduct/slice';
import { getSongsInfoData } from '@/redux/albumInfo/slice';


export const ListPage: React.FC = () => {
  const playList = useSelector(state => state.audioData.playingList) || [];
  //读取本地歌曲
  const [musicList, setMusicList] = useState<ListItem[]>([]);
  const menuList = ['本地歌曲', '下载歌曲', '下载视频', '正在下载'];
  const [currentIndex, setIndex] = useState(0);
  const search_cData = useSelector(state => state.musicDetailPage.searchSongs);
  const { type } = useParams();
  const dispatch = useAppDispatch();
  const [list, setList] = useState<ListItem[]>([]); //保存的未被初始化的音乐
  const listRef = useRef<ListItem[]>([]); // 保存不好喊img图片的歌曲信息
  const ablumAllSongsList = useSelector(state => state.musicAlbumDetail.songsInfoData.songs) || [];

  useEffect(() => {
    if (type === 'file') {
      const musicList: { url: string; artist: string; name: string; }[] = [];
      const musicDir = 'C:/Users/breeze/Music';
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

      searchValues.forEach((item, index) => {
        const regex = /\s*\([^)]+\)/g; // 匹配括号及其内容，包括前面的空格
        const cleanedString = item.replace(regex, '');
        dispatch(songsSearch_c({ value: cleanedString, offset: 1, limit: 1 }));
      });
      // 将歌曲添加到musicList中
      musicFiles.forEach((file: string) => {
        const musicUrl = `${musicDir}/${file}`;
        const fileExtension = file.split('.').pop();
        const filenameWithoutExtension = file.substring(0, file.lastIndexOf('.')); // 去掉文件格式后缀名
        const [artistName, songTitle] = filenameWithoutExtension.split(' - '); // 分解为艺术家和歌曲名称
        const music = {
          url: musicUrl,
          artist: artistName,
          name: songTitle
        };
        musicList.push(music);
      });
      setMusicList(musicList);
    } else if (type === 'live') {

    } else {

    }
  }, [type]);

  useEffect(() => {
    if (Array.isArray(search_cData.songs)) {
      //把添加的歌曲信息保存到本地
      const newList = [...listRef.current, ...search_cData.songs];
      listRef.current = newList;
      setList(newList);
    }
  }, [search_cData]);

  useEffect(() => {
    //过滤掉重复的数据保存所有的id
    const uniqueList = list.filter((item, index, arr) => {
      return arr.findIndex((t) => t.id === item.id) === index;
    });

    //讲所有保存的id保存为字符串 使用 ","分割
    const uniqueIdList = uniqueList.map(item => item.id).join(',');
    dispatch(getSongsInfoData(uniqueIdList));
  }, [list]);


  useEffect(() => {
    // 更新musicList
    musicList.map((music: ListItem) => {
      const foundItem = ablumAllSongsList.find((item: ListItem) => item.name.includes(music.name?.slice(0, 3)));
      if (foundItem) {
        Object.keys(foundItem).forEach((key) => {
          if (!music.hasOwnProperty(key)) {
            // @ts-ignore
            music[key as keyof ListItem] = foundItem[key as keyof ListItem];
          }
        });
      }
      return music;
    });

  }, [ablumAllSongsList]);

  const handleChangeClick = (index: number) => {
    dispatch(addPlayingList(musicList))
  };
  const handleChangeType = (index: number) => {
    setIndex(index);
  };
  return <div>
    <div className={styles.list_top}>
      <h2>本地与下载</h2>
      <div className={styles.deputy_name}>
        {
          menuList.map((item: string, index) => {
            return <button onClick={() => handleChangeType(index)}
                           className={`${styles.deputy_item} ${index === currentIndex ? styles.active : ''}`}
                           key={item}>
              <p>{item}
                <i className={styles.deputy_solid} />
              </p>
            </button>;
          })
        }
      </div>
    </div>
    <List handleChangeClick={handleChangeClick} data={musicList} />
  </div>;
};
