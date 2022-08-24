import { FC, memo, useRef, useEffect } from "react";
import { Container, Sprite, _ReactPixi } from "@inlet/react-pixi";
import { Container as PIXIContainer, Sprite as PIXISprite } from 'pixi.js';
import useAssets from "../../../hooks/useAssets";
import { toRadian } from "../../../utils";
import { gsap, Cubic, Back, Elastic, Linear } from 'gsap';
import PIXITimeout from "../../../utils/PIXITimeout";
import StarEffect from "./StarEffect";



export interface Props extends _ReactPixi.IContainer {
   id: string;
   idx: number;
   startPos: { x: number, y: number };
   bonus: boolean;
   onAnimationEnd?: (id: string) => void;
}




const EggEffect: FC<Props> = ({id, idx, startPos, bonus, onAnimationEnd, ...props}) => {

   const { resources } = useAssets();
   const container = useRef<PIXIContainer>(null);
   const egg = useRef<PIXISprite>(null);
   const leftEgg = useRef<PIXISprite>(null);
   const rightEgg = useRef<PIXISprite>(null);
   const light1 = useRef<PIXISprite>(null);
   const light2 = useRef<PIXISprite>(null);
   const dinos = useRef<PIXISprite>(null);
   const timer = useRef<any[]>([]);
   const bonusBg = useRef<PIXISprite>(null);



   useEffect(() => {
      gsap.to(egg.current, 0.6, {
         delay: 0.1,
         pixi: {x: 1015, y: 760, scale: 1, rotation: 0}, 
         ease: Cubic.easeInOut
      });
      
      gsap.timeline({delay: bonus ? 1 : 0, onStart: () => {
         timer.current[1] = PIXITimeout.start(() => {
            resources.audioEgg.sound.play()
         }, 800);
      }})
      .to(egg.current, 0.1, {delay: 0.7, pixi: {rotation: 15, scale: 1.1}, ease: Cubic.easeOut})
      .to(egg.current, 0.3, {pixi: {rotation: 0, scale: 1}, ease: Elastic.easeOut.config(1.2, 0.5), onComplete: () =>{
         egg.current!.alpha = 0;
         leftEgg.current!.alpha = 1;
         rightEgg.current!.alpha = 1;

         gsap.to(leftEgg.current, 0.8, {pixi: {rotation: -20, x: '-=150', y: '+=100'}, ease: Back.easeOut.config(2)});
         gsap.to(rightEgg.current, 0.8, {pixi: {rotation: 20, x: '+=150', y: '+=100'}, ease: Back.easeOut.config(2)});
         gsap.to(leftEgg.current, 0.3, {delay: 0.7, pixi: {alpha: 0}});
         gsap.to(rightEgg.current, 0.3, {delay: 0.7, pixi: {alpha: 0}});

         gsap.set(light1.current, {pixi: {scale: 0}});
         gsap.to(light1.current, 4, {pixi: {rotation: -360}, repeat: -1, ease: Linear.easeNone});
         gsap.to(light1.current, 0.2, {pixi: { alpha: 1}});
         gsap.to(light1.current, 0.7, {pixi: { scale: 1}, ease: Cubic.easeInOut});
         gsap.to(light1.current, 0.2, {delay: 1.3, pixi: { alpha: 0}});

         gsap.to(light2.current, 2, {pixi: {rotation: 360}, repeat: -1, ease: Linear.easeNone});
         gsap.to(light2.current, 0.2, {delay: 0.2, pixi: { alpha: 1}});
         gsap.to(light2.current, 0.2, {delay: 1.3, pixi: { alpha: 0}});

         gsap.set(dinos.current, {pixi: { scale: 0, y:'+=150' }});
         gsap.to(dinos.current, 0.2, {delay: 0.1, pixi: { alpha: 1 }});
         gsap.to(dinos.current, 0.6, {delay: 0.1, pixi: { scale: 1, y: '-=150' }, ease: Back.easeOut.config(3)});
         gsap.to(dinos.current, 0.6, {delay: 1.2, pixi: { scale: 1.5, alpha: 0 }, ease: Cubic.easeInOut});
         if(bonus) {
            gsap.to(bonusBg.current, 0.3, {pixi: {alpha: 1}});
            gsap.to(bonusBg.current, 0.3, {delay: 1.5, pixi: {alpha: 0}});
         }

         timer.current[2] = PIXITimeout.start(() => {
            resources.audioEggClear.sound.play();
         }, 200);
      }});

      timer.current[0] = PIXITimeout.start(() => {
         gsap.killTweensOf([light1.current, light2.current]);
         if(onAnimationEnd) onAnimationEnd(id);
      }, bonus ?  4000 : 3000);

      return () => {
         timer.current.forEach(t => PIXITimeout.clear(t));
         resources.audioEgg.sound.stop();
         resources.audioEggClear.sound.stop();
      }
   },[]);



   return (
      <Container
         ref={container}
         name="eggEffectCon"
         {...props}>
         
         <Sprite
            ref={light2}
            name="light2"
            texture={resources.mainEffectLight2.texture}
            anchor={0.5}
            alpha={light2.current ? light2.current.alpha : 0}
            position={[1020, 660]} />

         <Sprite
            ref={light1}
            name="light1"
            texture={resources.mainEffectLight1.texture}
            anchor={0.5}
            alpha={light1.current ? light1.current.alpha : 0}
            position={[1020, 660]} />

         {bonus && 
            <Sprite 
               ref={bonusBg}
               alpha={bonusBg.current ? bonusBg.current.alpha : 0}
               position={[1020, 660]}
               anchor={0.5}
               texture={resources.mainBonusBg.texture} />
         }

         

         <Sprite 
            ref={egg}
            name="egg"
            texture={resources.mainEggBig.texture}
            anchor={0.5}
            scale={egg.current ? egg.current.scale : 0.64}
            rotation={egg.current ? egg.current.rotation : toRadian(-9)}
            x={egg.current ? egg.current.position.x : startPos.x}
            y={egg.current ? egg.current.position.y : startPos.y} />

         <Sprite 
            ref={leftEgg}
            name="leftAgg"
            texture={resources.mainEggBigLeft.texture}
            anchor={[0, 0.5]}
            alpha={leftEgg.current ? leftEgg.current.alpha : 0}
            position={leftEgg.current ? leftEgg.current.position : [794, 760]} />

         <Sprite 
            ref={rightEgg}
            name="rightEgg"
            texture={resources.mainEggBigRight.texture}
            anchor={[1, 0.5]}
            alpha={rightEgg.current ? rightEgg.current.alpha : 0}
            position={rightEgg.current ? rightEgg.current.position : [1255, 760]} />

         <StarEffect 
            bonus={bonus}
            position={[1030, 680]} />
            
         <Sprite 
            ref={dinos}
            name="dinos"
            texture={bonus ? resources['mainDinosBonus'+idx].texture : resources['mainDinos'+idx].texture}
            anchor={0.5}
            alpha={dinos.current ? dinos.current.alpha : 0}
            position={[1030, 680]} />
            

      </Container>
   );
}

export default memo(EggEffect);