/* 
  StateManager.ts

  Class that manages the states defined in the FSM. Manages the output and
  receiving inputs to and from users, and handles life of program accordingly.
*/

import { ProcessService } from "../Process/Process";
import { StateService } from "../States/States";
import { Output } from "../Output/Output";
import * as Constants from "../../constants/constants";
import * as Types from "../../model/types";
import { sm } from "jssm";

const FSM = sm`
  Initial -> Primary 'next' -> Terminate;
`;

export class StateManagerService {
  private _states: Types.StatesTemplate;
  private _process: any;
  private _stateMachine: any;
  private _generatedResponse: any;
  private _botSpeechActiveInterval: any;
  private _checkForUserInputInterval: any;
  private _outputObject: any;

  public constructor() {
    this._stateMachine = FSM;
    this._process = new ProcessService();
    this._states = new StateService(this._process, this._stateMachine).states;
    this._generatedResponse = "";
    this._outputObject = Output;

    this.initiateChatBot();
  }

  public async initiateChatBot() {
    const currentStateName = this._stateMachine.state();
    const currentState = this._states[`${currentStateName}`];
    this._generatedResponse = "";

    try {
      if (!currentState.outputGenericResponse) {
        throw Error(Constants.INSUFFICIENT_DATA_ERROR);
      }

      if (currentStateName === Constants.STATE_INITIAL) {
        this.welcomeUser(currentState);
      } else {
        this.promptUser(currentState);
      }

      this.requestUserInput(currentState);
    } catch (error) {
      console.log(error);
    }
  }

  public welcomeUser(currentState: Types.State) {
    if (!currentState.outputGenericResponse) {
      throw Error(Constants.INSUFFICIENT_DATA_ERROR);
    }

    Output.print(currentState.outputGenericResponse());

    if (Output.speechEnabled) {
      Output.speak(currentState.outputGenericResponse(), Output.speechSpeed);
    }

    this._botSpeechActiveInterval = setInterval(() => {
      if (!Output.isSpeaking) {
        clearInterval(this._botSpeechActiveInterval);
        currentState.transission(Constants.STATE_PRIMARY);
        this.initiateChatBot();
      }
    }, 500);
  }

  public promptUser(currentState: Types.State) {
    this._checkForUserInputInterval = setInterval(() => {
      if (!currentState.outputGenericResponse) {
        throw Error(Constants.INSUFFICIENT_DATA_ERROR);
      }

      let genericResponse = currentState.outputGenericResponse();

      Output.print(genericResponse);

      if (Output.speechEnabled) {
        Output.speak(genericResponse, Output.speechSpeed);
      }
    }, 30000);
  }

  public async requestUserInput(currentState: Types.State) {
    if (currentState.determineResponse) {
      this._generatedResponse = await currentState.determineResponse();
      clearInterval(this._checkForUserInputInterval);

      this.adjustSpeechSettings(this._generatedResponse[1]);

      if (Output.speechEnabled) {
        Output.stopSpeech();
        Output.speak(this._generatedResponse[0], Output.speechSpeed);
      }

      Output.print(this._generatedResponse[0]);

      this._botSpeechActiveInterval = setInterval(() => {
        if (!Output.isSpeaking) {
          if (this._generatedResponse[1] === Constants.TRANSITION_TO_END) {
            currentState.transission(Constants.STATE_END);
            this._states[this._stateMachine.state()].transission();
          }

          clearInterval(this._botSpeechActiveInterval);
          this.initiateChatBot();
        }
      }, 500);
    }
  }

  public adjustSpeechSettings(intent: string) {
    if (intent === Constants.SPEECH_ENABLE) {
      Output.speechEnabled = true;
    } else if (intent === Constants.SPEECH_DISABLE) {
      Output.speechEnabled = false;
    } else if (intent === Constants.SPEECH_SPEED_INCREASE) {
      Output.speechSpeed += Constants.SPEECH_SPEED_INCREMENT;
    } else if (intent === Constants.SPEECH_SPEED_DECREASE) {
      Output.speechSpeed -= Constants.SPEECH_SPEED_INCREMENT;
    }
  }
  public get states() {
    return this._states;
  }

  public get outputObject() {
    return this._outputObject;
  }
}
