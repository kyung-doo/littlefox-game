import { FC, useCallback, useState } from "react";
import GameLayout from "../layouts/GameLayout";
import { Provider } from "react-redux";
import Store from '../stores/game';
import useAssets from "../hooks/useAssets";
import { GameActions, GameStatus } from "../stores/game/reducer";
import WordPicker from "../componens/game/letter-teams/WordPicker";



/*
* @ PROPS
*     stage: 게임 스테이지
*     step: 게임 스텝
*/
interface Props {
   stage: string | null;
   step: string | null;
}


const LetterTeamsGame: FC<Props> = ({ stage, step }) => {

   const dispatch = Store.dispatch;
   const [status, setStatus] = useState<GameStatus>(GameStatus.INIT);
   const [gameData, setGameData] = useState<any>(null);
   const { resources, loadStart, loadComplete } = useAssets();
   const [resultPopupData, setResultPopupData] = useState<any>(null);



   const onDataLoaded = useCallback(( gameData: any) => {
      dispatch({type: GameActions.INIT, payload: { 
         gameData: gameData, 
         stage: stage ? parseInt(stage) : 1, 
      }});

      const assetsList = require('../assets/LetterTeamsGameAssets').default( step, gameData.langCode, gameData.lowQuality );
      
      loadStart(assetsList);
   },[]);


   const onCloseResultPopup = useCallback(() => {
      dispatch({type: GameActions.SHOW_RESULT_POPUP, payload: false });
   }, []);



   return (
      <div id="wrap">
         <GameLayout 
            type="LetterTeams"
            title='ABC Bubble Pang'
            stage={stage ? parseInt(stage) : 1}
            resultPopupData={resultPopupData}
            onLoaded={onDataLoaded}
            onCloseResultPopup={onCloseResultPopup}>
            <Provider store={Store}>
               {(loadComplete && resources) &&
                  <WordPicker />
               }
            </Provider>
         </GameLayout>
      </div>
   )
}

export default LetterTeamsGame;