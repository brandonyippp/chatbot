/* States of FSM in States.ts */
export const STATE_INITIAL = "Initial";
export const STATE_PRIMARY = "Primary";
export const STATE_END = "Terminate";

/* Keyword Tags */
export const TRANSITION_TO_END = "Goodbye";

/* User requests */
export const SPEECH_SPEED_INCREASE = "Faster Speech";
export const SPEECH_SPEED_DECREASE = "Slower Speech";
export const SPEECH_ENABLE = "Voice On";
export const SPEECH_DISABLE = "Voice Off";
export const DEFAULT_SPEECH_SPEED = 1.25;
export const SPEECH_SPEED_INCREMENT = 0.25;

/* Miscellaneous - Append user name to these message types */
export const PERSONABLE_TAGS = [
  "Greetings",
  "Greetings Feeling",
  "Goodbye",
  "Set Username",
];

export const MOVIE_RECOMMENDATION_TAGS = [
  "Movie Recommendation Introduction - Action",
  "Movie Recommendation Introduction - Drama",
  "Movie Recommendation Introduction - Horror",
];

export const MUSIC_RECOMMENDATION_TAGS = [
  "Music Recommendation Introduction - Rap",
  "Music Recommendation Introduction - Hip-Hop",
  "Music Recommendation Introduction - Electronic",
];

export const MINIMUM_PROBABILITY_THRESHOLD = 0.2;

// export const DESIRED_ENCODING_LANGUAGE = "english";

/* Error Messages */
export const INSUFFICIENT_DATA_ERROR = "Insufficient data to perform task.";
