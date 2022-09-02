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
import TimeContainer, { Refs as TimeContainerRefs } from "./TimeContainer";
import useCounter from "../../../hooks/useCounter";
import GameoverText from "../GameoverText";
import ScoreText, { Props as ScoreTextProps} from "../ScoreText";
import GameQuiz, { Refs as GameQuizRefs } from "./GameQuiz";
import EggEffect, { Props as EggEffectProps } from "./EggEffect";
import BonusText from "../BonusText";
import Charactor, { Refs as CharactorRefs} from "./Charactor";


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
   const bonusLength: any = useSelector<any>(state => state.root.bonusLength);

   const app = useApp();
   const container = useRef<PixiRef<typeof Container>>(null);
   const timeContainer = useRef<TimeContainerRefs>(null);

   const quizTimeLength = gameData.quizTimeout * 1000;
   const quizCounter = useCounter(quizTimeLength);

   const quizNo = useRef<number>(0);
   const random = useRef<number[] | null>(null);
   const [quizStatus, setQuizStatus] = useState<QuizStatus>(QuizStatus.INIT);   
   const quizStatusRef = useRef<QuizStatus>(QuizStatus.INIT);

   const quizTargets = useRef<GameQuizRefs>(null);
   const correctNum = useRef<number>(0);

   const quizAudios = useRef<Sound[]>([]);
   const [quizAudioPlaying, setQuizAudioPlaying] = useState<boolean>(false);

   const [quizPlaying, setQuizPlaying] = useState<boolean>(false);

   const [eggEffect, setEggEffect] = useState<EggEffectProps[]>([]);
   const eggEffectCount = useRef<number>(0);

   const dinosCount = useRef<number>(0);
   const gameCount = useRef<number>(0);

   const [showBonusText, setShowBonusText] = useState<boolean>(false);
   const [showGameoverText, setShowGameoverText] = useState<boolean>(false);

   const [scoreTexts, setScoreTexts] = useState<ScoreTextProps[]>([]);
   const scoreCount = useRef<number>(0);

   const isTransition = useRef<boolean>(false);

   const charactor = useRef<CharactorRefs>(null);

   const bonusIdx = useRef<number>(0);
   const isTimeout = useRef<boolean>(false);
   const timer = useRef<any>();
   


   const makeQuiz = useCallback(() => {
      quizNo.current = quizCount % gameData.quizList.length;
      if(random.current === null) {
         random.current = makeRandom(gameData.quizList.length, gameData.quizList.length);
      }

      setQuizAudioPlaying(true);

      timer.current = PIXITimeout.start(() => {
         setQuizPlaying(true);
         quizAudios.current[random.current![quizNo.current]].play(() => setQuizAudioPlaying(false));
         quizCounter.start();
      }, gameCount.current === 0 ? 1200 : 500);

      if(gameCount.current === 0) {
         bonusIdx.current = Math.floor(Math.random() * 2) === 0 ? (bonusLength % 3) + 1 : 0;
         quizTargets.current?.start([
            random.current![quizNo.current],
            random.current![(quizNo.current+1) % gameData.quizList.length],
            random.current![(quizNo.current+2) % gameData.quizList.length]
         ], bonusIdx.current);
      } else {
         quizTargets.current?.start(random.current![quizNo.current]);
      }
      
      charactor.current?.default();

      gameCount.current++;
      gameCount.current = gameCount.current % 3;

   }, [quizCount, bonusLength]);


   const onQuizCorrect = useCallback(( pos, isBonus, bonusIdx ) => {
      correct(pos, false, isBonus, bonusIdx);
      if(isBonus) {
         dispatch({type: GameActions.ADD_BONUS_LENGTH});
         quizCounter.pause();
      }
      isTransition.current = true;
      timer.current = PIXITimeout.start(() => {
         isTransition.current = false;
         checkEnd();
         quizCounter.start();
      }, isBonus ? 4000 : 0);
   }, []);


   const onQuizWrong = useCallback(( pos ) => {
      dispatch({type: GameActions.INCORRECT_SCORE, payload: 10});
      resources.audioWrong.sound.stop();
      resources.audioWrong.sound.play();

      setScoreTexts(prev => [ ...prev, { 
         id: `scoreText${scoreCount.current}`, 
         texture: resources.mainScoreMinus10.texture, 
         x: pos.x + 595, 
         y: pos.y + 200,
         posY: 150
      }]);
      scoreCount.current++;
      charactor.current?.wrong();

      isTransition.current = true;
      timer.current = PIXITimeout.start(() => {
         isTransition.current = false;
         checkEnd();
      }, 500);
   }, []);


   const checkEnd = useCallback(() => {
      if(isTimeout.current) {
         setShowGameoverText(true);
         resources.audioGameover.sound.play();
         dispatch({ 
            type: GameActions.ADD_RESULT, 
            payload: { listNo: random.current![quizNo.current], correct: correctNum.current }
         });
      } else {
         if(quizStatusRef.current === QuizStatus.END) {
            setQuizPlaying(false);
            if(gameCount.current === 0) {
               quizTargets.current!.timeout();
               resources.audioTimeout.sound.play();
               timer.current = PIXITimeout.start(() => nextQuiz(), 500);
            } else {
               resources.audioTimeout.sound.play();
               nextQuiz();
            }
         }
      }
   },[]);


   const onQuizSuccess = useCallback(( pos, isBonus, bonusIdx ) => {
      isTransition.current = true;
      correct(pos, true, isBonus, bonusIdx);
      quizCounter.pause();
      quizStatusRef.current = QuizStatus.END;
      setQuizStatus(QuizStatus.END);
      setQuizPlaying(false);

      if(isBonus) {
         dispatch({type: GameActions.ADD_BONUS_LENGTH});
      }

      
      timer.current = PIXITimeout.start(() => {
         if(isTimeout.current) {
            setShowGameoverText(true);
            resources.audioGameover.sound.play();
            dispatch({ 
               type: GameActions.ADD_RESULT, 
               payload: { listNo: random.current![quizNo.current], correct: correctNum.current }
            });
         } else {
            isTransition.current = false;
            console.log('gameCount', gameCount.current);
            if(gameCount.current === 0) {
               quizTargets.current!.timeout();
               timer.current = PIXITimeout.start(() => nextQuiz(), 500);
            } else {
               nextQuiz();
            }
         }
      }, isBonus ? 4000 : 3000);
   }, []);


   const correct = useCallback((pos, isSuccess, isBonus, bonusIdx) => {
      correctNum.current++;
      charactor.current?.correct();

      if(isSuccess || (isBonus && !isSuccess)) {
         setEggEffect(prev => [...prev, {
            id: `eggEffect${eggEffectCount.current}`,
            idx: isBonus ? bonusIdx : dinosCount.current + 1,
            startPos: {x: pos.x + 585, y: pos.y + 287},
            bonus: isBonus
         }]);
         
         if(isBonus) {
            timer.current = PIXITimeout.start(() => {
               setShowBonusText(true);
               resources.audioBonus.sound.play();
               timer.current = PIXITimeout.start(() => {
                  charactor.current?.default();
               }, 3500);
               charactor.current?.bonus();
            }, 500);
         } else {
            timer.current = PIXITimeout.start(() => {
               charactor.current?.bonus();
            }, 500);
         }
         eggEffectCount.current++;
         dinosCount.current++;
         dinosCount.current = dinosCount.current % 9;
      }

      if(!isBonus){
         dispatch({type: GameActions.CORRECT_SCORE, payload: correctNum.current < 3 ? 50 :100 });
         setScoreTexts(prev => [ ...prev, { 
            id: `scoreText${scoreCount.current}`, 
            texture: correctNum.current < 3 ? resources.mainScorePlus50.texture : resources.mainScorePlus100.texture, 
            x: pos.x + 595, 
            y: pos.y + 200, 
            posY: 150
         }]);
      }

      scoreCount.current++;      
      resources.audioCorrect.sound.stop();
      resources.audioCorrect.sound.play();
   }, []);


   const nextQuiz = useCallback(() => {
      dispatch({ 
         type: GameActions.NEXT_QUIZ, 
         payload: { listNo: random.current![quizNo.current], correct: correctNum.current }
      });
      quizStatusRef.current = QuizStatus.START;
      setQuizStatus(QuizStatus.START);
   }, []);


   const onEggEffectEnd = useCallback(( id ) => {
      setEggEffect(prev => prev.filter(egg => egg.id != id));
   },[]);


   const onScoreTextAniEnd = useCallback((id: string) => {
      setScoreTexts(prev => {
         return prev.filter( st => st.id !== id);
      });
   }, []);


   const onPlayQuizAudio = useCallback(( e ) => {
      setQuizAudioPlaying(true);
      quizAudios.current[random.current![quizNo.current]].play(() => setQuizAudioPlaying(false));
   },[]);


   const onGameTimeout = useCallback(() => {
      container.current!.interactiveChildren = false;
      isTimeout.current = true;
      if(!isTransition.current) {
         setShowGameoverText(true);
         if(!resources.audioGameover.sound.isPlaying ){
            resources.audioGameover.sound.play();
         }
         dispatch({ 
            type: GameActions.ADD_RESULT, 
            payload: { listNo: random.current![quizNo.current], correct: correctNum.current }
         });
      }
   }, []);


   const goResult = useCallback(() => {
      gsap.globalTimeline.clear();
      PIXITimeout.clear(timer.current);
      let path = '';
      if (window.isTestAPI) path = `/gameSightWords/history`;
      else                  path = `/game/sightwords/history`;
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
            correctNum.current = 0;
            if(!isTimeout.current)  makeQuiz();
         break;
         case QuizStatus.END : 
            if(correctNum.current < 3) {
               if(!isTransition.current){
                  setQuizPlaying(false);
                  if(gameCount.current === 0) {
                     quizTargets.current!.timeout();
                     resources.audioTimeout.sound.play();
                     timer.current = PIXITimeout.start(() => nextQuiz(), 500);
                  } else {
                     resources.audioTimeout.sound.play();
                     nextQuiz();
                  }
               }
            }
            quizCounter.reset();
         break;
      }
   }, [quizStatus]);


   useEffect(() => {
      const bgmAudio = resources.audioBgm.sound;
      bgmAudio.play({loop: true, volume: 0.1});

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
            texture={resources.mainBg.texture}
            position={[-400, 0]} />


         <GameQuiz
            ref={quizTargets}
            onCorrect={onQuizCorrect}
            onSuccess={onQuizSuccess}
            onWrong={onQuizWrong} />

         <Sprite 
            name="topBg"
            texture={resources.mainTopBg.texture}
            position={[-400, 619]} />

         <Charactor ref={charactor} />

         <Sprite 
            name="soundBtnOff"
            texture={resources.mainSoundBtnOff.texture}
            position={[119, 700]}   
            interactive={!quizAudioPlaying}
            pointerup={onPlayQuizAudio}
            buttonMode={true} />

         <Sprite 
            name="soundBtnOn"
            visible={quizAudioPlaying}
            alpha={quizPlaying ? 1 : 0}
            interactive={true}
            position={[119, 700]}
            texture={resources.mainSoundBtnOn.texture} />

         {eggEffect.map(props => (
            <EggEffect 
               key={props.id} 
               onAnimationEnd={onEggEffectEnd}
               {...props} />
         ))}

         {scoreTexts.map(st => (
            <ScoreText 
               key={st.id} 
               onAnimationEnd={onScoreTextAniEnd}
               {...st} />
         ))}

         {showBonusText && 
            <BonusText 
               position={[1024, 500]}
               bonusLength={bonusLength}
               onAnimationEnd={() => setShowBonusText(false)} />
         }
         

         <Container name="bottomUI" position={[0, 1047]}>
            <ScoreContainer
               position={[30, -15]} />
            <TimeContainer
               ref={timeContainer}
               position={[1855, 70]}
               timeLength={gameData.gameTimeout * 1000}
               onTimeout={onGameTimeout} />
         </Container>

         {showGameoverText && 
            <GameoverText 
               y={620} 
               onAnimationEnd={goResult} />
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