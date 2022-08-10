import { FC, useEffect, useRef, useState, useCallback, memo, useLayoutEffect } from "react";
import { Container, PixiRef, Sprite, useTick, useApp } from "@inlet/react-pixi";
import {  AnimatedSprite as PIXIAnimatedSprite , Texture } from 'pixi.js';
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
import BonusEffect1 from "./BonusEffect1";
import BonusEffect2 from "./BonusEffect2";
import BonusEffect3 from "./BonusEffect3";




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
   const shadow = useRef<PixiRef<typeof Sprite>>(null);
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

   const [showBonusEffect1, setShowBonusEffect1] = useState<boolean>(false);
   const [showBonusEffect2, setShowBonusEffect2] = useState<boolean>(false);
   const [showBonusEffect3, setShowBonusEffect3] = useState<boolean>(false);
   const bonusIdx = useRef<number>(0);

   const isTimeout = useRef<boolean>(false);
   const timer = useRef<any[]>([]);

   
   


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
      timer.current[0] = PIXITimeout.start(() => {
         setQuizAudioPlaying(true);
         quizAudios.current[random.current![quizNo.current]].play(() => setQuizAudioPlaying(false));
      }, 300);
      bonusIdx.current = bonusCount === 2 ? (bonusLength % 3) + 1 : 0;
      quizTargets.current?.start(random.current![quizNo.current], bonusCount === 2 ? (bonusLength % 3) + 1 : 0);
      // bonusIdx.current = 3;
      // quizTargets.current?.start(random.current![quizNo.current], 3);

   }, [quizCount, bonusCount, bonusLength]);


   const onPlayQuizAudio = useCallback(( e ) => {
      setQuizAudioPlaying(true);
      quizAudios.current[random.current![quizNo.current]].play(() => setQuizAudioPlaying(false));
   },[]);


   const onQuizSuccess = useCallback((score: number, isBonus: boolean) => {

      dispatch({type: GameActions.CORRECT_SCORE, payload: score});
      dispatch({type: GameActions.ADD_BONUS_COUNT});

      resources.audioCorrect.sound.stop();
      resources.audioCorrect.sound.play();

      isCorrect.current = true;
      quizCounter.pause();
      quizStatusRef.current = QuizStatus.END;
      setQuizStatus(QuizStatus.END);
      timer.current.forEach(t => PIXITimeout.clear(t));
      setIsTransition(true);
      successTransition(isBonus);
      
   }, []);


   const onQuizWrong = useCallback(() => {
      dispatch({type: GameActions.INCORRECT_SCORE, payload: 10});
      resources.audioWrong.sound.stop();
      resources.audioWrong.sound.play();
      timer.current.forEach(t => PIXITimeout.clear(t));
      setIsTransition(true);
      timer.current[1] = PIXITimeout.start(() => {
         setIsTransition(false);
      }, 600);
   }, []);


   const onQuizEnter = useCallback(() => {
      enterBtn.current!.alpha = 0;
      quizTargets.current!.enter();
   }, []);


   const successTransition = useCallback((isBonus: boolean) => {
      gsap.to(ground.current, 0.6, {pixi: {y: 1060}, ease: Cubic.easeInOut});
      gsap.to(sky.current, 1, {pixi: {y: 520}, ease: Linear.easeNone});
      gsap.to(cloudCon.current, 1.3, {pixi: {y: 1750}, ease: Linear.easeNone});
      gsap.to(shadow.current, 0.5, {pixi: {scale: 0.2, alpha: 0}, ease: Cubic.easeInOut});
      if(isBonus) {
         timer.current[2] = PIXITimeout.start(() => {
            setShowBonusText(true);
            resources.audioBonus.sound.play();
            timer.current[3] = PIXITimeout.start(() => endTransition(isBonus), 3000);
            
            if(bonusIdx.current === 1) {
               setShowBonusEffect1(true);
            } else if(bonusIdx.current === 2) {
               setShowBonusEffect2(true);
            } else {
               setShowBonusEffect3(true);
            }
            
         }, 1520);
      } else {
         timer.current[4] = PIXITimeout.start(() => endTransition(isBonus), 1200);
      }
   }, [bonusLength]);


   const endTransition = useCallback((isBonus: boolean) => {
      if(!isTimeout.current) {
         timer.current.forEach(t => PIXITimeout.clear(t));
         gsap.to(ground.current, 0.7, {delay: 0.3, pixi: {y: 520}, ease: Cubic.easeInOut});
         gsap.to(sky.current, 0.5, {delay: 0.3, pixi: {y: 0}, ease: Linear.easeNone});
         gsap.to(cloudCon.current, 0.5, {delay: 0.3, pixi: {y: 1280}, ease: Linear.easeNone});
         gsap.set(shadow.current, {pixi: {scale: 1, alpha: 1}});
         quizTargets.current!.transition();
         if(isBonus) {
            dispatch({type: GameActions.ADD_BONUS_LENGTH});
         }
         timer.current[6] = PIXITimeout.start(()=>{
            timer.current[7] = PIXITimeout.start(()=>{
               if(isBonus) {
                  setShowBonusEffect1(false);
                  setShowBonusEffect2(false);
                  setShowBonusEffect3(false);
               }
               setIsTransition(false);
            }, 600);
            quizNext();
         }, 500);
      } else {
         setShowGameoverText(true);
         if(!resources.audioGameover.sound.isPlaying ){
            resources.audioGameover.sound.play();
         }
      }
   }, []);

   const onQuizTimeoutComp = useCallback(() => {
      quizNext();
      timer.current[8] = PIXITimeout.start(() => setIsTransition(false), 600);
   }, []);


   const quizNext = useCallback(() => {
      if(!isTimeout.current) {
         dispatch({ 
            type: GameActions.NEXT_QUIZ, 
            payload: { listNo: random.current![quizNo.current], correct: isCorrect.current }
         });
         quizStatusRef.current = QuizStatus.START;
         setQuizStatus(QuizStatus.START);
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
            payload: { listNo: random.current![quizNo.current], correct: isCorrect.current }
         });
      }
   }, []);

   const goResult = useCallback(() => {
      gsap.globalTimeline.clear();
      timer.current.forEach(t => PIXITimeout.clear(t));
      let path = '';
      if (window.isTestAPI) path = `/gameLetterTeams/history`;
      else                  path = `/game/letterteams/history`;
      window.http
      .get(path, { params: {fu_id: gameData.fu_id, play_type: 'G', stage: stage, score: score.total }})
      .then(({ data }) => {
         dispatch({type: GameActions.SET_BEST_SCORE, payload: { 
            score: data.data.bestScore, 
            date: data.data.bestScoreDate
         }});
         dispatch({type: GameActions.CHANGE_STATUS, payload: GameStatus.RESULT});
      })
      .catch( e => {
         if(window.isTestAPI) {
            dispatch({type: GameActions.SET_BEST_SCORE, payload: { 
               score: 5000, 
               date: "2022.3.7"
            }});
            dispatch({type: GameActions.CHANGE_STATUS, payload: GameStatus.RESULT});
         }
      });
   }, []);


   const onGameReset = useCallback(() => {
      gsap.globalTimeline.clear();
      gsap.globalTimeline.eventCallback('onStart', null);
      gsap.globalTimeline.eventCallback('onUpdate', null);
      gsap.globalTimeline.eventCallback('onComplete', null);
      timer.current.forEach(t => PIXITimeout.clear(t));
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
               timer.current.forEach(t => PIXITimeout.clear(t));
               quizTargets.current!.timeout();
               setIsTransition(true);
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

      setQuizStatus( prev => {
         quizStatusRef.current = QuizStatus.START;
         return QuizStatus.START;
      });

      timer.current[0] = PIXITimeout.start(()=>{
         timeContainer.current?.start();
      }, 600);

      return () => {
         timer.current.forEach(t => PIXITimeout.clear(t));
         bgmAudio.stop();
      }

   },[]);

   useLayoutEffect(()=>{
      Array.from(Array(4), (k, i) => {
         const texture = Object.keys(resources[`spritesheetFireWork${i+1}`].textures).map( name => resources[`spritesheetFireWork${i+1}`].textures[name]);
         const sprite = new PIXIAnimatedSprite(texture);
         sprite.position.y = -2000;
         container.current?.addChild(sprite);
      })
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
         </Container>

         <Container
            ref={ground}
            name="ground"
            x={-400}
            y={ground.current ? ground.current.position.y : 520}>
            <Sprite texture={resources.mainGround.texture} />
            <Sprite 
               ref={shadow}
               anchor={0.5}
               position={[1427, 387]}
               texture={resources.mainShadow.texture} />
         </Container>

         <Container 
            name="quizContainer"
            position={[1025, 650]}>
            <GameQuiz
               ref={quizTargets}
               onSuccess={onQuizSuccess}
               onWrong={onQuizWrong}
               onTimeoutComp={onQuizTimeoutComp} />
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

         <Container 
            name="bonusEffects"
            position={[1025, 650]}>
            {showBonusEffect1 && 
               <BonusEffect1 />
            }
            {showBonusEffect2 && 
               <BonusEffect2 />
            }
            {showBonusEffect3 && 
               <BonusEffect3 />
            }
         </Container>

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
               textColor="#354587"
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