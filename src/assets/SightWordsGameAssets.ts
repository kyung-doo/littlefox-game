
const fontPath = 'fonts/';
const audioPath = 'audio/';
const commonImgPath = 'images/game/common/';
const introImgPath = 'images/game/sight-words/intro/';
const mainImgPath = 'images/game/sight-words/main/';
const resultImgPath = 'images/game/sight-words/result/';
const spritesheetPath = 'images/game/sight-words/spritesheet/';




export default ( langCode: string, low: number ) => {


   const resource = [

      //common
      { name: 'LexendDeca-Light', url: `${fontPath}LexendDeca-Light.ttf`},
      { name: 'LexendDeca-Regular', url: `${fontPath}LexendDeca-Regular.ttf`},
      { name: 'LexendDeca-SemiBold', url: `${fontPath}LexendDeca-SemiBold.ttf`},
      { name: 'LexendDeca-Bold', url: `${fontPath}LexendDeca-Bold.ttf`},
      { name: 'Maplestory Bold', url: `${fontPath}Maplestory Bold.ttf`},
      { name: 'audioBgm', url: `${audioPath}bgm_sightwords.mp3` },
      { name: 'audioClick', url: `${audioPath}click.mp3` },
      { name: 'audioCorrect', url: `${audioPath}correct.mp3` },
      { name: 'audioWrong', url: `${audioPath}egg_wrong.mp3` },
      { name: 'audioEgg', url: `${audioPath}egg.mp3` },
      { name: 'audioEggShort', url: `${audioPath}egg_short.mp3` },
      { name: 'audioEggClear', url: `${audioPath}egg_clear.mp3` },
      { name: 'audioBonus', url: `${audioPath}bonus.mp3` },
      { name: 'audioTimeout', url: `${audioPath}wrong2.mp3` },
      { name: 'audioGameover', url: `${audioPath}game_over.mp3` },
      { name: 'commonExitBtn', url: `${commonImgPath}exit_btn.png` },
      
      
      
      // intro
      { name: 'commonBgmOnBtn', url: `${commonImgPath}bgm_btn_on.png` },
      { name: 'commonBgmOffBtn', url: `${commonImgPath}bgm_btn_off.png` },
      { name: 'commonBackBtn', url: `${commonImgPath}back_btn.png` },
      { name: 'introBg', url: `${introImgPath}bg.png`},
      { name: 'introGuide', url: `${introImgPath}guide_img_${langCode}.png`},
      { name: 'introInfoBtn', url: `${introImgPath}info_btn.png`},
      { name: 'introStartBtnDefault', url: `${introImgPath}start_btn_default.png`},
      { name: 'introStartBtnHover', url: `${introImgPath}start_btn_hover.png`},
      { name: 'introInfoText', url: `${introImgPath}info_text_${langCode}.png`},
      { name: 'introPannel', url: `${introImgPath}pannel.png`},
      { name: 'introTitle1_1', url: `${introImgPath}title1_1.png`},
      { name: 'introTitle1_2', url: `${introImgPath}title1_2.png`},
      { name: 'introTitle2', url: `${introImgPath}title2.png`},
      { name: 'introCharactor', url: `${introImgPath}charactor.png`},
      { name: 'introShine', url: `${introImgPath}shine.png`},
      { name: 'introLight', url: `${introImgPath}light.png`},
      { name: 'introDinos', url: `${introImgPath}dinos.png`},
      { name: 'introDinosLeg', url: `${introImgPath}dinos_leg.png`},
      { name: 'introLeaf1', url: `${introImgPath}leaf1.png`},
      { name: 'introLeaf2', url: `${introImgPath}leaf2.png`},
      { name: 'introLeaf3', url: `${introImgPath}leaf3.png`},
      { name: 'introLeaf4', url: `${introImgPath}leaf4.png`},
      { name: 'introStar', url: `${introImgPath}star.png`},

      

      // main
      { name: 'commonResetBtn', url: `${commonImgPath}reset_btn.png` },
      { name: 'mainBg', url: `${mainImgPath}bg.png` },
      { name: 'mainTopBg', url: `${mainImgPath}top_bg.png` },
      { name: 'mainScoreBg', url: `${mainImgPath}score_bg.png`},
      { name: 'mainScoreTitle', url: `${mainImgPath}score_title.png`},
      { name: 'mainProgressBg', url: `${mainImgPath}progress_bg.png`},
      { name: 'mainSoundBtnOff', url: `${mainImgPath}sound_btn_off.png`},
      { name: 'mainSoundBtnOn', url: `${mainImgPath}sound_btn_on.png`},
      { name: 'mainScorePlus50', url: `${mainImgPath}score_plus_50.png`},
      { name: 'mainScoreMinus10', url: `${mainImgPath}score_minus_10.png`},
      { name: 'mainEggBig', url: `${mainImgPath}egg_big.png`},
      { name: 'mainEggBigLeft', url: `${mainImgPath}egg_big_left.png`},
      { name: 'mainEggBigRight', url: `${mainImgPath}egg_big_right.png`},
      { name: 'mainEggBigBonus', url: `${mainImgPath}egg_big_bonus.png`},
      { name: 'mainEggBigBonusLeft', url: `${mainImgPath}egg_big_bonus_left.png`},
      { name: 'mainEggBigBonusRight', url: `${mainImgPath}egg_big_bonus_right.png`},
      { name: 'mainStonBlind', url: `${mainImgPath}ston_blind.png`},
      { name: 'mainEffectLight1', url: `${mainImgPath}effect_light1.png`},
      { name: 'mainEffectLight2', url: `${mainImgPath}effect_light2.png`},
      { name: 'mainStar', url: `${mainImgPath}star.png`},
      { name: 'mainStarBonus', url: `${mainImgPath}star_bonus.png`},
      { name: 'mainCharactor', url: `${mainImgPath}charactor.png`},
      { name: 'mainDinos1', url: `${mainImgPath}dinos1.png`},
      { name: 'mainDinos2', url: `${mainImgPath}dinos2.png`},
      { name: 'mainDinos3', url: `${mainImgPath}dinos3.png`},
      { name: 'mainDinos4', url: `${mainImgPath}dinos4.png`},
      { name: 'mainDinos5', url: `${mainImgPath}dinos5.png`},
      { name: 'mainDinos6', url: `${mainImgPath}dinos6.png`},
      { name: 'mainDinos7', url: `${mainImgPath}dinos7.png`},
      { name: 'mainDinos8', url: `${mainImgPath}dinos8.png`},
      { name: 'mainDinos9', url: `${mainImgPath}dinos9.png`},
      { name: 'mainDinosBonus1', url: `${mainImgPath}dinos_bonus1.png`},
      { name: 'mainDinosBonus2', url: `${mainImgPath}dinos_bonus2.png`},
      { name: 'mainDinosBonus3', url: `${mainImgPath}dinos_bonus3.png`},
      { name: 'mainBonusBg', url: `${mainImgPath}bonus_bg.png`},
      { name: 'spritesheetEgg', url: `${spritesheetPath}egg.json` },
      { name: 'spritesheetEggBonus', url: `${spritesheetPath}egg_bonus.json` },
      { name: 'spritesheetCharactorDefault', url: `${spritesheetPath}charactor_default.json` },
      { name: 'spritesheetCharactorCorrect', url: `${spritesheetPath}charactor_correct.json` },
      { name: 'spritesheetCharactorWrong', url: `${spritesheetPath}charactor_wrong.json` },
      { name: 'spritesheetCharactorBonus', url: `${spritesheetPath}charactor_bonus.json` },




      // result
      { name: 'commonResultBg', url: `${commonImgPath}result_bg.png` },
      { name: 'commonResultButtonDefault', url: `${commonImgPath}result_btn_default.png` },
      { name: 'commonResultButtonHover', url: `${commonImgPath}result_btn_hover.png` },
      { name: 'commonAgainButtonDefault', url: `${commonImgPath}again_btn_default.png` },
      { name: 'commonAgainButtonHover', url: `${commonImgPath}again_btn_hover.png` },
      { name: 'resultBg', url: `${resultImgPath}bg.png` }, 
      { name: 'resultLeftSuccess', url: `${resultImgPath}top_left_success_img.png`},
      { name: 'resultLeftFailed', url: `${resultImgPath}top_left_failed_img.png`},
      { name: 'resultRightSuccess', url: `${resultImgPath}top_right_success_img.png`},
      { name: 'resultRightFailed', url: `${resultImgPath}top_right_failed_img.png`},
      { name: 'resultSuccessMsg1', url: `${resultImgPath}success_message1.png`},
      { name: 'resultSuccessMsg2', url: `${resultImgPath}success_message2.png`},
      { name: 'resultSuccessMsg3', url: `${resultImgPath}success_message3.png`},
      { name: 'resultFailedMsg1', url: `${resultImgPath}failed_message1.png`},
      { name: 'resultFailedMsg2', url: `${resultImgPath}failed_message2.png`},
      { name: 'resultFailedMsg3', url: `${resultImgPath}failed_message3.png`},
      
   ];

   if(low === 0) {
      
   } else {
      
   }

   
   return resource;
}
