import { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Draggable from './Draggable';
import { addClass, elementIndex, makeRandom, removeClass } from '../../utils';
import { Sound } from '@pixi/sound';

/*
* @ PROPS
*     words: 단어 배열
*     wordBox: 단어 박스 element
*     onStudyClear: 학습 완료 콜백
*     audioStop: play중인 오디오 정지
*/
export interface Props {
   words: string[];
   wordBox: HTMLDivElement[];
   onStudyClear: () => void;
   audioStop: () => void;
}

const PhonicsQuiz: FC<Props> = ({ words, wordBox, onStudyClear, audioStop }) => {
   
   const [randomAr, setRandomAr] = useState<number[]>();
   const correctAudio = useRef<Sound>();
   const wrongAudio = useRef<Sound>();

   const onDragCorrect = useCallback((item: HTMLDivElement, area: HTMLDivElement) => {
      stopAudio();
      var areaIdx = elementIndex(area);
      removeClass(wordBox[areaIdx], 'active');
      addClass(wordBox[areaIdx], 'clear');
      correctAudio.current!.play(() => {
         if(area.nextElementSibling) {
            const nextArea = area.nextElementSibling as HTMLElement;
            nextArea.style.display = 'block';
            addClass(wordBox[areaIdx+1], 'active');
         } else {
            onStudyClear();
         }
      });
   }, []);

   const onDragWrong = useCallback((item: HTMLDivElement) => {
      stopAudio();
      wrongAudio.current!.play();
   }, []);

   const stopAudio = useCallback(() => {
      correctAudio.current!.stop();
      wrongAudio.current!.stop();
   }, []);

   useLayoutEffect(() => {
      setRandomAr(makeRandom(words.length, words.length));
   },[]);

   useEffect(() => {
      addClass(wordBox[0], 'active');
      correctAudio.current = Sound.from({url: require('../../assets/audio/correct.mp3').default, preload: true});
      wrongAudio.current = Sound.from({url: require('../../assets/audio/wrong4.mp3').default, preload: true});
      return () => {
         correctAudio.current?.destroy();
         wrongAudio.current?.destroy();
      }
   }, []);

   return (
      <div className="phonics-quiz">
         {randomAr && 
            <Draggable 
               areaAr={words}
               dragAr={randomAr.map(i => words[i])}
               dragElm={randomAr.map( i => (<span>{words[i]}</span>))}
               onDragStart={audioStop}
               onCorrect={onDragCorrect}
               onWrong={onDragWrong} />
         }
         
      </div>
   )
}

export default PhonicsQuiz;