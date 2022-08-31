import { FC, useEffect, useRef, useCallback, memo } from 'react';
import { Container, PixiRef, Sprite, _ReactPixi } from '@inlet/react-pixi';
import { Container as PIXIContainer, Sprite as PIXISprite } from 'pixi.js';
import { useDispatch, useSelector } from 'react-redux';
import useAssets from '../../../hooks/useAssets';
import PixiButton from '../PixiButton';
import { Sound } from '@pixi/sound';
import { isMobile, randomRange, toRadian } from '../../../utils';
import { gsap, Linear, Elastic, Power2, Back } from 'gsap';
import { GameActions, GameStatus } from '../../../stores/game/reducer';
import Guide, { Refs as GuideRefs } from '../Guide';




const IntroStar: FC<_ReactPixi.IContainer> = memo((props) => {

   const { resources } = useAssets();
   const container = useRef<PIXIContainer>(null);

   const moveStar = useCallback((idx: number, starCon: PIXIContainer, star: PIXISprite, delay: number) => {
      starCon.alpha = 0;
      starCon.scale.set(randomRange(20, 100) * 0.01);
      starCon.position.set(randomRange(-300, 300), 0);
      starCon.rotation = starCon.position.x > 0 ? toRadian(randomRange(0, 100)) : toRadian(randomRange(0, -100));
      star.y = 0;
      const speed = randomRange(300, 500)* 0.01;
      gsap.to(star, speed, {delay: delay, pixi: {y: `-=${randomRange(500, 700)}`}, ease: Linear.easeNone});
      gsap.to(starCon, 0.2, {delay: delay, pixi: {alpha: 1}});
      gsap.to(starCon, 0.5, {delay: delay + speed - 0.5, pixi: {alpha: 0}, onComplete: () => moveStar(idx, starCon, star, 0)});
   },[]);

   useEffect(() => {
      Array.from(Array(20), (k, i) => {
         const starCon = new PIXIContainer();
         const star = new PIXISprite(resources.introStar.texture);
         starCon.addChild(star);
         container.current?.addChild(starCon);
         moveStar(i, starCon, star, 0.1 * i + 0.3);
      });
   }, []);

   return (
      <Container 
         ref={container}
         name="introStar" 
         {...props} />
   );
}, () => true);



