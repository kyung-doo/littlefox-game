import { FC, ReactElement, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import CommonLayout from './CommonLayout';
import { StudyActions, StudyStatus } from '../stores/study/reducer';
import { Transition  } from 'react-transition-group';
import { gsap, Cubic, Power2, Back, Linear } from 'gsap';
import { sound } from '@pixi/sound';
import Ripples from 'react-ripples';
import { getCookie, addClass, makeRandom, removeClass } from '../utils';

import Draggable from "gsap/Draggable";
import { MotionPathPlugin } from 'gsap/all';
import { Sound } from '@pixi/sound';

gsap.registerPlugin(Draggable);
gsap.registerPlugin(MotionPathPlugin);


const CONTENT_WIDTH = 960;
const CONTENT_HEIGHT = 600;


/*
* @ PROPS
*     title: 학습 타이틀
*     stage: 학습 스테이지 숫자
*     type: 학습 종류
*     studyElem: 학습 jsx element
*/
export interface Prors {
   title: string;
   stage: number;
   type: string;
   studyElem: (idx: number) => ReactElement;
   showGameBtn?: boolean;
}

const StudyLayout: FC<Prors> = ({ title, stage, type, studyElem, showGameBtn }) => {

   const dispatch = useDispatch();
   const studyData: any = useSelector<any>(state => state.studyData);
   const status: any = useSelector<any>(state => state.status);
   const currentPage: any = useSelector<any>(state => state.currentPage);
   const totalPage: any = useSelector<any>(state => state.totalPage);
   const clearPages: any = useSelector<any>(state => state.clearPages);

   const introRef = useRef<HTMLDivElement>(null);
   const studyRef = useRef<HTMLDivElement>(null);
   const listConRef = useRef<HTMLDivElement>(null);
   const listRef = useRef<Array<HTMLDivElement>>([]);
   const resultRef = useRef<HTMLDivElement>(null);
   const clickAudio = useRef<Sound>();
   const goodJobAudio = useRef<Sound>();
   const clapAudio = useRef<Sound>();
   const prevPage = useRef<number>(1);
   const indexAr = useRef<number[]>([]);
   


   const onClickStart = useCallback(( e ) => {
      clickAudio.current!.play();
      addClass(introRef.current?.querySelector('.start-btn')?.parentElement, 'disable');
      
      if((type==='Alphabet' && studyData.reStudy === 0) || (type==='LetterTeams' && studyData.reStudy === 0)) {
         indexAr.current = Array.from(Array(totalPage)).map((x,i) => i);
      } else {
         indexAr.current = makeRandom(totalPage, totalPage);
      }

      removeClass(listRef.current[getIndex(0)], 'hidden');
      dispatch({ type: StudyActions.SET_ACTIVE_INDEX, payload: getIndex(currentPage - 1)});
      setTimeout(() => {
         dispatch({ type: StudyActions.CHANGE_STATUS, payload: StudyStatus.START });
      },500);
   }, [totalPage]);

   const onIntroExit = useCallback(() => {
      gsap.to(introRef.current, 0.3, {opacity: 0, ease: Cubic.easeInOut});
      setTimeout(() => {
         const titleBar = studyRef.current!.querySelector('.title-bar');
         const textCon = titleBar!.querySelector('.text-con');
         const pageCon = titleBar!.querySelector('.page-con');
         gsap.to(titleBar, 0.6, {force3D: true, height: 85, ease: Cubic.easeInOut});
         gsap.from(textCon, 0.6, {force3D: true, y: 50, ease: Cubic.easeInOut});
         gsap.from(pageCon, 0.6, {force3D: true, y: 50, ease: Cubic.easeInOut});
      }, 100);
   }, []);

   const onIntroExited = useCallback(() => {
      dispatch({ 
         type: StudyActions.CHANGE_STATUS, 
         payload: StudyStatus.STUDY_START
      });
   }, []);

   const onPrevPage = useCallback(( e ) => {
      if(currentPage > 0) {
         clickAudio.current!.play();
         setTimeout(()=>{
            dispatch({ type: StudyActions.SET_CURRENT_PAGE, payload: currentPage - 1});
            dispatch({ type: StudyActions.SET_ACTIVE_INDEX, payload: getIndex(currentPage - 2)});
            dispatch({ type: StudyActions.CHANGE_STATUS, payload: StudyStatus.STUDY_TRANSITION });
         });
      }
   },[currentPage, totalPage]);

   const onNextPage = useCallback(( e ) => {
      if(currentPage < totalPage) {
         clickAudio.current!.play();
         setTimeout(()=>{
            dispatch({ type: StudyActions.SET_CURRENT_PAGE, payload: currentPage + 1});
            dispatch({ type: StudyActions.SET_ACTIVE_INDEX, payload: getIndex(currentPage)});
            dispatch({ type: StudyActions.CHANGE_STATUS, payload: StudyStatus.STUDY_TRANSITION });
         });
      } else {
         let path = '';
         if (window.isTestAPI) {
            path = `/study${type}/history`;
         }
         else {
            let t = type.toLowerCase();
            if(t === 'words') t = 'word';
            path = `/game/${t}/history`;
         }
         if(studyData.reStudy === 0) {
            window.http
            .get(path, { params: {fu_id: studyData.fu_id, play_type: 'P', stage: stage }})
            .then((data) => console.log(data));
         }
         dispatch({ type: StudyActions.CHANGE_STATUS, payload: StudyStatus.RESULT });
      }
   },[currentPage, totalPage]);
   

   const onResultEnter = useCallback(() => {
      const title = resultRef.current?.querySelector('.good-job') as HTMLDivElement;
      const deco = resultRef.current?.querySelector('.deco') as HTMLDivElement;
      const circle = resultRef.current?.querySelector('.circle') as HTMLDivElement;
      const charactor = resultRef.current?.querySelector('.charactor') as HTMLDivElement;
      const star1 = resultRef.current?.querySelector('.star1') as HTMLDivElement;
      const star2 = resultRef.current?.querySelector('.star2') as HTMLDivElement;
      const star3 = resultRef.current?.querySelector('.star3') as HTMLDivElement;

      
      removeClass(title, 'hidden');
      removeClass(deco, 'hidden');
      removeClass(circle, 'hidden');
      removeClass(charactor, 'hidden');
     
      
      gsap.set(title!, {opacity: 0, force3D:true, scaleX:0, scaleY: 0});
      gsap.set(deco!, {force3D:true, scaleX: 0.5, scaleY: 0.5, opacity: 0});
      gsap.set(circle!, {opacity: 0, force3D:true, scaleX:0.2, scaleY: 0.2});
      gsap.set(charactor!, {force3D:true, y:300, rotation: -50});
      const btn = resultRef.current?.querySelector('.restudy-btn') as HTMLButtonElement;
      gsap.set(btn!, {opacity: 0});
      let btn2: HTMLButtonElement;
      if(showGameBtn){
         btn2 = resultRef.current?.querySelector('.game-btn') as HTMLButtonElement;
         gsap.set(btn2, {opacity: 0});
      }
      gsap.set(resultRef.current, {opacity: 0});

      gsap.to(resultRef.current, 0.6, {opacity: 1});
      gsap.to(title!, 0.6, {delay: 0.5, scaleX: 1, scaleY: 1, opacity:1, ease: Back.easeOut.config(2), onComplete: ()=> {
         title!.style.transform = '';
         title!.style.willChange = 'transform';
      }});
      gsap.to(deco!, 1, {delay: 1.2, scaleX: 1, scaleY: 1, opacity:1, ease: Back.easeOut.config(1.5), onComplete: ()=> {
         deco!.style.transform = '';
      }});
      gsap.to(circle!, 0.6, {delay: 0.8, force3D:true, scaleX: 1, scaleY:1, opacity: 1, ease: Back.easeOut.config(2)});
      gsap.to(charactor!, 0.5, {delay: 1.2, force3D:true, y: 0, rotation:0, ease: Back.easeOut.config(1.2), onComplete: ()=>{
         removeClass(btn, 'disable');
         gsap.to(btn!, 0.6, {opacity: 1});
         if(showGameBtn){
            removeClass(btn2, 'disable');
            gsap.to(btn2, 0.6, {opacity: 1});
         }
         gsap.to(charactor!, 0.5, {delay: 0.1, scale: 1.03, repeat: -1, yoyo: true, ease: Linear.easeNone});
      }});
      gsap.set(star1!, {x: 106, y: 7});
      gsap.set(star2!, {x: 67, y: 80});
      gsap.set(star3!, {x: 130, y: 90});
      gsap.to(star1!, 0.6, {delay: 1.2, opacity: 1, x:0, y:0, ease: Back.easeOut.config(2), onComplete: ()=> {
         star1!.style.transform = '';
      }});
      gsap.to(star2!, 0.6, {delay: 1.2, opacity: 1, x:0, y:0, ease: Back.easeOut.config(2), onComplete: ()=> {
         star2!.style.transform = '';
      }});
      gsap.to(star3!, 0.6, {delay: 1.2, opacity: 1, x:0, y:0, ease: Back.easeOut.config(2), onComplete: ()=> {
         star3!.style.transform = '';
      }});

      goodJobAudio.current!.play();
      clapAudio.current!.play();
   },[]);


   const onClickRestudy = useCallback(( e ) => {
      clickAudio.current!.play();
      addClass(resultRef.current?.querySelector('.restudy-btn')?.parentElement, 'disable');
      if(showGameBtn){
         addClass(resultRef.current?.querySelector('.game-btn')?.parentElement, 'disable');
      }
      setTimeout(() => {
         gsap.killTweensOf('*');
         dispatch({ type: StudyActions.RESTART});
      }, 600);
   },[]);

   const onClickGame = useCallback((e) => {
      clickAudio.current!.play();
      // addClass(resultRef.current?.querySelector('.restudy-btn')?.parentElement, 'disable');
      // addClass(resultRef.current?.querySelector('.game-btn')?.parentElement, 'disable');
      // setTimeout(() => {
         
      // }, 600);
   }, []);


   const getContentX = useCallback((idx: number) => {
      const x = (CONTENT_WIDTH + ((window.innerWidth - (CONTENT_WIDTH * window.scale)) / 2)) * idx;
      return x ? x : 0;
   }, []);

   const getIndex = useCallback(( idx ): number  => {
      let findIdx = 0;
      for(let i = 0; i<indexAr.current.length; i++){
         if(indexAr.current[i] === idx) {
            findIdx = i; 
            break;
         }
      }
      return findIdx;
   },[]);


   const onResize = useCallback(() => {
      setTimeout(()=> {
         const wrap = document.querySelector('#content-wrap') as HTMLDivElement;
         if(wrap) {
            const left = parseInt(wrap.style.left) * (1/window.scale);
            const width =  window.innerWidth * (1/window.scale);
            if(listRef.current){
               listRef.current.forEach((list, i) => list && (list.style.left=`${getContentX(indexAr.current[i])}px`));
               gsap.set(listConRef.current, {x: -getContentX(prevPage.current-1)});
            }
            if(introRef.current){
               const introBg = introRef.current.querySelector('.bg') as HTMLDivElement;
               introBg.style.width = `${width}px`;
               introBg.style.left = `${-left}px`;
            }
            if(studyRef.current){
               const titleBar = studyRef.current.querySelector('.title-bar') as HTMLDivElement;
               const studyBg = studyRef.current.querySelector('.bg') as HTMLDivElement;
               titleBar.style.width = `${width}px`;
               titleBar.style.left = `${-left}px`;
               studyBg.style.width = `${width}px`;
               studyBg.style.left = `${-left}px`;
            }
            if(resultRef.current){
               const resultBg = resultRef.current.querySelector('.bg') as HTMLDivElement;
               resultBg.style.width = `${width}px`;
               resultBg.style.left = `${-left}px`;
            }
            const exitBtn = document.querySelector('#exit-button') as HTMLDivElement
            exitBtn.style.left = `${900+left}px`;
         }
      }, 2);
   },[]);

   const onVisibleChange = useCallback(( e ) => {
      if(document.hidden) {
         sound.pauseAll();
      } else {
         sound.resumeAll();
      }
   }, []);

   const onExitApp = useCallback(( e ) => {
      clickAudio.current!.play();
      window.self.close();
      console.log('ExitApp');
   }, []);


   useEffect(() => {
      switch(status) {
         case StudyStatus.STUDY_TRANSITION : 
            removeClass(listRef.current[getIndex(currentPage-1)], 'hidden');
            if(prevPage.current > currentPage) {
               removeClass(listRef.current[getIndex(currentPage)], 'hidden');
            } else {
               removeClass(listRef.current[getIndex(currentPage-2)], 'hidden');
            }
            gsap.killTweensOf(listConRef.current);
            gsap.to(listConRef.current, 0.6, {delay:0.03, x: -getContentX(currentPage-1), ease: Power2.easeOut, force3D: true, 
               onComplete: () => {
                  listRef.current.forEach((list, i) => {
                     if(getIndex(currentPage-1) !== i){
                        addClass(list, 'hidden')
                     }
                  });
               } 
            });
            setTimeout(() => {
               dispatch({ 
                  type: StudyActions.CHANGE_STATUS, 
                  payload: StudyStatus.STUDY_START
               });
            }, 100);
            prevPage.current = currentPage;
         break;
         case StudyStatus.STUDY_END : 
            if(!clearPages.find((x: number) => x === currentPage)) {
               dispatch({type: StudyActions.SET_CLEAR_PAGE, payload: currentPage});
            }
         break;
         case StudyStatus.RESULT : 
            onResize();
         break;
         case StudyStatus.RESTART : 
            const titleBar = studyRef.current!.querySelector('.title-bar');
            gsap.set(titleBar, {force3D: true, height: 85});
            indexAr.current = makeRandom(totalPage, totalPage);
            prevPage.current = 1;
            removeClass(listRef.current[getIndex(0)], 'hidden');
            onResize();
            dispatch({ type: StudyActions.SET_ACTIVE_INDEX, payload: getIndex(currentPage - 1)});
            setTimeout(() => {
               dispatch({ 
                  type: StudyActions.CHANGE_STATUS, 
                  payload: StudyStatus.STUDY_START
               });
            }, 10);
         break;
      }
   },[status]);


   useEffect(() => {
      window.addEventListener('resize', onResize);
      document.addEventListener('visibilitychange', onVisibleChange);
      onResize();
      return () => {
         window.removeEventListener('resize', onResize);
         document.removeEventListener('visibilitychange', onVisibleChange);
      }
   }, []);


   useLayoutEffect(() => {
      clickAudio.current = Sound.from({url: require('../assets/audio/click.mp3').default, preload: true});
      goodJobAudio.current = Sound.from({url: require('../assets/audio/good_job.mp3').default, preload: true});
      clapAudio.current = Sound.from({url: require('../assets/audio/clap.mp3').default, preload: true});
      
      let path = '';
      if (window.isTestAPI) {
         path = `/study${type}`;
      }
      else {
         let t = type.toLowerCase();
         if(t === 'words') t = 'word';
         path = `/game/${t}/study`;
      }
      window.http
      .get(path, {params: { stage: stage, fu_id: getCookie('fx7'), langCode: getCookie('lang_code') }})
      .then(({ data }) => {
         let payload: any = { stage: stage, studyData: data.data, totalPage: data.data.list.length };
         if(data.data.reStudy !== 0) {
            payload.clearPages = Array.from(Array(data.data.list.length)).map((x,i) => i+1);
         }
         dispatch({ type: StudyActions.INIT, payload: payload});
         dispatch({ type: StudyActions.CHANGE_STATUS, payload: StudyStatus.READY});
      });
   }, []);


   if(status === StudyStatus.INIT) {
      return null;
   }

   return (
      <HelmetProvider>
         <CommonLayout
            contentWidth={CONTENT_WIDTH}
            contentHeight={CONTENT_HEIGHT}>
            <Helmet>
               <title>{title}</title>
            </Helmet>
            <div id="content">
               <Transition  
                  nodeRef={introRef} 
                  in={status === StudyStatus.READY}
                  timeout={{exit: 500, appear: 0}}
                  unmountOnExit
                  onExit={onIntroExit}
                  onExited={onIntroExited}>
                  <div id="intro" ref={introRef}>
                     <div className="bg"></div>
                     <div className="top-title">
                        {title} <span>{`STAGE ${stage}`}</span> 
                     </div>

                     <div className="intro-area">
                        <div className="area-wrap">
                           <div className="intro-title" dangerouslySetInnerHTML={{__html: studyData.stageTitle}} />
                           <Ripples color="rgba(255,255,255,0.4)" during={1500}>
                              <button className="start-btn" onClick={onClickStart}>
                                 <img src={require('../assets/images/study/common/start_btn.png').default} />
                              </button>
                           </Ripples>
                        </div>
                     </div>

                     <div className="deco">
                        <div className="left"></div>
                        <div className="right"></div>
                     </div>

                     <div className="bottom-guide">
                        <img src={require(`../assets/images/study/${type.toLowerCase()}/notice_${studyData.langCode}.png`).default} />
                     </div>
                  </div>
               </Transition>

               <Transition  
                  nodeRef={studyRef}
                  in={status !== StudyStatus.RESULT}
                  timeout={{ exit: 1000, appear: 0 }}
                  unmountOnExit>
                  <div ref={studyRef} id="study">
                     <div className="bg"></div>
                     <div className="title-bar">
                        <div className="title-wrap">
                           <div className="text-con">
                              {`STAGE ${stage} : `}<span dangerouslySetInnerHTML={{__html: studyData.stageTitle}}></span>
                           </div>
                           <div className="page-con">
                              <span>{currentPage}</span> / {totalPage}
                           </div>
                        </div>
                     </div>

                     <div className="study-lists" ref={listConRef}>
                        { studyData.list.map((li: any, i: number) => (
                           <div key={`study-list-${i}`} 
                              ref={el => listRef.current[i]=el!}
                              className="study-list hidden"
                              style={{left: getContentX(indexAr.current[i])}}>
                              {studyElem(i+1)}
                           </div>
                        ))}
                     </div>
                     
                     <div className={`page-btns ${status === StudyStatus.STUDY_TRANSITION || status === StudyStatus.RESULT ? 'disable' : ''}`}>
                        <button 
                           className={`prev-page-btn ${studyData.reStudy === 0 ? 'hidden': currentPage === 1 ? 'hidden' : ''}`}
                           onClick={onPrevPage}>   
                        </button>
                        <button 
                           className={`next-page-btn ${(clearPages.length === 0 || clearPages[clearPages.length-1] < currentPage) ? 'hidden': ''}`}
                           onClick={onNextPage}>   
                        </button>
                     </div>
                  </div>
               </Transition>

               <Transition  
                  nodeRef={resultRef}
                  in={status === StudyStatus.RESULT}
                  timeout={{ exit: 0, appear: 1000 }}
                  onEnter={onResultEnter}
                  unmountOnExit>
                  <div ref={resultRef} id="result">
                     <div className="bg"></div>
                     <div className="good-job hidden"></div>
                     <div className='deco hidden'></div>
                     <div className="circle hidden"></div>
                     <div className="charactor-con">
                        <div className="charactor hidden"></div>
                     </div>
                     <div className="star-con">
                        <div className="star1"></div>
                        <div className="star2"></div>
                        <div className="star3"></div>
                     </div>
                     <div className="bottom-con">
                        <Ripples color="rgba(255,88,0,0.3)" during={1500}>
                           <button 
                              className="restudy-btn disable"
                              onClick={onClickRestudy}>
                              <img src={require(`../assets/images/study/common/restart_${studyData.langCode}.png`).default} />
                           </button>
                        </Ripples>
                        {showGameBtn &&
                           <Ripples color="rgba(62,159,221,0.3)" during={1500}>
                              <button 
                                 className="game-btn disable"
                                 onClick={onClickGame}>
                                 <img src={require(`../assets/images/study/common/game_${studyData.langCode}.png`).default} />
                              </button>
                           </Ripples>
                        }
                        
                     </div>
                  </div>
               </Transition>

               <button id="exit-button"
                  type="button"
                  onClick={onExitApp} />
            </div>
         </CommonLayout>
      </HelmetProvider>
   )
}

export default StudyLayout;