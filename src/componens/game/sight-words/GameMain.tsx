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

   const app = useApp();
   const container = useRef<PixiRef<typeof Container>>(null);

   const quizTimeLength = gameData.quizTimeout * 1000;
   const quizCounter = useCounter(quizTimeLength);

   const quizNo = useRef<number>(0);
   const random = useRef<number[] | null>(null);
   const [quizStatus, setQuizStatus] = useState<QuizStatus>(QuizStatus.INIT);   
   const quizStatusRef = useRef<QuizStatus>(QuizStatus.INIT);

   const quizAudios = useRef<Sound[]>([]);
   const [quizAudioPlaying, setQuizAudioPlaying] = useState<boolean>(false);

   const timer = useRef<any[]>([]);





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
         // timeContainer.current?.start();
      }, 600);

      return () => {
         timer.current.forEach(t => PIXITimeout.clear(t));
         bgmAudio.stop();
      }

   },[]);


   return (
      <Container ref={container} name="mainContainer">
         <Sprite 
            name="bg"
            texture={resources.mainBg.texture}
            position={[-400, 0]} />
      </Container>
   );
}

export default memo(GameMain, () => true);