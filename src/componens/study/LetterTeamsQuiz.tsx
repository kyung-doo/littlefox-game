import { FC, useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react';
import { addClass, elementIndex, makeRandom, removeClass } from '../../utils';
import Draggable from './Draggable';
import { Sound } from '@pixi/sound';


export interface Props {
   syllables: any[];
   onStudyClear: () => void;
   syllableBox: HTMLDivElement[];
   audioStop: () => void;
}

const LetterTeamsQuiz: FC<Props> = ({syllables, syllableBox, onStudyClear, audioStop}) => {
   const [randomAr, setRandomAr] = useState<number[]>();
   const correctAudio = useRef<Sound>();
   const wrongAudio = useRef<Sound>();

   const onDragCorrect = useCallback((item: HTMLDivElement, area: HTMLDivElement) => {
      stopAudio();
      var areaIdx = elementIndex(area);
      removeClass(syllableBox[areaIdx], 'active');
      addClass(syllableBox[areaIdx], 'clear');
      correctAudio.current!.play(() => {
         if(area.nextElementSibling) {
            const nextArea = area.nextElementSibling as HTMLElement;
            nextArea.style.visibility = 'visible';
            addClass(syllableBox[areaIdx+1], 'active');
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
      setRandomAr(makeRandom(syllables.length, syllables.length));
   },[]);

   useEffect(() => {
      addClass(syllableBox[0], 'active');
      correctAudio.current = Sound.from({url: require('../../assets/audio/correct.mp3').default, preload: true});
      wrongAudio.current = Sound.from({url: require('../../assets/audio/wrong4.mp3').default, preload: true});
      return () => {
         correctAudio.current?.destroy();
         wrongAudio.current?.destroy();
      }
   }, []);


   return (
      <div className="letter-teams-quiz">
         {randomAr && 
            <Draggable 
               areaAr={syllables.map(syllable => syllable.text)}
               dragAr={randomAr.map(i => syllables[i].text)}
               dragElm={randomAr.map( i => (<span>{syllables[i].text}</span>))}
               onDragStart={audioStop}
               onCorrect={onDragCorrect}
               onWrong={onDragWrong}
               padding={'20%'} />
         }
      </div>
   )
}

export default LetterTeamsQuiz;