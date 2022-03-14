import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState, memo } from "react";
import { Container, Graphics, Sprite, _ReactPixi, PixiRef } from "@inlet/react-pixi";
import { Graphics as PIXIGraphics} from "pixi.js";
import { gsap, Power2, Linear } from "gsap";
import PIXITimeout from "../../utils/PIXITimeout";
import useAssets from "../../hooks/useAssets";

/*
* @ REFS
*     start: 애니메이션 시작
*     fast:  애니메이션 빠른 동작 모드
*     stop:  애니메이션 종료
*/
export interface Refs {
   start: () => void;
   fast: () => void;
   stop: () => void;
}

const Clock = forwardRef<Refs, _ReactPixi.IContainer>(( props, ref ) => {

   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);
   const clockStick = useRef<PixiRef<typeof Container>>(null);
   const clockButton = useRef<PixiRef<typeof Sprite>>(null);
   const [isInit, setIsInit] = useState<boolean>(false);

   const timer = useRef<any>(null);


   const drawRoundRect = useCallback((g: PIXIGraphics, width, height, round, color) => {
      if(!isInit) {
         g.beginFill(color);
         g.drawRoundedRect(0, 0, width, height, round);
         g.endFill();
      }
   }, [isInit]);

   const buttomMotion = useCallback((y: string, speed: number, delay: number) => {
      if(clockButton.current){
         gsap.to(clockButton.current, speed, {
            pixi: {y: y},
            onComplete: ()=> {
               if(y === '+=5') {
                  timer.current = PIXITimeout.start(()=> buttomMotion('-=5', speed, delay), 1);
               } else {
                  timer.current = PIXITimeout.start(()=> buttomMotion('+=5', speed, delay), delay);
               }
            }
         });
      }
   }, []);

   useImperativeHandle(ref, () => ({
      start: () => {
         gsap.to(clockStick.current, 10, { pixi: {rotation: 360}, repeat: -1, ease: Linear.easeNone });
         timer.current = PIXITimeout.start(() => buttomMotion('+=5', 0.5, 1000), 0.5);
      },
      fast: () => {
         PIXITimeout.clear(timer.current);
         gsap.killTweensOf(clockStick.current);
         gsap.killTweensOf(clockButton.current);
         clockStick.current!.rotation = 0;
         clockButton.current!.position.y = 0;
         gsap.to(clockStick.current, 1, { pixi: {rotation: 360}, repeat: -1, repeatDelay: 0.1, ease: Power2.easeInOut });
         timer.current = PIXITimeout.start(() => buttomMotion('+=5', 0.25, 500), 0.5);
         gsap.to(container.current, 0, { pixi: { scale: 1.1 }, repeat: -1, repeatDelay: 0.2, yoyo: true });
      },
      stop: () => {
         PIXITimeout.clear(timer.current);
         gsap.killTweensOf(clockStick.current);
         gsap.killTweensOf(clockButton.current);
         gsap.killTweensOf(container.current);
         clockStick.current!.rotation = 0;
         clockButton.current!.position.y = 0;
         container.current!.scale.set(1);
      }
   }));

   useEffect(() => {
      setTimeout(() => setIsInit(true));
      return () => {
         PIXITimeout.clear(timer.current);
      }
   }, []);

   return (
      <Container 
         ref={container}
         position={[60, 62]}
         name="watch" 
         {...props}>
         <Container position={[-60, -62]}>
            <Sprite  
               ref={clockButton}
               position={
                  clockButton.current 
                  ? [clockButton.current.position.x, clockButton.current.position.y] 
                  : [41, 0]
               }
               texture={resources.commonWatchButton.texture} />
            <Sprite 
               position={[0, 18]}
               texture={resources.commonWatchBody.texture} />
            <Graphics  
               position={[55, 71]}
               cacheAsBitmap={true}
               draw={ g => drawRoundRect(g, 20, 8, 8, 0x515f61)} />
            <Container 
               ref={clockStick} 
               position={clockStick.current ? clockStick.current.position : [59, 75]} 
               anchor={[0.5, 1]}>
               <Graphics  
                  cacheAsBitmap={true}
                  position={[-4, -28]}
                  draw={ g => drawRoundRect(g, 8, 28, 8, 0x515f61)} />
            </Container>
            <Sprite 
               position={[95, 20]}
               texture={resources.commonWatchBubble.texture} />
         </Container>
      </Container>
   )
});

export default memo(Clock, () => true);