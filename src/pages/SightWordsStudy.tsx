import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Provider, useDispatch, useSelector } from "react-redux";
import Store from '../stores/study';
import { StudyActions, StudyStatus } from '../stores/study/reducer';
import StudyLayout from '../layouts/StudyLayout';
import AudioButton, { Refs as AudioButtonRefs } from '../componens/study/AudioButton';
import { Sound } from '@pixi/sound';
import SightWordsQuiz from '../componens/study/SightWordsQuiz';
import SightWordsEffect from '../componens/study/SightWordsEffect';

import '../assets/scss/study-common.scss';
import '../assets/scss/study-sight-words.scss';



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
   const audio = useRef<Sound|null>(null);
   const audioBtn = useRef<AudioButtonRefs>(null);
   const [viewActive, setViewActive] = useState<boolean>(false);
   const [isClear, setIsClear] = useState<boolean>(false);
   const timer = useRef<any>();

   const audioFinish = () => {
      setQuizStatus(QuizStatus.START);
      setViewActive(false);
   };

   const stopAudio = () => {
      audio.current?.stop();
      setViewActive(false);
   }

   const onStudyClear = useCallback(() => {
      dispatch({ 
         type: StudyActions.CHANGE_STATUS, 
         payload: StudyStatus.STUDY_END
      });
      setIsClear(true);
   }, []);

   useEffect(() => {
      if(status === StudyStatus.STUDY_START) {
         clearTimeout(timer.current);
         if(idx === activeIndex + 1) {
            timer.current = setTimeout(()=>{
               setQuizStatus(QuizStatus.INTRO);
            }, 500);
         } else {
            setIsClear(false);
            setQuizStatus(QuizStatus.INIT);
            stopAudio();
         }
      } else if(status === StudyStatus.STUDY_TRANSITION || status === StudyStatus.RESULT) {
         clearTimeout(timer.current);
         stopAudio();
      }
   },[status]);

   useEffect(() => {
      if(quizStatus === QuizStatus.INTRO) {
         timer.current = setTimeout(()=>{
            audio.current?.play(audioFinish);
            setViewActive(true);
         }, 500);
      }
   }, [quizStatus]);

   useEffect(() => {
      audio.current = Sound.from({url: data.audio, preload: true});
   }, []);

   
   return (
      <>
         <div className={`quiz-view ${viewActive ? 'active': ''} ${isClear ? 'clear' : ''}`}>
            <AudioButton
               ref={audioBtn}
               src={data.audio} 
               left={'185px'}
               top={'4px'}
               disabled={
                  quizStatus === QuizStatus.INIT || 
                  quizStatus === QuizStatus.INTRO
               } />
            <div className="puzzle-con">
               <span className="glow"></span>
               <div className='text-con'>{data.correct}</div>
            </div>

            {quizStatus === QuizStatus.START &&
               <SightWordsQuiz
                  correct={data.correct}
                  wrong1={data.wrong1}
                  wrong2={data.wrong2}
                  onStudyClear={onStudyClear}
                  audioStop={() => audioBtn.current?.stop()} />
            }
            {isClear && 
               <SightWordsEffect />
            }
         </div>
      </>
   );
}


const SightWordsStudy: FC<{stage: string | null}> = ({stage}) => {
   return (
      <div id="wrap">
         <Provider store={Store}>
            <StudyLayout 
               title="Speed Fun Up"
               type="SightWords"
               stage={stage ? parseInt(stage) : 1}
               showGameBtn={true}
               studyElem={idx => <Study idx={idx} />} />
         </Provider>
      </div>
   )
}

export default SightWordsStudy;