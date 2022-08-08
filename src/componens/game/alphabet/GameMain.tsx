import { FC, useEffect, useRef, useState, useCallback, memo } from "react";
import { Container, PixiRef, Sprite, useTick, useApp } from "@inlet/react-pixi";
import { Container as PIXIContainer } from 'pixi.js';
import { gsap } from 'gsap';
import { Sound } from "@pixi/sound";
import { useDispatch, useSelector } from 'react-redux';
import { GameActions, GameStatus } from '../../../stores/game/reducer';
import GameQuiz, { Refs as QuizRef, QuizeDataType } from "./GameQuiz";
import BubbleParticle, { Refs as BubbleParticleRefs } from "./BubbleParticle";
import BonusContainer from "./BonusContainer";
import ScoreContainer from "../ScoreContainer";
import TimeContainer, { Refs as TimeContainerRefs } from "../TimeContainer";
import useCounter from "../../../hooks/useCounter";
import BonusText from "../BonusText";
import GameoverText from "../GameoverText";
import PixiButton from "../PixiButton";
import PIXITimeout from "../../../utils/PIXITimeout";
import { isMobile, makeRandom, makeRandomIgnoreFirst } from "../../../utils";
import Charactor, { Refs as CharactorRefs } from "./Charactor";
import useAssets from "../../../hooks/useAssets";



export enum QuizStatus {
   INIT='INIT',
   START='START',
   END='END',
}


