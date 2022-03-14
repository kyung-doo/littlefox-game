import { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { addClass, makeRandom, removeClass } from '../../utils';
import { gsap, Cubic } from 'gsap';
import { Sound } from '@pixi/sound';

/*
* @ PROPS
*     alphabets: 알파벳 배열
*     correctAlphabet: 정답 알파벳
*     onStudyClear: 학습 완료 콜백
*     audioStop: play중인 오디오 정지
*/
export interface Props {
   alphabets: string[];
   correctAlphabet: string;
   onStudyClear: () => void;
   audioStop: () => void;
}

const AlphabetQuiz: FC<Props> = ({ alphabets, correctAlphabet, onStudyClear, audioStop }) => {

   const container = useRef<HTMLDivElement>(null);
   const correctAudio = useRef<Sound>();
   const wrongAudio = useRef<Sound>();
   const [selectList, setSelectList] = useState<{[key: string]: any}[]>([]);

   const checkClear = useCallback(() => {
      return container.current!.querySelectorAll('.select-btn.correct').length === 2;
   }, []);

   const onClickSelect = useCallback((target: EventTarget, idx: number) => {
      audioStop();
      correctAudio.current!.stop();
      wrongAudio.current!.stop();
      addClass(container.current, 'disable');
      if(selectList[idx].correct) {
         addClass(target, 'correct');
         correctAudio.current!.play();
      } else {
         addClass(target, 'wrong');
         wrongAudio.current!.play();
      }

      setTimeout(() => {
         if(!selectList[idx].correct) {
            removeClass(container.current, 'disable');
            removeClass(target, 'wrong');
         } else {
            if(!checkClear()) {
               removeClass(container.current, 'disable');
            } else {
               onStudyClear();
            }
         }
      }, 600);
      
   }, [selectList]);

   useLayoutEffect(() => {
      const wrongAlphabets = alphabets.filter((x: string) => x !== correctAlphabet);
      const wrongAlphabet = wrongAlphabets[Math.floor(Math.random() * wrongAlphabets.length)];
      const list: {[key: string]: any}[] = [];
      makeRandom(4, 4).forEach((num, i) => {
         switch(i) {
            case 0 : 
               list[num] = { alphabet: correctAlphabet, correct: true};
            break;
            case 1 : 
               list[num] = { alphabet: correctAlphabet.toUpperCase(), correct: true};
            break;
            case 2 : 
               list[num] = { alphabet: wrongAlphabet, correct: false};
            break;
            case 3 : 
               list[num] = { alphabet: wrongAlphabet.toUpperCase(), correct: false};
            break;
         } 
      });
      setSelectList(list);
   }, []);

   useEffect(() => {
      correctAudio.current = Sound.from({url: require('../../assets/audio/correct.mp3').default, preload: true});
      wrongAudio.current = Sound.from({url: require('../../assets/audio/wrong2.mp3').default, preload: true});
      gsap.from(container.current, 0.6, {y: 150, ease: Cubic.easeInOut});
      return () => {
         correctAudio.current?.destroy();
         wrongAudio.current?.destroy();
      }
   },[]);
   
  
   
   return (
      <div ref={container} className='alphabet-quiz'>
         {selectList.map((list, i) => (
            <button 
               key={i} 
               className={`select-btn`}
               onClick={ e => onClickSelect(e.target, i)}>
                  {list.alphabet}
            </button>
         ))}
      </div>
   )
}

export default AlphabetQuiz;