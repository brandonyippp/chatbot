import { ProcessService } from "../Process/Process";

const Process = new ProcessService();

describe(`Processes .json file into a trained neural network.`, () => {
  it(`Should have functions to tokenize and stem inputs,
  create bags of words (arrays of 0's and 1's) from them,
  and create and train a neural network from this data`, () => {
    expect(Process.preProcessData).toBeDefined();
    expect(Process.stemPatterns).toBeDefined();
    expect(Process.createBagsOfWords).toBeDefined();
    expect(Process.buildNeuralNetwork).toBeDefined();
  });

  it("Should have set state variables according to json file data.", () => {
    expect(Process.trainedNetwork).toBeDefined();
    expect(Process.patternWords.length).toBe(265);
    expect(Process.intentTags.length).toBe(41);
    expect(Process.intentDocumentList.length).toBe(424);
  });
});
