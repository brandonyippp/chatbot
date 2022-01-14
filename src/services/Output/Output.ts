/* 
  Output.ts

  Class for outputting responses via text and/or voice. Only has console.log text implementations at this point,
  but can easily be adapted to displaying on a frontend application.
*/

const say = require("say");
import { DEFAULT_SPEECH_SPEED } from "../../constants/constants";

export class OutputService {
  private _speechEnabled: boolean;
  private _isSpeaking: boolean;
  private _speechSpeed: number;

  public constructor() {
    this._speechEnabled = true;
    this._isSpeaking = false;
    this._speechSpeed = DEFAULT_SPEECH_SPEED;
  }

  public print(message: string) {
    console.log(message);
  }

  public speak(message: string, speechSpeed?: number) {
    say.speak(
      message,
      null,
      speechSpeed ? speechSpeed : this._speechSpeed,
      () => {
        this._isSpeaking = false;
      }
    );
    this._isSpeaking = true;
  }

  public stopSpeech() {
    say.stop();
    this._isSpeaking = false;
  }

  public get speechEnabled() {
    return this._speechEnabled;
  }

  public set speechEnabled(enabled: boolean) {
    this._speechEnabled = enabled;
  }

  public get isSpeaking() {
    return this._isSpeaking;
  }

  public set isSpeaking(speaking: boolean) {
    this._isSpeaking = speaking;
  }

  public get speechSpeed() {
    return this._speechSpeed;
  }

  public set speechSpeed(speed: number) {
    this._speechSpeed = speed;
  }
}

export const Output = new OutputService();
