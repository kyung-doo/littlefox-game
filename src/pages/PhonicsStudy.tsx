import { FC, useCallback, useEffect, useState, useRef } from 'react';
import { Provider, useDispatch, useSelector } from "react-redux";
import Store from '../stores/study';
import { StudyActions, StudyStatus } from '../stores/study/reducer';
import StudyLayout from '../layouts/StudyLayout';
import AudioButton, { Refs as AudioButtonRefs } from '../componens/study/AudioButton';
import { addClass, removeClass } from '../utils';
import PhonicsQuiz from '../componens/study/PhonicsQuiz';
import { Sound } from '@pixi/sound';

import '../assets/scss/study-common.scss';
import '../assets/scss/study-phonics.scss';



enum QuizStatus {
   INIT = 'INIT',
   INTRO = 'INTRO',
   START = 'START'
}


const Study: FC<{idx: number}> = ({ idx }) => {
   
   const dispatch = useDispatch();
   const studyData: any = useSelector<any>(state => state.studyData);
   const status: any = useSelector<any>(state => state.status);
   const activeIndex: any = useSelector<any>(state => state.activeIndex);
   const data = studyData.list[idx-1];

   const [quizStatus, setQuizStatus] = useState<QuizStatus>(QuizStatus.INIT);
   const audioBtn = useRef<AudioButtonRefs>(null);
   const wordBox = useRef<HTMLDivElement[]>([]);
   const audios = useRef<Sound[]>([]);
   const timer = useRef<any>();

   const audioFinish = useCallback(( idx: number ) => {
      if(idx < 4) {
         removeClass(wordBox.current[0], 'playing');
         removeClass(wordBox.current[1], 'playing');
         removeClass(wordBox.current[2], 'playing');
         timer.current = setTimeout(() => {   
            audios.current[idx+1].play(() => audioFinish(idx+1));
            if(idx === 0) {
               addClass(wordBox.current[1], 'playing');
            } else if(idx === 1) {
               addClass(wordBox.current[2], 'playing');
            } else if(idx === 2) {
               addClass(wordBox.current[1], 'playing');
               addClass(wordBox.current[2], 'playing');
            } else {
               addClass(wordBox.current[0], 'playing');
               addClass(wordBox.current[1], 'playing');
               addClass(wordBox.current[2], 'playing');
            }
         }, 100);
      } else {
         setQuizStatus(QuizStatus.START);
         removeClass(wordBox.current[0], 'playing');
         removeClass(wordBox.current[1], 'playing');
         removeClass(wordBox.current[2], 'playing');
      }
   }, [quizStatus, wordBox.current]);

   const onStudyClear = useCallback(() => {
      dispatch({ 
         type: StudyActions.CHANGE_STATUS, 
         payload: StudyStatus.STUDY_END
      });
   }, []);

   const stopAudio = () => {
      audios.current.forEach(audio => audio.stop());
   }
   

   useEffect(() => {
      if(status === StudyStatus.STUDY_START) {
         clearTimeout(timer.current);
         if(idx === activeIndex + 1){
            timer.current = setTimeout(()=>{
               setQuizStatus(QuizStatus.INTRO);
            }, 500);
         } else {
            setQuizStatus(QuizStatus.INIT);
            stopAudio();
            wordBox.current.forEach( box => {
               removeClass(box, 'playing');
               removeClass(box, 'active');
               removeClass(box, 'clear');
            });
         }
      } else if(status === StudyStatus.STUDY_TRANSITION || status === StudyStatus.RESULT) {
         clearTimeout(timer.current);
         stopAudio();
      }
   }, [status]);

   useEffect(() => {
      if(quizStatus === QuizStatus.INTRO) {
         timer.current = setTimeout(()=>{
            audios.current[0].play(() => audioFinish(0));
            addClass(wordBox.current[0], 'playing');
         }, 500);
      }
   }, [quizStatus]);

   useEffect(() => {
      audios.current[0] = Sound.from({url: data.audio1, preload: true});
      audios.current[1] = Sound.from({url: data.audio2, preload: true});
      audios.current[2] = Sound.from({url: data.audio3, preload: true});
      audios.current[3] = Sound.from({url: data.audio4, preload: true});
      audios.current[4] = Sound.from({url: data.audio6, preload: true});
   },[]);
   

   return (
      <>
         <div className="quiz-view">
            <div className="image">
               <img src={data.image} />
            </div>
            <div className="word-boxs">
               <div ref={ref => ref && (wordBox.current[0]=ref)} 
                  className={`word-box box1`}>
                  <span>{data.word[0]}</span>
               </div>
               <div ref={ref => ref && (wordBox.current[1]=ref)} 
                  className={`word-box box2`}>
                  <span>{data.word[1]}</span>
               </div>
               <div ref={ref => ref && (wordBox.current[2]=ref)} 
                  className={`word-box box3`}>
                  <span>{data.word[2]}</span>
               </div>
            </div>
            <AudioButton
               ref={audioBtn}
               left="21px"
               top="18px"
               src={data.audio5} 
               disabled={
                  quizStatus === QuizStatus.INIT || 
                  quizStatus === QuizStatus.INTRO
               } />  
         </div>
         { quizStatus === QuizStatus.START && 
            <PhonicsQuiz
               words={[data.word[0], data.word[1], data.word[2]]}
               wordBox={wordBox.current}
               onStudyClear={onStudyClear}
               audioStop={() => audioBtn.current?.stop()} />
         }
      </>
   )
}


const PhonicsStudy: FC<{stage: string | null}> = ({stage}) => {
   return (
      <div id="wrap">
         <Provider store={Store}>
            <StudyLayout 
               title="Flying Arrow"
               type="Phonics"
               stage={stage ? parseInt(stage) : 1}
               studyElem={ idx => (
                  <Study idx={idx} />)
               } />
         </Provider>
      </div>
   )
}

export default PhonicsStudy;