import { FC, useEffect, useRef, useCallback, memo } from 'react';
import { Container, PixiRef, Sprite, useApp } from '@inlet/react-pixi';
import { Sprite as PIXISprite } from 'pixi.js';
import { gsap, Back, Power4, Power2, Linear } from 'gsap';
import { useDispatch, useSelector } from 'react-redux';
import { GameActions, GameStatus } from '../../../stores/game/reducer';
import PixiButton from '../PixiButton';
import { Sound } from '@pixi/sound';
import { isMobile } from '../../../utils';
import useAssets from '../../../hooks/useAssets';
import Guide, { Refs as GuideRefs } from '../Guide';




const GameIntro: FC = () => {
   const dispatch = useDispatch();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);
   const bgmAudio = useRef<Sound>();
   const guideRef = useRef<GuideRefs>(null);

   const app = useApp();


   const onStartGame = useCallback(() => {
      gsap.globalTimeline.clear();
      dispatch({type: GameActions.CHANGE_STATUS, payload: GameStatus.GAME_START});
   }, []);


   const onBgmToggle = useCallback(( target, isToggle ) => {
      if(isToggle){
         bgmAudio.current?.play({loop: true, volume: 0.3});
      } else {
         bgmAudio.current?.pause();
      }
   }, []);

   const resizeApp = useCallback(() => {
      if(container.current) {
         setTimeout(() => {
            const leftFocus = container.current?.getChildByName('leftFocus') as PIXISprite;
            const rightFocus = container.current?.getChildByName('rightFocus') as PIXISprite;
            leftFocus.position.x = 1024 - app.stage.children[0].position.x * (1/window.scale);
            rightFocus.position.x = 1024 + app.stage.children[0].position.x * (1/window.scale);
         }, 1);
      }
   },[]);
   

   useEffect(()=>{
      
      bgmAudio.current = resources.audioBgm.sound;

      const bg = container.current?.getChildByName('bg') as PIXISprite;
      const charactor = container.current?.getChildByName('charactor') as PIXISprite;
      const aimTarget = container.current?.getChildByName('aimTarget') as PIXISprite;
      const mainTitle = container.current?.getChildByName('mainTitle') as PIXISprite;
      const subTitle1 = container.current?.getChildByName('subTitle1') as PIXISprite;
      const line = container.current?.getChildByName('line') as PIXISprite;
      const infoTxt = container.current!.getChildByName('infoTitle', true);
      const startBtn = container.current!.getChildByName('startBtnCon', true);
      const leftFocus = container.current?.getChildByName('leftFocus') as PIXISprite;
      const rightFocus = container.current?.getChildByName('rightFocus') as PIXISprite;
      const topFocus = container.current?.getChildByName('topFocus') as PIXISprite;
      const textLight1 = container.current!.getChildByName('textLight1', true);
      const textLight2 = container.current!.getChildByName('textLight2', true);

      leftFocus.pivot.x = 1024;
      rightFocus.pivot.x = -1024;
      topFocus.pivot.y = 640;

      if(gameData.lowQuality === 0) {

         gsap.to(bg, 1.5, {pixi: {scale: 1}, ease: Power2.easeOut});
         gsap.to([charactor, aimTarget], 0.5, {alpha: 1});
         gsap.from(charactor, 1.5, {pixi: {scale: 1.5, x: '-=1200'}, ease: Power2.easeOut});
         gsap.from(aimTarget, 1.5, {pixi: {scale: 1.5, x: '+=1200'}, ease: Power2.easeOut});

         gsap.from(mainTitle, 0.8, { delay: 0.5, pixi: {y: '+=300', scale: 0.8}, ease: Power4.easeOut });
         gsap.to(mainTitle, 1, {delay: 0.5, pixi: {alpha: 1}});

         gsap.to(subTitle1, 1, { delay: 1, pixi: {rotation: 0, alpha: 1}, ease: Back.easeOut.config(3) });
         gsap.from(subTitle1, 1, { delay: 1, pixi: {x: `-=100`}, ease: Power4.easeOut });


         gsap.to(line, 1, { delay: 1.2, pixi: {rotation: 0, alpha: 1}, ease: Back.easeOut.config(3) });
         gsap.from(line, 1, { delay: 1.2,  pixi: {x: `-=100`}, ease: Power4.easeOut });

         
         gsap.from(infoTxt, 0.6, {delay: 1.3, pixi: {y: '+=100'}, ease: Power2.easeOut});
         gsap.to(infoTxt, 0.6, {delay: 1.3, pixi: {alpha: 1}});
         
         gsap.to(startBtn, 0.6, {delay: 1.5, pixi: {y: 0, alpha: 1}, ease: Power2.easeOut});

         
         
         gsap.to(leftFocus, 0.3, {pixi: {scale: 1.1}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         gsap.to(topFocus, 0.3, {delay: 0.1, pixi: {scale: 1.1}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         gsap.to(rightFocus, 0.3, {pixi: {scale: 1.1}, yoyo: true, repeat: -1, ease: Linear.easeNone});

         
         gsap.to(textLight1, 0.5, {delay: 1, pixi: {alpha: 1}});
         gsap.to(textLight2, 0.5, {delay: 2, pixi: {alpha: 1}});

         gsap.to(textLight1, 0.6, {delay: 1.5, pixi: {alpha: 0.5, scale:0.3}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         gsap.to(textLight2, 0.6, {delay: 2.5, pixi: {alpha: 0.5, scale:0.3}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         

         gsap.to(textLight1, 5, {pixi: {rotation: 360}, repeat: -1, ease: Linear.easeNone});
         gsap.to(textLight2, 5, {pixi: {rotation: -360}, repeat: -1, ease: Linear.easeNone});
         

      } else {
         bg.scale.set(1);
         charactor.alpha = 1;
         aimTarget.alpha = 1;
         mainTitle.alpha = 1;
         subTitle1.alpha = 1;
         subTitle1.rotation = 0;
         line.alpha = 1;
         line.rotation = 0;
         infoTxt.alpha = 1;
         startBtn.alpha = 1;
         startBtn.position.y = 0;
         leftFocus.scale.set(1);
         topFocus.scale.set(1);
         rightFocus.scale.set(1);
         textLight1.alpha = 1;
         textLight2.alpha = 1;
      }
      

      window.addEventListener('resize', resizeApp);
      resizeApp();


      return () => {
         bgmAudio.current?.stop();
         window.removeEventListener('resize', resizeApp);
      }
   });


   return (
      <Container ref={container} name="introContainer">
         <Sprite 
            name="bg" 
            scale={1.2}
            anchor={0.5}
            position={[1024, 640]}
            texture={resources.introBg.texture} />
         
         
         <Sprite 
            name="mainTitle" 
            position={[1024, 515]}
            alpha={0}
            anchor={[0.5, 1]}
            texture={resources.introMainTitle.texture} />
         
         <Sprite 
            name="subTitle1" 
            position={[1024, 1470]}
            rotation={-Math.PI/8}
            alpha={0}
            anchor={[0.5, 5]}
            texture={resources.introSubTitle1.texture} />
         
         <Sprite 
            name="line" 
            position={[1024, 1783]}
            rotation={-Math.PI/8}
            alpha={0}
            anchor={[0.5, 10]}
            texture={resources.introLine.texture} />

         <Sprite 
            name="textLight1" 
            position={[1235, 337]}
            scale={0.7}
            anchor={0.5}
            alpha={0}
            texture={resources.introTextLight.texture} />
         <Sprite 
            name="textLight2" 
            position={[750, 518]}
            anchor={0.5}
            alpha={0}
            texture={resources.introTextLight.texture} />
         

         <Sprite 
            name="charactor" 
            position={[93, 491]}
            alpha={0}
            texture={resources.introCharactor.texture} />
         <Sprite 
            name="aimTarget" 
            position={[1488, 569]}
            alpha={0}
            texture={resources.introAimTarget.texture} />

         <Sprite name="infoTitle"
            position={[1024, 868]}
            texture={resources.introInfoText.texture}
            anchor={0.5}
            alpha={0} />

         <Sprite 
            name="leftFocus" 
            anchor={[0, 0.5]}
            position={[0, 640]}
            texture={resources.introLeftFocus.texture} />
         <Sprite 
            name="topFocus" 
            anchor={[0.5, 0]}
            position={[1024, 640]}
            texture={resources.introTopFocus.texture} />
         <Sprite 
            name="rightFocus" 
            anchor={[1, 0.5]}
            position={[2048, 640]}
            texture={resources.introRightFocus.texture} />

         <Container name="startBtnCon" position={[0, 300]}>
            <PixiButton 
               name="startBtn"
               position={[819, 1045]}
               sound={resources.audioClick.sound}
               defaultTexture={resources.introStartBtnDefault.texture}
               hover={{active: true, texture: resources.introStartBtnHover.texture}}
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
   );
}

export default memo(GameIntro, () => true);