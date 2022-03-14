import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Container, PixiRef, AnimatedSprite, Sprite } from "@inlet/react-pixi";
import { Container as PIXIContainer, Sprite as PIXISprite, AnimatedSprite as PIXIAnimatedSprite, Text as PIXIText, Texture } from 'pixi.js';
import { gsap, Power3,  Linear } from "gsap";
import { randomRange, makeRandom, toRadian } from "../../../utils";
import ScoreText, {Props as ScoreTextProps} from "../ScoreText";
import BonusEffect1 from "./BonusEffect1";
import BonusEffect2 from "./BonusEffect2";
import BonusEffect3 from "./BonusEffect3";
import PIXITimeout from "../../../utils/PIXITimeout";
import useAssets from "../../../hooks/useAssets";
import { useSelector } from "react-redux";


export type QuizeDataType = {
   id: string;
   quizNo: number;
}

const bubblePosition = [
   {x: 1330, y: 326},
   {x: 700, y: 300}, 
   {x: 1720, y: 600},
   {x: 1080, y: 705}, 
];

/*
* @ PORPS
*     quizData: 퀴즈 데이터
*     bonus: 보너스 인덱스 (0, 보너스 아님, 1~3 보너스)
*     onCorrect: 퀴즈 정답 시 콜백
*     onWrong: 퀴즈 오답 시 콜백
*     onSuccess: 퀴즈 성공 시 콜백
*     onFailed: 퀴즈 실패 시 콜백
*     onTransitionEnd: 퀴즈 완료 트랜지션 콜백
*/
export interface Props {
   quizData: QuizeDataType;
   bonus: number;
   onCorrect: (id: string, idx: number, bubble: PIXIContainer, type: string) => void;
   onWrong: (id: string, idx: number, bubble: PIXIContainer) => void;
   onSuccess: (id: string, isBonus?: boolean | undefined) => void;
   onFailed: (id: string) => void;
   onTransitionEnd: (id: string, isBonus?: boolean | undefined) => void;
}


/*
* @ REFS
*     timeout: 시간초과 
*/
export interface Refs {
   timeout: () => void;
}



