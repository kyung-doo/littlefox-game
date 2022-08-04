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
import BonusText from "../BonusText";
import GameoverText from "../GameoverText";



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
   const cloudCon = useRef<PixiRef<typeof Sprite>>(null);
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

      setQuizAudioPlaying(false);
      timer.current = PIXITimeout.start(() => {
         setQuizAudioPlaying(true);
         quizAudios.current[random.current![quizNo.current]].play(() => setQuizAudioPlaying(false));
      }, 300);

      quizTargets.current?.start(random.current![quizNo.current], bonusCount === 2 ? (bonusLength % 3) + 1 : 0);
      // quizTargets.current?.start(random.current![quizNo.current], 1);

   }, [quizCount, bonusCount, bonusLength]);


   const onPlayQuizAudio = useCallback(( e ) => {
      setQuizAudioPlaying(true);
      quizAudios.current[random.current![quizNo.current]].play(() => setQuizAudioPlaying(false));
   },[]);


   const onQuizSuccess = useCallback((score: number, isBonus: boolean) => {
      console.log('quizSuccess', isBonus);

      dispatch({type: GameActions.CORRECT_SCORE, payload: score});
      dispatch({type: GameActions.ADD_BONUS_COUNT});

      resources.audioCorrect.sound.stop();
      resources.audioCorrect.sound.play();

      isCorrect.current = true;
      quizCounter.pause();
      quizStatusRef.current = QuizStatus.END;
      setQuizStatus(QuizStatus.END);
      setIsTransition(true);
      successTransition(isBonus);
   }, []);


   const onQuizWrong = useCallback(() => {
      console.log('quizWrong');

      dispatch({type: GameActions.INCORRECT_SCORE, payload: 10});
      resources.audioWrong.sound.stop();
      resources.audioWrong.sound.play();
      
      setIsTransition(true);
      timer.current = PIXITimeout.start(() => {
         setIsTransition(false);
      }, 300);
   }, []);


   const onQuizEnter = useCallback(() => {
      enterBtn.current!.alpha = 0;
      quizTargets.current!.enter();
   }, []);


   const successTransition = useCallback((isBonus: boolean) => {
      gsap.to(ground.current, 0.6, {pixi: {y: 1060}, ease: Cubic.easeInOut});
      gsap.to(sky.current, 1, {pixi: {y: 520}, ease: Linear.easeNone});
      gsap.to(cloudCon.current, 1.3, {pixi: {y: 1750}, ease: Linear.easeNone});
      if(isBonus) {
         timer.current = PIXITimeout.start(() => {
            setShowBonusText(true);
            resources.audioBonus.sound.play();
            timer.current = PIXITimeout.start(() => endTransition(isBonus), 3000);
         }, 1500);
      } else {
         timer.current = PIXITimeout.start(() => endTransition(isBonus), 1200);
      }
   }, []);


   const endTransition = useCallback((isBonus: boolean) => {
      gsap.to(ground.current, 0.7, {delay: 0.3, pixi: {y: 520}, ease: Cubic.easeInOut});
      gsap.to(sky.current, 0.5, {delay: 0.3, pixi: {y: 0}, ease: Linear.easeNone});
      gsap.to(cloudCon.current, 0.5, {delay: 0.3, pixi: {y: 1280}, ease: Linear.easeNone});
      quizTargets.current!.transition();
      if(isBonus) {
         dispatch({type: GameActions.ADD_BONUS_LENGTH});
      }
      timer.current = PIXITimeout.start(()=>{
         timer.current = PIXITimeout.start(()=>{
            setIsTransition(false);
         }, 500);
         quizNext();
      }, 500);
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

   const goResult = useCallback(() => {
      // gsap.globalTimeline.clear();
      // let path = '';
      // if (window.isTestAPI) path = `/studyAlphabet/history`;
      // else                  path = `/game/alphabet/history`;
      // window.http
      // .get(path, { params: {fu_id: gameData.fu_id, play_type: 'G', stage: stage, round: step, score: score.total }})
      // .then(({ data }) => {
      //    dispatch({type: GameActions.SET_BEST_SCORE, payload: { 
      //       score: data.data.bestScore, 
      //       date: data.data.bestScoreDate}
      //    });
      //    dispatch({type: GameActions.CHANGE_STATUS, payload: GameStatus.RESULT});
      // });
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

         <Container
            ref={cloudCon}
            name="cloudCon"
            x={0}
            y={cloudCon.current ? cloudCon.current.position.y : 1280}>
            <Sprite
               name="cloud1"
               position={[-254, -957]}
               texture={resources.mainCloud1.texture} />
            <Sprite
               name="cloud2"
               position={[1620, -884]}
               texture={resources.mainCloud2.texture} />
            {/* <Sprite
               name="cloud3"
               position={[-254, -2825]}
               texture={resources.mainCloud1.texture} />
            <Sprite
               name="cloud2"
               position={[1620, -2752]}
               texture={resources.mainCloud2.texture} /> */}
         </Container>

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

         {showBonusText && 
            <BonusText 
               position={[1024, 500]}
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