import { FC, useCallback, useEffect, useRef, memo } from 'react';
import { Container, PixiRef, Sprite } from "@inlet/react-pixi";
import { Sprite as PIXISprite, Container as PIXIContainer } from 'pixi.js';
import { useDispatch, useSelector } from 'react-redux';
import { GameActions, GameStatus } from '../../../stores/game/reducer';
import { gsap, Back, Cubic, Linear, Power2 } from 'gsap';
import PixiButton from '../PixiButton';
import { Sound } from '@pixi/sound';
import { isMobile } from '../../../utils';
import useAssets from '../../../hooks/useAssets';
import Guide, { Refs as GuideRefs } from '../Guide';



const GameIntro: FC = () => {
   const dispatch = useDispatch();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const { resources } = useAssets();

   const bgmAudio = useRef<Sound>();
   const container = useRef<PixiRef<typeof Container>>(null);
   const guideRef = useRef<GuideRefs>(null);



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

      const mainTitle1 = container.current!.getChildByName('mainTitle1', true) as PIXISprite;
      const mainTitle2 = container.current!.getChildByName('mainTitle2', true) as PIXISprite;
      const subTitleCon = container.current!.getChildByName('subTitles', true) as PIXIContainer;
      const subTitleBg = container.current!.getChildByName('subTitleBg', true) as PIXISprite;
      const charactor = container.current!.getChildByName('charactor', true) as PIXISprite;
      const musicIcon1 = container.current!.getChildByName('musicIcon1', true) as PIXISprite;
      const musicIcon2 = container.current!.getChildByName('musicIcon2', true) as PIXISprite;
      const leftHighLigt1 = container.current!.getChildByName('leftHighLigt1', true) as PIXISprite;
      const leftHighLigt2 = container.current!.getChildByName('leftHighLigt2', true) as PIXISprite;
      const rightHighLigt1 = container.current!.getChildByName('rightHighLigt1', true) as PIXISprite;
      const rightHighLigt2 = container.current!.getChildByName('rightHighLigt2', true) as PIXISprite;
      const infoTxt = container.current!.getChildByName('infoTitle', true);
      const startBtn = container.current!.getChildByName('startBtnCon', true);

      if(gameData.lowQuality === 0) {
         
         gsap.to(mainTitle1, 0.3, {delay: 0.5, pixi: { alpha: 1}});
         gsap.from(mainTitle1, 0.7, {delay: 0.5, pixi: { scale: 0, y: '+=200'}, ease: Back.easeOut});
         gsap.to(mainTitle2, 0.3, {delay: 0.8, pixi: { alpha: 1}});
         gsap.from(mainTitle2, 0.7, {delay: 0.8, pixi: { scale: 0, y: '+=200'}, ease: Back.easeOut});

         gsap.from(subTitleCon, 0.8, {delay: 1.4, pixi: { scale: 0.7, y: '+=100' }, ease: Back.easeOut});
         gsap.to(subTitleBg, 1, {delay: 1.4, pixi: { alpha: 1 }});
         const nums1 = [0, 2, 1];
         const nums2 = [1, 0, 2];
         Array.from(Array(6), (k,i) => {
            const subTitle = container.current!.getChildByName(`subTitle${i+1}`, true) as PIXISprite;
            let num1 = nums1[i%3]+0.1*i;
            let num2 = nums2[i%3]+0.1*i;
            gsap.to(subTitle, 0.6, {delay: 1.4, pixi: { alpha: 1, brightness: 1 }, ease: Linear.easeNone});
            gsap.to(subTitle, 0.3, {delay: 0.2 * num1 + 1.8, pixi: { alpha: 0.2, brightness: 2 }, ease: Linear.easeNone});
            gsap.to(subTitle, 0.3, {delay: 0.2 * num1 + 2, pixi: { alpha: 1, brightness: 1 }, ease: Linear.easeNone});
            gsap.to(subTitle, 0.3, {delay: 0.2 * num2 + 2.2, pixi: { alpha: 0.5, brightness: 1.5 }, ease: Linear.easeNone});
            gsap.to(subTitle, 0.3, {delay: 0.2 * num2 + 2.4, pixi: { alpha: 1, brightness: 1 }, ease: Linear.easeNone});
         });

         gsap.to(charactor, 0.3, {delay: 0.1, pixi: { alpha: 1}});
         gsap.from(charactor, 1, {delay: 0.1, pixi: { x: '+=200'}, ease: Cubic.easeOut});
         gsap.to(musicIcon1, 0.3, {delay: 0.2, pixi: { alpha: 1}});
         gsap.to(musicIcon2, 0.3, {delay: 0.2, pixi: { alpha: 1}});
         gsap.from(musicIcon1, 1, {delay: 0.1, pixi: { x:'+=100'}, ease: Cubic.easeOut});
         gsap.from(musicIcon2, 1, {delay: 0.1, pixi: { x:'+=100'}, ease: Cubic.easeOut});
         gsap.to(musicIcon1, 0.6, {pixi: { y: '-=15'}, yoyo: true, repeat: -1, ease: Linear.easeIn});
         gsap.to(musicIcon2, 0.6, {pixi: { y: '+=10'}, yoyo: true, repeat: -1, ease: Linear.easeIn});

         gsap.from(infoTxt, 0.6, {delay: 2, pixi: {y: '+=100'}, ease: Power2.easeOut});
         gsap.to(infoTxt, 0.6, {delay: 2, pixi: {alpha: 1}});
         gsap.to(startBtn, 0.6, {delay: 2.2, pixi: {y: 0, alpha: 1}, ease: Power2.easeOut});

         gsap.to(leftHighLigt1, 1.5, {delay:0.1, pixi: {rotation: '-=5'}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         gsap.to(rightHighLigt1, 1.5, {delay:0.2, pixi: {rotation: '+=5'}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         gsap.to(leftHighLigt2, 1.5, {delay:0.3, pixi: {rotation: '+=5'}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         gsap.to(rightHighLigt2, 1.5, {delay: 0.4, pixi: {rotation: '-=5'}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         gsap.to([leftHighLigt1, rightHighLigt1, leftHighLigt2, rightHighLigt2], 0.2, {pixi: {brightness: 1.5}, yoyo: true, repeat: -1, ease: Linear.easeNone});
      } else {
         mainTitle1.alpha = 1;
         mainTitle2.alpha = 1;
         subTitleBg.alpha = 1;
         Array.from(Array(6), (k,i) => {
            const subTitle = container.current!.getChildByName(`subTitle${i+1}`, true) as PIXISprite;
            subTitle.alpha=1;
         });
         charactor.alpha = 1;
         infoTxt.alpha = 1;
         startBtn.alpha = 1;
         startBtn.position.y = 0;
         musicIcon1.alpha = 1;
         musicIcon2.alpha = 1;
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
         <Sprite 
            name="leftHighLigt1" 
            texture={resources.introHightlight1.texture}
            anchor={[0, 0.1]}
            position={[-50, 0]} />
         <Sprite 
            name="leftHighLigt2" 
            texture={resources.introHightlight2.texture}
            anchor={[0, 0.1]}
            position={[-100, 100]} />
         <Sprite 
            name="rightHighLigt1" 
            texture={resources.introHightlight1.texture}
            anchor={[0, 0.1]}
            scale={[-1, 1]}
            position={[2098, 0]} />
         <Sprite 
            name="rightHighLigt2" 
            texture={resources.introHightlight2.texture}
            anchor={[0, 0.1]}
            scale={[-1, 1]}
            position={[2168, 100]} />

         <Container name="mainTitles">
            <Sprite 
               name="mainTitle1" 
               texture={resources.introMainTitle1.texture}
               anchor={[1, 0.5]}
               position={[967, 373]}
               alpha={0} />
            <Sprite 
               name="mainTitle2" 
               texture={resources.introMainTitle2.texture}
               anchor={[0, 0.5]}
               position={[977, 375]}
               alpha={0} />
         </Container>

         <Container name="subTitles" position={[1024, 540]}>
            <Sprite 
               name="subTitleBg" 
               texture={resources.introSubTitleBg.texture}
               position={[-312, -114]}
               alpha={0} />
            <Sprite 
               name="subTitle1" 
               texture={resources.introSubTitle1.texture}
               position={[-274, -63]}
               alpha={0} />
            <Sprite 
               name="subTitle2" 
               texture={resources.introSubTitle2.texture}
               position={[-134, -37]}
               alpha={0} />
            <Sprite 
               name="subTitle3" 
               texture={resources.introSubTitle3.texture}
               position={[-44, -75]}
               alpha={0} />
            <Sprite 
               name="subTitle4" 
               texture={resources.introSubTitle4.texture}
               position={[6, -38]}
               alpha={0} />
            <Sprite 
               name="subTitle5" 
               texture={resources.introSubTitle5.texture}
               position={[96, -75]}
               alpha={0} />
            <Sprite 
               name="subTitle6" 
               texture={resources.introSubTitle6.texture}
               position={[180, -30]}
               alpha={0} />
         </Container>


         
         <Sprite 
            name="musicIcon1" 
            texture={resources.introMusicIcon1.texture}
            position={[1821, 798]}
            alpha={0} />
         <Sprite 
            name="musicIcon2" 
            texture={resources.introMusicIcon2.texture}
            position={[1878, 786]}
            alpha={0} />
         <Sprite 
            name="charactor" 
            texture={resources.introCharactor.texture}
            position={[1421, 536]}
            alpha={0} />

         <Sprite name="infoTitle"
            position={[1024, 895]}
            texture={resources.introInfoText.texture}
            anchor={0.5}
            alpha={0} />

         <Container name="startBtnCon" position={[0, 300]}>
            <PixiButton 
               position={[819, 1045]}
               defaultTexture={resources.introStartBtnDefault.texture}
               sound={resources.audioClick.sound}
               hover={{active: true, texture: resources.introStartBtnHover.texture}}
               onTouchEnd={onStartGame} />
         </Container>

         <PixiButton
            name="infoBtn"
            anchor={[0, 1]}
            position={[41, 1244]}
            scale={isMobile() ? 1.5 : 1}
            defaultTexture={resources.introInfoBtn.texture}
            sound={resources.audioClick.sound}
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