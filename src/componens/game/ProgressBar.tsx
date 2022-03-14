import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import { Container, NineSlicePlane, PixiRef, _ReactPixi } from "@inlet/react-pixi";
import gsap from "gsap";
import useAssets from "../../hooks/useAssets";

/*
* @ REFS
*     update: 프로그레스바 넓이 업데이트
*     fast: 시간이 얼마 안 남았을때 fast 모드
*/
export interface Refs {
   update: (percent: number) => void;
   fast: () => void;
}


const ProgressBar = forwardRef<Refs, _ReactPixi.IContainer>(( props, ref ) => {

   const { resources } = useAssets();
   const barCon = useRef<PixiRef<typeof Container>>(null);
   const bar = useRef<PixiRef<typeof NineSlicePlane>>(null);

   useImperativeHandle(ref, () => ({
      update: ( percent ) => {
         bar.current!.width = (782 * (1-percent)) + 50;
      },
      fast: () => {
         bar.current!.texture = resources.commonProgressBar2.texture;
      }
   }));

   return (
      <Container name="progress" {...props}>
         <NineSlicePlane
            texture={resources.mainProgressBg.texture}
            leftWidth={30}
            rightWidth={30}
            width={844}
            height={68}/>
         <Container name="barCon" position={[7, 7]}>
            <Container ref={barCon} name="bar">
               <NineSlicePlane 
                  ref={bar}
                  texture={resources.commonProgressBar1.texture}
                  leftWidth={30}
                  rightWidth={30}
                  width={bar.current ? bar.current.width : 832}
                  height={53} />
            </Container>
         </Container>
      </Container>
   );
});

export default memo(ProgressBar, () => true);