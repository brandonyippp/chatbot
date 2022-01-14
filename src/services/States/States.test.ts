import { ProcessService } from "../Process/Process";
import { StateService } from "../States/States";
import { sm } from "jssm";

const FSM = sm`
Initial -> Primary 'next' -> Terminate;
`;

const Process = new ProcessService();
const States = new StateService(Process, FSM);

describe(`Initializes states of FSM for program and passes data down to other components`, () => {
  it(`Should have functions to initialize states of FSM, and determine information related to and from array indices`, () => {
    expect(States.initializeStates).toBeDefined();
    expect(States.generateRandomIndex).toBeDefined();
    expect(States.determineTagIndex).toBeDefined();
  });

  describe(`Calls function to initiate its states on construction`, () => {
    it(`Should have _states.length === 3`, () => {
      expect(Object.keys(States.states).length).toBe(3);
    });
  });

  describe(`Functions to retrieve indices and determine values of indices`, () => {
    it(`Should have a function to generate a random index between 0 (inclusive) and an upper bound (exclusive)`, () => {
      expect(States.generateRandomIndex(1)).toBe(0);
    });

    it(`Should have a function to determine the index (in intents.json) of a certain tag`, () => {
      expect(States.determineTagIndex("Greetings")).toBe(0);
    });
  });
});
