import { FC, useEffect, useRef, useState, useCallback, memo } from "react";
import { Container, Sprite, PixiRef, useTick, useApp } from "@inlet/react-pixi";
import { Sound } from "@pixi/sound";
import { gsap } from 'gsap';
import { useDispatch, useSelector } from 'react-redux';
import { GameActions, GameStatus } from '../../../stores/game/reducer';
import useCounter from "../../../hooks/useCounter";
import ScoreContainer from "../ScoreContainer";
import TimeContainer, { Refs as TimeContainerRefs } from "../TimeContainer";
import GameQuiz, { Refs as QuizRef } from "./GameQuiz";
import BonusText from "../BonusText";
import GameoverText from "../GameoverText";
import BonusContainer from "./BonusContainer";
import PixiButton from "../PixiButton";
import PIXITimeout from "../../../utils/PIXITimeout";
import { isMobile, makeRandom, makeRandomIgnoreFirst } from "../../../utils";
import useAssets from "../../../hooks/useAssets";
import Charactor, { Refs as CharactorRefs} from "./Charactor";



export enum QuizStatus {
   INIT='INIT',
   START='START',
   END='END',
}

const GameMain: FC = () => {

   const dispatch = useDispatch();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const quizCount: any = useSelector<any>(state => state.root.quizCount);
   const stage: any = useSelector<any>(state => state.root.stage);
   const step: any = useSelector<any>(state => state.root.step);
   const score: any = useSelector<any>(state => state.root.score);
   const bonusCount: any = useSelector<any>(state => state.root.bonusCount);
   const bonusLength: any = useSelector<any>(state => state.root.bonusLength);
   const { resources } = useAssets();

   const app = useApp();

   const container = useRef<PixiRef<typeof Container>>(null);
   const timeContainer = useRef<TimeContainerRefs>(null);
   const charactor = useRef<CharactorRefs>(null);

   const quizTimeLength = gameData.quizTimeout * 1000;
   const quizCounter = useCounter(quizTimeLength);

   const quizNo = useRef<number>(0);
   const random = useRef<number[] | null>(null);
   const [quizStatus, setQuizStatus] = useState<QuizStatus>(QuizStatus.INIT);   
   const quizStatusRef = useRef<QuizStatus>(QuizStatus.INIT);

   const quizTargets = useRef<QuizRef>(null);
   const isCorrect = useRef<boolean>(false);

   const quizAudios = useRef<Sound[]>([]);
   const [quizAudioPlaying, setQuizAudioPlaying] = useState<boolean>(false);

   const [showBonusText, setShowBonusText] = useState<boolean>(false);
   const [showGameoverText, setShowGameoverText] = useState<boolean>(false);

   const isTimeout = useRef<boolean>(false);
   const timer = useRef<any>();
   


   const makeQuiz = useCallback(() => {
      quizNo.current = quizCount % gameData.quizList.length;
      if(quizNo.current === 0) {
         if(!random.current) {
            random.current = makeRandom(gameData.quizList.length, gameData.quizList.length);
         } else {
            random.current = makeRandomIgnoreFirst(random.current[gameData.quizList.length-1], gameData.quizList.length, gameData.quizList.length);
         }
      }
      quizTargets.current?.start(random.current![quizNo.current], bonusCount === 2 ? (bonusLength % 3) + 1 : 0);
      if(step < 3){
         setQuizAudioPlaying(false);
         timer.current = PIXITimeout.start(() => {
            setQuizAudioPlaying(true);
            quizAudios.current[random.current![quizNo.current]].play(() => setQuizAudioPlaying(false));
         }, 300);
      }
   }, [quizCount, bonusCount, bonusLength]);

   const onPlayQuizAudio = useCallback(( e ) => {
      setQuizAudioPlaying(true);
      quizAudios.current[random.current![quizNo.current]].play(() => setQuizAudioPlaying(false));
   },[]);


   const onQuizCorrect = useCallback(( idx: number ) => {
      timer.current = PIXITimeout.start(()=>{
         resources.audioArrowHit.sound.stop();
         resources.audioArrowHit.sound.play();
      }, 700);
   }, []);


   const onQuizWrong = useCallback(( idx: number ) => {
      timer.current = PIXITimeout.start(()=>{
         resources.audioArrowHit.sound.stop();
         resources.audioArrowHit.sound.play();
         timer.current = PIXITimeout.start(()=>{
            resources.audioWrong.sound.stop();
            resources.audioWrong.sound.play();
         }, 200);
         dispatch({type: GameActions.INCORRECT_SCORE, payload: 10});
      }, 700);
   }, []);


   const onQuizSuccess = useCallback(( isBonus:  boolean | undefined) => {
      timer.current = PIXITimeout.start(()=> {
         dispatch({type: GameActions.CORRECT_SCORE, payload: 100 * step});
         dispatch({type: GameActions.ADD_BONUS_COUNT});
         timer.current = PIXITimeout.start(()=>{
            resources.audioCorrect.sound.stop();
            resources.audioCorrect.sound.play();
            if(isBonus){
               timer.current = PIXITimeout.start(()=> {
                  charactor.current!.bonus();
               }, 1800);
            }
         }, 200);
      }, 800);
      isCorrect.current = true;
      quizCounter.pause();
      quizStatusRef.current = QuizStatus.END;
      setQuizStatus(QuizStatus.END);
   }, []);
   


   const onTransitionEnd = useCallback(( isBonus: boolean | undefined ) => {
      if(!isTimeout.current) {
         if(isBonus) {
            dispatch({type: GameActions.ADD_BONUS_LENGTH});
            charactor.current!.default();
         }
         quizNext();
      } else {
         setShowGameoverText(true);
         if(!resources.audioGameover.sound.isPlaying ){
            resources.audioGameover.sound.play();
         }
         dispatch({ 
            type: GameActions.ADD_RESULT, 
            payload: { listNo: random.current![quizNo.current], correct: isCorrect.current }
         });
      }
   }, []);


   const quizNext = useCallback(() => {
      dispatch({ 
         type: GameActions.NEXT_QUIZ, 
         payload: { listNo: random.current![quizNo.current], correct: isCorrect.current }
      });
      quizStatusRef.current = QuizStatus.START;
      setQuizStatus(QuizStatus.START);
   }, []);
   

   const onGameTimeout = useCallback(() => {
      container.current!.interactiveChildren = false;
      app.stage.interactive = false;
      
      isTimeout.current = true;
      if(quizStatusRef.current === QuizStatus.START) {
         setShowGameoverText(true);
         if(!resources.audioGameover.sound.isPlaying ){
            resources.audioGameover.sound.play();
         }
         dispatch({ 
            type: GameActions.ADD_RESULT, 
            payload: { listNo: random.current![quizNo.current], correct: isCorrect.current }
         });
      }
      
   }, []);


   const goResult = useCallback(() => {
      gsap.globalTimeline.clear();
      let path = '';
      if (window.isTestAPI) path = `/studyPhonics/history`;
      else                  path = `/game/phonics/history`;
      window.http
      .get(path, { params: { fu_id: gameData.fu_id, play_type: 'G', stage: stage, round: step, score: score.total }})
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


   useTick(( delta ) => {
      if(!isTimeout.current){
         if(quizStatusRef.current === QuizStatus.START) {
            if(quizCounter.getTime() >= quizTimeLength) {
               quizStatusRef.current = QuizStatus.END;
               setQuizStatus(QuizStatus.END);
            }
         }
      }
   });

   useEffect(() => {
      switch(quizStatus) {
         case QuizStatus.START : 
            isCorrect.current = false;
            makeQuiz();
            quizCounter.start();
         break;
         case QuizStatus.END : 
            if(!isCorrect.current){
               quizTargets.current!.timeout();
            }
            quizCounter.reset();
         break;
      }
   }, [quizStatus]);

   useEffect(() => {
      const bgmAudio = resources.audioBgm.sound;
      bgmAudio.play({loop: true, volume: 0.3});
      
      if(step < 3) {
         gameData.quizList.forEach((list: any, i: number) => {
            quizAudios.current.push(resources[`quizAudio${i}`].sound);
         });
      }
      setQuizStatus( prev => {
         quizStatusRef.current = QuizStatus.START;
         return QuizStatus.START;
      });

      timer.current = PIXITimeout.start(()=>{
         timeContainer.current?.start();
      }, 600);

      return () => {
         PIXITimeout.clear(timer.current);
         bgmAudio.stop();
      }
   },[]);
   
   return (
      <Container ref={container} name="mainContainer">
         <Sprite 
            name="bg" 
            texture={resources.mainBg.texture}
            position={[-400, 0]} />

         <Charactor ref={charactor} />

         <Sprite 
            name="desk" 
            texture={resources.mainDesk .texture} 
            position={[62, 795]} />

         <Sprite 
            name="pannel"
            position={[592, 90]}
            texture={resources.mainSingPannel.texture} />

         <GameQuiz 
            ref={quizTargets}
            onCorrect={onQuizCorrect}
            onWrong={onQuizWrong}
            onSuccess={onQuizSuccess}
            onShowBonusText={() => setShowBonusText(true)}
            onTransitionEnd={onTransitionEnd} />

         {step < 3 &&
            <>
               <Sprite 
                  name="soundBtnOff"
                  texture={resources.commonSoundBtnOff.texture}
                  position={[112, 825]}   
                  interactive={!quizAudioPlaying}
                  click={onPlayQuizAudio}
                  touchend={onPlayQuizAudio}
                  buttonMode={true} />
                  
               <Sprite 
                  name="soundBtnOn"
                  visible={quizAudioPlaying}
                  interactive={true}
                  position={[114, 827]}
                  texture={resources.commonSoundBtnOn.texture} />
            </> 
         }

         {showBonusText && 
            <BonusText 
               position={[1024, 550]}
               bonusLength={bonusLength+1}
               onAnimationEnd={() => setShowBonusText(false)} />
         }
         
         <Container name="bottomUI" position={[0, 1047]}>
            <Sprite
               texture={resources.mainBottomUiBg.texture}
               position={[-400, 0]}
               width={2847}
               height={235}/>
            <BonusContainer />   
            <ScoreContainer />
            <TimeContainer 
               ref={timeContainer}
               position={[520, 56]}
               timeLength={gameData.gameTimeout * 1000}
               textColor="#0a4b7b"
               onTimeout={onGameTimeout} />
         </Container>

         {showGameoverText && 
            <GameoverText onAnimationEnd={goResult} />
         }
         
         <PixiButton 
            name="resetBtn"
            position={[41, 29]}
            scale={isMobile() ? 1.5 : 1}
            defaultTexture={resources.commonResetBtn.texture}
            sound={resources.audioClick.sound}
            onTouchEnd={onGameReset}
            align="LEFT" />
      </Container>
   )
}

export default memo(GameMain, () => true);