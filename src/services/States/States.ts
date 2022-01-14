/* 
  States.ts

  Class dedicated to declaring different states for the Finite State Machine used by this program.
*/

import { StatesTemplate, StateTypes } from "../../model/types";
import { ProcessService } from "../Process/Process";
import { ResponseService } from "../Response/Response";
import { STATE_END } from "../../constants/constants";

export class StateService {
  private _states: StatesTemplate;
  private _response: ResponseService;
  private stateMachine: any;
  private isAskingForName: boolean = true;
  private _dataProcessor: any;

  constructor(dataProcessor: ProcessService, stateMachine: any) {
    this._states = this.initializeStates();
    this._response = new ResponseService(dataProcessor);
    this.stateMachine = stateMachine;
    this._dataProcessor = dataProcessor;
  }

  public initializeStates() {
    return {
      Initial: {
        type: StateTypes.Question,
        outputGenericResponse: () => "Welcome to ThinkBot! What is your name?",
        transission: (intent: string) => {
          this.stateMachine.transition(intent);
        },
      },
      Primary: {
        type: StateTypes.Question,
        outputGenericResponse: () => {
          const periodicMessagesTagIndex: number =
            this.determineTagIndex("Periodic Messages");

          const intent =
            this._dataProcessor.dataFile["intents"][periodicMessagesTagIndex];

          return intent.responses[
            this.generateRandomIndex(intent.responses.length)
          ];
        },
        determineResponse: async () => {
          const response = await this._response.determineResponse(
            this.isAskingForName
          );
          this.isAskingForName = false;

          return response;
        },
        transission: (intent: string) => {
          if (intent === STATE_END) {
            this.stateMachine.transition("Terminate");
          }
        },
      },
      Terminate: {
        type: StateTypes.Statement,
        transission: () => {
          this._response.interface.close();
          process.exit();
        },
      },
    };
  }

  public generateRandomIndex(upperBound: number) {
    return Math.floor(Math.random() * upperBound);
  }

  public determineTagIndex(tag: string) {
    let tagIndex = 0;

    this._dataProcessor.dataFile["intents"].forEach(
      (intent: any, index: number) => {
        if (intent["tag"] === tag) {
          tagIndex = index;
        }
      }
    );
    return tagIndex;
  }

  public get states() {
    return this._states;
  }
}
