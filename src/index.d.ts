/**
 * LILO - Last In Last Out
 */
export declare function makeStack<T>(array: T[], maxSize?: number): {
  getSize: () => number;
  isEmpty: () => boolean;
  peek: (index?: 0 | -1) => T | undefined;
  push: (value: T) => void;
  pop: () => T | undefined;
  clear: () => void;
};

type CharGroup = "digit"
  | "alphabet"
  | "whitespace"
  | "newline"
  | "at_sign"
  | "quote"
  | "dot"
  | "semicolon"
  | "hashtag"
  | "dollar_sign"
  | "astrix"
  | "exclamation_sign"
  | "slash"
  | "equal"
  | "colon"
  | "left_angle_bracket"
  | "right_angle_bracket"
  | "angle_bracket"
  | "left_square_bracket"
  | "right_square_bracket"
  | "square_bracket"
  | "left_round_bracket"
  | "right_round_bracket"
  | "round_bracket"
  | "left_curly_bracket"
  | "right_curly_bracket"
  | "curly_bracket"

type CheckOptions = CharGroup & Omit<string, CharGroup>

type IsOption = Record<CheckOptions, boolean> & ((...params: CheckOptions[]) => boolean)

type ReadUntil = ((prop: ((val: string, index?: number) => boolean) | RegExp | CheckOptions) => string)
type ReadWhile = ((prop: ((val: string, index?: number) => boolean) | RegExp | CheckOptions) => string)
type ReadBase = ((num: number) => string)
type Read = {
  until: ReadUntil,
  while: ReadWhile
} & ReadBase;

export declare const createPointer: (source: string) => {
  getIndex: () => number;
  getValue: () => string;
  next: () => string;
  skip: () => number;
  peak: () => string;
  goto: (newIndex: number) => number;
  is: IsOption;
  read: Read;
  undo: () => void;
};
/**
 * pointer -> point -> value
 *
 * pointer.getValue()
 * pointer.getIndex()
 * pointer.goto()
 * pointer.next()
 * pointer.peak()
 * pointer.is.let_ | pointer.is('let ','const ')
 * pointer.read(14)
 * -pointer.read(/w+/g)
 * pointer.read.until('')
 * pointer.select(12)
 * -pointer.select(/w+/g)
 * -pointer.select.alphabets
 * pointer.select.until('')
 * pointer.select.reset()
 * pointer.select.value
*/
export declare const sum: (...nums: number[]) => number;
