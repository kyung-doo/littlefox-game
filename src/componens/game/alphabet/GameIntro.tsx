import { FC, useEffect, useRef, useCallback, forwardRef, useImperativeHandle, memo, useState } from 'react';
import { Container, PixiRef, Sprite, useTick, _ReactPixi } from '@inlet/react-pixi';
import { Sprite as PIXISprite} from 'pixi.js';
import { useDispatch, useSelector } from 'react-redux';
import { GameActions, GameStatus } from '../../../stores/game/reducer';
import { gsap, Back, Power2, Linear } from 'gsap';
import PixiButton from '../PixiButton';
import { Sound } from '@pixi/sound';
import { isMobile, randomRange } from '../../../utils';
import PIXITimeout from '../../../utils/PIXITimeout';
import useAssets from '../../../hooks/useAssets';
import Guide, { Refs as GuideRefs } from '../Guide';


interface IntroBubbleRefs {
   clear: () => void;
}

const IntroBubble = memo(forwardRef<IntroBubbleRefs, _ReactPixi.IContainer>((props, ref) => {

   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);
   const timer = useRef<any[]>([]);


   const moveBubble = useCallback((idx:number, bubble: PIXISprite, delay: number) => {
      const x1 = randomRange(300, 600);
      const x2 = randomRange(1400, 1600);
      const startX = idx % 2 === 0 ? x1 : x2;
      const moveX = randomRange(20, 40);
      
      bubble.texture = resources.introSmallBubble.texture;
      bubble.position.x = startX;
      bubble.position.y = randomRange(500, 650);
      bubble.scale.set(randomRange(20, 120)*0.01);

      let angle = 0;
      gsap.to(bubble, 0.3, {delay: delay, pixi: {alpha: randomRange(30, 100)*0.01}});
      gsap.to(bubble, 3 + (1 - bubble.scale.x), {delay: delay, pixi: {y: `-=${randomRange(300, 500)}`}, ease: Linear.easeNone, 
         onUpdate: () => {
            angle += randomRange(10, 30) * 0.001;
            const x = Math.sin(angle);
            bubble.position.x = startX + moveX * x;
         },
         onComplete: () => {
            bubble.texture = resources.introBubblePop.texture;
            timer.current[idx] = PIXITimeout.start(()=>{
               bubble.alpha = 0;
               moveBubble(idx, bubble, 1);
            }, 300);
         }
      });
      
   },[]);

   useImperativeHandle(ref, () => ({
      clear: () => {
         timer.current.forEach(t => PIXITimeout.clear(t));
      }
   }));

   useEffect(()=>{
      Array.from(Array(10), (k, i) => {
         const bubble = new PIXISprite(resources.introSmallBubble.texture);
         bubble.anchor.set(0.5);
         bubble.alpha = 0;
         container.current!.addChild(bubble);
         moveBubble(i, bubble, randomRange(0, 300) * 0.01);
      });
      return () => {
         timer.current.forEach(t => PIXITimeout.clear(t));
      }
   }, []);

   return(
      <Container ref={container} name="introbubble" {...props} />
   )
}));



