import { FC, useMemo, memo } from 'react';
import { Container, Sprite } from '@inlet/react-pixi';
import { useSelector } from 'react-redux';
import ResultContainer from '../ResultContainer';
import { randomRange } from '../../../utils';
import useAssets from '../../../hooks/useAssets';




const GameResult: FC = () => {
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const score: any = useSelector<any>(state => state.root.score);
   const { resources } = useAssets();
   const messageIdx = useMemo(() => randomRange(1, 3), []);

   return (
      <Container  name="resultCon">
         <Sprite 
            name="bg" 
            texture={resources.resultBg.texture} 
            position={[-400, 0]} />
         {score.total >= gameData.clearScore 
            ?
            <>
               <Sprite 
                  name="topLeftImg"
                  position={[305, 36]}
                  texture={resources.resultLeft.texture} />
               <Sprite 
                  name="topRightImg"
                  position={[1345, 3]}
                  texture={resources.resultRightSuccess.texture} />
               <Sprite 
                  name="topText"
                  anchor={0.5}
                  position={[1010, 218]}
                  texture={resources[`resultSuccessMsg${messageIdx}`].texture} />
            </>
            :
            <>
               <Sprite 
                  name="topLeftImg"
                  position={[305, 36]}
                  texture={resources.resultLeft.texture} />
               <Sprite 
                  name="topRightImg"
                  position={[1323, 30]}
                  texture={resources.resultRightFailed.texture} />
               <Sprite 
                  name="topText"
                  anchor={0.5}
                  position={[1000, 222]}
                  texture={resources[`resultFailedMsg${messageIdx}`].texture} />
            </>
         }
         <ResultContainer />
      </Container>
   );
}

export default memo(GameResult, () => true);

