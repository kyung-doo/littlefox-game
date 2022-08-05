import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Container, PixiRef, Sprite } from "@inlet/react-pixi";
import { useSelector } from "react-redux";
import useAssets from "../../../hooks/useAssets";
import WordPicker, {Refs as WordPickerRefs} from './WordPicker';
import PIXITimeout from "../../../utils/PIXITimeout";
import { Elastic, Cubic, gsap, Linear } from 'gsap';
import ScoreText, { Props as ScoreTextProps} from "../ScoreText";


export interface Props {
   onSuccess: (score: number, isBonus: boolean) => void;
   onWrong: () => void;
}

export interface Refs {
   start: (quizNo: number, bonus: number) => void;
   enter: () => void;
   transition: () => void;
   timeout: () => void;
}


const GameQuiz = forwardRef<Refs, Props>(({ onSuccess, onWrong }, ref) => {

   const { resources } = useAssets();

   const container = useRef<PixiRef<typeof Container>>(null);
   const pickerCon = useRef<PixiRef<typeof Container>>(null);
   const gameData: any = useSelector<any>(state => state.root.gameData);

   const [quizNo, setQuizNo] = useState<number | null>(null);
   const [bonusIdx, setBonusIdx] = useState<number | null>(null);
   const [wordLists, setWordLists] = useState<any>(null);

   

   const [scoreTexts, setScoreTexts] = useState<ScoreTextProps[]>([]);

   const scoreCount = useRef<number>(0);
   const timelines = useRef<gsap.core.Timeline[]>([]);
   const wordPickers = useRef<WordPickerRefs[]>([]);
   
   const timer = useRef<any>();



   const makeQuiz = useCallback(() => {
      const quizList = gameData.quizList[quizNo ? quizNo : 0];
      console.log(quizList.words)
      const lists: any = [];
      quizList.syllables.forEach((list: any) => {
         if(!list.isSilent) {
            lists.push([list.correct, list.wrong1, list.wrong2]);
         } else {
            lists.push(list.correct);
         }
      })
      setWordLists(lists);
      startBalloonAni();
   }, [quizNo]);



   const startBalloonAni = useCallback(() => {
      const leftBalloon1 = container.current!.getChildByName('balloonLeft1');
      const leftBalloon2 = container.current!.getChildByName('balloonLeft2');
      const rightBalloon1 = container.current!.getChildByName('balloonRight1');
      const rightBalloon2 = container.current!.getChildByName('balloonRight2');
      stopBalloonAni();
      gsap.to(leftBalloon1, 0.8, {pixi: {rotation: -5, y: -200}, yoyo: true, repeat: -1, ease: Linear.easeNone});
      gsap.to(leftBalloon2, 0.8, {pixi: {rotation: 3, y: -320}, delay: 0.3, yoyo: true, repeat: -1, ease: Linear.easeNone});
      gsap.to(rightBalloon1, 0.8, {pixi: {rotation: 5, y: -200}, yoyo: true, repeat: -1, ease: Linear.easeNone});
      gsap.to(rightBalloon2, 0.8, {pixi: {rotation: -3, y: -320}, delay: 0.3, yoyo: true, repeat: -1, ease: Linear.easeNone});
   }, []);


   const stopBalloonAni = useCallback(() => {
      const leftBalloon1 = container.current!.getChildByName('balloonLeft1');
      const leftBalloon2 = container.current!.getChildByName('balloonLeft2');
      const rightBalloon1 = container.current!.getChildByName('balloonRight1');
      const rightBalloon2 = container.current!.getChildByName('balloonRight2');
      gsap.killTweensOf([leftBalloon1, rightBalloon1, leftBalloon2, rightBalloon2]);
      timelines.current.forEach(t => t.kill());
      leftBalloon1.rotation = leftBalloon2.rotation = rightBalloon1.rotation = rightBalloon2.rotation = 0;
      leftBalloon1.position.x = -625;
      rightBalloon1.position.x = 645;
      leftBalloon2.position.x = -554;
      rightBalloon2.position.x = 575;
      leftBalloon1.position.y = rightBalloon1.position.y = -205;
      leftBalloon2.position.y = rightBalloon2.position.y = -325;
   },[]);


   const onQuizSuccess = useCallback(() => {
      const score = 20 * wordLists.length;
      container.current!.interactiveChildren = false;
      setScoreTexts(prev => [ ...prev, { 
         id: `scoreText${scoreCount.current}`, 
         texture: resources[`mainScorePlus${score}`].texture, 
         x: 0, 
         y: -160, 
         scale: 2,
         delay: 0.5,
      }]);

      scoreCount.current++;
      onSuccess(score, bonusIdx ? true : false);

   }, [wordLists, bonusIdx, onSuccess]);

   const onQuizWrong = useCallback(() => {
      setScoreTexts(prev => [ ...prev, { 
         id: `scoreText${scoreCount.current}`, 
         texture: resources.mainScoreMinus10.texture, 
         x: 0, 
         y: -160, 
         scale: 2,
         delay: 0.5,
      }]);
      scoreCount.current++;

      stopBalloonAni();

      timelines.current[0] = gsap.timeline({onComplete: startBalloonAni})
      .to(container.current, 0.25, {pixi: {rotation: 3, x: 50}, ease: Cubic.easeOut})
      .to(container.current, 1, {pixi: {rotation: 0, x: 0}, ease: Elastic.easeOut.config(0.9, 0.3)});

      const leftBalloon1 = container.current!.getChildByName('balloonLeft1');
      const leftBalloon2 = container.current!.getChildByName('balloonLeft2');
      const rightBalloon1 = container.current!.getChildByName('balloonRight1');
      const rightBalloon2 = container.current!.getChildByName('balloonRight2');

      timelines.current[1] = gsap.timeline()
      .to([leftBalloon1, rightBalloon1], 0.3, {pixi: {rotation: 40}})
      .to([leftBalloon1, rightBalloon1], 1, {pixi: {rotation: 0}, ease: Elastic.easeOut.config(0.9, 0.3)});

      timelines.current[2] = gsap.timeline()
      .to([leftBalloon2, rightBalloon2], 0.3, {pixi: {rotation: 30, y: '+=50'}})
      .to([leftBalloon2, rightBalloon2], 1, {pixi: {rotation: 0, y:'-=50'}, ease: Elastic.easeOut.config(0.5, 0.3)});
      
      onWrong();
   }, []);
   
   

   const onScoreTextAniEnd = useCallback((id: string) => {
      setScoreTexts(prev => {
         return prev.filter( st => st.id !== id);
      });
   },[]);


   const quizTimeout = useCallback(() => {
      PIXITimeout.clear(timer.current);
      container.current!.interactiveChildren = false;
   }, []);


   useImperativeHandle(ref, () => ({
      start: (quizNo, bonus) => {
         setBonusIdx(bonus);
         setQuizNo(quizNo);
      },
      enter: () => {
         let count = 0;
         wordPickers.current.forEach(picker => {
            if(picker.isCorrect()) count++;
         });
         if(count === wordLists.length) {
            onQuizSuccess();
         } else {
            onQuizWrong();
         }
      },
      transition: () => {
         gsap.to(container.current, 0.4, {pixi:{y: -1000}, onComplete: () => {
            gsap.set(container.current, {pixi: {y: 1000}});
            gsap.to(container.current, 0.4, {delay: 0.2, pixi: { y: 0}});
         }});
      },
      timeout:() => setTimeout(quizTimeout, 1)
   }));
   

   useEffect(() => {
      if(quizNo !== null) {
         setWordLists(null);
         wordPickers.current = [];
         timer.current = PIXITimeout.start(() => makeQuiz());
         timer.current = PIXITimeout.start(() => {
            pickerCon.current!.visible = true;
         }, 100);
      }
      return ()=> {
         PIXITimeout.clear(timer.current);
      }
   }, [quizNo]);


   useEffect(() => {
      if( wordLists ) {
         pickerCon.current!.position.x = -1430 / 2 + ((1430 - (255 * wordLists.length))/2) - 15;
         container.current!.interactiveChildren = true;
      }
   }, [wordLists]);



   return (
      <>
         <Container 
            ref={container} 
            interactive={container.current ? container.current.interactiveChildren : false}
            name="quizCon">
            <Sprite 
               name="charactor"
               position={[-125, -546]}
               texture={resources.mainCharactor.texture} />

            <Sprite
               name="balloonLeft2"
               position={[-554, -325]}
               pivot={[125, 200]}
               texture={resources.mainBalloonLeft2.texture} />
            <Sprite
               name="balloonRight2"
               position={[575, -325]}
               pivot={[200, 200]}
               texture={resources.mainBalloonRight2.texture} />

            <Sprite 
                  name="basket"
                  position={[-715, -266]}
                  texture={resources.mainBasket.texture} />

            <Sprite
               name="balloonLeft1"
               position={[-625, -205]}
               pivot={[190, 250]}
               texture={resources.mainBalloonLeft1.texture} />
            <Sprite
               name="balloonRight1"
               position={[645, -205]}
               pivot={[125, 250]}
               texture={resources.mainBalloonRight1.texture} />

            <Container
               ref={pickerCon}
               name="pickerCon"
               visible={false}
               y={-172}>
               {wordLists && wordLists.map((words: string[] | string, i: number) => (
                  <WordPicker 
                     key={`word-picker-${quizNo}-${i}`}
                     ref={ref => ref && (wordPickers.current[i] = ref)}
                     x={263 * i}
                     words={words} />
               ))}
            </Container>

            
            
         </Container>
         {scoreTexts.map(st => (
            <ScoreText 
               key={st.id} 
               onAnimationEnd={onScoreTextAniEnd}
               {...st} />
         ))}
         
      </>
   );
});


export default memo(GameQuiz, () => true);