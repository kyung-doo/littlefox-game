import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Container, NineSlicePlane, PixiRef, Sprite, Text, _ReactPixi } from '@inlet/react-pixi';
import { Texture } from 'pixi.js';
import { gsap, Power1 } from 'gsap';
import { useSelector } from 'react-redux';
import useAssets from '../../../hooks/useAssets';



/*
* @ REFS
*     start: 전광판 시작
*     stop: 전광판 멈춤
*     nextSign: 다음 단어 표시
*     finish: 전광판 종료
*/
export interface Refs {
   start: (image: Texture, words: string[], correctIndex: number[]) => void;
   stop: () => void;
   nextSign: () => void;
   finish: (delay: number) => void;
}

const SignPannel = forwardRef<Refs, _ReactPixi.IContainer>((props, ref) => {
   
   const step: any = useSelector<any>(state => state.root.step);

   const { resources } = useAssets();

   const container = useRef<PixiRef<typeof Container>>(null);
   const onSign = useRef<PixiRef<typeof Container>>(null);

   const [image, setImage] = useState<Texture>();
   const [words, setWords] = useState<string[]>();
   const [signNum, setSignNum] = useState<number>(0);
   const [correctIndex, setCorrrectIndex] = useState<number[]>([]);


   const showWhite = useCallback(( idx: number ) => {
      if(step === 1) {
         return true;
      } else if(step === 2) {
         if(signNum === 0) {
            if(idx === correctIndex[1]) return false;
            else                        return true;
         } else {
            return true;
         }
      } else {
         if(idx <= signNum) return true;
         else               return false;
      }
   }, [signNum, correctIndex]);

   const showText = useCallback(( idx: number ) => {
      if(step === 1) {
         if(signNum > 0) {
            return true;
         } else {
            return correctIndex[0] !== idx;
         }
      } else if(step === 2) {
         if(signNum === 0) {
            if(idx === correctIndex[0] || idx === correctIndex[1]) return false;
            else                                                   return true;
         } else if(signNum === 1) {
            if(idx === correctIndex[1]) return false;
            else                        return true;
         } else {
            return true;
         }
      } else {
         if(idx < signNum) return true;
         else              return false;
      }
   }, [signNum, correctIndex]);

   const offSign = useCallback(() => {
      gsap.killTweensOf(onSign);
      onSign.current!.alpha = 0;
   },[]);


   useImperativeHandle(ref, () => ({
      start: (image, words, correctIndex) =>{
         setImage(image);
         setCorrrectIndex(correctIndex);
         setWords(words);
         setSignNum(0);
      },
      nextSign: () => {
         setSignNum(prefState => prefState+1);
      },
      stop: () => {
         gsap.killTweensOf(onSign.current!);
         onSign.current!.alpha = 0;
      },
      finish: (delay: number) => {
         gsap.to(container.current, 0.3, { delay: (delay+100) * 0.001, pixi: { alpha: 0 } });
         gsap.killTweensOf(onSign.current);
      }
   }));

   useEffect(() => {
      if(signNum === step) offSign();
   }, [signNum]);

   useEffect(() => {
      if(words) {
         onSign.current!.alpha = 1;
         gsap.to(onSign.current!, 0.5, { pixi: { alpha: 0 }, yoyo: true, repeat: -1, ease: Power1.easeIn});
         gsap.to(container.current, 0.3, { delay: 0.1, pixi: { alpha: 1 }});
      }
   }, [words]);
   
   
   return (
      <Container 
         ref={container}
         name="signPannel" 
         alpha={container.current ? container.current.alpha : 0}
         {...props}>
         <Container 
            name="singImage">
               <NineSlicePlane
                  texture={resources.mainRoundRect.texture}
                  leftWidth={13}
                  rightWidth={13}
                  width={272}
                  height={272} />
            {image && 
               <Sprite 
                  texture={image}
                  width={272}
                  height={272} />
            }
         </Container>
         {Array.from(Array(3), (k, i) => (
            <Container 
               key={`sing${i}`} 
               name={`sing${i}`}
               x={303 + 155 * i}>
               <NineSlicePlane
                  texture={resources.mainRoundRect.texture}
                  tint={0x0b1f33}
                  alpha={0.5}
                  leftWidth={13}
                  rightWidth={13}
                  width={131}
                  height={272} />
               <NineSlicePlane
                  texture={resources.mainRoundRect.texture}
                  leftWidth={13}
                  rightWidth={13}
                  width={131}
                  height={272}
                  visible={showWhite(i)} />
               <Text 
                  text={words ? words[i] : ''} 
                  anchor={0.5}
                  position={[65, 140]}
                  visible={showText(i)}
                  style={{
                     fontSize: 125,
                     fontFamily: 'LexendDeca-SemiBold',
                     fill: '#184eb2',
                     align: 'center'
                  }} />
            </Container>
         ))}
         <Container ref={onSign}>
            <Sprite 
               x={282 + 155 * correctIndex[signNum]}
               y={-20}
               texture={resources.mainSingOn.texture} />
         </Container>
      </Container>
   )
})

export default memo(SignPannel, () => true);