
const fontPath = 'fonts/';
const audioPath = 'audio/';
const commonImgPath = 'images/game/common/';
const introImgPath = 'images/game/alphabet/intro/';
const mainImgPath = 'images/game/alphabet/main/';
const resultImgPath = 'images/game/alphabet/result/';
const spritesheetPath = 'images/game/alphabet/spritesheet/';




export default ( step: number, langCode: string, low: number ) => {


   const resource = [

      //common
      { name: 'LexendDeca-Light', url: `${fontPath}LexendDeca-Light.ttf`},
      { name: 'LexendDeca-Regular', url: `${fontPath}LexendDeca-Regular.ttf`},
      { name: 'LexendDeca-SemiBold', url: `${fontPath}LexendDeca-SemiBold.ttf`},
      { name: 'Maplestory Bold', url: `${fontPath}Maplestory Bold.ttf`},
      { name: 'audioBgm', url: `${audioPath}bgm_alphabet.mp3` },
      { name: 'audioClick', url: `${audioPath}click.mp3` },
      { name: 'audioBubbleStart', url: `${audioPath}bubble_start.mp3` },
      { name: 'audioBubblePop', url: `${audioPath}bubble_pop.mp3` },
      { name: 'audioCorrect', url: `${audioPath}correct.mp3` },
      { name: 'audioWrong', url: `${audioPath}wrong.mp3` },
      { name: 'audioBonus', url: `${audioPath}bonus.mp3` },
      { name: 'audioGameover', url: `${audioPath}game_over.mp3` },
      { name: 'commonExitBtn', url: `${commonImgPath}exit_btn.png` },
      
      
      
      // intro
      { name: 'commonBgmOnBtn', url: `${commonImgPath}bgm_btn_on.png` },
      { name: 'commonBgmOffBtn', url: `${commonImgPath}bgm_btn_off.png` },
      { name: 'commonBackBtn', url: `${commonImgPath}back_btn.png` },
      { name: 'introBg', url: `${introImgPath}bg.png`},
      { name: 'introGuide', url: `${introImgPath}guide_img_${langCode}.png`},
      { name: 'introStartBtnDefault', url: `${introImgPath}start_btn_default.png`},
      { name: 'introStartBtnHover', url: `${introImgPath}start_btn_hover.png`},
      { name: 'introInfoBtn', url: `${introImgPath}info_btn.png`},
      { name: 'introBigBubble', url: `${introImgPath}big_bubble.png`},
      { name: 'introSmallBubble', url: `${introImgPath}small_bubble.png`},
      { name: 'introBubblePop', url: `${introImgPath}bubble_pop.png`},
      { name: 'introSideBubble', url: `${introImgPath}side_bubble.png`},
      { name: 'introCharactor', url: `${introImgPath}charactor.png`},
      { name: 'introTitle1_1', url: `${introImgPath}title1_1.png`},
      { name: 'introTitle1_2', url: `${introImgPath}title1_2.png`},
      { name: 'introTitle1_3', url: `${introImgPath}title1_3.png`},
      { name: 'introTitle1_4', url: `${introImgPath}title1_4.png`},
      { name: 'introTitle1_5', url: `${introImgPath}title1_5.png`},
      { name: 'introTitle1_6', url: `${introImgPath}title1_6.png`},
      { name: 'introTitle2_1', url: `${introImgPath}title2_1.png`},
      { name: 'introTitle2_2', url: `${introImgPath}title2_2.png`},
      { name: 'introTitle2_3', url: `${introImgPath}title2_3.png`},
      { name: 'introLeftLeaf', url: `${introImgPath}left_leaf.png`},
      { name: 'introRightLeaf', url: `${introImgPath}right_leaf.png`},



      // main
      { name: 'commonResetBtn', url: `${commonImgPath}reset_btn.png` },
      { name: 'commonSoundBtnOff', url: `${commonImgPath}sound_btn_off.png`},
      { name: 'commonSoundBtnOn', url: `${commonImgPath}sound_btn_on.png`},
      { name: 'commonProgressBar1', url: `${commonImgPath}progress_bar1.png` },
      { name: 'commonProgressBar2', url: `${commonImgPath}progress_bar2.png` },
      { name: 'commonLightGradient', url: `${commonImgPath}light_gradient.png` },
      { name: 'mainBg', url: `${mainImgPath}bg.png`},
      { name: 'mainBottomUiBg', url: `${mainImgPath}bottom_ui_bg.png` },
      { name: 'mainScoreBg', url: `${mainImgPath}score_bg.png`},
      { name: 'mainScoreTitle', url: `${mainImgPath}score_title.png`},
      { name: 'mainScorePlus100', url: `${mainImgPath}score_plus_100.png`},
      { name: 'mainScoreMinus10', url: `${mainImgPath}score_minus_10.png`},
      { name: 'mainProgressBg', url: `${mainImgPath}progress_bg.png` },
      { name: 'mainTree', url: `${mainImgPath}tree.png`},
      { name: 'mainBonusBg', url: `${mainImgPath}bonus_bg.png`},
      { name: 'mainBonusEffect', url: `${mainImgPath}bonus_effect.png`},
      { name: 'mainStar', url: `${mainImgPath}star.png`},
      { name: 'mainRainbow', url: `${mainImgPath}rainbow.png`},
      { name: 'mainRainbowMask', url: `${mainImgPath}rainbow_mask.png`},
      { name: 'mainRadialEffect', url: `${mainImgPath}radial_effect.png`},
      { name: 'mainLight', url: `${mainImgPath}light.png`},
      
      { name: 'spritesheetBubbleDefault', url: `${spritesheetPath}bubble_default.json` },
      { name: 'spritesheetBubbleBonus', url: `${spritesheetPath}bubble_bonus.json` },
      { name: 'commonExplodEffect', url: `${commonImgPath}spritesheet/explod_effect.json` },
      { name: 'spritesheetBubbleLight1', url: `${spritesheetPath}bubble_light1.json` },
      { name: 'spritesheetBubbleLight2', url: `${spritesheetPath}bubble_light2.json` },
      { name: 'spritesheetCharactorDefault', url: `${spritesheetPath}charactor_default.json` },
      { name: 'spritesheetCharactorBubble', url: `${spritesheetPath}charactor_bubble.json` },
      { name: 'spritesheetCharactorBonus', url: `${spritesheetPath}charactor_bonus.json` },
      



      // result
      { name: 'commonResultBg', url: `${commonImgPath}result_bg.png` },
      { name: 'commonResultButtonDefault', url: `${commonImgPath}result_btn_default.png` },
      { name: 'commonResultButtonHover', url: `${commonImgPath}result_btn_hover.png` },
      { name: 'commonAgainButtonDefault', url: `${commonImgPath}again_btn_default.png` },
      { name: 'commonAgainButtonHover', url: `${commonImgPath}again_btn_hover.png` },
      { name: 'resultSuccess', url: `${resultImgPath}top_img_success.png`},
      { name: 'resultFailed', url: `${resultImgPath}top_img_failed.png`},
      { name: 'resultSuccessMsg1', url: `${resultImgPath}success_message1.png`},
      { name: 'resultSuccessMsg2', url: `${resultImgPath}success_message2.png`},
      { name: 'resultSuccessMsg3', url: `${resultImgPath}success_message3.png`},
      { name: 'resultFailedMsg1', url: `${resultImgPath}failed_message1.png`},
      { name: 'resultFailedMsg2', url: `${resultImgPath}failed_message2.png`},
      { name: 'resultFailedMsg3', url: `${resultImgPath}failed_message3.png`},
      
   ];

   if(step < 3) {
      resource.push({ name: 'introInfoText', url: `${introImgPath}info_text_${langCode}_1.png`});
   } else {
      resource.push({ name: 'introInfoText', url: `${introImgPath}info_text_${langCode}_2.png`});
   }

   if(low === 0) {
      resource.push({ name: 'commonWatchBody', url: `${commonImgPath}watch_body.png` });
      resource.push({ name: 'commonWatchButton', url: `${commonImgPath}watch_button.png` });
      resource.push({ name: 'commonWatchBubble', url: `${commonImgPath}watch_bubble.png` });
   } else {
      resource.push({ name: 'commonWatch', url: `${commonImgPath}watch.png` });
      resource.push({ name: 'introBackBubble', url: `${introImgPath}back_bubble.png` });
   }

console.log(resource);
   return resource;
}
