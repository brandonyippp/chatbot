/* 
  Types.ts

  Definitions for various types and data structures used throughout the program, both for function and semantics.
*/

export interface NeuralNetworkData {
  input: number[];
  output: number[];
}

export enum StateTypes {
  Question,
  Statement,
}

export interface State {
  type: StateTypes;
  outputGenericResponse?(): any;
  determineResponse?(): any;
  transission(intent?: string): void;
}

export interface StatesTemplate {
  [key: string]: State;
}