const GameMain: FC = () => {
   
   const { resources } = useAssets();

   const dispatch = useDispatch();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const quizCount: any = useSelector<any>(state => state.root.quizCount);
   const stage: any = useSelector<any>(state => state.root.stage);
   const step: any = useSelector<any>(state => state.root.step);
   const score: any = useSelector<any>(state => state.root.score);
   const bonusCount: any = useSelector<any>(state => state.root.bonusCount);
   const bonusLength: any = useSelector<any>(state => state.root.bonusLength);
   

   const app = useApp();
   const container = useRef<PixiRef<typeof Container>>(null);
   const bubbleParticle = useRef<BubbleParticleRefs>(null);
   const timeContainer = useRef<TimeContainerRefs>(null);
   const charactor = useRef<CharactorRefs>(null);
   
   const quizTimeLength = gameData.quizTimeout * 1000;
   const quizCounter = useCounter(quizTimeLength);

   const quizNo = useRef<number>(0);
   const random = useRef<number[] | null>(null);
   const [quizStatus, setQuizStatus] = useState<QuizStatus>(QuizStatus.INIT);   
   const quizStatusRef = useRef<QuizStatus>(QuizStatus.INIT);

   const [quizDatas, setQuizDatas] = useState<QuizeDataType[]>([]);
   const quizTargets = useRef<{[key: string] : QuizRef}>({});

   const isSuccess = useRef<boolean>(false);
   const correctTypes = useRef<{[key: string]: boolean}>({});

   const quizAudios = useRef<Sound[]>([]);
   const [quizAudioPlaying, setQuizAudioPlaying] = useState<boolean>(false);
   const [showBonusText, setShowBonusText] = useState<boolean>(false);
   const [showGameoverText, setShowGameoverText] = useState<boolean>(false);
   
   
   const isTimeout = useRef<boolean>(false);
   const timer = useRef<any>(null);



   const makeQuiz = useCallback(() => {
      quizNo.current = quizCount % gameData.quizList.length;
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
      quizAudios.current.forEach(audio => audio.stop());
      setQuizAudioPlaying(false);
      timer.current = PIXITimeout.start(() => {
         setQuizAudioPlaying(true);
         quizAudios.current[random.current![quizNo.current]].play(() => setQuizAudioPlaying(false))
      }, 300);
      
      bubbleParticle.current?.start();
   }, [quizCount]);



   const onPlayQuizAudio = useCallback(( e ) => {
      setQuizAudioPlaying(true);
      quizAudios.current[random.current![quizNo.current]].play(() => setQuizAudioPlaying(false));
   },[]);



   const onQuizCorrect = useCallback(( id: string, idx: number, bubble: PIXIContainer, type: string ) => {
      resources.audioBubblePop.sound.stop();
      resources.audioBubblePop.sound.play();
      dispatch({type: GameActions.CORRECT_SCORE, payload: 100});
      correctTypes.current[type] = true;
      timer.current = PIXITimeout.start(()=>{
         resources.audioCorrect.sound.stop();
         resources.audioCorrect.sound.play();
      }, 200);
   }, []);


   const onQuizWrong = useCallback(( id: string, idx: number, bubble: PIXIContainer ) => {
      resources.audioWrong.sound.stop();
      resources.audioWrong.sound.play();
      dispatch({type: GameActions.INCORRECT_SCORE, payload: 10});
   }, []);


   const onQuizSuccess = useCallback(( id: string, isBonus: boolean | undefined ) => {
      quizStatusRef.current = QuizStatus.END;
      setQuizStatus(QuizStatus.END);
      isSuccess.current = true;
      dispatch({type: GameActions.ADD_BONUS_COUNT});
      if(!isBonus) {
         successNext();
      } else {
         setShowBonusText(true);
         timer.current = PIXITimeout.start(()=>{
            charactor.current!.bonus();
         }, 300);
      }
   }, []);

   const successNext = useCallback(() => {
      dispatch({ 
         type: GameActions.NEXT_QUIZ, 
         payload: { listNo: random.current![quizNo.current], correct: correctTypes.current }
      });

      timer.current = PIXITimeout.start(()=>{
         quizStatusRef.current = QuizStatus.START;
         setQuizStatus(QuizStatus.START);
      }, 500);
      
      charactor.current!.bubble();
   }, []);


   const onQuizFailed = useCallback(( id: string ) => {
      dispatch({ 
         type: GameActions.NEXT_QUIZ, 
         payload: { listNo: random.current![quizNo.current], correct: correctTypes.current }
      });

      timer.current = PIXITimeout.start(()=>{
         quizStatusRef.current = QuizStatus.START;
         setQuizStatus(QuizStatus.START);
      }, 500);
      
      charactor.current!.bubble();
   }, []);
   


   const onTransitionEnd = useCallback(( id: string, isBonus: boolean | undefined ) => {
      if(!isTimeout.current) {
         delete quizTargets.current[id];
         setQuizDatas(prev => {
            return prev.filter( x => x.id !== id);
         });
         if(isBonus) {
            dispatch({type: GameActions.ADD_BONUS_LENGTH});
            successNext();
         }
      } else {
         setShowGameoverText(true);
         if(!resources.audioGameover.sound.isPlaying ){
            resources.audioGameover.sound.play();
         }
         dispatch({ 
            type: GameActions.ADD_RESULT, 
            payload: { listNo: random.current![quizNo.current], correct: correctTypes.current }
         });
      }
   }, []);

   const onGameTimeout = useCallback(() => {
      container.current!.interactiveChildren = false;
      isTimeout.current = true;
      if(quizStatusRef.current === QuizStatus.START) {
         setShowGameoverText(true);
         if(!resources.audioGameover.sound.isPlaying ){
            resources.audioGameover.sound.play();
         }
         dispatch({ 
            type: GameActions.ADD_RESULT, 
            payload: { listNo: random.current![quizNo.current], correct: correctTypes.current }
         });
      }
   }, []);

   const goResult = useCallback(() => {
      gsap.globalTimeline.clear();
      let path = '';
      if (window.isTestAPI) path = `/gameAlphabet/history`;
      else                  path = `/game/alphabet/history`;
      window.http
      .get(path, { params: {fu_id: gameData.fu_id, play_type: 'G', stage: stage, round: step, score: score.total }})
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
            isSuccess.current = false;
            if(step !== 3) {
               correctTypes.current = { upper: false, lower: false };
            } else {
               correctTypes.current = { image1: false, image2: false };
            }
            makeQuiz();
            quizCounter.start();
         break;
         case QuizStatus.END : 
            if(!isSuccess.current){
               quizTargets.current[`quiz-${quizCount}`].timeout();
            }
            quizCounter.reset();
         break;
      }
   }, [quizStatus]);


   useEffect(() => {
      const bgmAudio = resources.audioBgm.sound;
      bgmAudio.play({loop: true, volume: 0.3});
      gameData.quizList.forEach((list: any, i: number) => {
         quizAudios.current.push(resources[`quizAudio${i}`].sound);
      });

      timer.current = PIXITimeout.start(()=>{
         charactor.current!.bubble();
         timer.current = PIXITimeout.start(()=>{
            timeContainer.current?.start();
            setQuizStatus( prev => {
               quizStatusRef.current = QuizStatus.START;
               return QuizStatus.START;
            });
         }, 500);
      }, 500);

      return () => {
         PIXITimeout.clear(timer.current);
         bgmAudio.stop();
      }
   }, []);

   
   return (
      <Container ref={container} name="mainContainer">

         <Sprite 
            name="bg" 
            texture={resources.mainBg.texture} 
            position={[-400, 0]} />
         <Sprite 
            name="tree"
            texture={resources.mainTree.texture}
            position={[34, 720]} />

         <Charactor ref={charactor} />
         
         <Sprite 
            name="soundBtnOff"
            texture={resources.commonSoundBtnOff.texture}
            position={[135, 790]}   
            interactive={!quizAudioPlaying}
            pointerup={onPlayQuizAudio}
            buttonMode={true} />
            
         <Sprite 
            name="soundBtnOn"
            visible={quizAudioPlaying}
            interactive={true}
            position={[137, 792]}
            texture={resources.commonSoundBtnOn.texture} />

         <BubbleParticle ref={bubbleParticle} />

         {quizDatas.map((data: any) => (
            <GameQuiz 
               key={data.id}
               ref={ref => ref && (quizTargets.current[data.id] = ref)}
               quizData={data}
               bonus={bonusCount === 2 ? (bonusLength % 3) + 1 : 0}
               onCorrect={onQuizCorrect}
               onWrong={onQuizWrong}
               onSuccess={onQuizSuccess}
               onFailed={onQuizFailed}
               onTransitionEnd={onTransitionEnd} />
         ))}

         {showBonusText && 
            <BonusText 
               position={[1024, 425]}
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
               textColor="#0c5338"
               timeLength={gameData.gameTimeout * 1000}
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
   );
}

export default memo(GameMain, () => true);

 