import React, { useEffect, useImperativeHandle, useRef } from 'react';
import PubSub from 'pubsub-js';

export interface AudioControllerRef {
  play: () => void;
  pause: () => void;
  currentTime: number;
}

interface PropsType extends AudioControllerRef {
  src: string | undefined;
  onTimeUpdate: (currentTime: number) => void;
  onLoadedData: (data: any) => void;
  onDuration: (duration: number) => void;
  onEnded: (data: any) => void;
  onLoad: (data: any) => void;
  onPause?: (data: any) => void;
  onPlaying?: (data: any) => void;
  autoplay: boolean;
  key?: any;
}

export const AudioController = React.forwardRef<AudioControllerRef, PropsType>(
  ({ src, onTimeUpdate, onLoadedData, autoplay = true, key, onDuration, onEnded, onPause, onPlaying, onLoad }, ref) => {
    const audio = React.useRef<HTMLAudioElement>(null);
    const play = () => {
      if (audio.current) {
        audio.current.play();
      }
    };

    const pause = () => {
      if (audio.current) {
        audio.current.pause();
      }
    };

    useImperativeHandle(ref, () => {
      return {
        play,
        pause,
        currentTime: audio.current?.currentTime ?? 0, // 给 currentTime 属性传值
      };
    });
    useEffect(() => {
      const handleTimeUpdate = () => {
        if (audio.current) {
          onTimeUpdate(audio.current.currentTime);
        }
      };

      const handleLoadeddata = () => {
        if (audio.current) {
          onLoadedData(audio.current.ended);
        }
      };
      const handleDuration = () => {
        if (audio.current) {
          onDuration(audio.current.duration);
        }
      };
      const handleEnded = () => {
        if (audio.current) {
          onEnded(audio.current.ended);
        }
      };
      const handleOnPause = () => {
        if (audio.current) {
          if (onPause) {
            onPause(audio.current.paused);
          }
        }
      };
      const handleOnPlaying = () => {
        if (audio.current) {
          if (onPlaying) {
            onPlaying(audio.current.onplaying);
          }
        }
      };
      const handleOnLoad = () => {
        if (audio.current) {
          if (onPlaying) {
            onLoad(audio.current.onload);
          }
        }
      };

      if (audio.current) {
        audio.current.addEventListener('timeupdate', handleTimeUpdate);
        audio.current.addEventListener('loadeddata', handleLoadeddata);
        // @ts-ignore
        audio.current.addEventListener('durationchange', handleDuration);
        audio.current.addEventListener('ended', handleEnded);
        audio.current.addEventListener('paused', handleOnPause);
        audio.current.addEventListener('playing', handleOnPlaying);
        audio.current.addEventListener('onload', handleOnLoad);
      }
      return () => {
        if (audio.current) {
          audio.current.addEventListener('timeupdate', handleTimeUpdate);
          audio.current.addEventListener('loadeddata', handleLoadeddata);
          // @ts-ignore
          audio.current.addEventListener('durationchange', handleDuration);
          audio.current.addEventListener('ended', handleEnded);
          audio.current.addEventListener('paused', handleOnPause);
          // audio.current.addEventListener('playing', handleOnPlaying);
          audio.current.addEventListener('onload', handleOnLoad);
        }
      };
    }, [audio, onTimeUpdate, onLoadedData, onDuration, onEnded, onPause, onPlaying]);

    useEffect(() => {
      PubSub.subscribe('upDataCurrentTime', (data: any, time: number) => {
        if (audio.current) {
          audio.current.currentTime = (time + 2) / 1000;
          audio.current.play();
        }
      });
    }, [audio]);

    return (
      <div>
        <audio ref={audio} autoPlay={autoplay} src={src} key={key} />
      </div>
    );
  }
);


