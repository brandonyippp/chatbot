import { Output } from "../Output/Output";
import {
  DEFAULT_SPEECH_SPEED,
  SPEECH_SPEED_INCREMENT,
} from "../../constants/constants";

const say = require("say");
jest.mock("say");

describe(`Output voice & text to console class`, () => {
  const message = "This is a non-empty message for testing purposes.";

  it(`Should offer functionality to print to console, and to speak and stop speaking`, () => {
    expect(Output.print).toBeDefined();
    expect(Output.speak).toBeDefined();
    expect(Output.stopSpeech).toBeDefined();

    expect(DEFAULT_SPEECH_SPEED).toBe(1.25); /* Subject to change */
    expect(Output.speechSpeed).toBe(DEFAULT_SPEECH_SPEED);
  });

  describe(`Voice speech is outputted when`, () => {
    it(`_speechEnabled is set to true (true by default)`, () => {
      expect(Output.speechEnabled).toBeTruthy();
    });

    it(`isSpeaking is false until a message is provided the speak function`, () => {
      expect(Output.isSpeaking).toBeFalsy();
    });

    it(`Should speak an inputted message and set _isSpeaking to true while being read`, () => {
      Output.speak(message);
      expect(say.speak).toHaveBeenCalled();
      expect(Output.isSpeaking).toBeTruthy();
    });

    it(`Should stop reading the message upon calling the stopSpeech() function`, () => {
      Output.stopSpeech();
      expect(say.stop).toHaveBeenCalled();
    });

    it(`Should set _isSpeaking back to false once the message has either reached termination or stopSpeech() has been called`, () => {
      expect(Output.isSpeaking).toBeFalsy();
    });

    it(`Should adjust its speech speed depending on the number passed in`, () => {
      Output.speechSpeed = Output.speechSpeed - SPEECH_SPEED_INCREMENT;
      expect(Output.speechSpeed).toBe(1);

      Output.speechSpeed = Output.speechSpeed + SPEECH_SPEED_INCREMENT;
      expect(Output.speechSpeed).toBe(1.25);
    });
  });

  describe(`Text should be outputted when`, () => {
    it(`Calls print() method, and should log to console ${message}`, () => {
      const consoleSpy = jest.spyOn(console, "log");

      Output.print(message);

      expect(consoleSpy).toHaveBeenCalledWith(message);
    });
  });
});
