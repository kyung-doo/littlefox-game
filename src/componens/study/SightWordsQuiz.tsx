import { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { makeRandom, addClass, elementIndex } from '../../utils';
import Draggable from './Draggable';
import { Sound } from '@pixi/sound';

export interface Props {
   correct: string;
   wrong1: string;
   wrong2: string;
   onStudyClear: () => void;
   audioStop: () => void;
}

const SightWordsQuiz: FC<Props> = ({ correct, wrong1, wrong2, onStudyClear, audioStop }) => {

   const [randomAr, setRandomAr] = useState<number[]>();
   const [colorRandomAr, setColorRandomAr] = useState<number[]>();
   const [words, setWords] = useState<string[]>();
   const container = useRef<HTMLDivElement>(null);
   const correctAudio = useRef<Sound>();
   const wrongAudio = useRef<Sound>();

   

   const onDragCorrect = useCallback((item: HTMLDivElement, area: HTMLDivElement) => {
      const areas = container.current?.querySelectorAll('.drag-area.active');
      const areaIdx = elementIndex(area);
      const correctBlock = container.current?.querySelector(`.correct-block.block${areaIdx+1}`);
      stopAudio();
      correctAudio.current?.play(() => {
         if(areas!.length == 2) {
            onStudyClear();
            addClass(container.current, 'clear');
         }
      });
      addClass(correctBlock, 'active');
      if(areas!.length == 2) {
         addClass(container.current, 'disable');
      }
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
      const rand = makeRandom(4, 4);
      const colorRand = makeRandom(4, 4);
      setRandomAr(rand);
      setColorRandomAr(colorRand);
      const word = rand.map((num, i) => {
         if(i === 0)       return correct;
         else if(i === 1)  return correct;
         else if(i === 2)  return wrong1;
         else              return wrong2;
      });
      setWords(word);
   },[]);

   useEffect(() => {
      correctAudio.current = Sound.from({url: require('../../assets/audio/correct.mp3').default, preload: true});
      wrongAudio.current = Sound.from({url: require('../../assets/audio/wrong4.mp3').default, preload: true});
      return () => {
         correctAudio.current?.destroy();
         wrongAudio.current?.destroy();
      }
   }, []);

   return (
      <div className="sightwords-quiz" ref={container}>
         {(randomAr && words && colorRandomAr) && 
            <>
               <div className="correct-block block1" data-color={colorRandomAr[0]}><span>{words[0]}</span></div>
               <div className="correct-block block2" data-color={colorRandomAr[1]}><span>{words[1]}</span></div>
               <Draggable 
                  areaAr={[0, 1]}
                  areaElm={randomAr.map( i => <span></span>)}
                  dragAr={randomAr}
                  dragElm={randomAr.map( i => (
                     <div data-color={colorRandomAr[i]}><span>{words[i]}</span></div>
                  ))}
                  onDragStart={audioStop}
                  onCorrect={onDragCorrect}
                  onWrong={onDragWrong}
                  padding={'20%'} />
            </>
         }
      </div>
   );
}

export default SightWordsQuiz;