const GameIntro: FC = () => {

   const dispatch = useDispatch();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   
   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);
   const introBubble = useRef<IntroBubbleRefs>(null);
   const angle = useRef<number>(0);
   const bubbleScaleX = useRef<number>(0);
   const bubbleScaleY = useRef<number>(0);
   const bgmAudio = useRef<Sound>();
   const guideRef = useRef<GuideRefs>(null);
   

   const onStartGame = useCallback(() => {
      gsap.globalTimeline.clear();
      introBubble.current?.clear();
      dispatch({type: GameActions.CHANGE_STATUS, payload: GameStatus.GAME_START});
   }, []);


   const onBgmToggle = useCallback(( target, isToggle ) => {
      if(isToggle){
         bgmAudio.current!.play({loop: true, volume: 0.3});
      } else {
         bgmAudio.current!.pause();
      }
   }, []);


   useTick(( delta ) => {
      if(container.current && gameData.lowQuality === 0) {
         const bigBubble = container.current.getChildByName('bigBubble', true);
         const sideBubble = container.current.getChildByName('sideBubble', true);
         bubbleScaleX.current = Math.cos(angle.current);
         bubbleScaleY.current = -Math.sin(angle.current);
         angle.current += delta * 0.01;
         bigBubble.scale.x = 1 + Math.abs(bubbleScaleX.current) / 30;
         bigBubble.scale.y = 1 + Math.abs(bubbleScaleY.current) / 25;
         bigBubble.rotation = angle.current / 15;
         bigBubble.position.y = (853/2) + (bubbleScaleY.current * 20);
         sideBubble.rotation = bubbleScaleX.current/5;
         sideBubble.scale.x = 1+bubbleScaleX.current/5;
         sideBubble.scale.y = 1+bubbleScaleY.current/5;
      }
   });

   useEffect(() => {

      bgmAudio.current = resources.audioBgm.sound;
      const infoTxt = container.current!.getChildByName('infoTitle', true);
      const startBtn = container.current!.getChildByName('startBtnCon', true);
      if(gameData.lowQuality === 0){
         Array.from(Array(6), (k, i) => {
            const title = container.current!.getChildByName(`title1_${i+1}`, true);
            const delay = 0.2 + i * 0.1;
            let x: any = '+=0';
            if(i <= 1) x='+=80';
            if(i > 2)  x='-=80';
            gsap.from(title, 0.5, { delay: delay, pixi: { x: x, y: '+=200', scale: 0 }, ease: Back.easeOut.config(2) });
            gsap.to(title, 0.5, { delay: delay, alpha:1 });
         });

         Array.from(Array(3), (k, i) => {
            const title = container.current!.getChildByName(`title2_${i+1}`, true);
            let delay = 1.2 + i * 0.1;
            gsap.from(title, 0.5, { delay: delay, pixi: { scale: 0}, ease: Back.easeOut.config(2) });
            gsap.to(title, 0.5, { delay: delay, alpha:1 });
         });

         gsap.from(infoTxt, 0.6, {delay: 1.8, pixi: {y: '+=100'}, ease: Power2.easeOut});
         gsap.to(infoTxt, 0.6, {delay: 1.8, pixi: {alpha: 1}});
         gsap.to(startBtn, 0.6, {delay: 2, pixi: {y: 0, alpha: 1}, ease: Power2.easeOut});
      } else {
         Array.from(Array(6), (k, i) => {
            const title = container.current!.getChildByName(`title1_${i+1}`, true);
            title.alpha = 1;
         });
         Array.from(Array(3), (k, i) => {
            const title = container.current!.getChildByName(`title2_${i+1}`, true);
            title.alpha = 1;
         });
         infoTxt.alpha = 1;
         startBtn.alpha = 1;
         startBtn.position.y = 0;
      }
      

      return () => {
         bgmAudio.current?.stop();
      }

   }, []);

   
   return (
      <Container ref={container} name="introContainer">

         <Sprite 
            name="bg" 
            texture={resources.introBg.texture} 
            position={[-400, 0]} />
            
         {gameData.lowQuality === 0 
            ?
            <IntroBubble ref={introBubble} />
            :
            <Sprite 
               texture={resources.introBackBubble.texture}
               position={[455, -45]} />
         }
         

         <Sprite 
            name="charactor" 
            position={[1408, 669]}
            texture={resources.introCharactor.texture} />

         <Container 
            name="bigBubbleCon" 
            anchor={0.5}
            position={[585, 33]}>
            <Sprite 
               name="bigBubble" 
               position={[853/2, 853/2]}
               anchor={0.5}
               texture={resources.introBigBubble.texture} />
         </Container>

         <Sprite 
            name="sideBubble" 
            position={[1452, 708]}
            anchor={[0.9, 0.8]}
            texture={resources.introSideBubble.texture} />

         <Container name="title1">
            <Sprite 
               name="title1_1"
               texture={resources.introTitle1_1.texture}
               anchor={0.5}
               alpha={0}
               position={[731, 409]} />
            <Sprite 
               name="title1_2"
               texture={resources.introTitle1_2.texture}
               anchor={0.5}
               alpha={0}
               position={[862, 410]} />
            <Sprite 
               name="title1_3"
               texture={resources.introTitle1_3.texture}
               anchor={0.5}
               alpha={0}
               position={[992, 384]} />
            <Sprite 
               name="title1_4"
               texture={resources.introTitle1_4.texture}
               anchor={0.5}
               alpha={0}
               position={[1129, 384]} />
            <Sprite 
               name="title1_5"
               texture={resources.introTitle1_5.texture}
               anchor={0.5}
               alpha={0}
               position={[1225, 389]} />
            <Sprite 
               name="title1_6"
               texture={resources.introTitle1_6.texture}
               anchor={0.5}
               alpha={0}
               position={[1313, 418]} />

         </Container>

         <Container name="title2">
            <Sprite 
               name="title2_1"
               texture={resources.introTitle2_1.texture}
               anchor={0.5}
               alpha={0}
               position={[899, 590]} />
            <Sprite 
               name="title2_2"
               texture={resources.introTitle2_2.texture}
               anchor={0.5}
               alpha={0}
               position={[1034, 588]} />
            <Sprite 
               name="title2_3"
               texture={resources.introTitle2_3.texture}
               anchor={0.5}
               alpha={0}
               position={[1168, 597]} />
         </Container>

         <Sprite name="infoTitle"
            position={[1024, 925]}
            texture={resources.introInfoText.texture}
            anchor={0.5}
            alpha={0} />

         <Sprite
            name="leftLeaf"
            position={[-400, 1090]}
            texture={resources.introLeftLeaf.texture} /> 
         <Sprite
            name="rightLeaf"
            position={[1570, 1091]}
            texture={resources.introRightLeaf.texture} />

         <Container 
            name="startBtnCon" 
            position={[0, 300]}>
            <PixiButton 
               name="startBtn"
               position={[819, 1045]}
               defaultTexture={resources.introStartBtnDefault.texture}
               hover={{active: true, texture: resources.introStartBtnHover.texture}}
               sound={resources.audioClick.sound}
               onTouchEnd={onStartGame} />
         </Container>

         <PixiButton
            name="infoBtn"
            anchor={[0, 1]}
            position={[41, 1244]}
            scale={isMobile() ? 1.5 : 1}
            sound={resources.audioClick.sound}
            defaultTexture={resources.introInfoBtn.texture}
            onTouchEnd={() => guideRef.current?.show()}
            align="LEFT" />

         <PixiButton 
            name="bgmBtn"
            position={[41, 29]}
            scale={isMobile() ? 1.5 : 1}
            defaultTexture={resources.commonBgmOnBtn.texture!}
            sound={resources.audioClick.sound}
            toggle={{active: true, initToggle: true, texture: resources.commonBgmOffBtn.texture}}
            onToggle={onBgmToggle}
            align="LEFT" />

         <Guide ref={guideRef} />
         
         
      </Container>
   )
}

export default memo(GameIntro, () => true);

 
 
 
 
 
 