import { forwardRef, memo, useCallback, useContext, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatedSprite, Container, Sprite, Text } from "@inlet/react-pixi";
import { Container as PIXIContainer, Sprite as PIXISprite, Texture, AnimatedSprite as PIXIAnimatedSprite, Text as PIXIText } from "pixi.js";
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
   start: (quizNo: number[] | number, bonus?: number) => void;
   timeout: () => void;
}


const MAP_HOR = 4;
const MAP_VER = 4;


const GameQuiz = forwardRef<Refs, Props>(({ onCorrect, onWrong, onSuccess }, ref) => {

   const gameData: any = useSelector<any>(state => state.root.gameData);
   const { resources } = useAssets();

   const container = useRef<PIXIContainer>(null);
   const eggs = useRef<PIXIContainer[]>([]);
   const eggBgs = useRef<PIXIAnimatedSprite[]>([]);
   const eggTexts = useRef<PIXIText[]>([]);
   const eggBtns = useRef<PIXISprite[]>([]);
   const stonBlind = useRef<PIXISprite>(null);

   const [quizNo, setQuizNo] = useState<number[] | number | null>(null);
   const [bonusIdx, setBonusIdx] = useState<number | null>(null);
   const [wordLists, setWordLists] = useState<{[key: string]: any}[] | null>(null);
   const [mapPosition, setMapPosition] = useState<{ x: number, y: number }[]>([]);

   const correctNum = useRef<number>(0);
   const targetNo = useRef<number>(0);
   const isHideTransition = useRef<boolean>(false);
   
   const timer = useRef<any[]>([]);
   



   const makeQuiz = useCallback(() => {
      const quizList = [...gameData.quizList];
      container.current!.interactiveChildren = false;
      correctNum.current = 0;

      if(typeof quizNo === 'object'){
         const correctData = [quizList[quizNo![0]], quizList[quizNo![1]], quizList[quizNo![2]]];
         const wrongDatas =  quizList.filter((li: any) => !correctData.find(x => x.words === li.words));
         const listRandom = makeRandom(MAP_VER * MAP_HOR, MAP_VER * MAP_HOR);
         const lists: {[key: string]: any}[] = [];
         const bonusNum = randomRange(0, 2);

         targetNo.current = quizNo![0];
         
         Array.from(Array(9), (k, i) => {
            if(i < 3) {
               lists.push({ no: quizNo![0], idx: listRandom[i], word: correctData[0].words, correct: true, bonus: i === 0 && bonusIdx! > 0 && bonusNum === 0  ?  true : false});
            }
            else if(i < 6) {
               lists.push({ no: quizNo![1], idx: listRandom[i], word: correctData[1].words, correct: true, bonus: i === 3 && bonusIdx! > 0 && bonusNum === 1 ?  true : false});
            }
            else { 
               lists.push({ no: quizNo![2], idx: listRandom[i], word: correctData[2].words, correct: true, bonus: i === 6 && bonusIdx! > 0 && bonusNum === 2 ?  true : false});
            }
         });
         Array.from(Array(MAP_VER * MAP_HOR - 9), (k, i) => {
            lists.push({ idx: listRandom[i + 9], word: wrongDatas[randomRange(0, wrongDatas.length-1)].words, correct: false });
         });
         stonBlind.current!.visible = false;
         setWordLists(lists);
         timer.current.forEach(t => PIXITimeout.clear(t));
         const showRandom = makeRandom(MAP_VER * MAP_HOR, MAP_VER * MAP_HOR);
         timer.current[0] = PIXITimeout.start(() => {
            eggs.current.forEach((agg, i) => {
               agg.visible = true;
               gsap.to(agg, 0.6, {
                  delay: 0.05 * showRandom[i], 
                  pixi: { scale: 1, alpha: 1 }, 
                  ease: Back.easeOut.config(1.5)
               });
            });
            timer.current[1] = PIXITimeout.start(() => {
               container.current!.interactiveChildren = true;
            }, 1500);
         }, 100);
      } else {
         
         stonBlind.current!.visible = false;
         targetNo.current = quizNo!;
         timer.current[2] = PIXITimeout.start(() => {
            container.current!.interactiveChildren = true;
         }, 500);
      }
      
   }, [quizNo, bonusIdx]);


   const onAggClick = useCallback(( list: any ) => {
      const target = eggs.current[list.idx];
      if(list.correct && targetNo.current === list.no) {
         if(correctNum.current < 2) {
            onCorrect({x: target.position.x, y: target.position.y }, list.bonus, bonusIdx!);
            if(list.bonus) {
               target.visible = false;
               stonBlind.current!.visible = true;
               gsap.to(stonBlind.current, 0.3, {alpha: 1});
               gsap.to(stonBlind.current, 0.3, {delay: list.bonus ? 4 : 3, alpha: 0, onComplete: () => {
                  stonBlind.current!.visible = false;
               }});
            } else {
               eggs.current.forEach((egg, i) => egg.zIndex = i);
               target.zIndex = eggs.current.length;
               eggBgs.current[list.idx].play();
               eggTexts.current[list.idx].visible = false;
               eggBtns.current[list.idx].interactive = false;
               resources.audioEggShort.sound.stop();
               resources.audioEggShort.sound.play();
               stonBlind.current!.visible = true;
               timer.current[3] = PIXITimeout.start(() => {
                  stonBlind.current!.visible = false;
               }, 100);
            }
         } else {
            target.visible = false;
            onSuccess({x: target.position.x, y: target.position.y}, list.bonus, bonusIdx!);
            stonBlind.current!.visible = true;
            gsap.to(stonBlind.current, 0.3, {alpha: 1});
            gsap.to(stonBlind.current, 0.3, {delay: list.bonus ? 4 : 3, alpha: 0, onComplete: () => {
               stonBlind.current!.visible = false;
            }});
         }
         
         correctNum.current++;
      } else {
         onWrong({x: target.position.x, y: target.position.y});
         worngAni(target);
         stonBlind.current!.visible = true;
         timer.current[4] = PIXITimeout.start(() => {
            stonBlind.current!.visible = false;
         }, 500);
      }
   }, [bonusIdx]);
   

   const worngAni = useCallback(( target: PIXIContainer ) => {
      gsap.to(target, 0.1, {pixi: {rotation: 15, scale: 1.1}, ease: Cubic.easeOut})
      gsap.to(target, 0.6, {delay: 0.1, pixi: { rotation: 0, scale: 1}, ease: Elastic.easeOut.config(1.2, 0.4)});
   }, []);
   

   const hideAgg = useCallback(() => {
      timer.current.forEach(t => PIXITimeout.clear(t));
      container.current!.interactiveChildren = false;
      isHideTransition.current = true;
      eggs.current.forEach(agg => gsap.killTweensOf(agg));
      eggs.current.filter(x => x.visible).forEach((agg, i) => {
         gsap.to(agg, 0.4, {pixi: { scale: 0.2, alpha: 0 }, ease: Cubic.easeIn});
      });
      timer.current[5] = PIXITimeout.start(()=>{
         eggs.current = [];
         setWordLists(null);
         isHideTransition.current = false;
      }, 500);
   }, []);

   const eggTextures = useMemo(() => {
      return Object.keys(resources.spritesheetEgg.textures).map( name => resources.spritesheetEgg.textures[name]);
   }, []);

   const eggBonusTextures = useMemo(() => {
      return Object.keys(resources.spritesheetEggBonus.textures).map( name => resources.spritesheetEggBonus.textures[name]);
   }, []);
   

   useImperativeHandle(ref, () => ({
      start: ( quizNo: number[] | number, bonus?: number ) => {
         eggs.current.forEach((egg, i) => gsap.killTweensOf(egg));
         if(bonus) setBonusIdx(bonus);
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
         timer.current.forEach(t => PIXITimeout.clear(t));
      }
   }, [quizNo]);


   return (
      <Container 
         ref={container}
         name="quizContainer">
         <Container 
            name="aggCon"
            sortableChildren={true}
            position={[590, 280]}>
            {wordLists && wordLists.map((list, i) => {
               return(
               <Container
                  ref={ref => ref && (eggs.current[list.idx] = ref)}
                  key={`agg-${quizNo}-${list.idx}`}
                  name={`agg-${list.idx}`}
                  visible={eggs.current[list.idx] ? eggs.current[list.idx].visible : true}
                  x={288 * mapPosition[list.idx].x}
                  y={234 * mapPosition[list.idx].y}
                  scale={eggs.current[list.idx] ? eggs.current[list.idx].scale : 0}>
                  <Sprite 
                     ref={ref => ref && (eggBtns.current[list.idx] = ref)}
                     name="button"
                     buttonMode={true}
                     interactive={true}
                     pointerdown={() => onAggClick(list)}
                     width={259}
                     height={173}
                     position={[-120, -86]}
                     texture={Texture.EMPTY} />
                  <AnimatedSprite 
                     name="aggBg"
                     ref={ref => ref && (eggBgs.current[list.idx] = ref)}
                     isPlaying={eggBgs.current[list.idx] ? eggBgs.current[list.idx].playing : false}
                     loop={false}
                     position={[-279, -110]}
                     initialFrame={eggBgs.current[list.idx] && eggBgs.current[list.idx].playing ? eggBgs.current[list.idx].currentFrame : 0}
                     animationSpeed={0.5}
                     onComplete={() => eggs.current[list.idx].visible = false}
                     textures={list.bonus ? eggBonusTextures : eggTextures} />
                  <Text 
                     ref={ref => ref && (eggTexts.current[list.idx] = ref)}
                     text={list.word} 
                     visible={true}
                     anchor={0.5}
                     style={{
                        fontSize: 56,
                        fontFamily: 'LexendDeca-SemiBold',
                        fill: '#000000'
                     }} />
               </Container>
            )})}
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