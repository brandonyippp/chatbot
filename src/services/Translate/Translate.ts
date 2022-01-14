/*
    Translate.ts

    Class to translate text to any desired language with use following libraries (for now):
    https://www.npmjs.com/package/translate
    https://www.npmjs.com/package/languagedetect

    Insufficient free-to-use alternative to paid Google Cloud Platform Translation API service.
    Does not function well when detected language is outside of ISO 639-1 scope -> detectLanguage(input: string).
*/

const translate = require("translate");
const LanguageDetect = require("languagedetect");

export class TranslateService {
  languageDetector: any;

  public constructor() {
    this.languageDetector = new LanguageDetect();
  }

  public async translateToEnglish(input: string, originalLanguage: string) {
    return await translate(input, { from: originalLanguage, to: "en" });
  }

  public detectLanguage(input: string) {
    return this.languageDetector.detect(input);
  }
}

export const Translate = new TranslateService();
