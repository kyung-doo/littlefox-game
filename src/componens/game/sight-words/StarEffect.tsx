import { VFC, useRef, useEffect, memo } from "react";
import { Container, Sprite, _ReactPixi } from "@inlet/react-pixi";
import { Container as PIXIContainer, Sprite as PIXISprite } from 'pixi.js';
import useAssets from "../../../hooks/useAssets";
import { toRadian } from "../../../utils";
import { gsap, Cubic, Back } from 'gsap';
import PIXITimeout from "../../../utils/PIXITimeout";



export interface Props extends _ReactPixi.IContainer {
   bonus: boolean;
}


const STAR_LENGTH = 12;

const StarEffect: VFC<Props> = ({bonus, ...props}) => {
   
   const { resources } = useAssets();
   const container = useRef<PIXIContainer>(null);
   const starSet1 = useRef<PIXIContainer>(null);
   const starSet2 = useRef<PIXIContainer>(null);
   const starSet3 = useRef<PIXIContainer>(null);
   const starSet4 = useRef<PIXIContainer>(null);
   const stars1 = useRef<PIXISprite[]>([]);
   const stars2 = useRef<PIXISprite[]>([]);
   const stars3 = useRef<PIXISprite[]>([]);
   const stars4 = useRef<PIXISprite[]>([]);
   const timer = useRef<any>();
   

   useEffect(() => {
      timer.current = PIXITimeout.start(() => {
         stars1.current.forEach((star: PIXISprite, i) => {
            const num = i % 2;
            gsap.to(star, 0.2, {delay: 1, pixi: {alpha: 1}});
            gsap.to(star, 1, {delay: 0.1 * num + 1, pixi: {y: bonus ? -380 : -310}, ease: Back.easeOut.config(4)});
            gsap.to(star, 0.2, {delay: 2.5, pixi: {alpha: 0, y: "+=30"}, ease: Cubic.easeInOut});
         });
   
         stars2.current.forEach((star: PIXISprite, i) => {
            const num = i % 2;
            gsap.to(star, 0.2, {delay: 1.1, pixi: {alpha: 1}});
            gsap.to(star, 1, {delay: 0.1 * num + 1.1, pixi: {y: bonus ? -410 : -350}, ease: Back.easeOut.config(2)});
            gsap.to(star, 0.2, {delay: 2.4, pixi: {alpha: 0, y: "+=30"}, ease: Back.easeOut.config(2)});
         });
   
         stars3.current.forEach((star: PIXISprite, i) => {
            const num = i % 2;
            gsap.to(star, 0.2, {delay: 1.2, pixi: {alpha: 1}});
            gsap.to(star, 1, {delay: 0.1 * num + 1.2, pixi: {y: bonus ? -410 : -350}, ease: Back.easeOut.config(1.5)});
            gsap.to(star, 0.2, {delay: 2.3, pixi: {alpha: 0, y: "+=30"}, ease: Cubic.easeInOut});
         });
   
         stars4.current.forEach((star: PIXISprite, i) => {
            const num = i % 2;
            gsap.to(star, 0.2, {delay: 1.3, pixi: {alpha: 1}});
            gsap.to(star, 1, {delay: 0.1 * num + 1.3, pixi: {y: bonus ? -360 : -290}, ease: Back.easeOut.config(1)});
            gsap.to(star, 0.2, {delay: 2.2, pixi: {alpha: 0, y: "+=30"}, ease: Cubic.easeInOut});
         });
      }, bonus ? 1000 : 0);
      
      return () => {
         PIXITimeout.clear(timer.current);
      }
      
   }, []);


   return (
      <Container
         ref={container}
         name="starEffect"
         {...props}>
         <Container 
            ref={starSet1}
            name="starSet1">
            {Array.from(Array(STAR_LENGTH), (k, i) => (
               <Container 
                  key={`starCon${i}`}
                  name="star"
                  rotation={toRadian((360 / STAR_LENGTH) * i)}>
                  <Sprite 
                     ref={ref => ref && (stars1.current[i] = ref)}
                     anchor={0.5}
                     alpha={stars1.current[i] ? stars1.current[i].alpha : 0}
                     tint={bonus ? 0xffffff : 0xfff547}
                     texture={bonus ? resources.mainStarBonus.texture : resources.mainStar.texture} />
               </Container>
            ))}
         </Container>
         <Container 
            ref={starSet2}
            name="starSet2" 
            rotation={toRadian(-10)}>
            {Array.from(Array(STAR_LENGTH), (k, i) => (
               <Container 
                  key={`starCon${i}`}
                  name="star"
                  rotation={toRadian((360 / STAR_LENGTH) * i)}>
                  <Sprite 
                     ref={ref => ref && (stars2.current[i] = ref)}
                     anchor={0.5}
                     alpha={stars2.current[i] ? stars2.current[i].alpha : 0}
                     tint={bonus ? 0xfffec3 : 0xff8d47}
                     scale={0.5}
                     texture={resources.mainStar.texture} />
               </Container>
            ))}
         </Container>
         <Container 
            ref={starSet3}
            name="starSet3" 
            rotation={toRadian(-20)}>
            {Array.from(Array(STAR_LENGTH), (k, i) => (
               <Container 
                  key={`starCon${i}`}
                  name="star"
                  rotation={toRadian((360 / STAR_LENGTH) * i)}>
                  <Sprite 
                     ref={ref => ref && (stars3.current[i] = ref)}
                     anchor={0.5}
                     alpha={stars3.current[i] ? stars3.current[i].alpha : 0}
                     tint={bonus ? 0xffc9d9 : 0xdcffe9}
                     scale={0.4}
                     texture={resources.mainStar.texture} />
               </Container>
            ))}
         </Container>
         <Container 
            ref={starSet4}
            name="starSet4" 
            rotation={toRadian(-20)}>
            {Array.from(Array(STAR_LENGTH), (k, i) => (
               <Container 
                  key={`starCon${i}`}
                  name="star"
                  rotation={toRadian((360 / STAR_LENGTH) * i)}>
                  <Sprite 
                     ref={ref => ref && (stars4.current[i] = ref)}
                     anchor={0.5}
                     alpha={stars4.current[i] ? stars4.current[i].alpha : 0}
                     tint={bonus ? 0xffffff : 0xc6a2ff}
                     scale={0.3}
                     texture={resources.mainStar.texture} />
               </Container>
            ))}
         </Container>
      </Container>
   )
}

export default memo(StarEffect);