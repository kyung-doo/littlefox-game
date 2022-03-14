import { useEffect, useRef, VFC, memo } from 'react';
import { Container, _ReactPixi, Text, PixiRef } from "@inlet/react-pixi";
import { gsap, Back} from 'gsap';
import PIXITimeout from '../../utils/PIXITimeout';


/*
* @ PROPS
*     onAnimationEnd:  애니메이션 종료 콜백
*/
export interface Props extends _ReactPixi.IContainer {
   onAnimationEnd: () => void;
}

const GameoverText: VFC<Props> = ({onAnimationEnd, ...props}) => {

   const container = useRef<PixiRef<typeof Container>>(null);
   const timer = useRef<any>(null);

   useEffect(() => { 
      const con = container.current!;
      con.visible=true;
      con.scale.set(0);
      con.alpha = 0;
      gsap.to(con, 0.8, {
         pixi: {scale: 1, alpha:1}, 
         ease: Back.easeOut.config(2)
      });
      
      timer.current = PIXITimeout.start(() => onAnimationEnd(), 3000);

      return () => {
         PIXITimeout.clear(timer.current);
      }
   },[]);

   return (
      <Container 
         ref={container}
         visible={container.current ? container.current.visible : false }
         position={[1024, 500]}
         skew={[-0.2, 0]}
         name="timeoutTextCon" 
         {...props}>
         
         <Text 
            text="Game Over"
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
               letterSpacing: 8,
               strokeThickness: 35,
               dropShadow: true,
               dropShadowAngle: 1.5,
               dropShadowDistance: 8,
               dropShadowColor: '#08abcb'}} />

         <Text 
            text="Game Over"
            anchor={0.5}
            style={{
               fontSize: 127,
               fontFamily: 'Maplestory Bold',
               fontWeight: '600',
               fill: '#ff4958',
               align: 'center',
               lineJoin: "round",
               stroke: "#ffffff",
               letterSpacing: 8,
               strokeThickness: 15}} />

      </Container>
   );
}

export default memo(GameoverText, () => true);