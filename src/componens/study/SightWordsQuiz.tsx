import { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { makeRandom, addClass } from '../../utils';
import Draggable from './Draggable';

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

   const onDragCorrect = useCallback((item: HTMLDivElement, area: HTMLDivElement) => {
      const areas = container.current?.querySelectorAll('.drag-area.active');
      if(areas!.length == 2) {
         onStudyClear();
         addClass(container.current, 'disable');
      }
   }, []);

   const onDragWrong = useCallback((item: HTMLDivElement) => {
      
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

   return (
      <div className="sightwords-quiz" ref={container}>
         {(randomAr && words && colorRandomAr) && 
            <Draggable 
               areaAr={[0, 1]}
               dragAr={randomAr}
               dragElm={randomAr.map( i => (
                  <div data-color={colorRandomAr[i]}><span>{words[i]}</span></div>
               ))}
               onDragStart={audioStop}
               onCorrect={onDragCorrect}
               onWrong={onDragWrong} />
         }
      </div>
   );
}

export default SightWordsQuiz;