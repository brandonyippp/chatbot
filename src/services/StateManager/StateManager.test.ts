import { StateManagerService } from "../StateManager/StateManager";
import * as Constants from "../../constants/constants";
import { Output } from "../Output/Output";

const say = require("say");
jest.mock("say");

const StateManager = new StateManagerService();

describe(`Manages the application, specifically by instantiating other lower-level classes
         and managing cycles of requesting for user input, processing it when received, and doing
         in-between operations while waiting for said user inputs.`, () => {
  it(`Should have functions to initialize the chatbot, including welcoming and prompting user, and requesting for input`, () => {
    expect(StateManager.initiateChatBot).toBeDefined();
    expect(StateManager.welcomeUser).toBeDefined();
    expect(StateManager.promptUser).toBeDefined();
    expect(StateManager.requestUserInput).toBeDefined();
    expect(StateManager.adjustSpeechSettings).toBeDefined();
  });

  StateManager.welcomeUser(StateManager.states["Primary"]);

  describe(`Makes calls to the Output.ts class, invoking the \"say\" library in some cases and adjusting state variables in others.`, () => {
    it(`Should set Output._isSpeaking to true when welcomeUser() is called, and Output._speechEnabled to be true`, () => {
      setTimeout(() => {
        expect(StateManager.outputObject.speechEnabled).toBeTruthy();
        expect(StateManager.outputObject.isSpeaking).toBeTruthy();
      }, 500);
    });

    StateManager.outputObject.stopSpeech();

    it(`Should set Output._isSpeaking to false when Output.stopSpeech is called`, () => {
      expect(StateManager.outputObject.isSpeaking).toBeFalsy();
    });

    StateManager.promptUser(StateManager.states["Primary"]);

    it(`Should set Output._isSpeaking to true when promptUser() is called`, () => {
      setTimeout(() => {
        expect(StateManager.outputObject.isSpeaking).toBeTruthy();
      }, 500);
    });

    StateManager.outputObject.stopSpeech();

    it(`Should set Output._isSpeaking to false when Output.stopSpeech is called`, () => {
      expect(StateManager.outputObject.isSpeaking).toBeFalsy();
    });

    describe(`Adjusting speech settings related to speed and/or enablement`, () => {
      it(`Should set speechEnabled to false if the intent is equal to \"Voice Off\"`, () => {
        StateManager.adjustSpeechSettings(Constants.SPEECH_DISABLE);
        expect(StateManager.outputObject.speechEnabled).toBeFalsy();
      });

      it(`Should set speechEnabled to true if the intent is equal to \"Voice On\"`, () => {
        StateManager.adjustSpeechSettings(Constants.SPEECH_ENABLE);
        expect(StateManager.outputObject.speechEnabled).toBeTruthy();
      });

      it(`Should subtract 0.25 from the speech speed (default of 1.25) if the intent is equal to \"Slower Speech\"`, () => {
        StateManager.adjustSpeechSettings(Constants.SPEECH_SPEED_DECREASE);
        expect(StateManager.outputObject.speechSpeed).toBe(1);
      });

      it(`Should add 0.25 to the speech speed (default of 1.25) if the intent is equal to \"Faster Speech\"`, () => {
        StateManager.adjustSpeechSettings(Constants.SPEECH_SPEED_INCREASE);
        expect(StateManager.outputObject.speechSpeed).toBe(1.25);
      });
    });
  });
});