const GameIntro: FC = () => {

   const dispatch = useDispatch();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);
   const bgmAudio = useRef<Sound>();
   const guideRef = useRef<GuideRefs>(null);


   const onStartGame = useCallback(() => {
      gsap.globalTimeline.clear();
      dispatch({type: GameActions.CHANGE_STATUS, payload: GameStatus.GAME_START});
   }, []);

   
   const onBgmToggle = useCallback(( target, isToggle ) => {
      if(isToggle){
         bgmAudio.current?.play({loop: true, volume: 0.1});
      } else {
         bgmAudio.current?.pause();
      }
   }, []);


   useEffect(() => {

      bgmAudio.current = resources.audioBgm.sound;

      const shine = container.current!.getChildByName('shine', true);
      const light = container.current!.getChildByName('light', true);
      const pannel = container.current!.getChildByName('pannel', true);
      const charactor = container.current!.getChildByName('charactor', true);
      const dinos = container.current!.getChildByName('dinos', true);
      const dinosLeg = container.current!.getChildByName('dinosLeg', true);
      const title1_1 = container.current!.getChildByName('title1_1', true);
      const title1_2 = container.current!.getChildByName('title1_2', true);
      const title2 = container.current!.getChildByName('title2', true);
      const leaf1 = container.current!.getChildByName('leaf1', true);
      const leaf2 = container.current!.getChildByName('leaf2', true);
      const leaf3 = container.current!.getChildByName('leaf3', true);
      const leaf4 = container.current!.getChildByName('leaf4', true);
      const infoTxt = container.current!.getChildByName('infoTitle', true);
      const startBtn = container.current!.getChildByName('startBtnCon', true);

      if(gameData.lowQuality === 0) {

         gsap.to(shine, 0.6, {delay: 0.1, pixi: {alpha: 0.8}});
         gsap.to(light, 0.6, {delay: 0.1, pixi: {alpha: 0.7}, onComplete: () => {
            gsap.to(light, 0.1, {pixi: {alpha: 1}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         }});
         

         gsap.to(pannel, 0.2, {delay: 0.1, pixi: {alpha: 1}});
         gsap.to(pannel, 0.6, {delay: 0.1, pixi: {scale: 1}, ease: Back.easeOut.config(1.5)});
         
         gsap.set(leaf1, {pixi: { scale: 0, rotation: -40 }});
         gsap.to(leaf1, 0.3, { delay: 0.4, pixi: { alpha: 1}});
         gsap.to(leaf1, 0.8, { delay: 0.4, pixi: { rotation: 0, scale: 1}, ease: Elastic.easeOut.config(2, 0.8), onComplete: () => {
            gsap.to(leaf1, 0.6, {pixi: {rotation: 5}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         }});

         gsap.set(leaf2, {pixi: { scale: 0, rotation: 40 }});
         gsap.to(leaf2, 0.3, { delay: 0.4, pixi: { alpha: 1}});
         gsap.to(leaf2, 0.8, { delay: 0.4, pixi: { rotation: 0, scale: 1}, ease: Elastic.easeOut.config(2, 0.8), onComplete: () => {
            gsap.to(leaf2, 0.6, {pixi: {rotation: -5}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         }});

         gsap.set(leaf3, {pixi: { scale: 0, rotation: -40 }});
         gsap.to(leaf3, 0.3, { delay: 0.4, pixi: { alpha: 1}});
         gsap.to(leaf3, 0.8, { delay: 0.4, pixi: { rotation: 0, scale: 1}, ease: Elastic.easeOut.config(2, 0.8), onComplete: () => {
            gsap.to(leaf3, 0.6, {pixi: {rotation: 5}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         }});

         gsap.set(leaf4, {pixi: { scale: 0, rotation: 40 }});
         gsap.to(leaf4, 0.3, { delay: 0.4, pixi: { alpha: 1}});
         gsap.to(leaf4, 0.8, { delay: 0.4, pixi: { rotation: 0, scale: 1}, ease: Elastic.easeOut.config(2, 0.8), onComplete: () => {
            gsap.to(leaf4, 0.6, {pixi: {rotation: -5}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         }});


         gsap.set(dinos, {pixi: { y: '+=80' }});
         gsap.to(dinos, 0.3, { delay: 0.5, pixi: { alpha: 1}});
         gsap.to(dinos, 0.6, { delay: 0.5, pixi: { y: '-=80'}, ease: Elastic.easeOut.config(2, 0.8), onComplete: () => {
            gsap.to(dinos, 0.5, { pixi: { y: '-=8'}, yoyo: true, repeat: -1, ease: Linear.easeNone});
         }});

         gsap.set(dinosLeg, {pixi: { y: '-=15' }});
         gsap.to(dinosLeg, 0.3, { delay: 0.5, pixi: { y: '+=15', alpha: 1}});

         gsap.set(charactor, {pixi: { x: '+=200' }});
         gsap.to(charactor, 0.6, { delay: 0.3, pixi: { x: '-=200', alpha: 1}});

         gsap.set(title1_1, { pixi: { scale: 1.5 }});
         gsap.to(title1_1, 0.3, { delay: 1, pixi: {alpha: 1}});
         gsap.to(title1_1, 0.6, { delay: 1, pixi: {scale: 1}, ease: Elastic.easeOut.config(3, 1.5)});

         gsap.set(title1_2, { pixi: {  scale: 1.5 }});
         gsap.to(title1_2, 0.3, { delay: 1.2, pixi: {alpha: 1}});
         gsap.to(title1_2, 0.6, { delay: 1.2, pixi: { scale: 1 }, ease: Elastic.easeOut.config(3, 1.5)});

         gsap.set(title2, { pixi: { scale: 0}});
         gsap.to(title2, 0.3, { delay: 1.7, pixi: {alpha: 1}});
         gsap.to(title2, 0.6, { delay: 1.7, pixi: {scale: 1}, ease: Back.easeOut.config(3)});
         

         gsap.from(infoTxt, 0.6, {delay: 2, pixi: {y: '+=100'}, ease: Power2.easeOut});
         gsap.to(infoTxt, 0.6, {delay: 2, pixi: {alpha: 1}});
         gsap.to(startBtn, 0.6, {delay: 2.2, pixi: {y: 0, alpha: 1}, ease: Power2.easeOut});

      } else {
         shine.alpha = 1;
         light.alpha = 1;
         pannel.alpha = 1;
         pannel.scale.set(1);
         charactor.alpha = 1;
         dinos.alpha = 1;
         dinosLeg.alpha = 1;
         leaf1.alpha = 1;
         leaf2.alpha = 1;
         leaf3.alpha = 1;
         leaf4.alpha = 1;
         gsap.set(title1_1, { pixi: { scale: 1.5 }});
         gsap.to(title1_1, 0.3, { delay: 0.1, pixi: {alpha: 1}});
         gsap.to(title1_1, 0.6, { delay: 0.1, pixi: {scale: 1}, ease: Elastic.easeOut.config(3, 1.5)});

         gsap.set(title1_2, { pixi: {  scale: 1.5 }});
         gsap.to(title1_2, 0.3, { delay: 0.2, pixi: {alpha: 1}});
         gsap.to(title1_2, 0.6, { delay: 0.2, pixi: { scale: 1 }, ease: Elastic.easeOut.config(3, 1.5)});

         gsap.set(title2, { pixi: { scale: 0}});
         gsap.to(title2, 0.3, { delay: 0.7, pixi: {alpha: 1}});
         gsap.to(title2, 0.6, { delay: 0.7, pixi: {scale: 1}, ease: Back.easeOut.config(3)});
         

         gsap.from(infoTxt, 0.6, {delay: 1, pixi: {y: '+=100'}, ease: Power2.easeOut});
         gsap.to(infoTxt, 0.6, {delay: 1, pixi: {alpha: 1}});
         gsap.to(startBtn, 0.6, {delay: 1.2, pixi: {y: 0, alpha: 1}, ease: Power2.easeOut});
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

         <Sprite name="shine"
            position={[1015, 340]}
            texture={resources.introShine.texture}
            anchor={0.5}
            alpha={0} />

         <Sprite name="light"
            position={[1105, 528]}
            texture={resources.introLight.texture}
            anchor={[0.6, 0.8]}
            alpha={0} />

         <IntroStar 
            position={[1015, 340]} />

         <Sprite name="leaf1"
            position={[671, 606]}
            texture={resources.introLeaf1.texture}
            anchor={[1, 1]}
            alpha={0} />
         <Sprite name="leaf2"
            position={[661, 569]}
            texture={resources.introLeaf2.texture}
            anchor={[1, 0]}
            alpha={0} />
         <Sprite name="leaf3"
            position={[1370, 520]}
            texture={resources.introLeaf3.texture}
            anchor={[0, 0.9]}
            alpha={0} />
         <Sprite name="leaf4"
            position={[1382, 529]}
            texture={resources.introLeaf4.texture}
            anchor={[0, 0.1]}
            alpha={0} />

         <Sprite name="dinos"
            position={[965, 256]}
            texture={resources.introDinos.texture}
            anchor={[0.5, 0.5]}
            alpha={0} />

         <Sprite name="pannel"
            position={[980, 480]}
            texture={resources.introPannel.texture}
            anchor={0.5}
            alpha={0}
            scale={0} />

         <Sprite name="dinosLeg"
            position={[1047, 234]}
            texture={resources.introDinosLeg.texture}
            anchor={[0.5, 0.5]}
            alpha={0} />

         <Sprite name="title1_1"
            position={[864, 392]}
            texture={resources.introTitle1_1.texture}
            anchor={0.5}
            alpha={0} />
         <Sprite name="title1_2"
            position={[1190, 393]}
            texture={resources.introTitle1_2.texture}
            anchor={0.5}
            alpha={0} />
         <Sprite name="title2"
            position={[1017, 596]}
            texture={resources.introTitle2.texture}
            anchor={0.5}
            alpha={0} />

         <Sprite name="charactor"
            position={[1715, 886]}
            texture={resources.introCharactor.texture}
            anchor={0.5}
            alpha={0} />

         <Sprite name="infoTitle"
            position={[1024, 880]}
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