const GameQuiz = forwardRef<Refs, Props>(({ quizData, bonus, onCorrect, onWrong, onSuccess, onFailed, onTransitionEnd }, ref) => {

   const gameData: any = useSelector<any>(state => state.root.gameData);
   const step: any = useSelector<any>(state => state.root.step);

   const { resources } = useAssets();
   const bubbleTextures = resources.spritesheetBubbleDefault.textures;
   const bonusBubbleTextures = resources.spritesheetBubbleBonus.textures;
   const explodTextures = resources.commonExplodEffect.textures;

   const bubbleCon = useRef<PixiRef<typeof Container>>(null);
   const explodes = useRef<PixiRef<typeof AnimatedSprite>[]>([]);
   const bonusBubbles = useRef<PixiRef<typeof AnimatedSprite>[]>([]);
   const [bubbleList, setBubbleList] = useState<{[key: string]: any}[] | null>(null);
   const correctList = useRef<number[]>([]);
   
   const [scoreTexts, setScoreTexts] = useState<ScoreTextProps[]>([]);
   const scoreCount = useRef<number>(0);
   const [bonusIdx, setBonusIdx] = useState<number | null>(null);
   const [showBonusEffect1, setShowBonusEffect1] = useState<boolean>(false);
   const [showBonusEffect2, setShowBonusEffect2] = useState<boolean>(false);
   const [showBonusEffect3, setShowBonusEffect3] = useState<boolean>(false);

   const timer = useRef<any[]>([]);
   
   

   const makeBubbles = useCallback(() => {
      const quizList = [...gameData.quizList];
      quizList.forEach((li: any, i: number) => li.no = i);
      const correctData = quizList[quizData.quizNo];
      const wrongDatas = quizList.filter((li: any) => li.alphabet !== correctData.alphabet);
      const wrongData = wrongDatas[Math.floor(Math.random() * wrongDatas.length)];
      if(step < 3) {
         setTextBubble(correctData.alphabet, wrongData.alphabet);
      } else {
         setImageBubble(correctData.no, wrongData.no)
      }
   }, []);

   const setTextBubble = useCallback(( correctAlphabet: string , wrongAlphabet: string ) => {
      const list: {[key: string]: any}[] = [];
      makeRandom(4, 4).forEach(( num, i )=>{
         switch(i) {
            case 0 : 
               list[num] = { alphabet: correctAlphabet, correct: true, type: 'lower'};
            break;
            case 1 : 
               list[num] = { alphabet: correctAlphabet.toUpperCase(), correct: true, type: 'upper'};
            break;
            case 2 : 
               list[num] = { alphabet: wrongAlphabet, correct: false, type: 'lower'};
            break;
            case 3 : 
               list[num] = { alphabet: wrongAlphabet.toUpperCase(), correct: false, type: 'upper'};
            break;
         } 
      });
      setBubbleList(list);
   }, []);
   

   const setImageBubble = (correctNo: number , wrongNo: number) => {
      const list: {[key: string]: any}[] = [];
      makeRandom(4, 4).forEach(( num, i )=>{
         switch(i) {
            case 0 : 
               list[num] = { texture: resources[`quizImg_${correctNo}_1`].texture, correct: true, type: 'image1'};
            break;
            case 1 : 
               list[num] = { texture: resources[`quizImg_${correctNo}_2`].texture, correct: true, type: 'image2'};
            break;
            case 2 : 
               list[num] = { texture: resources[`quizImg_${wrongNo}_1`].texture, correct: false, type: 'image1'};
            break;
            case 3 : 
               list[num] = { texture: resources[`quizImg_${wrongNo}_2`].texture, correct: false, type: 'image2'};
            break;
         } 
      });
      setBubbleList(list);
   }

   const onBubbleTouch = useCallback(( idx: number ) => {
      const bubbleSet = bubbleCon.current?.getChildByName(`bubble${idx}`) as PIXIContainer;
      
      if(bubbleList![idx].correct){
         const bubble = bubbleSet.getChildByName('bubble', true) as PIXIAnimatedSprite;
         const btn = bubbleSet.getChildByName('btn', true) as PIXISprite;
         const explod = bubbleSet.getChildByName('explod', true) as PIXIAnimatedSprite;
         const item = bubbleSet.getChildByName('item', true);
         gsap.killTweensOf(bubbleSet);
         btn.interactive = false;
         bubble.play();
         if(gameData.lowQuality === 0){
            timer.current[0] = PIXITimeout.start(() => {
               explod.visible = true;
               explod.play()
            }, 200);
         }

         gsap.to(item, 0.3, { pixi: { scale: 2, alpha: 0}});
         
         setScoreTexts(prev => [ ...prev, { 
               id: `scoreText${scoreCount.current}`, 
               texture: resources.mainScorePlus100.texture, 
               x: bubbleSet.x, 
               y: bubbleSet.y-100, 
               posY: 150
            }
         ]);
         onCorrect(quizData.id, idx, bubbleSet, bubbleList![idx].type);
         correctList.current.push(idx);
         if(correctList.current.length === 2) {
            bubbleCon.current!.interactiveChildren = false;
            if(bonusIdx === 0)   quizEnd(true);
            else                 quizEndBonus();
         }
      } else {
         const bubbleGrup = bubbleSet.getChildByName('bubbleGroup', true) as PIXIAnimatedSprite;
         gsap.killTweensOf(bubbleGrup);
         bubbleGrup.position.x = 0;
         gsap.to(bubbleGrup, 0.1, {pixi: { x: '+=30'}});
         gsap.to(bubbleGrup, 0.1, {delay: 0.1, pixi: { x: '-=50' }});
         gsap.to(bubbleGrup, 0.1, {delay: 0.2, pixi: { x: '+=40'}});
         gsap.to(bubbleGrup, 0.1, {delay: 0.3, pixi: { x: '-=20'}});
         gsap.to(bubbleGrup, 0.1, {delay: 0.4, pixi: { x: 0}});
         onWrong(quizData.id, idx, bubbleSet);
         setScoreTexts(prev => [ ...prev, { 
               id: `scoreText${scoreCount.current}`, 
               texture: resources.mainScoreMinus10.texture, 
               x: bubbleSet.x, 
               y: bubbleSet.y-100, 
               posY: 150
            }
         ]);
      }
      scoreCount.current++;
   }, [bubbleList, bonusIdx]);


   const quizEnd = useCallback(( isSuccess = false) => {
      bubbleCon.current!.interactiveChildren = false;
      
      bubbleCon.current?.children.forEach((child, i) => {
         const bubbleSet = child as PIXIContainer;
         if(correctList.current.indexOf(i) === -1) {
            gsap.to(bubbleSet, 1, { delay: 0.4, pixi: {y: `-=${randomRange(150, 300)}`, alpha: 0}, ease: Power3.easeOut });
         }
      });

      if(isSuccess){
         onSuccess(quizData.id);
      } else {
         onFailed(quizData.id);
      }

      timer.current[1] = PIXITimeout.start(() => {
         onTransitionEnd(quizData.id);
      }, 2500);
      
   }, []);

   const quizEndBonus = useCallback(() => {
      bubbleCon.current!.interactiveChildren = false;
      onSuccess(quizData.id, true);
      resources.audioBonus.sound.play();
      bubbleCon.current?.children.forEach((child, i) => {
         if(correctList.current.indexOf(i) === -1) {
            const bubbleSet = child as PIXIContainer;
            const bonusBubble = bubbleSet.getChildByName('bubbleBonus', true) as PIXIAnimatedSprite;
            bonusBubble.visible = true;
         }
      });
      timer.current[3] = PIXITimeout.start(() => {
         if(bonusIdx ===1){
            setShowBonusEffect1(true);
         } else if(bonusIdx === 2) {
            setShowBonusEffect2(true);
         }else if(bonusIdx === 3) {
            setShowBonusEffect3(true);
         }

         bubbleCon.current?.children.forEach((child, i) => {
            if(correctList.current.indexOf(i) === -1) {
               const bubbleSet = child as PIXIContainer;
               const bubble = bubbleSet.getChildByName('bubble', true) as PIXIAnimatedSprite;
               const bonusBubble = bubbleSet.getChildByName('bubbleBonus', true) as PIXIAnimatedSprite;
               const item = bubbleSet.getChildByName('item', true);
               const explod = bubbleSet.getChildByName('explod', true) as PIXIAnimatedSprite;
               gsap.to(bonusBubble, 0.5, {alpha: 0.5, yoyo: true, repeat: 1, onComplete: () =>{
                  gsap.killTweensOf(bubbleSet);
                  bubble.visible = false;
                  bonusBubble.alpha = 1;
                  bonusBubble.play();
                  resources.audioBubblePop.sound.play();
                  resources.audioCorrect.sound.play();
                  if(gameData.lowQuality === 0) {
                     timer.current[2] = PIXITimeout.start(() => {
                        explod.visible = true;
                        explod.play();
                     }, 200);
                  }
                  gsap.to(item, 0.3, {pixi: { scale: 2, alpha: 0}});
               }});
            }
         });
            
         timer.current[4] = PIXITimeout.start(() => {
            setShowBonusEffect1(false);
            setShowBonusEffect2(false);
            setShowBonusEffect3(false);
            onTransitionEnd(quizData.id, true);
         }, bonusIdx === 1? 2500 : 3000);
      }, 1000);
   }, [bonusIdx]);

   const getBubbleTextures = useMemo(() => {
      return Object.keys(bubbleTextures).map( name => bubbleTextures[name]);
   }, []);

   const getBonusTextures = useMemo(() => {
      return Object.keys(bonusBubbleTextures).map( name => bonusBubbleTextures[name]);
   }, []);

   const getExplodTextures = useMemo(() => {
      return Object.keys(explodTextures).map( name => explodTextures[name]);
   }, []);

   const onScoreTextAniEnd = useCallback((id: string) => {
      setScoreTexts(prev => {
         return prev.filter( st => st.id !== id);
      });
   },[]);


   useImperativeHandle(ref, () => ({
      timeout: quizEnd
   }));

   useEffect(() => {
      if(bubbleList) {
         resources.audioBubbleStart.sound.play();
         bubbleCon.current?.children.forEach((bubbleSet, i) => {
            const bubbleGroup = (bubbleSet as PIXIContainer).getChildByName('bubbleGroup') as PIXIContainer;
            const btn = (bubbleSet as PIXIContainer).getChildByName('btn', true) as PIXISprite;
            if(step < 3) {
               const text = new PIXIText(bubbleList[i].alphabet, {
                  fontSize: 127, fontFamily: 'LexendDeca-SemiBold', fill: '#123f9b', align: 'center'
               });
               text.name = 'item';
               text.anchor.set(0.5);
               bubbleGroup.addChild(text);
               timer.current[4] = PIXITimeout.start(() => text.cacheAsBitmap = true, 1000);
            } else {
               const image = new PIXISprite(bubbleList[i].texture);
               image.name = 'item';
               image.width = 250;
               image.height = 250;
               image.anchor.set(0.5);
               bubbleGroup.addChild(image);
            }

            bubbleSet.position.x = 270;
            bubbleSet.position.y = 560;
            bubbleSet.scale.x = bubbleSet.scale.y = 0.2;
            bubbleSet.alpha = 0;

            let delay = i * 0.2;
            if(i > 1) delay -= 0.2;
            gsap.to(bubbleSet, 0.7, { delay: 0.2 + delay, pixi: { x: bubblePosition[i].x, y: bubblePosition[i].y, scale: 1, alpha: 1 },
               onStart: () => {
                  if(bubbleSet){
                     bubbleSet.alpha = 0.5;
                     bubbleSet.visible = true;
                  }
               }
            });
            gsap.to(bubbleGroup, 0.25, { delay: delay, pixi: { y: 600 }});
            gsap.to(bubbleGroup, 0.7, { delay: delay+0.3, pixi: { y: 0 }, 
               onComplete: () => {
                  gsap.to(bubbleSet, randomRange(150, 200)*0.01, {delay: i * 0.2, pixi: { y: `+=${randomRange(30, 70)}` }, repeat: -1, yoyo: true, ease: Linear.easeNone});
                  btn.interactive = true;
               }
            });
         });
      }
   }, [bubbleList]);

   
   useEffect(() => {
      setBonusIdx(bonus);
      makeBubbles();
      return ()=> {
         timer.current.forEach(t => PIXITimeout.clear(t));
      }
   }, []);

   

   return(
      <Container name={`quiz${quizData.id}`}>
         {showBonusEffect3 && 
            <BonusEffect3 name="effect3" />
         }
         <Container ref={bubbleCon}>
            {bubbleList && bubbleList.map((li, i) => (
               <Container
                  key={`bubble${i}`} 
                  name={`bubble${i}`} 
                  visible={false}
                  anchor={0.5}>
                  <Container name="bubbleGroup" anchor={0.5}>
                     {li.correct 
                        ?
                        <AnimatedSprite
                           name="bubble"
                           anchor={0.5}
                           loop={false}
                           roundPixels={true}
                           isPlaying={false}
                           textures={getBubbleTextures}
                           initialFrame={0}
                           animationSpeed={0.5} />
                        :
                        <>
                           <Sprite
                              name="bubble"
                              anchor={0.5}
                              roundPixels={true}
                              texture={getBubbleTextures[0]} />
                           {(bonusIdx !== null && bonusIdx > 0) &&
                              <AnimatedSprite
                                 ref={ref => ref && (bonusBubbles.current[i] = ref)}
                                 name="bubbleBonus"
                                 anchor={0.5}
                                 visible={bonusBubbles.current[i] ? bonusBubbles.current[i].visible : false}
                                 loop={false}
                                 isPlaying={false}
                                 textures={getBonusTextures}
                                 initialFrame={0}
                                 animationSpeed={0.5} />
                           }
                           {showBonusEffect1 && 
                              <BonusEffect1 name="effect1" />
                           }
                        </>
                     }
                     <Sprite 
                        name="btn"
                        anchor={0.5}
                        alpha={0}
                        buttonMode={true}
                        pointerdown={() => onBubbleTouch(i)}
                        width={280}
                        height={280}
                        texture={Texture.EMPTY} />
                  </Container>
                  {(gameData.lowQuality === 0 && (li.correct || (bonusIdx !== null && bonusIdx > 0))) &&
                     <AnimatedSprite
                        ref={ref => ref && (explodes.current[i] = ref)}
                        name="explod"
                        visible={explodes.current[i] ? explodes.current[i].visible : false}
                        anchor={0.5}
                        tint={0xffffe5}
                        rotation={toRadian(randomRange(-180, 180))}
                        loop={false}
                        isPlaying={false}
                        textures={getExplodTextures}
                        scale={1.3}
                        animationSpeed={0.5} />
                  }
               </Container>
            ))}
         </Container>

         {scoreTexts.map(st => (
            <ScoreText key={st.id} {...st} onAnimationEnd={onScoreTextAniEnd} />
         ))}

         {showBonusEffect2 && 
            <BonusEffect2 name="effect2" position={[350, 235]} />
         }

      </Container>
   )
})

export default memo(GameQuiz, () => true);