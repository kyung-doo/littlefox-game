import { FC, useEffect, useRef, useCallback, memo } from 'react';
import { Container, PixiRef, Sprite } from '@inlet/react-pixi';
import { useDispatch, useSelector } from 'react-redux';
import { Sprite as PIXISprite } from 'pixi.js';
import useAssets from '../../../hooks/useAssets';
import PixiButton from '../PixiButton';
import { Sound } from '@pixi/sound';
import { isMobile } from '../../../utils';
import { gsap, Linear, Cubic, Elastic, Power2 } from 'gsap';
import { GameActions, GameStatus } from '../../../stores/game/reducer';



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

   useEffect(() => {
      bgmAudio.current = resources.audioBgm.sound;
      const bgEffect = container.current?.getChildByName('bgEffect') as PIXISprite;
      const title1 = container.current?.getChildByName('title1') as PIXISprite;
      const title2 = container.current?.getChildByName('title2') as PIXISprite;
      const infoTxt = container.current!.getChildByName('infoTitle', true);
      const startBtn = container.current!.getChildByName('startBtnCon', true);

      if(gameData.lowQuality === 0) {
         gsap.to(bgEffect, 10, {pixi: {rotation: 360}, ease: Linear.easeNone, repeat: -1});

         gsap.set(title1, {pixi: {alpha: 0, scaleX: 0.3, scaleY: 0.3}});
         gsap.from(title1, 1.2, {pixi: {y: '+=200'}, ease: Cubic.easeOut});
         gsap.to(title1, 1, {pixi: {scaleX: 1}, ease: Elastic.easeOut});
         gsap.to(title1, 1.3, {pixi: {scaleY: 1}, ease: Elastic.easeOut});
         gsap.to(title1, 0.3, {alpha: 1});

         gsap.set(title2, {pixi: {alpha: 0, scaleX: 0.5, scaleY: 0.5}});
         gsap.from(title2, 1.2, {delay: 0.4, pixi: {y: '+=200'}, ease: Cubic.easeOut});
         gsap.to(title2, 1, {delay: 0.4, pixi: {scaleX: 1}, ease: Elastic.easeOut});
         gsap.to(title2, 1.3, {delay: 0.4, pixi: {scaleY: 1}, ease: Elastic.easeOut});
         gsap.to(title2, 0.3, {delay: 0.4,alpha: 1});

         gsap.to(bgEffect, 1, {delay: 0.5, pixi: {alpha: 0.75}});

         gsap.from(infoTxt, 0.6, {delay: 1.2, pixi: {y: '+=100'}, ease: Power2.easeOut});
         gsap.to(infoTxt, 0.6, {delay: 1.2, pixi: {alpha: 1}});
         
         gsap.to(startBtn, 0.6, {delay: 1.4, pixi: {y: 0, alpha: 1}, ease: Power2.easeOut});
      } else {
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
         {/* <Sprite 
            texture={resources.guide.texture}
            alpha={0.5} /> */}

         <Sprite 
            name="bgEffect" 
            anchor={0.5}
            alpha={0}
            position={[1024, 500]}
            texture={resources.introBgEffect.texture} />

         <Sprite 
            name="balloon1" 
            anchor={0.5}
            position={[834, 250]}
            texture={resources.introBalloon1.texture} />
         <Sprite 
            name="balloon2" 
            anchor={0.5}
            position={[236, 698]}
            texture={resources.introBalloon2.texture} />
         <Sprite 
            name="balloon3" 
            anchor={0.5}
            position={[444, 767]}
            texture={resources.introBalloon3.texture} />
         <Sprite 
            name="balloon5" 
            anchor={0.5}
            position={[1220, 504]}
            texture={resources.introBalloon5.texture} />
         <Sprite 
            name="balloon6" 
            anchor={0.5}
            position={[544, 492]}
            texture={resources.introBalloon6.texture} />
         <Sprite 
            name="balloon7" 
            anchor={0.5}
            position={[1738, 392]}
            texture={resources.introBalloon7.texture} />
         <Sprite 
            name="balloon4" 
            anchor={0.5}
            position={[1436, 574]}
            texture={resources.introBalloon4.texture} />

         

         <Sprite
            name="charactor"
            position={[1493, 554]}
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