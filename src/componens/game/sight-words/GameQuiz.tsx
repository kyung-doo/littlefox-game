import { forwardRef, memo, useCallback, useContext, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Container, Sprite, Text } from "@inlet/react-pixi";
import { Container as PIXIContainer, Sprite as PIXISprite } from "pixi.js";
import useAssets from "../../../hooks/useAssets";
import { useSelector } from "react-redux";
import { makeRandom, randomRange } from "../../../utils";
import PIXITimeout from "../../../utils/PIXITimeout";
import { gsap, Back, Elastic, Cubic } from 'gsap';



/*
* @ PORPS
*     onCorrect: 퀴즈 정답 시 콜백
*     onWrong: 퀴즈 오답 시 콜백
*/
export interface Props {
   onCorrect: (pos: {x: number, y: number}, isBonus: boolean, bonusIdx: number) => void;
   onSuccess: (pos: {x: number, y: number}, isBonus: boolean, bonusIdx: number) => void;
   onWrong: (pos: {x: number, y: number}) => void;
}

/*
* @ REFS
*     start: 퀴즈 시작
*     timeout: 시간초과
*/
export interface Refs {
   start: (quizNo: number, bonus: number) => void;
   timeout: () => void;
}


const MAP_HOR = 4;
const MAP_VER = 4;

let timeline: gsap.core.Timeline | null = null;

