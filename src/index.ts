const isRegExp = (val: unknown): val is RegExp => val instanceof RegExp
const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function'
const isString = (val: unknown): val is string => typeof val === 'string'

const char_group = [
  ["digit", /\d/g] as const,
  ["alphabet", /\w/g] as const,
  ["whitespace", ' '] as const,
  ["newline", /\r\n?|\n|\u2028|\u2029/g] as const,
  ["at_sign", '@'] as const,
  ["quote", /\'|\"||\"|\`/g] as const,
  ["dot", '.'] as const,
  ["semicolon", ';'] as const,
  ["hashtag", '#'] as const,
  ["dollar_sign", '$'] as const,
  ["astrix", '*'] as const,
  ["exclamation_sign", '!'] as const,
  ["slash", '/'] as const,
  ["equal", '='] as const,
  ["colon", ':'] as const,
  ["left_angle_bracket", '<'] as const,
  ["right_angle_bracket", '>'] as const,
  ["angle_bracket", /\<|\>/g] as const,
  ["left_square_bracket", '['] as const,
  ["right_square_bracket", ']'] as const,
  ["square_bracket", /\[|\]/g] as const,
  ["left_round_bracket", '('] as const,
  ["right_round_bracket", ')'] as const,
  ["round_bracket", /\(|\)/g] as const,
  ["left_curly_bracket", '{'] as const,
  ["right_curly_bracket", '}'] as const,
  ["curly_bracket", /\{|\}/g] as const,
]

type TCharGroup = (typeof char_group)[number][0]
type CheckOptions = TCharGroup | Omit<string, TCharGroup>

const char_map = new Map<CheckOptions, string | RegExp>(char_group)

const char_equality_checker = (input: CheckOptions, value_to_check: string) => {
  let char_regexp_string = char_map.get(input)
  if (isString(char_regexp_string)) return char_regexp_string === value_to_check
  if (char_regexp_string !== undefined) return char_regexp_string.test(value_to_check)
  return input === value_to_check
}

/**
 * LILO - Last In Last Out
 */
export function makeStack<T>(array: T[], maxSize: number = 20) {
  return {
    getSize: () => array.length,
    // isEmpty - Return true if the stack is empty.
    isEmpty: () => array.length === 0,
    // Return the top of the stack, without removing it.
    peek: (index: 0 | -1 = 0): T | undefined => {
      return index === 0
        ? array[array.length - 1]
        : array[0]
    },
    // Add an item to the top of the stack
    push: (value: T) => {
      array.push(value)
      if (array.length >= maxSize) {
        array.shift()
      }
    },
    // Remove the top item from the stack
    pop: (): T | undefined => array.pop(),
    clear: () => { array = [] },
    // forEach: (cb: ((v: T) => void)) => {
    //   array.forEach(cb)
    // }
  }
}

export const createPointer = (source: string) => {
  let index = -1
  const at = (index: number) => source[index]
  const getIndex = () => index
  const getValue = () => at(index)
  // const move = () => at(index++) // this will first return then, increment index;
  const next = () => at(++index) // this will first inc then return it;
  const skip = () => ++index // this will just increment
  const peak = () => at(index + 1) // this will just return the next value, without any update to index; 
  const goto = (newIndex: number) => index = newIndex
  const history = makeStack<number>([], 20);

  function is_base(prop: CheckOptions, skip: boolean = true) {
    // console.log(prop)
    if (prop.includes('_')) prop = prop.replaceAll('_', ' ')
    const v = prop.length === 1 ? getValue() : source.slice(index, prop.length + index)
    if (char_map.has(prop)) {
      const is_equal = char_equality_checker(prop, getValue())
      if (is_equal && skip) {
        history.push(index)
        index++
      }
      return is_equal
    }
    const is_equal = char_equality_checker(prop, v)
    if (is_equal && skip) {
      history.push(index)
      index += v.length
    }
    return is_equal
  }

  const is = new Proxy<Record<TCharGroup, boolean> & ((...params: CheckOptions[]) => boolean)>(
    function (...props: CheckOptions[]) {
      for (let i = 0; i < props.length; i++) {
        const prop = props[i]
        if (is_base(prop, false)) return is_base(prop)
      }
      return false
    }, {
    get(_, prop: CheckOptions) {
      return is_base(prop)
    }
  })

  function read_while(prop: ((val: string, index?: number) => boolean) | RegExp | CheckOptions) {
    let readed = ''
    const initial = index;
    if (isFunction(prop)) {
      let i = 0;
      while (prop(getValue(), i)) {
        readed += getValue()
        skip();
        i++;
      }
    } else if (isString(prop)) {
      while (is_base(prop, false)) {
        readed += getValue()
        skip()
      }
    } else if (isRegExp(prop)) {
      while (new RegExp(prop).test(getValue())) {
        readed += getValue()
        skip();
      }
    }
    if (initial !== index) history.push(initial)
    return readed
  }

  function read_until(prop: ((val: string, index?: number) => boolean) | RegExp | CheckOptions) {
    let readed = ''
    const initial = index;
    if (isFunction(prop)) {
      let i = 0;
      while (!prop(getValue(), i)) {
        readed += getValue()
        skip();
        i++;
      }
    } else if (isString(prop)) {
      while (!is_base(prop, false)) {
        readed += getValue()
        skip()
      }
    } else if (isRegExp(prop)) {
      while (!(new RegExp(prop).test(getValue()))) {
        readed += getValue()
        skip();
      }
    }
    if (initial !== index) history.push(initial)
    return readed
  }

  function read_base(chars: number): string {
    const v = source.slice(index, chars + index)
    history.push(index);
    index += chars
    return v
  }

  const read: Read = new Proxy(
    read_base, {
    get(_, prop: 'until' | 'while') {
      if (prop === 'until')
        return read_until
      else if (prop === 'while') return read_while
    }
  })

  const undo = () => {
    let v = history.pop();
    if (v) index = v;
  }

  return {
    getIndex,
    getValue,
    next,
    skip,
    peak,
    goto,
    is,
    read,
    undo,
  }
}
