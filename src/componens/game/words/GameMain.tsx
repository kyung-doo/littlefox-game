import { FC, useCallback, memo, useEffect, useRef, useState } from "react";
import { Container, PixiRef, Sprite, useApp } from "@inlet/react-pixi";
import { useDispatch, useSelector } from 'react-redux';
import { GameActions, GameStatus } from '../../../stores/game/reducer';
import { Sound } from "@pixi/sound";
import BackParticle from "./BackParticle";
import GameQuiz, { QuizeDataType, Refs as QuizRef } from './GameQuiz';
import ScoreText, {Props as ScoreTextProps} from "../ScoreText";
import ScoreContainer from "./ScoreContainer";
import TimeContainer, { Refs as TimeContainerRefs} from "./TimeContainer";
import GameoverText from "../GameoverText";
import { gsap } from 'gsap';
import CorrectEffect from "./CorrectEffect";
import PixiButton from "../PixiButton";
import PIXITimeout from "../../../utils/PIXITimeout";
import { isMobile, makeRandom, makeRandomIgnoreFirst } from "../../../utils";
import useAssets from "../../../hooks/useAssets";
import Charactor, { Refs as CharactorRefs} from "./Charactor";


const POSITION_X = [-2, 446, 894];

const GameMain: FC = () => {

   const dispatch = useDispatch();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const quizCount: any = useSelector<any>(state => state.root.quizCount);
   const stage: any = useSelector<any>(state => state.root.stage);
   const score: any = useSelector<any>(state => state.root.score);
   const { resources } = useAssets();

   const app = useApp();

   const isStart = useRef<boolean>(false);
   const quizAudios = useRef<Sound[]>([]);

   const quizNo = useRef<number>(0);
   const random = useRef<number[] | null>(null);
   const [quizDatas, setQuizDatas] = useState<QuizeDataType[]>([]);
   const quizTargets = useRef<{[key: string] : QuizRef}>({});

   const container = useRef<PixiRef<typeof Container>>(null);
   const buttons = useRef<PixiRef<typeof Sprite>[]>([]);
   const charactor  = useRef<CharactorRefs>(null);
   const [isPresssed, setIsPressed] = useState<number>(0);
   const playingIdx = useRef<number>(0);

   const [scoreTexts, setScoreTexts] = useState<ScoreTextProps[]>([]);
   const scoreCount = useRef<number>(0);

   const timeContainer = useRef<TimeContainerRefs>(null);
   const [showGameoverText, setShowGameoverText] = useState<boolean>(false);
   const areaLight = useRef<PixiRef<typeof Sprite>>(null);
   const [correctEffect, setCorrectEffect] = useState<{id: string, idx: number}[]>([]);
   const correctEffectCount = useRef<number>(0);
   const [addSpeed, setAddSpeed] = useState<number>(0);
   const addSpeedCound = useRef<number>(0);
   
   const timer = useRef<any>(null);




   const makeQuiz = useCallback(()=>{
      quizNo.current = quizCount % gameData.quizList.length ;
      if(quizNo.current === 0) {
         if(!random.current) {
            random.current = makeRandom(gameData.quizList.length, gameData.quizList.length);
         } else {
            random.current = makeRandomIgnoreFirst(random.current[gameData.quizList.length-1], gameData.quizList.length, gameData.quizList.length);
         }
      }
      const quizData = { id: `quiz-${quizCount}`, quizNo: random.current![quizNo.current] };
      setQuizDatas(prev => {
         return [...prev, quizData];
      });
   }, [quizCount]);

   const onButtonTouchStart = useCallback((idx: number) => {
      gsap.killTweensOf(areaLight.current);
      gsap.to(areaLight.current, 0.2, {pixi: {alpha: 1}});
      if(areaLight.current!.texture !== resources.mainAreaLignt.texture) {
         areaLight.current!.texture = resources.mainAreaLignt.texture;
      }
      if(isPresssed === 0) {
         setIsPressed(idx);
         if(quizTargets.current[`quiz-${playingIdx.current}`]){
            quizTargets.current[`quiz-${playingIdx.current}`].touchStart(idx);
         }
         areaLight.current!.position.x = POSITION_X[idx-1]+354+((idx-1)*2);
      }
   },[isPresssed]);


   const onButtonTouchEnd = useCallback(() => {
      setIsPressed(0);
      gsap.to(areaLight.current, 1, {pixi: {alpha: 0}});
      if(quizTargets.current[`quiz-${playingIdx.current}`]){
         quizTargets.current[`quiz-${playingIdx.current}`].touchEnd();
      }
   },[]);


   const onQuizStart = useCallback((id: string) => {
      resources.audioCorrect.sound.volume = 0.3;
      resources.audioWrong.sound.volume = 0.3;
      quizAudios.current[random.current![quizNo.current]].play(() => {
         resources.audioCorrect.sound.volume = 1;
         resources.audioWrong.sound.volume = 1;
      });
   }, []);

   const onQuizHit = useCallback((id: string, quizNo: number, idx: number, isCorrect: boolean, isFirst: boolean, posY: number) => {
      const posX = POSITION_X[idx-1]+585;
      resources.audioCorrect.sound.stop();
      if(isCorrect) {
         if(isFirst){
            setCorrectEffect( prev => [...prev, {id: `correctEffect${correctEffectCount.current}`, idx: idx}]);
            correctEffectCount.current++;
            dispatch({type: GameActions.CORRECT_SCORE, payload: 100});
            setScoreTexts(prev => [ ...prev, { 
                  id: `scoreText${scoreCount.current}`, 
                  texture: resources.mainScorePlus100.texture, 
                  x: posX, 
                  y: posY + 20, 
                  posY: 300
               }
            ]);
            dispatch({ 
               type: GameActions.ADD_RESULT, 
               payload: { listNo: quizNo, correct: true }
            });
            resources.audioCorrect.sound.play();
         } else {
            dispatch({type: GameActions.BONUS_SCORE, payload: 10});
            setScoreTexts(prev => [ ...prev, { 
                  id: `scoreText${scoreCount.current}`, 
                  texture: resources.mainScorePlus10.texture, 
                  x: posX, 
                  y: posY + 20, 
                  posY: 300
               }
            ]);
            resources.audioCorrect.sound.play();
         }
         if(areaLight.current!.texture !== resources.mainAreaLignt.texture) {
            areaLight.current!.texture = resources.mainAreaLignt.texture;
         }
         charactor.current!.correct();
      } else {
         dispatch({type: GameActions.INCORRECT_SCORE, payload: 10});
         setScoreTexts(prev => [ ...prev, { 
               id: `scoreText${scoreCount.current}`, 
               texture: resources.mainScoreMinus10.texture, 
               x: posX, 
               y: posY + 20, 
               posY: 300
            }
         ]);
         resources.audioWrong.sound.stop();
         resources.audioWrong.sound.play();
         if(areaLight.current!.texture !== resources.mainAreaLignt2.texture) {
            areaLight.current!.texture = resources.mainAreaLignt2.texture
         }
         charactor.current!.wrong();
      }
      scoreCount.current++;
   }, []);
   


   const onQuizNext = useCallback((id: string) => {
      dispatch({ type: GameActions.ADD_QUIZ_COUNT});
   }, []);


   const onQuizFinish = useCallback((id: string, quizNo: number, isSuccess: boolean, isTimeout: boolean) => {
      if(!isTimeout) {
         delete quizTargets.current[id];
         setQuizDatas(prev => {
            return prev.filter( x => x.id !== id);
         });
         playingIdx.current++;
      }
      if(!isSuccess) {
         dispatch({ 
            type: GameActions.ADD_RESULT, 
            payload: { listNo: quizNo, correct: false }
         });
      }
   }, []);


   const onScoreTextAniEnd = useCallback((id: string) => {
      setScoreTexts(prev => {
         return prev.filter( st => st.id !== id);
      });
   },[]);
   
   const onCorrectEffectFinish = useCallback((id: string) => {
      setCorrectEffect(prev => {
         return prev.filter( se => se.id !== id);
      });
   }, []);

   const onGameTimeout = useCallback(() => {
      container.current!.interactiveChildren = false;
      PIXITimeout.clear(timer.current);
      Object.keys(quizTargets.current).forEach(key => quizTargets.current[key].timeout());
      setShowGameoverText(true);
      resources.audioGameover.sound.play();
   }, []);

   const goResult = useCallback(() => {
      gsap.globalTimeline.clear();
      let path = '';
      if (window.isTestAPI) path = `/gameWords/history`;
      else                  path = `/game/word/history`;
      window.http
      .get(path, { params: {fu_id: gameData.fu_id, play_type: 'G', stage: stage, score: score.total }})
      .then(({ data }) => {
         dispatch({type: GameActions.SET_BEST_SCORE, payload: { 
            score: data.data.bestScore, 
            date: data.data.bestScoreDate}
         });
         dispatch({type: GameActions.CHANGE_STATUS, payload: GameStatus.RESULT});
      });
   }, [score]);

   const onGameReset = useCallback(() => {
      gsap.globalTimeline.clear();
      gsap.globalTimeline.eventCallback('onStart', null);
      gsap.globalTimeline.eventCallback('onUpdate', null);
      gsap.globalTimeline.eventCallback('onComplete', null);
      PIXITimeout.clear(timer.current);
      resources.audioCorrect.sound.stop();
      resources.audioWrong.sound.stop();
      quizAudios.current.forEach(audio => audio.stop());
      dispatch({type: GameActions.RESET});
      dispatch({type: GameActions.CHANGE_STATUS, payload: GameStatus.RESET});
      app.ticker.stop();
      setTimeout(() => {
         dispatch({type: GameActions.CHANGE_STATUS, payload: GameStatus.GAME_START});
         gsap.globalTimeline.clear();
         app.ticker.start();
      }, 1000/60);
   },[]);


   useEffect(() => {
      let delay = 100;
      if(!isStart.current)  delay = 1000;
      timer.current = PIXITimeout.start(() => {
         makeQuiz();
         if(!isStart.current) {
            playingIdx.current = quizCount;
            timeContainer.current?.start();
            isStart.current = true;
         }
      }, delay);
   },[quizCount]);

   useEffect(() => {
      if(addSpeedCound.current < gameData.speedInfo.length) {
         if(score.total >= gameData.speedInfo[addSpeedCound.current].score) {
            setAddSpeed(gameData.speedInfo[addSpeedCound.current].speed - 1);
            addSpeedCound.current++;
         }
      }
   },[score]);


   useEffect(() => {
      const bgmAudio = resources.audioBgm.sound;
      bgmAudio.play({loop: true, volume: 0.3});
      gameData.quizList.forEach((list: any, i: number) => {
         quizAudios.current.push(resources[`quizAudio${i}`].sound);
      });
      return () => {
         PIXITimeout.clear(timer.current);
         bgmAudio.stop();
      }
   }, []);
   

   return (
      <Container 
         ref={container} 
         name="mainContainer">

         <Sprite 
            name="bg" 
            x={-400}
            texture={resources.mainBg.texture} />

         {gameData.lowQuality === 0 &&
            <BackParticle />
         }

         <Sprite 
            ref={areaLight}
            name="areaLight"
            alpha={areaLight.current ? areaLight.current.alpha : 0}
            texture={resources.mainAreaLignt.texture} />

         <Sprite 
            name="startLine"
            position={[345, 855]}
            texture={resources.mainStartLine.texture} />

         {quizDatas.map((data: any) => (
            <GameQuiz 
               key={data.id}
               ref={ref => ref && (quizTargets.current[data.id] = ref)}
               quizData={data}
               addSpeed={addSpeed}
               onStart={onQuizStart}
               onHit={onQuizHit}
               onNext={onQuizNext}
               onFinish={onQuizFinish} />
         ))}


         <Container name="buttonCon" position={[352, 1121]}>
            <Sprite 
               name="bg" 
               texture={resources.mainButtonBg.texture} />
            {Array.from(Array(3), (k, i)=> (
               <Sprite 
                  key={`button${i+1}`}
                  ref={ref => ref && (buttons.current[i] = ref)}
                  name={`button${i+1}`}
                  interactive={true}
                  buttonMode={true}
                  position={[POSITION_X[i], 0]}
                  pointerdown={()=>onButtonTouchStart(i+1)}
                  pointerup={onButtonTouchEnd}
                  pointerupoutside={onButtonTouchEnd}
                  texture={
                     isPresssed === i + 1 
                     ? 
                     resources.mainButtonOn.texture 
                     : 
                     resources.mainButtonOff.texture
                  } 
               />
            ))}
         </Container>

         {correctEffect.map(ce => (
            <CorrectEffect 
               key={ce.id}
               id={ce.id}
               position={[POSITION_X[ce.idx-1] + 580, 1200]}
               onAnimationFinish={onCorrectEffectFinish} />
         ))}

         {scoreTexts.map(st => (
            <ScoreText 
               key={st.id}
               onAnimationEnd={onScoreTextAniEnd} 
               {...st}  />
         ))}

         <Charactor ref={charactor} />
            
         <ScoreContainer
            name="scoreCon" 
            position={[168, 1093]} />
         
         <TimeContainer
            ref={timeContainer}
            position={[1873, 1093]}
            timeLength={gameData.gameTimeout * 1000}
            onTimeout={onGameTimeout} />
            
         {showGameoverText && 
            <GameoverText onAnimationEnd={goResult} />
         }

         <PixiButton 
            name="resetBtn"
            position={[41, 29]}
            scale={isMobile() ? 1.5 : 1}
            defaultTexture={resources.commonResetBtn.texture}
            onTouchEnd={onGameReset}
            align="LEFT" />
      </Container>
   );
}

export default memo(GameMain, () => true);