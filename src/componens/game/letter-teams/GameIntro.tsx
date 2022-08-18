import { FC, useEffect, useRef, useCallback, memo } from 'react';
import { Container, PixiRef, Sprite } from '@inlet/react-pixi';
import { useDispatch, useSelector } from 'react-redux';
import { Sprite as PIXISprite } from 'pixi.js';
import useAssets from '../../../hooks/useAssets';
import PixiButton from '../PixiButton';
import { Sound } from '@pixi/sound';
import { isMobile, randomRange} from '../../../utils';
import { gsap, Linear, Cubic, Elastic, Power2, Back } from 'gsap';
import { GameActions, GameStatus } from '../../../stores/game/reducer';
import StarLight from './StarLight';



const GameIntro: FC = () => {
   const dispatch = useDispatch();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);
   const bgmAudio = useRef<Sound>();


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

   const balloonAni = useCallback(( balloon, targetY ) => {
      gsap.to(balloon, randomRange(800, 1500) * 0.001, {pixi: {y: `+=${targetY}`}, yoyo: true, repeat: -1, ease: Linear.easeNone});
   },[]);


   useEffect(() => {
      bgmAudio.current = resources.audioBgm.sound;
      const bgEffect = container.current?.getChildByName('bgEffect') as PIXISprite;
      const charactor = container.current?.getChildByName('charactor') as PIXISprite;
      const balloon1 = container.current?.getChildByName('balloon1') as PIXISprite;
      const balloon2 = container.current?.getChildByName('balloon2') as PIXISprite;
      const balloon3 = container.current?.getChildByName('balloon3') as PIXISprite;
      const balloon4 = container.current?.getChildByName('balloon4') as PIXISprite;
      const balloon5 = container.current?.getChildByName('balloon5') as PIXISprite;
      const balloon6 = container.current?.getChildByName('balloon6') as PIXISprite;
      const balloon7 = container.current?.getChildByName('balloon7') as PIXISprite;
      const title1 = container.current?.getChildByName('title1') as PIXISprite;
      const title2 = container.current?.getChildByName('title2') as PIXISprite;
      const infoTxt = container.current!.getChildByName('infoTitle', true);
      const startBtn = container.current!.getChildByName('startBtnCon', true);

      if(gameData.lowQuality === 0) {
         gsap.to(bgEffect, 10, {pixi: {rotation: 360}, ease: Linear.easeNone, repeat: -1});
         gsap.to(bgEffect, 0.6, {pixi: {alpha: 0.75}});

         gsap.from(charactor, 0.6, {delay: 0.3, pixi: {y: '+=500'}, ease :Back.easeOut});
         gsap.to(charactor, 0.3, {delay: 0.3, pixi: {alpha: 1}});

         gsap.from(balloon6, 1.5, {pixi: {scale: 0.2, rotation: 30, x: 795, y: 1300}, onComplete: () => balloonAni(balloon6, 25)});
         gsap.to(balloon6, 0.3, {pixi: {alpha:1}});

         gsap.from(balloon4, 1.5, {pixi: {scale: 0.2, rotation: -30, x: 1166, y: 1200}, onComplete: () => balloonAni(balloon4, 20)});
         gsap.to(balloon4, 0.3, {pixi: {alpha:1}});

         gsap.from(balloon5, 1.5, {delay: 0.3, pixi: {scale: 0.2, rotation: -20, x: 1060, y: 844}, onComplete: () => balloonAni(balloon5, 15)});
         gsap.to(balloon5, 0.3, {delay: 0.3, pixi: {alpha:1}});

         gsap.from(balloon2, 1.5, {delay: 0.2, pixi: {scale: 0.2, rotation: 25, x: 345, y: 950}, onComplete: () => balloonAni(balloon2, 10)});
         gsap.to(balloon2, 0.3, {delay: 0.2, pixi: {alpha:1}});

         gsap.from(balloon3, 1.5, {delay: 0.4, pixi: {scale: 0.2, rotation: 25, x: 565, y: 860}, onComplete: () => balloonAni(balloon3, 10)});
         gsap.to(balloon3, 0.3, {delay: 0.4, pixi: {alpha:1}});

         gsap.from(balloon1, 1.5, {delay: 0.3, pixi: {scale: 0.2, y: 570}, onComplete: () => balloonAni(balloon1, 8)});
         gsap.to(balloon1, 0.3, {delay: 0.3, pixi: {alpha:1}});

         gsap.from(balloon7, 1.5, {delay: 0.4, pixi: {scale: 0.2, rotation: -25, x: 1450, y: 630}, onComplete: () => balloonAni(balloon7, 8)});
         gsap.to(balloon7, 0.3, {delay: 0.4, pixi: {alpha:1}});

         gsap.set(title1, {delay: 0.8, pixi: {alpha: 0, scaleX: 0.3, scaleY: 0.3}});
         gsap.from(title1, 1.2, {delay: 0.8, pixi: {y: '+=300'}, ease: Cubic.easeOut});
         gsap.to(title1, 1, {delay: 0.8, pixi: {scaleX: 1}, ease: Elastic.easeOut});
         gsap.to(title1, 1.3, {delay: 0.8, pixi: {scaleY: 1}, ease: Elastic.easeOut});
         gsap.to(title1, 0.3, {delay: 0.8, pixi: {alpha: 1}});

         gsap.set(title2, {delay: 0.8, pixi: {alpha: 0, scaleX: 0.3, scaleY: 0.3}});
         gsap.from(title2, 1.2, {delay: 1.2, pixi: {y: '+=300'}, ease: Cubic.easeOut});
         gsap.to(title2, 1, {delay: 1.2, pixi: {scaleX: 1}, ease: Elastic.easeOut});
         gsap.to(title2, 1.3, {delay: 1.2, pixi: {scaleY: 1}, ease: Elastic.easeOut});
         gsap.to(title2, 0.3, {delay: 1.2,alpha: 1});

         

         gsap.from(infoTxt, 0.6, {delay: 1.8, pixi: {y: '+=100'}, ease: Power2.easeOut});
         gsap.to(infoTxt, 0.6, {delay: 1.8, pixi: {alpha: 1}});
         gsap.to(startBtn, 0.6, {delay: 2, pixi: {y: 0, alpha: 1}, ease: Power2.easeOut});

      } else {
         charactor.alpha = 1;
         balloon1.alpha = 1;
         balloon2.alpha = 1;
         balloon3.alpha = 1;
         balloon4.alpha = 1;
         balloon5.alpha = 1;
         balloon6.alpha = 1;
         balloon7.alpha = 1;
         title1.alpha = 1;
         title2.alpha = 1;
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
            anchor={0.5}
            position={[1024, 640]}
            texture={resources.introBg.texture} />

         <Sprite 
            name="bgEffect" 
            anchor={0.5}
            alpha={0}
            position={[1024, 500]}
            texture={resources.introBgEffect.texture} />

         <Sprite 
            name="balloon1" 
            anchor={0.5}
            alpha={0}
            position={[834, 250]}
            texture={resources.introBalloon1.texture} />
         <Sprite 
            name="balloon2" 
            anchor={0.5}
            alpha={0}
            position={[236, 698]}
            texture={resources.introBalloon2.texture} />
         <Sprite 
            name="balloon3" 
            anchor={0.5}
            alpha={0}
            position={[444, 767]}
            texture={resources.introBalloon3.texture} />
         <Sprite 
            name="balloon5" 
            anchor={0.5}
            alpha={0}
            position={[1220, 504]}
            texture={resources.introBalloon5.texture} />
         <Sprite 
            name="balloon6" 
            anchor={0.5}
            alpha={0}
            position={[544, 492]}
            texture={resources.introBalloon6.texture} />
         <Sprite 
            name="balloon7" 
            anchor={0.5}
            alpha={0}
            position={[1738, 392]}
            texture={resources.introBalloon7.texture} />
         <Sprite 
            name="balloon4" 
            anchor={0.5}
            alpha={0}
            position={[1436, 574]}
            texture={resources.introBalloon4.texture} />

         

         <Sprite
            name="charactor"
            position={[1493, 554]}
            alpha={0}
            texture={resources.introCharactor.texture} />

         

         <Sprite
            name="title2"
            position={[1027, 610]}
            anchor={0.5}
            alpha={0}
            texture={resources.introTitle2.texture} />
         <Sprite
            name="title1"
            position={[1014, 395]}
            anchor={0.5}
            alpha={0}
            texture={resources.introTitle1.texture} />

         <StarLight 
            position={[780, 290]}
            scale={0.7}
            delay={1800}
            timeout={-1}
            noAnimation={gameData.lowQuality === 0 ? false : true} />

         <StarLight 
            position={[1050, 260]}
            scale={[-1, 1]}
            delay={1500}
            timeout={-1}
            noAnimation={gameData.lowQuality === 0 ? false : true} />

         <StarLight 
            position={[730, 530]}
            scale={[-0.5, 0.5]}
            delay={1500}
            timeout={-1}
            noAnimation={gameData.lowQuality === 0 ? false : true} />

         <StarLight 
            position={[1290, 300]}
            scale={0.6}
            delay={1800}
            timeout={-1}
            noAnimation={gameData.lowQuality === 0 ? false : true} />

         <Sprite name="infoTitle"
            position={[1024, 886]}
            texture={resources.introInfoText.texture}
            anchor={0.5}
            alpha={0} />
         
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
            // onTouchEnd={() => guideRef.current?.show()}
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
      </Container>
   );
}

export default memo(GameIntro, () => true);