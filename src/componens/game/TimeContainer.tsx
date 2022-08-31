import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import { Container, Text, Sprite, PixiRef, _ReactPixi, useTick } from "@inlet/react-pixi";
import ProgressBar, { Refs as ProgressRefs } from "./ProgressBar";
import Clock, { Refs as ClockRefs} from "./Clock";
import useCounter from "../../hooks/useCounter";
import useAssets from "../../hooks/useAssets";
import { useSelector } from "react-redux";

/*
* @ PROPS
*     timeLength: 전체 타임
*     textColor: 타임 텍스트 칼라
*     onTimeout: 타이머 종료 콜백
*/
export interface Props extends _ReactPixi.IContainer {
   timeLength: number;
   textColor: string;
   onTimeout: () => void;
}

/*
* @ REFS
*     start: 타이머 시작
*/
export interface Refs {
   start: () => void;
}

const TimeContainer = forwardRef<Refs, Props>(({ timeLength, textColor, onTimeout, ...props }, ref ) => {

   const { resources } = useAssets();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   
   const clock = useRef<ClockRefs>(null);
   const progressBar = useRef<ProgressRefs>(null);
   const timeText = useRef<PixiRef<typeof Text>>(null);
   const isStart = useRef<boolean>(false);
   const isFast = useRef<boolean>(false);
   const gameCounter = useCounter(timeLength);



   useTick(() => {
      if(isStart.current){
         if( gameCounter.getTime() < timeLength ) {
            const percent = gameCounter.getTime() / timeLength;
            if(timeText.current && timeText.current.text !== gameCounter.getFormat()) {
               timeText.current.text = gameCounter.getFormat();
            }
            if(progressBar.current) {
               progressBar.current.update(percent, );
            }
            if((timeLength - gameCounter.getTime()) / 1000 <= 11 && !isFast.current) {
               clock.current?.fast();
               progressBar.current!.fast();
               isFast.current = true;
            }
         } else {
            isStart.current = false;
            gameCounter.pause();
            clock.current?.stop();
            onTimeout();
         }
      }
   });

   useImperativeHandle(ref, () => ({
      start: () => {
         isStart.current = true;
         gameCounter.start();
         clock.current?.start();
      }
   }));
   

   return (
      <Container name="timeContainer" {...props}>
         <ProgressBar 
            ref={progressBar}
            position={[50, 42]} />
         {gameData.lowQuality === 0
            ?
            <Clock ref={clock} />
            :
            <Sprite texture={resources.commonWatch.texture} />
         }
         <Text 
            ref={timeText}
            text={gameCounter.getFormat()}
            name="timeText"
            position={[820, 14]}
            anchor={0.5}
            style={{
               fontSize: 40,
               fontFamily: 'LexendDeca-SemiBold',
               fill: textColor,
               align: 'right'}
            }>      
         </Text>
      </Container>
   );
});

export default memo(TimeContainer, () => true);