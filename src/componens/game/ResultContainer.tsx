import { FC, useCallback, memo } from 'react';
import { Container, Sprite, Text, _ReactPixi } from '@inlet/react-pixi';
import { useDispatch, useSelector } from 'react-redux';
import { GameActions, GameStatus } from '../../stores/game/reducer';
import { numberWithCommas } from '../../utils';
import PixiButton from './PixiButton';
import useAssets from '../../hooks/useAssets';




const ResultContainer: FC<_ReactPixi.IContainer> = () => {
   const dispatch = useDispatch();
   const score: any = useSelector<any>(state => state.root.score);
   const bestScore: any = useSelector<any>(state => state.root.bestScore);
   const { resources } = useAssets();

   const onMyResult = useCallback(() => {
      dispatch({type: GameActions.SHOW_RESULT_POPUP, payload: true });
   },[]);

   const onAgain = useCallback(() => {
      dispatch({type: GameActions.RESET });
      dispatch({type: GameActions.CHANGE_STATUS, payload: GameStatus.GAME_START});
   },[]);

   return (
      <Container name="resultCon">
         <Sprite 
            name="bg" 
            position={[258, 352]}
            texture={resources.commonResultBg.texture} />
         <Text 
            text={numberWithCommas(score.correct)}
            name="correctText"
            position={[1040, 580]}
            anchor={[1, 0.5]}
            style={{
               fontSize: 43,
               fontFamily: 'LexendDeca-Regular',
               fill: '#2a2a2a',
               align: 'right'}
            }>      
         </Text>
         <Text 
            text={score.incorrect === 0 ? '0' : `-${numberWithCommas(score.incorrect)}`}
            name="incorrectText"
            position={[1040, 712]}
            anchor={[1, 0.5]}
            style={{
               fontSize: 43,
               fontFamily: 'LexendDeca-Regular',
               fill: '#2a2a2a',
               align: 'right'}
            }>
         </Text>  
         <Text 
            text={score.bonus === 0 ? '0' : `+${numberWithCommas(score.bonus)}`}
            name="bonusText"
            position={[1040, 842]}
            anchor={[1, 0.5]}
            style={{
               fontSize: 43,
               fontFamily: 'LexendDeca-Regular',
               fill: '#2a2a2a',
               align: 'right'}
            }>
         </Text>
         <Text 
            text={numberWithCommas(score.total)}
            name="totalText"
            position={[1040, 983]}
            anchor={[1, 0.5]}
            style={{
               fontSize: 79,
               fontFamily: 'LexendDeca-SemiBold',
               fill: '#2a2a2a',
               align: 'right'}
            }>
         </Text>
         <Text 
            text={numberWithCommas(bestScore.score)}
            name="bestText"
            position={[1630, 656]}
            anchor={[1, 0.5]}
            style={{
               fontSize: 58,
               fontFamily: 'LexendDeca-Regular',
               fill: '#65604b',
               align: 'right'}
            }>
         </Text>
         <Text 
            text={bestScore.date}
            name="dateText"
            position={[1425, 747]}
            anchor={0.5}
            style={{
               fontSize: 28,
               fontFamily: 'LexendDeca-Light',
               fill: '#a09f99',
               align: 'center'}
            }>
         </Text>
         <PixiButton 
            name="myResultBtn"
            position={[1138, 810]}
            onTouchEnd={onMyResult}
            defaultTexture={resources.commonResultButtonDefault.texture} 
            sound={resources.audioClick.sound}
            hover={{active: true, texture: resources.commonResultButtonHover.texture}} />
         <PixiButton 
            name="againBtn"
            position={[1138, 950]}
            onTouchEnd={onAgain}
            defaultTexture={resources.commonAgainButtonDefault.texture} 
            sound={resources.audioClick.sound}
            hover={{active: true, texture: resources.commonAgainButtonHover.texture}} />
      </Container>
   );
}

export default memo(ResultContainer, () => true);