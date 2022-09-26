import { forwardRef, memo, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Container } from "@inlet/react-pixi";
import Camera3d from "../pixi-projection/Camera3d";
import Container3d from "../pixi-projection/Container3d";
import ShootTarget, { Refs as ShootTargetRefs } from "./ShootTarget";
import SignPannel, { Refs as SignPannelRefs } from "./SignPannel";
import Shooter, { Refs as ShooterRefs } from "./Shooter";
import { makeRandom, randomRange } from "../../../utils";
import ScoreText, { Props as ScoreTextProps} from "../ScoreText";
import ShootEffect, { Props as ShootEffectProps } from "./ShootEffect";
import BonusEffect3 from "./BonusEffect3";
import PIXITimeout from "../../../utils/PIXITimeout";
import useAssets from "../../../hooks/useAssets";
import { useSelector } from "react-redux";



/*
* @ PORPS
*     onCorrect: 퀴즈 정답 시 콜백
*     onWrong: 퀴즈 오답 시 콜백
*     onSuccess: 퀴즈 성공 시 콜백
*     onTransitionEnd: 퀴즈 완료 트랜지션 콜백
*     onShowBonusText: 보너스 텍스트 show 콜백
*/
export interface Props {
   onCorrect: (idx: number) => void;
   onWrong: (idx: number) => void;
   onSuccess: (isBonus?: boolean) => void;
   onTransitionEnd: (isBonus?: boolean) => void;
   onShowBonusText: () => void;
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

const SHOOT_POSITION3 = [-490, 0, 490];
const SHOOT_POSITION4 = [-490, -170, 170, 490];


const GameQuiz = forwardRef<Refs, Props>(({ onCorrect, onWrong, onSuccess, onTransitionEnd, onShowBonusText }, ref) => {

   const gameData: any = useSelector<any>(state => state.root.gameData);
   const step: any = useSelector<any>(state => state.root.step);
   
   const { resources } = useAssets();

   const [quizNo, setQuizNo] = useState<number | null>(null);
   const shooter = useRef<ShooterRefs>(null);
   const shootTargets = useRef<ShootTargetRefs[]>([]);
   const signPannel = useRef<SignPannelRefs>(null);

   const [wordLists, setWordLists] = useState<{[key: string]: any}[] | null>(null);
   const [correctWords, setCorrectWords] = useState<string[] | null>(null);

   const [scoreTexts, setScoreTexts] = useState<ScoreTextProps[]>([]);
   const [shootEffects, setShootEffects] = useState<ShootEffectProps[]>([]);
   const scoreCount = useRef<number>(0);
   const effectCount = useRef<number>(0);
   const [bonusIdx, setBonusIdx] = useState<number | null>(null);
   const isShoot = useRef<boolean>(false);
   const isBonus = useRef<boolean>(false);
   const [showBonus3, setShowBonus3] = useState<boolean>(false);
   const correctRandom = useRef<number[]>([]);
   
   
   const timer = useRef<any[]>([]);
   
   

   const makeQuiz = useCallback(() => {
      
      const quizList = [...gameData.quizList];
      const correctData = quizList[quizNo!];
      const wrongDatas = quizList.filter((li: any) => li.words !== correctData.words);
      setCorrectWords(correctData.words.split(''));
      if(step === 1) {
         correctRandom.current = makeRandom(3, step);
         const wrongData = getWorngWords(wrongDatas, [correctData.words[correctRandom.current[0]]]);
         const wrongRandom = makeRandom(wrongData.length, 2);
         const list: {[key: string]: any}[] = [];

         let wrongWord1 = wrongData[wrongRandom[0]];
         let wrongWord2 = wrongData[wrongRandom[1]];
         let correctWord = correctData.words[correctRandom.current[0]];

         if (wrongWord1.toLowerCase() === wrongWord2.toLowerCase()) {
            while (true) {
               wrongWord2 = wrongData[makeRandom(wrongData.length, 2)[1]];

               if (wrongWord1.toLowerCase() !== wrongWord2.toString()) {
                  break;
               }
            }
         }

         if (correctWord.toLowerCase() === wrongWord1.toLowerCase() || correctWord.toLowerCase() === wrongWord2.toLowerCase()) {
            while (true) {
               correctWord = correctData.words[makeRandom(3, step)[0]];

               if (correctWord.toLowerCase() !== wrongWord1.toLowerCase() || correctWord.toLowerCase() !== wrongWord2.toLowerCase()) {
                  break;
               }
            }
         }

         makeRandom(3, 3).forEach(( num, i ) => {
            switch(i) {
               case 0 : list[num] = { word: correctWord, correct: true}; break;
               case 1 : list[num] = { word: wrongWord1, correct: false}; break;
               case 2 : list[num] = { word: wrongWord2, correct: false}; break;
            } 
         });
         setWordLists(list);
      } else if(step === 2) {
         correctRandom.current = makeRandom(3, step).sort();
         const wrongData = getWorngWords(wrongDatas, [correctData.words[correctRandom.current[0]], correctData.words[correctRandom.current[1]]]);
         const wrongRandom = randomRange(0, wrongData.length-1);
         const list: {[key: string]: any}[] = [];
         let wrongWord = wrongData[wrongRandom];

         if (wrongData[wrongRandom].toLowerCase() === correctData.words[correctRandom.current[0]].toLowerCase() || wrongData[wrongRandom].toLowerCase() === correctData.words[correctRandom.current[1]].toLowerCase()) {
            while (true) {
               wrongWord = wrongData[randomRange(0, wrongData.length-1)];

               if (wrongWord.toLowerCase() !== correctData.words[correctRandom.current[0]].toLowerCase() || wrongWord.toLowerCase() !== correctData.words[correctRandom.current[1]].toLowerCase()) {
                  console.log('replace word = ' + wrongWord);
                  break;
               }
            }
         }

         makeRandom(3, 3).forEach(( num, i ) => {
            switch(i) {
               case 0 : list[num] = { word: correctData.words[correctRandom.current[0]], correct: true}; break;
               case 1 : list[num] = { word: correctData.words[correctRandom.current[1]], correct: true}; break;
               case 2 : list[num] = { word: wrongWord, correct: false}; break;
            } 
         });
         setWordLists(list);

      } else {
         correctRandom.current = [0,1,2];
         const wrongData = getWorngWords(wrongDatas, [correctData.words[0], correctData.words[1], correctData.words[2]]);
         const wrongRandom = randomRange(0, wrongData.length-1);
         const list: {[key: string]: any}[] = [];
         let wrongWord = wrongData[wrongRandom];
         let correctWord1 = correctData.words[correctRandom.current[0]];
         let correctWord2 = correctData.words[correctRandom.current[1]];
         let correctWord3 = correctData.words[correctRandom.current[2]];

         if (wrongData[wrongRandom].toLowerCase() === correctWord1.toLowerCase() || wrongData[wrongRandom].toLowerCase() === correctWord2.toLowerCase() || wrongData[wrongRandom].toLowerCase() === correctWord3.toLowerCase()) {
            while (true) {
               wrongWord = wrongData[randomRange(0, wrongData.length-1)];

               if (wrongWord.toLowerCase() !== correctWord1.toLowerCase() || wrongWord.toLowerCase() !== correctWord2.toLowerCase() || wrongWord.toLowerCase() !== correctWord3.toLowerCase()) {
                  break;
               }
            }
         }

         makeRandom(4, 4).forEach(( num, i ) => {
            switch(i) {
               case 0 : list[num] = { word: correctData.words[correctRandom.current[0]], correct: true}; break;
               case 1 : list[num] = { word: correctData.words[correctRandom.current[1]], correct: true}; break;
               case 2 : list[num] = { word: correctData.words[correctRandom.current[2]], correct: true}; break;
               case 3 : list[num] = { word: wrongWord, correct: false}; break;
            } 
         });
         setWordLists(list);
      }
      
   }, [quizNo]);

   const getWorngWords = useCallback((wrongData, correctWord) => {
      let words: string[] = [];
      wrongData.forEach((data: any) => {
         data.words.split('').forEach((word: string) => words.push(word));
      });
      return words
            .filter((word, i) => words.indexOf(word) === i)
            .filter(word => !correctWord.find((w: string) => w === word));
   }, []);
   

   const onShootCorrect = useCallback(( correct: number, posX: number, finish: boolean ) => {
      setShootEffects(prev => {
         effectCount.current++;
         return [ ...prev, { 
            id: `shootEffect${effectCount.current}`, 
            type: 'correct',  
            posX: 1024 + posX 
         }];
      });

      timer.current[0] = PIXITimeout.start(()=> {
         shootTargets.current[correct].flipDown('correct');
         if(finish) {
            setScoreTexts(prev => [ ...prev, { 
                  id: `scoreText${scoreCount.current}`, 
                  texture: resources[`mainScorePlus${step*100}`].texture, 
                  x: step < 3 ? SHOOT_POSITION3[correct]+1024 : SHOOT_POSITION4[correct]+1024, 
                  y: 600, 
                  posY: 150
               }
            ]);
            scoreCount.current++;
         }
      }, 700);

      isShoot.current = true;

      timer.current[1] = PIXITimeout.start(()=> {
         signPannel.current!.nextSign();
         isShoot.current = false;
      }, 800);

      onCorrect(correct);

      if(finish) {
         if(bonusIdx === 0) {
            quizEnd(true);
         } else {
            quizEndBonus();
         }
      }
   }, [bonusIdx, wordLists]);

  

   const onShootWrong = useCallback(( wrong: number, posX: number ) => {
      onWrong(wrong);
      timer.current[2] = PIXITimeout.start(()=> {
         setShootEffects(prev => {
            effectCount.current++;
            return [ ...prev, { id: `shootEffect${effectCount.current}`, type: 'wrong',  posX: 1024 + posX }];
         });
         
         setScoreTexts(prev => [ ...prev, { 
               id: `scoreText${scoreCount.current}`, 
               texture: resources.mainScoreMinus10.texture, 
               x: step < 3 ? SHOOT_POSITION3[wrong]+1024 : SHOOT_POSITION4[wrong]+1024, 
               y: 600, 
               posY: 150
            }
         ]);
         scoreCount.current++;
         shootTargets.current[wrong].flipWrong();
         isShoot.current = false;
      }, 600);
      isShoot.current = true;
   }, []);



   const onShootBonus = useCallback(( num: number, posX: number, isLast ) => {
      
      setShootEffects(prev => {
         effectCount.current++;
         return [ ...prev, { id: `shootEffect${effectCount.current}`, type: 'bonus', posX: 1024 + posX }];
      });
      timer.current[4] = PIXITimeout.start(() => {
         shootTargets.current[num].flipDown('bonus');
         resources.audioArrowHit.sound.stop();
         resources.audioArrowHit.sound.play();
         timer.current[4] = PIXITimeout.start(() => {
            resources.audioCorrect.sound.stop();
            resources.audioCorrect.sound.play();
         },200);
         if(isLast) {
            signPannel.current!.finish(1500);
            shooter.current!.finish(1500);
         }
      }, 700);
      if(isLast) {
         
         timer.current[5] = PIXITimeout.start(() => {
            onTransitionEnd(true);
            isBonus.current = false;
         }, 2500);
      }
   }, []);


   const quizEnd = useCallback(( isSuccess = false ) => {
      if(!isSuccess && isBonus.current) {
         return;
      }
      if(isSuccess)  onSuccess(false);
      let delay = 500;
      if(isSuccess) delay = 1500;
      if(!isSuccess && isShoot.current) {
         delay += 1000;
      }

      signPannel.current!.finish(delay);
      shooter.current!.finish(delay);

      timer.current[6] = PIXITimeout.start(()=> {
         shootTargets.current.forEach(li => li.flipDown('timeout'));
      }, delay);

      timer.current[7] = PIXITimeout.start(()=> {
         onTransitionEnd(false);
      }, delay + 500);

   }, []);
   

   const quizEndBonus = useCallback(() => {
      isBonus.current = true;
      onSuccess(true);
      signPannel.current!.stop();
      if(bonusIdx === 1) {
         shooter.current!.shootBonus1();
      } else if(bonusIdx === 2) {
         shooter.current!.shootBonus2();
      } else {
         shooter.current!.disable();
         setShowBonus3(true);
         timer.current[8] = PIXITimeout.start(()=> {
            const wrongList: number[] = [];
            wordLists?.forEach((list, i) => !list.correct && wrongList.push(i));
            wrongList.forEach((idx, i) => {
               if(step < 3){
                  onShootBonus(idx, SHOOT_POSITION3[idx], i === wrongList.length - 1);
               } else {
                  onShootBonus(idx, SHOOT_POSITION4[idx], i === wrongList.length - 1);
               }
            });
         }, 2800);
         timer.current[9] = PIXITimeout.start(()=>setShowBonus3(false), 5000);
      }
      timer.current[10] = PIXITimeout.start(() => {
         onShowBonusText();
         resources.audioBonus.sound.play();
      }, 1500);
   }, [bonusIdx, wordLists]);


   const getShooterCorrect = useMemo(() => {
      if(correctWords != null) {
         const copyCorrectWords = [...correctWords];
         if(step === 1) {
            return [copyCorrectWords[correctRandom.current[0]]];
         } else if(step === 2) {
            return [copyCorrectWords[correctRandom.current[0]], copyCorrectWords[correctRandom.current[1]]];
         } else {
            return copyCorrectWords;
         }
      }
      return [];
   }, [correctWords]);


   const onShootEffectAniEnd = useCallback((id: string) => {
      setShootEffects(prev => {
         return prev.filter( se => se.id !== id);
      });
   },[]);


   const onScoreTextAniEnd = useCallback((id: string) => {
      setScoreTexts(prev => {
         return prev.filter( st => st.id !== id);
      });
   },[]);
   

   useImperativeHandle(ref, () => ({
      start: ( quizNo, bonus ) => {
         setBonusIdx(bonus);
         setQuizNo(quizNo);
      },
      timeout:() => setTimeout(quizEnd, 1)
   }));

   useEffect(() => {
      if(quizNo !== null) {
         makeQuiz();
      }
   }, [quizNo]);


   useEffect(() => {
      if( wordLists ) {
         isShoot.current = false;
         isBonus.current = false;
         shootTargets.current.forEach((target, i) => target.start(wordLists[i]));
         shooter.current!.start(wordLists, getShooterCorrect);
         signPannel.current!.start(resources[`quizImage${quizNo}`].texture, correctWords!, correctRandom.current);
      }
   }, [wordLists]);


   useEffect(() => {
      return ()=> {
         timer.current.forEach(t => PIXITimeout.clear(t));
      }
   }, []);

   return (
      <Container 
         name="quizContainer" 
         sortableChildren={true}>
         {(wordLists !== null && correctWords !== null) && 
            <>
               <SignPannel 
                  ref={signPannel}
                  position={[640, 140]} />

               <Camera3d 
                  name="shootTargetCam"
                  position={[1024, 640]}
                  setPlanes={[5000, 10, 10000]}>
                  <Container3d 
                     name="shootTargetCon">
                     {Array.from(Array(step < 3 ? 3 : 4), (k, i) => (
                        <ShootTarget
                           key={`shootTarget${i}`}
                           ref={ref => ref && (shootTargets.current[i] = ref)} 
                           posX={step < 3 ? SHOOT_POSITION3[i] : SHOOT_POSITION4[i]} />
                     ))}
                  </Container3d>
               </Camera3d>

               <Shooter 
                  ref={shooter}
                  hitPositions={step < 3 ? SHOOT_POSITION3 : SHOOT_POSITION4}
                  onShootCorrect={onShootCorrect}
                  onShootWrong={onShootWrong}
                  onShootBonus={onShootBonus} />
               {shootEffects.map(se => (
                  <ShootEffect
                     key={se.id}
                     onAnimationEnd={onShootEffectAniEnd}
                     {...se} />
               ))}
            </>
         }
         {scoreTexts.map(st => (
            <ScoreText 
               key={st.id} 
               onAnimationEnd={onScoreTextAniEnd}
               {...st} />
         ))}
         {showBonus3 && 
            <BonusEffect3 position={[1024, 560]} />
         }
      </Container>
   );
});

export default memo(GameQuiz, () => true);