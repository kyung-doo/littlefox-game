import { FC, useCallback, useEffect, useState } from 'react';
import { Provider } from "react-redux";
import Store from '../stores/game';
import { GameActions, GameStatus } from '../stores/game/reducer';
import GameLayout from '../layouts/GameLayout';
import GameIntro from '../componens/game/alphabet/GameIntro';
import PixiButton from '../componens/game/PixiButton';
import GameMain from '../componens/game/alphabet/GameMain';
import useAssets from '../hooks/useAssets';
import GameResult from '../componens/game/alphabet/GameResult';
import Loading from '../componens/game/Loading';
import {exitPage, isMobile} from '../utils';
import '@pixi/sound';



/*
* @ PROPS
*     stage: 게임 스테이지
*     step: 게임 스텝
*/
interface Props {
   stage: string | null;
   step: string | null;
}

const AlphabetGame: FC<Props> = ({ stage, step }) => {

   const dispatch = Store.dispatch;
   const [status, setStatus] = useState<GameStatus>(GameStatus.INIT);
   const [gameData, setGameData] = useState<any>(null);
   const [showResultPopup, setShowResultPopup] = useState<boolean>(false);
   const [resultData, setResultData] = useState<any>(null);

   const { resources, loadStart, loadComplete } = useAssets();
   const [resultPopupData, setResultPopupData] = useState<any>(null);

   
   const onDataLoaded = useCallback(( gameData: any) => {
      dispatch({type: GameActions.INIT, payload: { 
         gameData: gameData, 
         stage: stage ? parseInt(stage) : 1, 
         step: step ? parseInt(step) : 1,
      }});

      const assetsList = require('../assets/AlphabetGameAssets').default( step, gameData.langCode, gameData.lowQuality );

      if(!step || parseInt(step) !== 3){
         gameData.quizList.forEach((li: any, i: number) => {
            assetsList.push({ name: `quizAudio${i}`, url: li.audio, noRequired: true });
         });
      } else {
         gameData.quizList.forEach((li: any, i: number) => {
            assetsList.push({ name: `quizAudio${i}`, url: li.audio, noRequired: true });
            assetsList.push({ name: `quizImg_${i}_1`, url: li.image1.url, noRequired: true });
            assetsList.push({ name: `quizImg_${i}_2`, url: li.image2.url, noRequired: true });
         });
      }
      
      loadStart(assetsList);
   },[]);


   const onCloseResultPopup = useCallback(() => {
      dispatch({type: GameActions.SHOW_RESULT_POPUP, payload: false });
   }, []);


   const onExitApp = useCallback(( e ) => {
      window.self.close();
      exitPage();
   }, []);

   const groupData = useCallback(( data: any[] ) => {
      const group: any[] = [];
      data.forEach((li: any) => {
         const find = group.find(x => x.word === li.word);
         if(find) {
            find.corrects = [...find.corrects, ...li.corrects].sort().reverse();
         } else {
            group.push(li);
         }
      });
      return group;
   }, []);

   
   useEffect(() => {
      if(showResultPopup){
         let data: any = [];
         const s = step ? parseInt(step) : 1;
         gameData.quizList.forEach((list: any, i: number) => {
            const result = resultData.filter((x: any) => x.listNo === i);
            if(s === 3){
               data.push({
                  no: i,
                  text: `${list.alphabet.toUpperCase()}${list.alphabet}`,
                  sound: resources![`quizAudio${i}`].sound,
                  image: list.image1.url,
                  word: list.image1.word,
                  corrects: result.map((x: any) => x.correct.image1).sort().reverse()
               });
               data.push({
                  no: i,
                  text: `${list.alphabet.toUpperCase()}${list.alphabet}`,
                  sound: resources![`quizAudio${i}`].sound,
                  image: list.image2.url,
                  word: list.image2.word,
                  corrects: result.map((x: any) => x.correct.image2).sort().reverse()
               });
            } else {
               data.push({
                  no: i,
                  text: list.alphabet.toUpperCase(),
                  sound: resources![`quizAudio${i}`].sound,
                  corrects: result.map((x: any) => x.correct.upper).sort().reverse()
               });
               data.push({
                  no: i,
                  text: list.alphabet,
                  sound: resources![`quizAudio${i}`].sound,
                  corrects: result.map((x: any) => x.correct.lower).sort().reverse()
               });
            }
         });
         setResultPopupData( s === 3 ? groupData(data) : data );
      } else {
         if(resources) resources.audioClick.sound.play();
         setResultPopupData(null);
      }
   },[showResultPopup]);


   useEffect(() => {
      if( resources ) {
         console.log('resources : ', resources);
         dispatch({type: GameActions.CHANGE_STATUS, payload: GameStatus.INTRO});
      }
   }, [resources]);


   useEffect(() => {
      Store.subscribe(() => {
         const state = Store.getState();
         switch(state.action.type) {
            case GameActions.INIT : setGameData(state.root.gameData); break;
            case GameActions.CHANGE_STATUS : 
               setStatus(state.root.status); 
               if(state.root.status === GameStatus.RESULT) {
                  setResultData(state.root.resultData);
               }
            break;
            case GameActions.SHOW_RESULT_POPUP : setShowResultPopup(state.root.showResultPopup); break;
            case GameActions.RESET : setResultData(null); break;
         }
      });
   }, []);


   return (
      <div id="wrap">
         <GameLayout 
            type="Alphabet"
            title='Bubble Pop'
            stage={stage ? parseInt(stage) : 1}
            step={step ? parseInt(step) : 1}
            resultPopupData={resultPopupData}
            onLoaded={onDataLoaded}
            onCloseResultPopup={onCloseResultPopup}>
            <Provider store={Store}>
               {(loadComplete && resources)  
                  ? 
                  <>
                     {status === GameStatus.INTRO && 
                        <GameIntro />
                     }

                     {status === GameStatus.GAME_START && 
                        <GameMain />
                     }

                     {status === GameStatus.RESULT && 
                        <GameResult />
                     }
                     <PixiButton 
                        name="exitBtn" 
                        anchor={[1, 0]}
                        scale={isMobile() ? 1.5 : 1}
                        position={[2008, 29]}
                        defaultTexture={resources.commonExitBtn.texture!}
                        sound={resources.audioClick.sound}
                        onTouchEnd={onExitApp}
                        align="RIGHT" />
                  </>
                  :
                  <Loading bgUrl='images/game/alphabet/intro/bg.png' />
               }
            </Provider>
         </GameLayout>
      </div>
   )
}

export default AlphabetGame;