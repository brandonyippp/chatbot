/* 
  Response.ts

  This class generates the best response given a users input. Either outputting a response from the highest probable category
  or a random message from a specific category if conditions are met (i.e first input of program asks for users name -> will always
  output a random response from that specific category).
*/

import {
  MINIMUM_PROBABILITY_THRESHOLD,
  PERSONABLE_TAGS,
  MUSIC_RECOMMENDATION_TAGS,
  MOVIE_RECOMMENDATION_TAGS,
  //DESIRED_ENCODING_LANGUAGE
} from "../../constants/constants";
// import { Translate } from "../Translate/Translate";
import { ProcessService } from "../Process/Process";
import * as readline from "readline";
import natural from "natural";

export class ResponseService {
  private _dataProcessor: ProcessService;
  private _interface: any;
  private _userName: string = "friend";
  // translationSuccessful: boolean = true;

  public constructor(_dataProcessor: ProcessService) {
    this._dataProcessor = _dataProcessor;

    this._interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  public async determineResponse(isAskingForName: boolean) {
    const userInput: string = (await this.invokeUserInput()
      .then((userInput) => userInput)
      .catch((error) => {
        console.log(error);
      })) as string;

    if (isAskingForName) {
      this._userName = userInput;
    }

    /*
    
    *** Refer to Translate.ts documentation ***

    let translatedUserInput = "";

    const potentialLanguages = Translate.detectLanguage(userInput);
    if (potentialLanguages.length !== 0) {
      translatedUserInput = await Translate.translateToEnglish(
        userInput,
        potentialLanguages[0][0]
      );
    }

    this.translationSuccessful =
      typeof translatedUserInput === "undefined" ? false : true;

    const processedUserInput: string[] = this.stemUserInput(
      this.translationSuccessful ? translatedUserInput : userInput
    );

    */

    const processedUserInput: string[] = this.stemUserInput(userInput);

    const bagOfWords: number[] = this.generateBagOfWords(processedUserInput);

    return this.generateOutput(bagOfWords, userInput, isAskingForName);
  }

  public invokeUserInput() {
    return new Promise((resolve) => {
      this._interface.question("\r> ", (userInput: string) =>
        resolve(userInput)
      );
    });
  }

  public stemUserInput(userInput: string) {
    const tokenizer = new natural.WordTokenizer();
    let tokenizedUserInput: string[] = tokenizer.tokenize(userInput);

    let processedUserInput: string[] = tokenizedUserInput.map((word) =>
      natural.PorterStemmer.stem(word.toLowerCase())
    );

    return processedUserInput;
  }

  public generateBagOfWords(processedUserInput: string[]) {
    let bagOfWords: number[] = new Array(
      this._dataProcessor.patternWords.length
    ).fill(0);

    processedUserInput.forEach((word) => {
      this._dataProcessor.patternWords.forEach((patternWord, index) => {
        if (patternWord === word) {
          bagOfWords[index] = 1;
        }
      });
    });

    return bagOfWords;
  }

  public generateOutput(
    bagOfWords: number[],
    userInput: string,
    isAskingForName: boolean
  ) {
    const probabilities: Float64Array =
      this._dataProcessor.trainedNetwork.run(bagOfWords);

    let highestProbabilityIntent: any = this.determineMostApplicableIntent(
      probabilities,
      isAskingForName
    );

    const highestProbabilityIntentTag = highestProbabilityIntent["tag"];

    let selectedResponse =
      highestProbabilityIntent.responses[
        this.generateRandomIndex(highestProbabilityIntent.responses.length)
      ];

    /* Create a more personalized message for the user including their name */
    if (PERSONABLE_TAGS.includes(highestProbabilityIntentTag)) {
      if (highestProbabilityIntentTag === "Set Username") {
        this._userName = userInput;
      }

      selectedResponse = this.createPersonableResponse(
        selectedResponse,
        highestProbabilityIntentTag,
        isAskingForName
      );
    } else if (
      MUSIC_RECOMMENDATION_TAGS.includes(highestProbabilityIntentTag)
    ) {
      selectedResponse = this.createMusicRecommendationResponse(
        highestProbabilityIntentTag
      );
    } else if (
      MOVIE_RECOMMENDATION_TAGS.includes(highestProbabilityIntentTag)
    ) {
      selectedResponse = this.createMovieRecommendationResponse(
        highestProbabilityIntentTag
      );
    }

    const myArr: { [key: number]: any } = new Array(
      selectedResponse,
      highestProbabilityIntentTag
    );
    return myArr;
  }

  public determineMostApplicableIntent(
    probabilities: any,
    isAskingForName: boolean
  ) {
    let highestProbabilityIntent: any;

    const intents = this._dataProcessor.dataFile["intents"];

    const highestProbabilityIndex: number =
      this.determineIndexOfLargestElement(probabilities);

    const miscellaneousTagIndex: number =
      this.determineTagIndex("Miscellaneous");

    const setUsernameIndex: number = this.determineTagIndex("Set Username");

    if (isAskingForName) {
      highestProbabilityIntent = intents[setUsernameIndex];
    } else if (
      probabilities[highestProbabilityIndex] < MINIMUM_PROBABILITY_THRESHOLD
    ) {
      highestProbabilityIntent = intents[miscellaneousTagIndex];
    } else {
      highestProbabilityIntent = intents[highestProbabilityIndex];
    }

    return highestProbabilityIntent;
  }

  public createPersonableResponse(
    selectedResponse: string,
    highestProbabilityIntentTag: string,
    isAskingForName: boolean
  ) {
    let desiredTagIndex: number = 0;

    const intents = this._dataProcessor.dataFile["intents"];
    let intent: any;
    let randomIntentResponse: string;

    if (isAskingForName) {
      /* Triggered upon providing name to bot */
      desiredTagIndex = this.determineTagIndex("Personable Acknowledge");

      intent = intents[desiredTagIndex];

      randomIntentResponse =
        intent.responses[this.generateRandomIndex(intent.responses.length)];
    } else if (highestProbabilityIntentTag === "Goodbye") {
      desiredTagIndex = this.determineTagIndex("Personable Goodbye");

      intent = intents[desiredTagIndex];

      randomIntentResponse =
        intent.responses[this.generateRandomIndex(intent.responses.length)];
    } else {
      /* Triggered on saying hello to bot */
      desiredTagIndex = this.determineTagIndex("Personable Greeting");

      intent = intents[desiredTagIndex];

      randomIntentResponse =
        intent.responses[this.generateRandomIndex(intent.responses.length)];
    }

    return `${randomIntentResponse} ${this._userName}. ${selectedResponse}`;
  }

  public createMusicRecommendationResponse(
    highestProbabilityIntentTag: string
  ) {
    const intents = this._dataProcessor.dataFile["intents"];

    let introductionTagIndex: number = 0;
    let introductionIntent: any;
    let randomIntroductionResponse: string;

    let songRecommendationTagIndex: number = 0;
    let songRecommendationIntent: any;
    let randomSongRecommendationResponse: string;

    let finalResponse: string = "";

    /* Add an if block here if adding more song recommendation genres to intents.json */
    if (
      highestProbabilityIntentTag === "Music Recommendation Introduction - Rap"
    ) {
      introductionTagIndex = this.determineTagIndex(
        "Music Recommendation Introduction - Rap"
      );
      songRecommendationTagIndex = this.determineTagIndex("Rap Songs");
    } else if (
      highestProbabilityIntentTag ===
      "Music Recommendation Introduction - Hip-Hop"
    ) {
      introductionTagIndex = this.determineTagIndex(
        "Music Recommendation Introduction - Hip-Hop"
      );
      songRecommendationTagIndex = this.determineTagIndex("Hip-Hop Songs");
    } else if (
      highestProbabilityIntentTag ===
      "Music Recommendation Introduction - Electronic"
    ) {
      introductionTagIndex = this.determineTagIndex(
        "Music Recommendation Introduction - Electronic"
      );
      songRecommendationTagIndex = this.determineTagIndex("Electronic Songs");
    }

    introductionIntent = intents[introductionTagIndex];
    songRecommendationIntent = intents[songRecommendationTagIndex];

    randomIntroductionResponse =
      introductionIntent.responses[
        this.generateRandomIndex(introductionIntent.responses.length)
      ];
    randomSongRecommendationResponse =
      songRecommendationIntent.responses[
        this.generateRandomIndex(songRecommendationIntent.responses.length)
      ];

    finalResponse = this.concatenateResponses(
      randomIntroductionResponse,
      randomSongRecommendationResponse
    );

    return `${finalResponse}!`;
  }

  public createMovieRecommendationResponse(
    highestProbabilityIntentTag: string
  ) {
    const intents = this._dataProcessor.dataFile["intents"];

    let introductionTagIndex: number = 0;
    let introductionIntent: any;
    let randomIntroductionResponse: string;

    let movieRecommendationTagIndex: number = 0;
    let movieRecommendationIntent: any;
    let randomMovieRecommendationResponse: string;

    let finalResponse: string = "";

    /* Add an if block here if adding more song recommendation genres to intents.json */
    if (
      highestProbabilityIntentTag ===
      "Movie Recommendation Introduction - Action"
    ) {
      introductionTagIndex = this.determineTagIndex(
        "Movie Recommendation Introduction - Action"
      );
      movieRecommendationTagIndex = this.determineTagIndex("Action Movies");
    } else if (
      highestProbabilityIntentTag ===
      "Movie Recommendation Introduction - Drama"
    ) {
      introductionTagIndex = this.determineTagIndex(
        "Movie Recommendation Introduction - Drama"
      );
      movieRecommendationTagIndex = this.determineTagIndex("Drama Movies");
    } else if (
      highestProbabilityIntentTag ===
      "Movie Recommendation Introduction - Horror"
    ) {
      introductionTagIndex = this.determineTagIndex(
        "Movie Recommendation Introduction - Horror"
      );
      movieRecommendationTagIndex = this.determineTagIndex("Horror Movies");
    }

    introductionIntent = intents[introductionTagIndex];
    movieRecommendationIntent = intents[movieRecommendationTagIndex];

    randomIntroductionResponse =
      introductionIntent.responses[
        this.generateRandomIndex(introductionIntent.responses.length)
      ];
    randomMovieRecommendationResponse =
      movieRecommendationIntent.responses[
        this.generateRandomIndex(movieRecommendationIntent.responses.length)
      ];

    finalResponse = this.concatenateResponses(
      randomIntroductionResponse,
      randomMovieRecommendationResponse
    );

    return `${finalResponse}!`;
  }

  public concatenateResponses(firstResponse: string, secondResponse: string) {
    return firstResponse + secondResponse;
  }

  public generateRandomIndex(upperBound: number) {
    return Math.floor(Math.random() * upperBound);
  }

  public determineIndexOfLargestElement(probabilities: Float64Array) {
    let largestIndex: number = 0;
    for (let i = 0; i < probabilities.length; i++) {
      largestIndex =
        probabilities[i] > probabilities[largestIndex] ? i : largestIndex;
    }

    return largestIndex;
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

  public get dataProcessor() {
    return this._dataProcessor;
  }
  public get interface() {
    return this._interface;
  }
  public get userName() {
    return this._userName;
  }
}
