
const fontPath = 'fonts/';
const audioPath = 'audio/';
const commonImgPath = 'images/game/common/';
const introImgPath = 'images/game/letter-teams/intro/';
const mainImgPath = 'images/game/letter-teams/main/';
const resultImgPath = 'images/game/letter-teams/result/';
const spritesheetPath = 'images/game/letter-teams/spritesheet/';




export default ( langCode: string, low: number ) => {


   const resource = [

      //common
      { name: 'LexendDeca-Light', url: `${fontPath}LexendDeca-Light.ttf`},
      { name: 'LexendDeca-Regular', url: `${fontPath}LexendDeca-Regular.ttf`},
      { name: 'LexendDeca-SemiBold', url: `${fontPath}LexendDeca-SemiBold.ttf`},
      { name: 'LexendDeca-Bold', url: `${fontPath}LexendDeca-Bold.ttf`},
      { name: 'Maplestory Bold', url: `${fontPath}Maplestory Bold.ttf`},
      { name: 'audioBgm', url: `${audioPath}bgm_phonics.mp3` },
      { name: 'audioClick', url: `${audioPath}click.mp3` },
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
      { name: 'introBgEffect', url: `${introImgPath}bg_effect.png`},
      { name: 'introInfoBtn', url: `${introImgPath}info_btn.png`},
      { name: 'introStartBtnDefault', url: `${introImgPath}start_btn_default.png`},
      { name: 'introStartBtnHover', url: `${introImgPath}start_btn_hover.png`},
      { name: 'introCharactor', url: `${introImgPath}charactor.png`},
      { name: 'introTitle1', url: `${introImgPath}title1.png`},
      { name: 'introTitle2', url: `${introImgPath}title2.png`},
      { name: 'introBalloon1', url: `${introImgPath}balloon1.png`},
      { name: 'introBalloon2', url: `${introImgPath}balloon2.png`},
      { name: 'introBalloon3', url: `${introImgPath}balloon3.png`},
      { name: 'introBalloon4', url: `${introImgPath}balloon4.png`},
      { name: 'introBalloon5', url: `${introImgPath}balloon5.png`},
      { name: 'introBalloon6', url: `${introImgPath}balloon6.png`},
      { name: 'introBalloon7', url: `${introImgPath}balloon7.png`},



      // main
      { name: 'commonResetBtn', url: `${commonImgPath}reset_btn.png` },
      { name: 'mainPickerBg', url: `${mainImgPath}picker_bg.png` },
      { name: 'mainPickerUp', url: `${mainImgPath}picker_up.png` },
      { name: 'mainPickerDown', url: `${mainImgPath}picker_down.png` },
      { name: 'commonProgressBar1', url: `${commonImgPath}progress_bar1.png` },
      { name: 'commonProgressBar2', url: `${commonImgPath}progress_bar2.png` },
      { name: 'mainBottomUiBg', url: `${mainImgPath}bottom_ui_bg.png` },
      { name: 'mainScoreBg', url: `${mainImgPath}score_bg.png`},
      { name: 'mainScoreTitle', url: `${mainImgPath}score_title.png`},
      { name: 'mainProgressBg', url: `${mainImgPath}progress_bg.png` },
      { name: 'mainBonusBg', url: `${mainImgPath}bonus_bg.png`},
      { name: 'mainBonusOn', url: `${mainImgPath}bonus_on.png`},
      { name: 'mainGround', url: `${mainImgPath}ground.png`},
      { name: 'mainSky', url: `${mainImgPath}sky.png`},
      { name: 'mainCloud1', url: `${mainImgPath}cloud1.png`},
      { name: 'mainCloud2', url: `${mainImgPath}cloud2.png`},
      { name: 'mainBasket', url: `${mainImgPath}basket.png`},
      { name: 'mainSoundBtn', url: `${mainImgPath}sound_btn.png`},
      { name: 'mainEnterOffBtn', url: `${mainImgPath}enter_btn_off.png`},
      { name: 'mainEnterOnBtn', url: `${mainImgPath}enter_btn_on.png`},
      { name: 'mainBalloonLeft1', url: `${mainImgPath}balloon_left_1.png`},
      { name: 'mainBalloonLeft2', url: `${mainImgPath}balloon_left_2.png`},
      { name: 'mainBalloonRight1', url: `${mainImgPath}balloon_right_1.png`},
      { name: 'mainBalloonRight2', url: `${mainImgPath}balloon_right_2.png`},
      { name: 'mainScorePlus40', url: `${mainImgPath}score_plus_40.png`},
      { name: 'mainScorePlus60', url: `${mainImgPath}score_plus_60.png`},
      { name: 'mainScorePlus80', url: `${mainImgPath}score_plus_80.png`},
      { name: 'mainScorePlus100', url: `${mainImgPath}score_plus_100.png`},
      { name: 'mainScoreMinus10', url: `${mainImgPath}score_minus_10.png`},
      { name: 'mainBonus1Light', url: `${mainImgPath}bonus1_light.png`},
      { name: 'mainBonus1Bg', url: `${mainImgPath}bonus1_bg.png`},
      { name: 'mainBonus1Star', url: `${mainImgPath}bonus1_star.png`},
      { name: 'mainStarLight', url: `${mainImgPath}star_light.png`},
      { name: 'mainWhiteStar', url: `${mainImgPath}white_star.png`},
      { name: 'mainWhiteLine', url: `${mainImgPath}white_line.png`},
      { name: 'mainPartyBg', url: `${mainImgPath}party_bg.png`},
      { name: 'mainRibon1', url: `${mainImgPath}ribon1.png`},
      { name: 'mainRibon2', url: `${mainImgPath}ribon2.png`},
      { name: 'mainRibon3', url: `${mainImgPath}ribon3.png`},
      { name: 'mainRibon4', url: `${mainImgPath}ribon4.png`},
      { name: 'mainRibon5', url: `${mainImgPath}ribon5.png`},

      { name: 'spritesheetBalloonLight1', url: `${spritesheetPath}balloon_light1.json` },
      { name: 'spritesheetBalloonLight2', url: `${spritesheetPath}balloon_light2.json` },
      { name: 'spritesheetFireWork1', url: `${spritesheetPath}firework1.json` },
      { name: 'spritesheetFireWork2', url: `${spritesheetPath}firework2.json` },
      { name: 'spritesheetFireWork3', url: `${spritesheetPath}firework3.json` },
      { name: 'spritesheetFireWork4', url: `${spritesheetPath}firework4.json` },
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
      { name: 'resultLeft', url: `${resultImgPath}top_left_img.png`},
      { name: 'resultRightSuccess', url: `${resultImgPath}top_right_success_img.png`},
      { name: 'resultRightFailed', url: `${resultImgPath}top_right_failed_img.png`},
      { name: 'resultSuccessMsg1', url: `${resultImgPath}success_message1.png`},
      { name: 'resultSuccessMsg2', url: `${resultImgPath}success_message2.png`},
      { name: 'resultSuccessMsg3', url: `${resultImgPath}success_message3.png`},
      { name: 'resultFailedMsg1', url: `${resultImgPath}failed_message1.png`},
      { name: 'resultFailedMsg2', url: `${resultImgPath}failed_message2.png`},
      { name: 'resultFailedMsg3', url: `${resultImgPath}failed_message3.png`},

      
      
   ];

   resource.push({ name: 'introInfoText', url: `${introImgPath}info_text_${langCode}.png`});

   if(low === 0) {
      resource.push({ name: 'commonWatchBody', url: `${commonImgPath}watch_body.png` });
      resource.push({ name: 'commonWatchButton', url: `${commonImgPath}watch_button.png` });
      resource.push({ name: 'commonWatchBubble', url: `${commonImgPath}watch_bubble.png` });
   } else {
      resource.push({ name: 'commonWatch', url: `${commonImgPath}watch.png` });
   }

   
   return resource;
}
