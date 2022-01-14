import { ResponseService } from "../Response/Response";
import { ProcessService } from "../Process/Process";

describe(`Takes in user input and outputs most probable response from options listed in intents.json`, () => {
  const Process = new ProcessService();
  const Response = new ResponseService(Process);

  const message = "Brandon Yip";

  it(`Should have functions to request for user input, tokenize and stem user input, create bags of words from them, and generate an output`, () => {
    expect(Response.determineResponse).toBeDefined();
    expect(Response.invokeUserInput).toBeDefined();
    expect(Response.stemUserInput).toBeDefined();
    expect(Response.generateBagOfWords).toBeDefined();
    expect(Response.generateOutput).toBeDefined();
  });

  it(`Should have functions defined to return messages crafted to prepend and/or append relevant information`, () => {
    expect(Response.createPersonableResponse).toBeDefined();
    expect(Response.createMusicRecommendationResponse).toBeDefined();
    expect(Response.createMovieRecommendationResponse).toBeDefined();
    expect(Response.concatenateResponses).toBeDefined();
  });

  it(`Should have functions to determine and identify meaningful information of array elements, such as indices and elements of said indices`, () => {
    expect(Response.determineMostApplicableIntent).toBeDefined();
    expect(Response.generateRandomIndex).toBeDefined();
    expect(Response.determineIndexOfLargestElement).toBeDefined();
    expect(Response.determineTagIndex).toBeDefined();
  });

  const processedUserInput = Response.stemUserInput(message);

  describe(`Tokenizes and stems given input`, () => {
    it(`Should return an array of strings rather than a singular string`, () => {
      expect(processedUserInput).toBeInstanceOf(Array);
    });
  });

  const bagOfWordsOutput = Response.generateBagOfWords(processedUserInput);

  describe(`Creates a bag of words`, () => {
    it(`Should return an array of 0's and 1's with length === # of patterns in intents.json`, () => {
      expect(bagOfWordsOutput.length).toBe(265);
    });
  });

  describe(`Return response with most relevant tag`, () => {
    it(`Should return a response in category of \"Set Username\"`, () => {
      expect(Response.generateOutput(bagOfWordsOutput, message, true)[1]).toBe(
        "Set Username"
      );
    });
  });

  const probabilities: Float64Array =
    Process.trainedNetwork.run(bagOfWordsOutput);

  let highestProbabilityIntent: any = Response.determineMostApplicableIntent(
    probabilities,
    true
  );

  const highestProbabilityIntentTag = highestProbabilityIntent["tag"];

  describe(`Has functions to determine array index-relevant information`, () => {
    it(`Should return index largest element in array`, () => {
      expect(Response.determineIndexOfLargestElement(probabilities)).toBe(5);
    });
  });

  describe(`Has functions to construct unique strings depending on user input`, () => {
    it(`Should return a string that is constructed using a random song from intents.json depending on specified genre`, () => {
      expect(
        Response.createMusicRecommendationResponse(
          typeof "Music Recommendation Introduction - Rap"
        )
      ).toEqual(expect.any(String));

      expect(
        Response.createMusicRecommendationResponse(
          typeof "Music Recommendation Introduction - Hip-Hop"
        )
      ).toEqual(expect.any(String));

      expect(
        Response.createMusicRecommendationResponse(
          typeof "Music Recommendation Introduction - Electronic"
        )
      ).toEqual(expect.any(String));

      expect(
        Response.createMovieRecommendationResponse(
          typeof "Movie Recommendation Introduction - Action"
        )
      ).toEqual(expect.any(String));

      expect(
        Response.createMovieRecommendationResponse(
          typeof "Movie Recommendation Introduction - Drama"
        )
      ).toEqual(expect.any(String));

      expect(
        Response.createMovieRecommendationResponse(
          typeof "Movie Recommendation Introduction - Horror"
        )
      ).toEqual(expect.any(String));

      expect(Response.concatenateResponses("Hello", "World")).toEqual(
        expect.any(String)
      );
    });
  });
});
