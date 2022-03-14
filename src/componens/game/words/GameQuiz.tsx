import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, memo, useState } from "react";
import { Container, PixiRef, Sprite, useTick } from "@inlet/react-pixi";
import { Container as PIXIContainer } from "pixi.js";
import { makeRandom, randomRange } from "../../../utils";
import PIXITimeout from "../../../utils/PIXITimeout";
import useAssets from "../../../hooks/useAssets";
import { useSelector } from "react-redux";



export type QuizeDataType = {
   id: string;
   quizNo: number;
}


/*
* @ PROPS
*     quizData: 퀴즈 데이터
*     addSpeed: 추가 속도 값
*     onStart: 퀴즈 시작 콜백
*     onNext: 다음 퀴즈 시작 콜백
*     onHit: 문제가 유효 선에 닫았을때 콜백
*     onFinish: 퀴즈 종료 콜백
*/
export interface Props {
   quizData: QuizeDataType;
   addSpeed: number;
   onStart: (id: string) => void;
   onNext: (id: string) => void;
   onHit: (id: string, quizNo: number, idx: number, isCorrect: boolean, isFirst: boolean, posY: number) => void;
   onFinish: (id: string, quizNo: number, isSuccess: boolean, isTimeout: boolean) => void;
}

/*
* @ REFS
*     touchStart: 버튼 터치 시 호출
*     touchEnd: 버튼 터치 종료시 호출
*     timeout: 퀴즈 시간초과 시 호출
*/
export interface Refs {
   touchStart: (idx: number) => void;
   touchEnd: () => void;
   timeout: () => void;
}


