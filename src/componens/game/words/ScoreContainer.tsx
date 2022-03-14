import { FC, memo, useContext } from "react";
import { Container, Sprite, Text, _ReactPixi } from "@inlet/react-pixi";
import { useSelector } from 'react-redux';
import useAssets from "../../../hooks/useAssets";


const ScoreContainer: FC<_ReactPixi.IContainer> = ( props ) => {

   const score: any = useSelector<any>(state => state.root.score);
   const { resources } = useAssets();

   return (
      <Container name="scoreContainer" {...props}>
         <Sprite 
            texture={resources.mainScoreTitle.texture} 
            anchor={[0.5, 0]}
            position={[0, -65]} />
         <Text name="scoreText"
            position={[0, 30]}
            text={score.total}
            anchor={0.5}
            style={{
               fontSize: 75,
               fontFamily: 'LexendDeca-SemiBold',
               breakWords: true,
               fill: '#ffffff',
               align: 'center',
               dropShadow: true,
               dropShadowColor: '#144032',
               dropShadowBlur: 10,
               dropShadowAngle: Math.PI / 4,
               dropShadowDistance: 10}}>
         </Text>
         
      </Container>
   );
}

export default memo(ScoreContainer, () => true);