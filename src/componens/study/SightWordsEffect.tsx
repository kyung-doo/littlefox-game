import { FC, useEffect, useRef } from 'react';
import { addClass, makeRandom, randomRange } from '../../utils';
import { gsap, Cubic } from 'gsap';

const PARTICLE_NUM = 10;
const POSITION = [
   {x: -212, y: 300},
   {x: -191, y: 220},
   {x: -236, y: 253},
   {x: -161, y: 250},
   {x: -136, y: 166},
   {x: 245, y: 311},
   {x: 213, y: 275},
   {x: 166, y: 302},
   {x: 176, y: 197},
   {x: 240, y: 195},
];

const SightWordsEffect: FC = () => {

   const container = useRef<HTMLDivElement>(null);
   const stars = useRef<HTMLDivElement[]>([]);

   useEffect(() => {
      const rand1 = makeRandom(5, 5);
      const rand2 = makeRandom(5, 5);
      
      stars.current.forEach((star, i) => {
         const num = i % 5;
        
         if(i < PARTICLE_NUM/2){
            addClass(star, `star${rand1[num]+1}`);
         } else {
            addClass(star, `star${rand2[num]+1}`);
         }

         const scale = randomRange(20, 50) * 0.01;
         const rotation = randomRange(0, 180) * 0.01;
         const delay = randomRange(0, 30) * 0.01;
         const duration = randomRange(50, 100) * 0.01;
         gsap.set(star, {scale: scale, rotation: rotation, opacity: 0, x: POSITION[i].x, y: POSITION[i].y});
         gsap.to(star, 0.3, {delay: delay, opacity: 1});
         gsap.to(star, duration, {
            delay: delay,
            scale: randomRange(70, 100) * 0.01,
            rotation: `+=${randomRange(-180, 180)}`,
            ease: Cubic.easeOut
         });
         gsap.to(star, 0.3, {delay: delay + duration-0.3, opacity: 0});
         
      });
   }, []);

   return (
      <div className="effect-con" ref={container}>
         {Array.from(Array(PARTICLE_NUM), (k, i) => (
            <div className="star" key={`star-${i}`} ref={ref => ref && (stars.current[i] = ref)}></div>
         ))}
      </div>
   );
}

export default SightWordsEffect;