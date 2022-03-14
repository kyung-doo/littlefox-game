import { useEffect, useRef, VFC, memo } from 'react';
import { Container, _ReactPixi, Text, PixiRef } from "@inlet/react-pixi";
import { useDispatch } from 'react-redux';
import { GameActions } from '../../stores/game/reducer';
import { gsap, Back, Power3} from 'gsap';
import PIXITimeout from '../../utils/PIXITimeout';


/*
* @ PROPS
*     bonusLength: 보너스 가중치
*     onAnimationEnd: 보너스 에니메이션 종료 콜백
*/
export interface Props extends _ReactPixi.IContainer {
   bonusLength: number;
   onAnimationEnd: () => void;
}


const BonusText: VFC<Props> = ({bonusLength, onAnimationEnd, ...props}) => {

   const dispatch = useDispatch();
   const container = useRef<PixiRef<typeof Container>>(null);
   const timer = useRef<any>(null);
   

   useEffect(() => { 
      const con = container.current!;
      con.visible=true;
      con.scale.set(0);
      con.alpha = 0;
      timer.current = PIXITimeout.start(() => con.children.forEach((child) => child.cacheAsBitmap = true), 1000);
      gsap.to(con, 0.8, {
         delay: 0.1, 
         pixi: {scale: 1, alpha:1}, 
         ease: Back.easeOut, 
         onComplete: () => {
            dispatch({type: GameActions.BONUS_SCORE, payload: bonusLength * 100 });
         }
      });

      gsap.to(con, 0.6, {
         delay: 1.2, 
         pixi: {scale: 1.2, alpha:0}, 
         ease: Power3.easeOut,
         onComplete: () => {
            onAnimationEnd();
         }
      });
      
      return () => {
         PIXITimeout.clear(timer.current);
      }

   },[]);

   return (
      <Container 
         ref={container}
         visible={container.current ? container.current.visible : false }
         skew={[-0.2, 0]}
         name="bonusTextCon" 
         {...props}>
         
         <Text 
            text={`${bonusLength} Bonus`}
            anchor={0.5}
            position={[4, 4]}
            style={{
               fontSize: 127,
               fontFamily: 'Maplestory Bold',
               fontWeight: '600',
               fill: '#21edff',
               align: 'center',
               lineJoin: "round",
               stroke: "#21edff",
               letterSpacing: 5,
               strokeThickness: 35,
               dropShadow: true,
               dropShadowAlpha: 0.3,
               dropShadowAngle: 1.5,
               dropShadowDistance: 8,
               dropShadowColor: '#000'}} />

         <Text 
            text={`${bonusLength} Bonus`}
            anchor={0.5}
            style={{
               fontSize: 127,
               fontFamily: 'Maplestory Bold',
               fontWeight: '600',
               fill: '#ff4958',
               align: 'center',
               lineJoin: "round",
               stroke: "#ffffff",
               letterSpacing: 5,
               strokeThickness: 15}} />

         <Text 
            text={`+${bonusLength * 100}`}
            anchor={0.5}
            position={[40, 150]}
            style={{
               fontSize: 61,
               fontFamily: 'Maplestory Bold',
               fontWeight: '600',
               fill: '#21edff',
               align: 'center',
               lineJoin: "round",
               stroke: "#21edff",
               letterSpacing: 5,
               strokeThickness: 35}} />

         <Text 
            text={`+${bonusLength * 100}`}
            anchor={0.5}
            position={[40, 150]}
            style={{
               fontSize: 61,
               fontFamily: 'Maplestory Bold',
               fontWeight: '600',
               fill: '#ff4958',
               align: 'center',
               lineJoin: "round",
               stroke: "#ffffff",
               letterSpacing: 5,
               strokeThickness: 15}} />

      </Container>
   );
}

export default memo(BonusText, () => true);