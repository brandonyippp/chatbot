# ThinkBot - The Chatbot Application

### Table of Contents

1. Usage
2. Example Commands
3. Goals of the Application
4. Goals Set Out for Myself
5. Roadmap
6. Acknowledgments

## Usage

- `npm start` - Runs the bot
- `npm test` - Runs the tests associated with codebase

## Example Commands

- Includes but not limited to the following (see intents.json for more accepted patterns, although categories listed below are difficult to achieve - Inputs do not have to match exactly, just closely enough):

1. "Hi", "Hello", "Hi there", "Hey there"
2. "How are you", "How is your night", "Whats going on", "Whats new"
3. "What did you eat", "What's for breakfast"
4. "Talk < faster / slower >" -> Re-running the program might be required to make this command work, unsure on how Brain.js works internally.
5. "Thank you", "I appreciate that", "I owe you one"
6. "I feel < good / bad / sad / alright >", "My day is so-so", "I feel meh"
7. "Goodbye", "Bye", "Farewell"
8. "Let me talk to someone", "Connect me with someone", "Let me talk to an agent"
9. "What is your favourite restaurant", "What did you eat today", "I am hungry", "What is for breakfast"
10. "Recommend me a < book / movie / song >"

- The following patterns become inconsistent as the data file grows in size (along with neural network configurations - explained below in goals):

  1. Due to configuration settings:

  - Voice On
  - Voice Off
  - Faster Speech
  - Slower Speech
  - Jokes
  - Age
  - Asking Name
  - Stories
  - Interesting Facts

  - 9 / 41 patterns become difficult to navigate towards for the bot which can be optimized with configurations to Brain.js' neural network, although achieving 41/41 with this library seems to be quite difficult.

## Goals of the Application

- The goal of this application was to create an intelligent chatbot that would dynamically respond to user inquiry based on the criteria of any given message within the scope of pre-determined rulesets. Using machine learning techniques such as utilizing a neural network to determine the most probable category of conversation that the input from said users would be referring to, there are cases where overlaps of certain patterns may occur which leads to inconsistencies and unexpected outputs for very descriptive inputs.

- The approach of this application was to facilitate a conversation that resembles human-to-human interaction where a user could either respond to any given message accordingly, or begin a new inquiry. With that being said, any output given by the bot will simply suggest that the user reply in a certain manner, however the user may simply ask a new question or make a new statement at anytime and the bot will adapt accordingly.

- Although the chatbot may not be adaptable and be able to recognize and discern similar inputs (e.g asking "How are you" and "How old are you" result into the same pattern), this is largely due to the configurations of the neural network NPM library (Brain.js), a flow of conversation can be achieved. I have provided a configuration that I have found to work sufficiently for this use case, however there are some clear issues that you will find as you explore the applications functionality. A user with more adept knowledge on the theory of neural networks and optimizations of such (number of hidden layers, error thresholds, etc.) will most likely be able to yield better results than what is provided here. From my testing however, exploring higher values with some of these settings results in drastic reductions in overall performance.

  - Ex. 1: Inputting `How old are you` will be interpreted under a pattern of the user asking how the bot is doing, rather than referring to its age.
  - Ex. 2: Inputting `Talk faster` will be interpreted under a pattern of the user asking the bot to talk slower -> Slower Speech.

- A large factor in this application is the library (brain.js) itself. Utilizing its default configurations, the `learningRate` configuration setting yields a suboptimal level of understanding for a large variety of inputs (for my specific use case). Changing this value between the range of (0, 1) drastically improves the performance of the algorithm with a diminishing return on both ends. Anywhere above 0.6 results in sporadic behavior where outputs given match to exceedingly different patterns than what is expected. With the default value (0.3) however, certain commands (e.g Talk faster, slower, etc.) work flawlessly, yet render a large amount of other commands unusable. A value of 0.6 seems to yield stable reasonably consistent results, although faults are undeniably present.

  - Configuration settings in the extreme seem to optimize the chatbot slightly, however there is a very noticeable hit to performance time (time to complete training). One could reasonably run the training operation once and serialize/save the results to a .json file, however upon testing this and letting the program run for 15+ hours and still not having been completed, I decided that this would be far beyond the scope of this application. Alongside the outputted results being reasonably accurate to a clear degree, I felt that that such actions were unnecessary.

    - This can be seen by playing around with configuration options in Process.ts in the buildNeuralNetwork() function. Setting errorThresh to any arbitrary value such as 0.0005 and exploring different options for the number of hidden layers utilized for the network itself both seem to have a noticeable performance factor to them (documentation can be found [https://openbase.com/js/brain.js/documentation](here)).

## Translation Goal

- Another goal of the application was to be able to translate user input and bot output to better match the needs of the user. Without utilizing Google Translation API (SaaS service), the free-variant npm libraries (see Acknowledgements below) experience issues when attempting to detect a given language. If a language is detected to be outside of the ISO 639-1 scope, the translation library fails, simply outputting an error.

- There are workarounds that can be done within the application to combat this issue such as parsing the language returned by the [https://www.npmjs.com/package/languagedetect](language detector library) and mapping them to strings that are discernable to the [https://www.npmjs.com/package/translate](translation library), however I felt this to be outside the scope of this application and unscalable overall. In addition to this, a more robust and reliable solution would be to simply utilize Google SaaS services (GCP Translation API) to achieve this functionality anyway.

## Goals Set Out for Myself

- As indicated by the provided README.md in the original set of deliverables, the program left much to be desired in relation to the conversation itself. Conversations do not function on providing a singular keyword, and the expected result of a statement and/or question should not be a static response in every case. With that being said, I established a few goals for this application:

  1. Facilitate real conversations where inputs and outputs can vary and still yield results within the same category
  2. Be able to discern messages that would expect a form of personability (thank you/hello/goodbye) as opposed to more general questions
  3. Approach this application with a naive mindset where I would refrain from considering what was needed to achieve the above goals as too difficult, moreso asking myself "How hard could it really be?".

  With these goals in mind (which then entailed a separate list of criteria - Learning about neural networks, tokenization and stemming, base level machine learning algorithm prerequisites, etc.), I set out to create this chatbot and improve it to my best ability.

## Roadmap

- [x] Periodic check-in messages on set interval if no user input received
- [ ] Python server that manages calls via cloud functions to POST/GET data rather than local .json file
- [ ] Google Search API in cases where bot is unfamiliar with input (Highest probability category < THRESHOLD)
- [ ] Multi-language Support via Google Translation API
- [ ] Improve Neural Network configurations to improve generated responses (speech speed/toggle, discerning similar patterns such as "How are you" and "How old are you")
- [ ] Implement preprocessing of intent data rather than during runtime, including (but not limited to) object serialization and save-to-file

## Acknowledgments

- [Speaking Package](https://www.npmjs.com/package/say)
- [State Machine Package](https://www.npmjs.com/package/jssm?activeTab=readme)
- [Tokenization & Stemming Package](https://www.npmjs.com/package/natural)
- [Language Translation Package (non-functional for detected languages outside of ISO 639-1 scope)](https://www.npmjs.com/package/translate)
- [Language Detection Package](https://www.npmjs.com/package/languagedetect)