const GameQuiz = forwardRef<Refs, Props>(({ addSpeed, quizData, onStart, onNext, onHit, onFinish }, ref) => {

   const gameData: any = useSelector<any>(state => state.root.gameData);
   const { resources } = useAssets();

   const container = useRef<PixiRef<typeof Container>>(null);
   const quizItems = useRef<PixiRef<typeof Container>[]>([]);
   const lights = useRef<PixiRef<typeof Sprite>[]>([]);

   const [quizDataItems, setQuizDataItems] = useState<{[key: string]: any}[] | null>(null);
   const isStart = useRef<boolean>(false);
   const isNext = useRef<boolean>(false);
   const isTouch = useRef<boolean>(false);
   const touchIdx = useRef<number>(0);
   const firstTouch = useRef<boolean>(false);
   const isSuccess = useRef<boolean>(false);
   const isTick = useRef<boolean>(false);
   const posY = useRef<number[]>([]);   

   const timer = useRef<any>(null);
   


   const makeQuizItems = useCallback(() => {
      
      const quizList = [...gameData.quizList];
      quizList.forEach((li: any, i: number) => li.no = i);
      const correctData = quizList[quizData.quizNo];
      const wrongDatas = quizList.filter((li, i) => i !== quizData.quizNo);
      const rand = makeRandom(wrongDatas.length, 2);
      const wrongData1 = wrongDatas[rand[0]];
      const wrongData2 = wrongDatas[rand[1]];
      const list: {[key: string]: any}[] = [];
      const speeds = makeRandom(3, 3);

      makeRandom(3, 3).forEach(( num, i ) => {
         switch(i) {
            case 0 : 
               list[num] = { image: resources[`quizImg_${correctData.no}`].texture, correct: true};
            break;
            case 1 : 
               list[num] = { image: resources[`quizImg_${wrongData1.no}`].texture, correct: false};
            break;
            case 2 : 
               list[num] = { image:resources[`quizImg_${wrongData2.no}`].texture, correct: false};
            break;
         } 
         list[num].speed = speeds[i];
         list[num].randSpeed = 1 + randomRange(0, 50) * 0.01;
      });

      setQuizDataItems(list);
      
   }, []);

  
   const checkHit = useCallback(( target: PIXIContainer ) => {
      const chekY = target.position.y + 250;
      if(chekY >= 860 && chekY < 1375) return true;
      return false;
   }, []);

   const checkTouchItem = useCallback(( target: PIXIContainer, idx: number ) => {
      if(isTouch.current && checkHit(target) && touchIdx.current === idx) {
         if(!firstTouch.current) {
            if(quizDataItems![idx-1].correct){
               firstTouch.current = true;
               isSuccess.current = true;
               onHit(quizData.id, quizData.quizNo, idx, true, true, target.position.y);
            } else {
               onHit(quizData.id, quizData.quizNo, idx, false, false, target.position.y);
            }
         } else {
            onHit(quizData.id, quizData.quizNo, idx, quizDataItems![idx-1].correct, false, target.position.y);
         }
         if(!quizDataItems![idx-1].correct && lights.current[idx-1].texture !== resources.mainItemLight2.texture) {
            lights.current[idx-1].texture = resources.mainItemLight2.texture;
         }
         isTouch.current = false;
      }
   }, [quizDataItems]);


   useImperativeHandle(ref, () => ({
      touchStart: ( idx: number ) => {
         touchIdx.current = idx;
         isTouch.current = true;
         PIXITimeout.clear(timer.current);
      },
      touchEnd: () => {
         isTouch.current = false;
         touchIdx.current = 0;
         timer.current =PIXITimeout.start(()=>{
            lights.current.forEach(light => {
               if(light.texture !== resources.mainItemLight.texture) {
                  light.texture = resources.mainItemLight.texture;
               }
            });
         }, 100);
      },
      timeout: () => {
         isTick.current = false;
         if(isNext.current && !isSuccess.current) {
            onFinish(quizData.id, quizData.quizNo, isSuccess.current, true);
         }
      }
   }));

   useTick((delta) => {
      if(quizDataItems && isTick.current){
         quizItems.current.forEach((item, i) => {
            const data = quizDataItems[i];
            try{
               if(item.position.y < 1220) {
                  const timeout = gameData.quizTimeout ? gameData.quizTimeout : 7;
                  const moveY = (1220/(timeout-1)) * 0.02 * delta;
                  posY.current[i] += moveY;
                  posY.current[i] += moveY * Math.pow(data.speed + 1, 2) * data.randSpeed * 0.05;
                  posY.current[i] += moveY * addSpeed;
                  lights.current[i].scale.y = (10 * (1-((posY.current[i]+280)/1500))) + 0.5;
                  
                  if(data.speed === 2) {
                     if(posY.current[i] > 100 && !isStart.current) {
                        onStart(quizData.id);
                        isStart.current = true;
                     }
                  }
                  if(data.speed === 0 && !isNext.current) {
                     if(posY.current[i] > 650) {
                        onNext(quizData.id);
                        isNext.current = true;
                     }
                  }
                  if(posY.current[i] < 1150){
                     checkTouchItem(item, i+1);
                  }
               } else {
                  if(data.speed === 0) {
                     onFinish(quizData.id, quizData.quizNo, isSuccess.current, false);
                     isTick.current = false;
                  }
               }
               item.position.y = posY.current[i];
            }catch(e){}
         });
      }
   });


   useEffect(() => {
      if(quizDataItems) {
         quizItems.current.forEach((item, i) => {
            const data = quizDataItems[i];
            item.y = (-50 * (2-data.speed)) -280;
            posY.current[i] = item.y;
            item.visible = true;
            isTick.current = true;
            lights.current[i].scale.y = 10;
         });
      }
   }, [quizDataItems]);


   useEffect(() => {
      makeQuizItems()
      return () => {
         PIXITimeout.clear(timer.current);
      }
   }, []);


   return (
      <Container 
         ref={container} 
         name="quizCon"
         x={353}>
         {quizDataItems && quizDataItems.map((item, i) => (
            <Container 
               key={`item${quizData.id}-${i}`}
               ref={ref => ref && (quizItems.current[i] = ref)}
               name={`item${quizData.id}-${i}`}
               visible={ quizItems.current[i] ? quizItems.current[i].visible : false }
               x={14 + 450 * i}>
               <Sprite 
                  name="light"
                  ref={ref => ref && (lights.current[i] = ref)}
                  position={[205, 0]}
                  anchor={[0.5, 1]}
                  texture={resources.mainItemLight.texture} />
               <Sprite 
                  name="thumbBg"
                  texture={resources.mainThumbBg.texture} />
               <Sprite 
                  name="thumb"
                  position={15}
                  roundPixels={true}
                  texture={item.image}
                  width={387}
                  height={225} />
               
            </Container>
         ))}
      </Container>
   )
});

export default memo(GameQuiz, () => true);