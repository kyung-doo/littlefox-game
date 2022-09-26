import { FC, useCallback, useEffect, useState } from 'react';
import { Provider } from "react-redux";
import Store from '../stores/game';
import { GameActions, GameStatus } from '../stores/game/reducer';
import PixiButton from '../componens/game/PixiButton';
import useAssets from '../hooks/useAssets';
import GameLayout from '../layouts/GameLayout';
import GameIntro from '../componens/game/words/GameIntro';
import GameMain from '../componens/game/words/GameMain';
import GameResult from '../componens/game/words/GameResult';
import Loading from '../componens/game/Loading';
import { isMobile, exitPage } from '../utils';



/*
* @ PROPS
*     stage: 게임 스테이지
*/
interface Props {
   stage: string | null;
}


const WordsGame: FC<Props> = ({ stage }) => {
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
         stage: stage ? parseInt(stage) : 1
      }});
      
      const assetsList = require('../assets/WordsGameAssets').default( gameData.langCode, gameData.lowQuality );
      gameData.quizList.forEach((li: any, i: number) => {
         assetsList.push({ name: `quizAudio${i}`, url: li.audio, noRequired: true });
         assetsList.push({ name: `quizImg_${i}`, url: li.image, noRequired: true });
      });
      loadStart(assetsList);
   },[]);
   

   const onCloseResultPopup = useCallback(() => {
      dispatch({type: GameActions.SHOW_RESULT_POPUP, payload: false });
   }, []);

   const onExitApp = useCallback(( e ) => {
      window.self.close();
      exitPage();
   }, []);


   useEffect(() => {
      if(showResultPopup){
         const data: any = [];
         gameData.quizList.forEach((list: any, i: number) => {
            const result = resultData.filter((x: any) => x.listNo === i);
            data.push({
               no: i,
               text: list.word,
               sound: resources![`quizAudio${i}`].sound,
               image: list.image,
               corrects: result.map((x: any) => x.correct).sort().reverse()
            })
         });
         setResultPopupData(data);
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
            type="Words"
            title="Word Melody"
            stage={stage ? parseInt(stage) : 1}
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
                        position={[2008, 29]}
                        scale={isMobile() ? 1.5 : 1}
                        defaultTexture={resources.commonExitBtn.texture!}
                        sound={resources.audioClick.sound}
                        onTouchEnd={onExitApp}
                        align="RIGHT" />
                  </>
                  :
                  <Loading bgUrl='images/game/words/intro/bg.png' />
               }
            </Provider>
         </GameLayout>
      </div>
   )
}

export default WordsGame;