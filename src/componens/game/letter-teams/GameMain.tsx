import { FC, useEffect, useRef, useState, useCallback, memo } from "react";
import { Container, PixiRef, Sprite, useTick, useApp, Graphics } from "@inlet/react-pixi";
import { Container as PIXIContainer, Texture } from 'pixi.js';
import { gsap, Cubic, Linear } from 'gsap';
import { Sound } from "@pixi/sound";
import { useDispatch, useSelector } from 'react-redux';
import { GameActions, GameStatus } from '../../../stores/game/reducer';
import useAssets from "../../../hooks/useAssets";
import PIXITimeout from "../../../utils/PIXITimeout";
import { isMobile, makeRandom, makeRandomIgnoreFirst } from "../../../utils";
import PixiButton from "../PixiButton";
import ScoreContainer from "../ScoreContainer";
import TimeContainer, { Refs as TimeContainerRefs } from "../TimeContainer";
import useCounter from "../../../hooks/useCounter";
import BonusContainer from "./BonusContainer";
import GameQuiz, {Refs as GameQuizRefs} from "./GameQuiz";



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
   const score: any = useSelector<any>(state => state.root.score);
   const bonusCount: any = useSelector<any>(state => state.root.bonusCount);
   const bonusLength: any = useSelector<any>(state => state.root.bonusLength);

   const app = useApp();
   const container = useRef<PixiRef<typeof Container>>(null);
   const ground = useRef<PixiRef<typeof Sprite>>(null);
   const sky = useRef<PixiRef<typeof Sprite>>(null);
   const enterBtn = useRef<PixiRef<typeof Sprite>>(null);
   const timeContainer = useRef<TimeContainerRefs>(null);

   const quizTimeLength = gameData.quizTimeout * 1000;
   const quizCounter = useCounter(quizTimeLength);

   const quizNo = useRef<number>(0);
   const random = useRef<number[] | null>(null);
   const [quizStatus, setQuizStatus] = useState<QuizStatus>(QuizStatus.INIT);   
   const quizStatusRef = useRef<QuizStatus>(QuizStatus.INIT);

   const quizTargets = useRef<GameQuizRefs>(null);
   const isCorrect = useRef<boolean>(false);
   const [isTransition, setIsTransition] = useState<boolean>(false);

   const quizAudios = useRef<Sound[]>([]);
   const [quizAudioPlaying, setQuizAudioPlaying] = useState<boolean>(false);


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

      setQuizAudioPlaying(false);
      timer.current = PIXITimeout.start(() => {
         setQuizAudioPlaying(true);
         quizAudios.current[random.current![quizNo.current]].play(() => setQuizAudioPlaying(false));
      }, 300);

      quizTargets.current?.start(random.current![quizNo.current], bonusCount === 2 ? (bonusLength % 3) + 1 : 0);

   }, [quizCount, bonusCount, bonusLength]);


   const onPlayQuizAudio = useCallback(( e ) => {
      setQuizAudioPlaying(true);
      quizAudios.current[random.current![quizNo.current]].play(() => setQuizAudioPlaying(false));
   },[]);

   const onQuizSuccess = useCallback((score: number) => {
      console.log('quizSuccess');

      dispatch({type: GameActions.CORRECT_SCORE, payload: score});
      resources.audioCorrect.sound.stop();
      resources.audioCorrect.sound.play();

      isCorrect.current = true;
      quizCounter.pause();
      quizStatusRef.current = QuizStatus.END;
      setQuizStatus(QuizStatus.END);
      successTransition();

      // setTimeout(() => quizNext(), 1000);
   }, []);

   const onQuizWrong = useCallback(() => {
      console.log('quizWrong');
      resources.audioWrong.sound.stop();
      resources.audioWrong.sound.play();
      dispatch({type: GameActions.INCORRECT_SCORE, payload: 10});
   }, []);

   const onQuizEnter = useCallback(() => {
      enterBtn.current!.alpha = 0;
      quizTargets.current!.enter();
   }, []);


   const successTransition = useCallback(() => {
      setIsTransition(true);
      gsap.to(ground.current, 0.6, {pixi: {y: 1060}, ease: Cubic.easeInOut});
      gsap.to(sky.current, 1, {pixi: {y: 520}, ease: Linear.easeNone});
      timer.current = PIXITimeout.start(endTransition, 1500);
   }, []);

   const endTransition = useCallback(() => {
      gsap.to(ground.current, 1, {delay: 0.5, pixi: {y: 520}, ease: Cubic.easeInOut});
      gsap.to(sky.current, 0.8, {delay: 0.5, pixi: {y: 0}, ease: Linear.easeNone});
      quizTargets.current!.transition();
      timer.current = PIXITimeout.start(()=>{
         timer.current = PIXITimeout.start(()=>{
            setIsTransition(false);
         }, 500);
         quizNext();
      }, 1000);
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
      isTimeout.current = true;
      if(quizStatusRef.current === QuizStatus.START) {
         setShowGameoverText(true);
         if(!resources.audioGameover.sound.isPlaying ){
            resources.audioGameover.sound.play();
         }
      }
   }, []);


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
               // quizStatusRef.current = QuizStatus.END;
               // setQuizStatus(QuizStatus.END);
               // quizNext();
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
      // bgmAudio.play({loop: true, volume: 0.3});

      gameData.quizList.forEach((list: any, i: number) => {
         quizAudios.current.push(resources[`quizAudio${i}`].sound);
      });

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
            texture={Texture.WHITE}
            tint={0x0a9dff}
            width={2847}
            height={1280}
            position={[-400, 0]} />

         <Sprite 
            ref={sky}
            name="sky"
            x={-400}
            y={sky.current ? sky.current.position.y : 0}
            texture={resources.mainSky.texture} />

         <Sprite 
            ref={ground}
            name="ground"
            x={-400}
            y={ground.current ? ground.current.position.y : 520}
            texture={resources.mainGround.texture} />

         <Container 
            name="quizContainer"
            position={[1025, 650]}>
            <GameQuiz
               ref={quizTargets}
               onSuccess={onQuizSuccess}
               onWrong={onQuizWrong} />
         </Container>

         <Sprite 
            name="soundBtn"
            visible={!isTransition}
            alpha={quizAudioPlaying ? 1 : 0}
            interactive={!quizAudioPlaying}
            buttonMode={!quizAudioPlaying}
            click={onPlayQuizAudio}
            touchend={onPlayQuizAudio}
            position={[80, 712]}
            texture={resources.mainSoundBtn.texture} />

         <Sprite 
            name="enterBtnOff"
            visible={!isTransition}
            position={[1826, 740]}
            texture={resources.mainEnterOffBtn.texture} />

         <Sprite 
            ref={enterBtn}
            name="enterBtnOn"
            visible={!isTransition}
            alpha={enterBtn.current ? enterBtn.current.alpha : 0}
            interactive={true}
            buttonMode={true}
            pointerdown={() => enterBtn.current!.alpha=1}
            pointerupoutside={() => enterBtn.current!.alpha=0}
            click={onQuizEnter}
            touchend={onQuizEnter}
            position={[1826, 740]}
            texture={resources.mainEnterOnBtn.texture} />

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