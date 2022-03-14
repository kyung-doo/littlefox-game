import { VFC, memo } from "react";
import { Container, Sprite, AnimatedSprite, _ReactPixi } from "@inlet/react-pixi";


/*
* @ PROPS
*     bgUrl:  게임 인트로 배경 이미지
*/
export interface Props extends _ReactPixi.IContainer{
   bgUrl: string;
}

const loadingAni = [
   require('../../assets/images/game/common/loading/loading_01.png').default,
   require('../../assets/images/game/common/loading/loading_02.png').default,
   require('../../assets/images/game/common/loading/loading_03.png').default,
   require('../../assets/images/game/common/loading/loading_04.png').default,
   require('../../assets/images/game/common/loading/loading_05.png').default,
   require('../../assets/images/game/common/loading/loading_06.png').default,
];

const Loading: VFC<Props> = ({bgUrl, ...props}) => {
   return (
      <Container {...props}>

         <Sprite 
            image={require(`../../assets/${bgUrl}`).default} 
            position={[-400, 0]} />

         <AnimatedSprite
            anchor={0.5}
            position={[1000, 640]}
            images={loadingAni}
            isPlaying={true}
            initialFrame={0}
            animationSpeed={0.2} />
         
      </Container>
   );
}

export default memo(Loading, () => true);