/* 
  Process.ts

  Takes in a JSON data file and processes it into a neural network-ready form. This includes tokenization,
  stemming, creating bags of words which then get utilized to create a neural network.
*/

import { NeuralNetworkData } from "../../model/types";
import dataFile from "../../data/intents.json";
const brain = require("brain.js");
import natural from "natural";

export class ProcessService {
  private _dataFile: any;
  private _trainedNetwork: any;

  private _patternWords: string[] = [];
  private _intentTags: string[] = [];
  private _intentDocumentList: Array<[string[], string]> = [];

  private _training: Array<NeuralNetworkData> = [];

  public constructor() {
    this._dataFile = dataFile;
    this.preProcessData();
  }

  public preProcessData() {
    this.stemPatterns();
    this.createBagsOfWords();
    this.buildNeuralNetwork();
  }

  public stemPatterns() {
    const tokenizer = new natural.WordTokenizer();

    let allWords: string[] = [];

    this._dataFile["intents"].forEach((intent: any, index: number) => {
      intent.patterns.forEach((pattern: string) => {
        const tokenizedPatternWords: string[] = tokenizer.tokenize(pattern);

        tokenizedPatternWords.forEach((word) => {
          allWords.push(word);
        });

        this._intentDocumentList.push([tokenizedPatternWords, intent["tag"]]);
      });
      if (!this._intentTags.includes(intent["tag"])) {
        this._intentTags.push(intent["tag"]);
      }
    });

    allWords = allWords.map((word) =>
      natural.PorterStemmer.stem(word.toLowerCase())
    );

    this._patternWords = [...new Set(allWords)];
    this._intentTags = [...new Set(this._intentTags)];
  }

  public createBagsOfWords() {
    const outputTemplate: number[] = new Array(this._intentTags.length).fill(0);

    this._intentDocumentList.forEach((document) => {
      let bagOfWords: number[] = [];
      let currentPattern = document[0];

      currentPattern = currentPattern.map((word) =>
        natural.PorterStemmer.stem(word.toLowerCase())
      );

      this._patternWords.forEach((word) =>
        currentPattern.includes(word) ? bagOfWords.push(1) : bagOfWords.push(0)
      );

      let tagRelatedBagOfWords: number[] = Object.assign([], outputTemplate);
      tagRelatedBagOfWords[this._intentTags.indexOf(document[1])] = 1;

      this._training.push({ input: bagOfWords, output: tagRelatedBagOfWords });
    });
  }

  public buildNeuralNetwork() {
    const config = {
      iterations: 100000,
      binaryThresh: 0.5,
      hiddenLayers: [10],
      activation: "sigmoid",
      learningRate: 0.6,
    };

    const net = new brain.NeuralNetwork(config);

    net.train(this._training);

    this._trainedNetwork = net;
  }

  public get dataFile() {
    return this._dataFile;
  }

  public get trainedNetwork() {
    return this._trainedNetwork;
  }

  public get patternWords() {
    return this._patternWords;
  }

  public get intentTags() {
    return this._intentTags;
  }

  public get intentDocumentList() {
    return this._intentDocumentList;
  }
}
