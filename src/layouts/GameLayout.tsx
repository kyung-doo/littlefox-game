import { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Container, PixiRef, Stage } from '@inlet/react-pixi';
import { Application, settings } from 'pixi.js';
import * as PIXI from "pixi.js";
import { sound } from '@pixi/sound';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/all';
import { PixiPlugin } from "gsap/all";
import CommonLayout from './CommonLayout';
import { getCookie, isMobile } from '../utils';
import ResultPopup from '../componens/game/ResultPopup';
import PIXITimeout from '../utils/PIXITimeout';

import '../assets/scss/game-common.scss';

gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);
PIXITimeout.register(PIXI.Ticker.shared);

settings.RESOLUTION = window.devicePixelRatio;
settings.FILTER_RESOLUTION = window.devicePixelRatio;
PixiPlugin.registerPIXI(PIXI);

// pixi chrome debug
if(process.env.NODE_ENV === 'development') {
   (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&  (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
}


/*
* @ PROPS
*     type: 게임 종류
*     title: 게임 타이틀
*     stage: 게임 스테이지 숫자
*     step: 게임 스텝 숫자
*     resultPopupData: 결과 팝업 데이터
*     onLoaded: HTTP통신 로드완료 콜백
*     onCloseResultPopup: 결과 팝업 닫은 후 콜백
*/
export interface Props {
   type: string;
   title: string;
   stage: number;
   step?: number;
   resultPopupData: any;
   onLoaded: (gameData: any) => void;
   onCloseResultPopup: () => void;
}

const CONTENT_WIDTH = 2048;
const CONTENT_HEIGHT = 1280;


const GameLayout: FC<Props> = ({ children, type, title, stage, step, resultPopupData, onLoaded, onCloseResultPopup }) => {
   
  
   const [gameData, setGameData] = useState<any>();
   const container = useRef<PixiRef<typeof Container>>(null);

   const resizeApp = useCallback((app: Application) => {
      if(container.current) {
         app.renderer.view.width = window.innerWidth;
         app.renderer.view.height = CONTENT_HEIGHT * window.scale;
         gsap.set(app.renderer.view, { top: (window.innerHeight - (CONTENT_HEIGHT * window.scale)) / 2});
         app.renderer.resize(window.innerWidth, CONTENT_HEIGHT * window.scale);
         container.current.position.x = (window.innerWidth - (CONTENT_WIDTH * window.scale)) / 2;
         container.current.scale.x = window.scale;
         container.current.scale.y = window.scale;
      }
   }, []);

   const onVisibleChange = useCallback(( e ) => {
      if(document.hidden) {
         sound.pauseAll();
      } else {
         sound.resumeAll();
      }
   }, []);

   const onMountApp = useCallback(( app: Application ) => {
      resizeApp(app);
      window.addEventListener('resize', () => setTimeout(() => resizeApp(app)));
      window.addEventListener('orientationchange', () => setTimeout(() => resizeApp(app), 100));
      document.addEventListener('visibilitychange', onVisibleChange);
   }, []);
   

   useLayoutEffect(() => {
      let s = step;
      if(s === undefined) s = 1;
      let path = '';
      if (window.isTestAPI) {
         if(step !== undefined)  path = `/game${type}Step${s}`;
         else                    path = `/game${type}`;
      }
      else {
         let t = type.toLowerCase();
         if(t === 'words') t = 'word';
         path = `/game/${t}/play`;
      }
      window.http
      .get(path, { params: { stage: stage, step: step, fu_id: getCookie('fu_id'), langCode: getCookie('lang_code') }})
      .then(({ data }) => {
         setGameData(data.data);
      });
   }, []);

   useEffect(() => {
      if(gameData){
         onLoaded(gameData);
      }
   },[gameData]);

   return (
      <HelmetProvider>
         <Helmet>
            <title>{title}</title>
         </Helmet>
         <Stage 
            onMount={onMountApp} 
            width={CONTENT_WIDTH}
            height={CONTENT_HEIGHT}
            options={{
               backgroundColor: 0x000000, 
               useContextAlpha: false,
               antialias: false, 
               autoDensity: true,
               resolution: !isMobile() ? 2 : window.devicePixelRatio 
            }}>
            <Container ref={container}>{children}</Container>
         </Stage>
         <CommonLayout
            contentWidth={CONTENT_WIDTH}
            contentHeight={CONTENT_HEIGHT}
            disabled={!resultPopupData ? true : false}>
            <div id="content">
               {resultPopupData && 
                  <ResultPopup 
                     data={resultPopupData} 
                     type={type} 
                     step={step ? step : 1}
                     onClose={onCloseResultPopup} />
               }
            </div>
         </CommonLayout>
      </HelmetProvider>
   )
}

export default GameLayout;