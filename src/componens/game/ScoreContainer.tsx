import { FC, memo, useEffect } from "react";
import { Container, Sprite, Text, _ReactPixi } from "@inlet/react-pixi";
import { useSelector } from 'react-redux';
import useAssets from "../../hooks/useAssets";


const ScoreContainer: FC<_ReactPixi.IContainer> = ( props ) => {

   const score: any = useSelector<any>(state => state.root.score);
   const { resources } = useAssets();

   return (
      <Container 
         name="scoreContainer" 
         position={[52, 34]} 
         {...props}>

         <Sprite texture={resources.mainScoreBg.texture} />
         <Sprite 
            texture={resources.mainScoreTitle.texture} 
            position={[resources.mainScoreBg.texture.orig.width/2 - 55, 28]} />
         <Text name="scoreText"
            position={[resources.mainScoreBg.texture.orig.width/2, 110]}
            text={score.total}
            anchor={0.5}
            style={{
               fontSize: 74,
               fontFamily: 'LexendDeca-SemiBold',
               breakWords: true,
               fill: '#ffffff',
               align: 'center',
               dropShadow: true,
               dropShadowColor: '#144032',
               dropShadowBlur: 4,
               dropShadowAngle: Math.PI / 4,
               dropShadowDistance: 6}}>
         </Text>
         
      </Container>
   );
}

export default memo(ScoreContainer, () => true);