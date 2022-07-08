import { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface Props {
   correct: string;
   wrong1: string;
   wrong2: string;
}

const SightWordsQuiz: FC<Props> = ({ correct, wrong1, wrong2 }) => {



   return (
      <div className="sightwords-quiz">

      </div>
   );
}

export default SightWordsQuiz;