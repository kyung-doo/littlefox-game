import { memo, useCallback, useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { Container, Sprite, _ReactPixi, Text, PixiRef } from "@inlet/react-pixi";
import { Sprite as PIXISprite, Texture } from 'pixi.js';
import { Sprite3d as PIXISprite3d, Container3d as PIXIContainer3d } from 'pixi-projection';
import Container3d from "../pixi-projection/Container3d";
import Sprite3d from "../pixi-projection/Sprite3d";
import { gsap, Expo, Cubic, Back, Linear } from "gsap";
import { toRadian } from "../../../utils";
import PIXITimeout from "../../../utils/PIXITimeout";
import useAssets from "../../../hooks/useAssets";


/*
* @ PORPS
*     posX: 과녁 위치
*/
export interface Props {
   posX?: number;
}


/*
* @ REFS
*     start: 과녁 시작
*     flipDown: 과녁 뒤집어짐
*     flipUp: 과녁 원위치
*     flipWrong: 오답 시 과녁 튕김
*/
export interface Refs {
   start: (data: {[key: string]: any}) => void;
   flipDown: (type: '' | 'timeout' | 'correct' | 'bonus') => void;
   flipUp: () => void;
   flipWrong: () => void;
}


const ShootTarget = forwardRef<Refs, Props>(({ posX = 0 }, ref) => {

   const { resources } = useAssets();

   const pannel = useRef<PIXIContainer3d>(null);
   const pannelFront = useRef<PIXISprite3d>(null);
   const pannelBack = useRef<PIXISprite3d>(null);
   const bottom = useRef<PixiRef<typeof Sprite>>(null);
   const text = useRef<PixiRef<typeof Text>>(null);
   const hartCon = useRef<PixiRef<typeof Container>>(null);

   const isFlip = useRef<boolean>(false);
   const [word, setWord] = useState<any>();
   const timer = useRef<any[]>([]);



   const start = useCallback(( data ) => {
      setWord(data.word);
      timer.current[0] = PIXITimeout.start(() => flipUp(), 300);
   }, []);


   const flipDown = useCallback(( type ) => {
      if(isFlip.current || !pannel.current) return;
      if(type !== '') {
         const speed = (type === 'correct' || type === 'bonus') ? 0.5 : 0.4;
         gsap.to(pannel.current.euler, speed, {
            x: -Math.PI/1.8, 
            ease: (type === 'correct' || type === 'bonus') ? Back.easeOut : Expo.easeOut
         });
      } else {
         pannel.current.euler.x = -Math.PI/1.8;
      }

      const func = () => {
         pannel.current!.zIndex = 1;
         bottom.current!.zIndex = 2;
         pannelFront.current!.visible = false;
         pannelBack.current!.visible = true;
         text.current!.visible = false;

         if(type !== '') {
            gsap.to(pannel.current!.position3d, 0.1, {
               y: -18, 
               ease: Expo.easeOut
            });
         } else {
            pannel.current!.position3d.y = -18;
         }

         if(type === 'correct' || type === 'bonus') {
            showHart(type === 'correct' ? resources.mainHart.texture : resources.mainBonusHart.texture);
         }
      }

      if(type !== '') {
         timer.current[1] = PIXITimeout.start(func, 150); 
      } else {
         func();  
      }
      isFlip.current = true;
   }, []);


   const flipUp = useCallback(() => {
      gsap.to(pannel.current!.euler, 0.8, {
         x: 0, 
         ease: Cubic.easeOut
      });
      timer.current[2] = PIXITimeout.start(() => {
         pannel.current!.zIndex = 2;
         bottom.current!.zIndex = 1;
         pannelFront.current!.visible = true;
         pannelBack.current!.visible = false;
         text.current!.visible = true;
         gsap.to(pannel.current!.position3d, 0.1, {
            y: 0, 
            ease: Expo.easeOut
         });
      }, 10);
      isFlip.current = false;
   }, []);


   const flipWrong = useCallback(() => {
      gsap.to(pannel.current!.euler, 0.1, {
         x: -Math.PI/8, 
         ease: Linear.easeIn
      });
      gsap.to(pannel.current!.euler, 0.1, {
         delay: 0.1,
         x: 0, 
         ease: Linear.easeOut
      });
   }, []);


   const showHart = useCallback(( texture: Texture ) => {

      const hart1 = hartCon.current!.getChildByName('hart1') as PIXISprite;
      const hart2 = hartCon.current!.getChildByName('hart2') as PIXISprite;
      const hart3 = hartCon.current!.getChildByName('hart3') as PIXISprite;

      hart1.texture = texture;
      hart2.texture = texture;
      hart3.texture = texture;   

      hart1.position.set(-40, -25);
      hart1.rotation = toRadian(-12);
      hart2.position.set(40, -50);
      hart2.rotation = toRadian(15);
      hart2.scale.set(0.8);
      hart3.position.set(10, -100);
      hart3.rotation = toRadian(-10);
      hart3.scale.set(0.5);
      hart1.alpha = hart2.alpha = hart3.alpha = 0;
      hartCon.current!.visible = true;

      gsap.to(hart1, 0.3, { pixi: {alpha: 1} });
      gsap.to(hart1, 0.3, { delay: 0.4, pixi: { alpha: 0 }, ease: Linear.easeNone });
      gsap.to(hart2, 0.3, { delay: 0.1, pixi: {alpha: 1}, ease: Linear.easeNone });
      gsap.to(hart2, 0.3, { delay: 0.5, pixi: { alpha: 0 },  ease: Linear.easeNone });
      gsap.to(hart3, 0.3, { delay: 0.2, pixi: {alpha: 1}, ease: Linear.easeNone });
      gsap.to(hart3, 0.3, { delay: 0.6, pixi: { alpha: 0 }, ease: Linear.easeNone });

      gsap.from(hart1, 0.8, { pixi: {x: '+=20', y:'+=50', scale: '-=0.2'}, ease: Linear.easeNone });
      gsap.from(hart2, 0.8, { delay: 0.1, pixi: {x: '-=10', y:'+=50', scale: '-=0.2'}, ease: Linear.easeNone});
      gsap.from(hart3, 0.8, { delay: 0.2, pixi: {y:'+=50', scale: '-=0.2'}, ease: Linear.easeNone });
      
   },[]);
   


   useImperativeHandle(ref, () => ({
      start: start,
      flipDown: flipDown,
      flipUp: flipUp,
      flipWrong: flipWrong
   }));


   useEffect(() => {
      flipDown('');
      pannel.current!.visible = true
      return () => {
         timer.current.forEach(t => PIXITimeout.clear(t));
      }
   }, []);


   return (
      <Container3d 
         anchor={[0.5, 1]}
         position3d={{x: posX, y: 115, z: 0}}
         sortableChildren={true} >

         <Sprite
            anchor={[0.5, 1]}
            y={40}
            texture={resources.mainShootTargetShadow.texture} />
         <Sprite
            ref={bottom}
            anchor={[0.5, 1]}
            y={32}
            texture={resources.mainShootTargetBottom.texture} />
         <Container3d
            ref={pannel}
            visible={pannel.current ? pannel.current.visible : false}
            anchor={[0.5, 1]}>
            <Sprite3d 
               ref={pannelFront}
               anchor={[0.5, 1]}
               texture={resources.mainShootTargetPannel.texture} />
            <Sprite3d 
               ref={pannelBack}
               visible={pannelBack.current ? pannelBack.current.visible : false}
               anchor={[0.5, 1]}
               texture={resources.mainShootTargetBack.texture} />
            <Text 
               ref={text}
               text={word ? word : ''} 
               anchor={0.5}
               y={-85}
               style={{
                  fontSize: 86,
                  fontFamily: 'LexendDeca-SemiBold',
                  fill: '#184eb2',
                  align: 'center'
               }} />
         </Container3d>

         <Container 
            ref={hartCon}
            name="hartCon"
            visible={hartCon.current ? hartCon.current.visible : false}
            y={-50}>
            <Sprite 
               name="hart1"
               anchor={[0.5, 1]}
               texture={resources.mainHart.texture} />
            <Sprite 
               name="hart2"
               anchor={[0.5, 1]}
               texture={resources.mainHart.texture} />
            <Sprite 
               name="hart3"
               anchor={[0.5, 1]}
               rotation={toRadian(-10)}
               texture={resources.mainHart.texture} />
         </Container>

      </Container3d>
   );
})

export default memo(ShootTarget, () => true);