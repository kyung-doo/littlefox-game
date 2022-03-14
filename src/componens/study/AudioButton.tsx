import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Sound } from '@pixi/sound';

/*
* @ PROPS
*     src: 오디오 경로
*     left: left 값
*     top: top 값
*     onBeforeClick : 클릭 시 오디오 플레이 전 콜백
*     onAfterClick : 클릭 시 오디오 플레이 이후 콜백
*/
export interface Props {
   src: string;
   left?: string;
   top?: string;
   onBeforeClick?: () => void;
   onAfterClick?: () => void;
   disabled: boolean;
}

/*
* @ REFS
*     stop: 오디오가 플레이 중일때 정지
*/
export interface Refs {
   stop: () => void;
}

const AudioButton = forwardRef<Refs, Props>(({ 
   src, 
   disabled, 
   left = '0px', 
   top = '0px', 
   onBeforeClick, 
   onAfterClick 
}, ref) => {

   const [isPlay, setIsPlay] = useState<boolean>(false);
   const audio = useRef<Sound | undefined>(undefined);
   const onBtnClick = useCallback(() => {
      if(!isPlay) {
         if(onBeforeClick) onBeforeClick();
         setIsPlay(true);
         audio.current?.play(() => setIsPlay(false));
         if(onAfterClick) onAfterClick();
      }
   },[onBeforeClick, onAfterClick, isPlay]);

   useImperativeHandle(ref, () => ({
      stop: () => {
         audio.current?.stop();
         setIsPlay(false);
      }
   }));

   useEffect(() => {
      if(!disabled) {
         if(audio.current){
            audio.current?.destroy();
            audio.current = undefined;
         }
         audio.current = Sound.from({url: src, preload: true});
         return () => {
            audio.current?.destroy();
            audio.current = undefined;
         }
      }
   }, [disabled]);

   return (
      <button 
         style={{ left, top }}
         className={`audio-button ${!disabled && isPlay ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
         onClick={onBtnClick}> 
      </button>
   )
});

export default AudioButton;