import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { Container, Graphics, PixiRef, Sprite, Text, useTick, _ReactPixi } from "@inlet/react-pixi";
import { LINE_CAP } from "pixi.js";
import useCounter from "../../../hooks/useCounter";

import { toRadian } from "../../../utils";
import { gsap } from "gsap";
import useAssets from "../../../hooks/useAssets";
import { useSelector } from "react-redux";


/*
* @ PROPS
*     timeLength: 전체 타임
*     onTimeout: 타이머 종료 콜백
*/
export interface Props extends _ReactPixi.IContainer {
   timeLength: number;
   onTimeout: () => void;
}


/*
* @ REFS
*     start: 타이머 시작
*/
export interface Refs {
   start: () => void;
}


const TimeContainer = forwardRef<Refs, Props>(({ timeLength, onTimeout, ...props }, ref ) => {
   
   const { resources } = useAssets();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   
   const timeText = useRef<PixiRef<typeof Text>>(null);
   const isStart = useRef<boolean>(false);
   const gameCounter = useCounter(timeLength);
   const progressBar = useRef<PixiRef<typeof Graphics>>(null);


   const drawArc = useCallback(( angle: number ) => {
      if(gameData.lowQuality === 0) {
         progressBar.current!.cacheAsBitmap = false;
         progressBar.current!.clear();
         progressBar.current!.lineStyle({
            width: 22,
            color: (timeLength - gameCounter.getTime()) / 1000 > 10 ? 0xffc000 : 0xe8540b,
            cap: LINE_CAP.ROUND
         });
         progressBar.current!.arc(0, 0, 109, toRadian(angle), 0)
         progressBar.current!.endFill();
         progressBar.current!.cacheAsBitmap = true;
      }
   },[]);

   useImperativeHandle(ref, () => ({
      start: () => {
         isStart.current = true;
         gameCounter.start();
      }
   }));


   useTick(( delta ) => {
      if(isStart.current){
         if( gameCounter.getTime() < timeLength ) {
            if(timeText.current && timeText.current.text !== gameCounter.getFormat()) {
               timeText.current.text = gameCounter.getFormat();
            }
            drawArc(360 * gameCounter.getTime() / timeLength);
         } else {
            isStart.current = false;
            gameCounter.pause();
            onTimeout();
            drawArc(0);
         }
      }
   });

   useEffect(() => drawArc(1), []);

   return (
      <Container name="timeContainer" {...props}>
         <Text 
            ref={timeText}
            text={gameCounter.getFormat()}
            name="timeText"
            anchor={0.5}
            style={{
               fontSize: 60,
               fontFamily: 'LexendDeca-SemiBold',
               fill: '#ffffff',
               align: 'right',
               dropShadow: true,
               dropShadowColor: 'rgba(0,0,0,0.4)',
               dropShadowBlur: 10,
               dropShadowAngle: Math.PI / 4,
               dropShadowDistance: 5}
            }>      
         </Text>
         {gameData.lowQuality === 0 && 
            <>
               <Sprite 
                  name="progressBg"
                  texture={resources.mainProgressBg.texture}
                  anchor={0.5} />
               <Graphics 
                  ref={progressBar}
                  name="progressBar"
                  scale={[-1, 1]}
                  rotation={toRadian(90)} />
            </>
         }
      </Container>
   );
});

export default memo(TimeContainer, () => true);