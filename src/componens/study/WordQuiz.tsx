import { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, Back } from 'gsap';
import Sortable from './Sortable';
import { randomRange, toRadian } from '../../utils';
import { Sound } from '@pixi/sound';

/*
* @ PROPS
*     image: 이미지 src 경로
*     onStudyClear: 학습 완료 이벤트
*     audioStop: play중인 오디오 정지
*/
export interface Props {
   image: string;
   onStudyClear: () => void;
   audioStop: () => void;
}

const RANDOM_TYPE: Array<number[]> = [[0, 2, 1],[1, 0, 2],[1, 2, 0],[2, 0, 1],[2, 1, 0]];

const WordQuiz: FC<Props> = ({ image, onStudyClear, audioStop }) => {

   const [randomAr, setRandomAr] = useState<number[]>();
   const correctAudio = useRef<Sound>();
   const [isClear, setIsClear] = useState<boolean>(false);
   const effectCon = useRef<HTMLDivElement>(null);
   
   const onSortClear = useCallback(() => {
      correctAudio.current!.play(() => {
         onStudyClear();
      });   
      setIsClear(true);
   }, []);
   
   useLayoutEffect(() => {
      const random = RANDOM_TYPE[Math.floor(Math.random()*RANDOM_TYPE.length)];
      setRandomAr(random);
   },[]);

   useEffect(() => {
      correctAudio.current = Sound.from({url: require('../../assets/audio/correct.mp3').default, preload: true});
      return () => {
         correctAudio.current?.destroy();
      }
   },[]);

   useEffect(() => {
      if(isClear){
         const stars = effectCon.current?.querySelectorAll('.star');
         let r = 0;
         stars?.forEach( star => {
            gsap.set(star, {x: 0, y: 0, scale: 0, opacity: 0, force3D: true});
            gsap.set(star.children, {rotation: randomRange(-360, 360), transformOrigin:'center center', force3D: true});
            const angle = r;
            r+= randomRange(20, 25);
            const dist = randomRange(80, 130);
            const x = Math.cos(toRadian(angle)) * dist;
            const y = -Math.sin(toRadian(angle)) * dist;
            const opacity = randomRange(50, 100) * 0.01;
            const delay = randomRange(10, 30) * 0.01;
            const scale = randomRange(50, 120) * 0.01
            gsap.to(star, 0.6, {delay: delay, x:x, y:y, opacity:opacity, scaleX: scale, scaleY: scale, ease: Back.easeOut.config(1.5)});
            gsap.to(star.children, 0.6, {delay: delay, rotation: randomRange(-180, 180)});
            gsap.to(star.children, 0.3, {delay: delay + 0.5, opacity: 0, onComplete: () => {
               (star as HTMLElement).style.display = 'none';
            }});
         });
         
         return () => {
            stars?.forEach( star => gsap.killTweensOf(star));
         }
      }
   },[isClear]);
   

   return (
      <div className={`word-quiz ${isClear ? 'clear' : ''}`}>
         <img className="clear-img" src={image} />
         {randomAr && 
            <Sortable 
               initSort={randomAr} 
               image={<img src={image} />}
               imageWidth={648}
               onClear={onSortClear}
               onDragStart={audioStop} />
         }
         {isClear &&
            <div ref={effectCon} className="clear-effect">
               {Array.from(Array(20), (x, i) => (
                  <div key={i} className="star"><span></span></div>
               ))}
            </div>
         }
      </div>
   )
}

export default WordQuiz;