const GameQuiz = forwardRef<Refs, Props>(({ onCorrect, onWrong, onSuccess }, ref) => {

   const gameData: any = useSelector<any>(state => state.root.gameData);
   const { resources } = useAssets();

   const container = useRef<PIXIContainer>(null);
   const aggs = useRef<PIXIContainer[]>([]);
   const stonBlind = useRef<PIXISprite>(null);

   const [quizNo, setQuizNo] = useState<number | null>(null);
   const [bonusIdx, setBonusIdx] = useState<number | null>(null);
   const [wordLists, setWordLists] = useState<{[key: string]: any}[] | null>(null);
   const [mapPosition, setMapPosition] = useState<{ x: number, y: number }[]>([]);

   const correctNum = useRef<number>(0);
   const isHideTransition = useRef<boolean>(false);
   
   const timer = useRef<any>(null);
   



   const makeQuiz = useCallback(() => {
      const quizList = [...gameData.quizList];
      const correctData = quizList[quizNo!];
      const wrongDatas = quizList.filter((li: any) => li.words !== correctData.words);
      const listRandom = makeRandom(MAP_VER * MAP_HOR, MAP_VER * MAP_HOR);
      
      const lists: {[key: string]: any}[] = [];
      Array.from(Array(3), (k, i) => {
         lists.push({ idx: listRandom[i], word: correctData.words, correct: true, bonus: i === 0 && bonusIdx! > 0 ?  true : false});
      });
      Array.from(Array(MAP_VER * MAP_HOR - 3), (k, i) => {
         lists.push({ idx: listRandom[i+3], word: wrongDatas[randomRange(0, wrongDatas.length-1)].words, correct: false });
      });
      setWordLists(lists);
      container.current!.interactiveChildren = false;
      correctNum.current = 0;
      const showRandom = makeRandom(MAP_VER * MAP_HOR, MAP_VER * MAP_HOR);
      
      timer.current = PIXITimeout.start(() => {
         aggs.current.forEach((agg, i) => {
            gsap.to(agg, 0.6, {
               delay: 0.05 * showRandom[i], 
               pixi: { scale: 1 }, 
               ease: Back.easeOut.config(1.5)
            });
         });
         timer.current = PIXITimeout.start(() => {
            container.current!.interactiveChildren = true;
         }, 1500);
      }, 100);

   }, [quizNo]);


   const onAggClick = useCallback(( list: any ) => {
      const target = aggs.current[list.idx];
      if(list.correct) {
         target.visible = false;
         if(correctNum.current < 2) {
            onCorrect({x: target.position.x, y: target.position.y }, list.bonus, bonusIdx!);
         } else {
            onSuccess({x: target.position.x, y: target.position.y}, list.bonus, bonusIdx!);
         }
         stonBlind.current!.visible = true;
         gsap.to(stonBlind.current, 0.3, {alpha: 1});
         gsap.to(stonBlind.current, 0.3, {delay: list.bonus ? 4 : 3, alpha: 0, onComplete: () => {
            stonBlind.current!.visible = false;
         }});
         
         correctNum.current++;
      } else {
         onWrong({x: target.position.x, y: target.position.y});
         worngAni(target);
         stonBlind.current!.visible = true;
         timer.current = PIXITimeout.start(() => {
            stonBlind.current!.visible = false;
         }, 500);
      }
   }, [bonusIdx]);
   

   const worngAni = useCallback(( target: PIXIContainer ) => {
      timeline = gsap.timeline()
         .to(target, 0.1, {pixi: {rotation: 15, scale: 1.1}, ease: Cubic.easeOut})
         .to(target, 0.6, {pixi: {rotation: 0, scale: 1}, ease: Elastic.easeOut.config(1.2, 0.4)});
   }, []);


   

   const hideAgg = useCallback(() => {
      container.current!.interactiveChildren = false;
      isHideTransition.current = true;
      aggs.current.forEach(agg => gsap.killTweensOf(agg));
      aggs.current.filter(x => x.visible).forEach((agg, i) => {
         gsap.to(agg, 0.4, {pixi: { scale: 0.2, alpha: 0 }, ease: Cubic.easeIn});
      });
      timer.current = PIXITimeout.start(()=>{
         if(timeline) timeline.kill();
         aggs.current = [];
         setWordLists(null);
         isHideTransition.current = false;
      }, 500);
   }, []);
   

   useImperativeHandle(ref, () => ({
      start: ( quizNo: number, bonus: number ) => {
         setBonusIdx(bonus);
         setQuizNo(quizNo);
      },
      timeout: () => {
         if(!isHideTransition.current) {
            hideAgg();
         }
      }
   }));

   useLayoutEffect(() => {
      let y = -1;
         const pos: {x: number, y: number}[] = [];
         Array.from(Array(MAP_HOR * MAP_VER), (k, i) => {
            const x = i % MAP_HOR;
            if(x === 0) y++;
            pos.push({x: x, y: y});
         });
         setMapPosition(pos);
   }, []);


   useEffect(() => {
      if(quizNo !== null) {
         makeQuiz();
      }
      return ()=> {
         PIXITimeout.clear(timer.current);
      }
   }, [quizNo]);


   return (
      <Container 
         ref={container}
         name="quizContainer">
         <Container 
            name="aggCon"
            position={[590, 280]}>
            {wordLists && wordLists.map((list, i) => (
               <Container
                  ref={ref => ref && (aggs.current[list.idx] = ref)}
                  key={`agg-${quizNo}-${list.idx}`}
                  name={`agg-${list.idx}`}
                  x={288 * mapPosition[list.idx].x}
                  y={234 * mapPosition[list.idx].y}
                  buttonMode={true}
                  interactive={true}
                  pointerdown={() => onAggClick(list)}
                  scale={aggs.current[list.idx] ? aggs.current[list.idx].scale : 0}>
                  <Sprite 
                     name="aggBg"
                     position={[-130, -86]}
                     texture={list.bonus ? resources.mainEggBonus.texture : resources.mainEggDefault.texture} />
                  <Text 
                     text={list.word} 
                     anchor={0.5}
                     style={{
                        fontSize: 56,
                        fontFamily: 'LexendDeca-SemiBold',
                        fill: '#000000'
                     }} />
               </Container>
            ))}
         </Container>

         <Sprite
            ref={stonBlind}
            name="stonBlind"
            position={[368, 115]}
            interactive={true}
            visible={stonBlind.current ? stonBlind.current.visible : false}
            alpha={stonBlind.current ? stonBlind.current.alpha : 0}
            texture={resources.mainStonBlind.texture} />

      </Container>
   )
});

export default memo(GameQuiz, () => true);