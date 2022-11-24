import { ParseState } from "./types.ts";
import { TEXT_TAGS } from "./consts.ts";

export const resetState = (state: ParseState) => {
  state.text = "";
  state.attributes = {};
  state.ignore = true;
};

type StateKey = "title" | "author" | "latitude" | "longitude" | "altitude" | "source";
const isOfStateKey = (key: string): key is StateKey => {
  return TEXT_TAGS.includes(
    key,
  );
};

export const setStateText = (state: ParseState, key: StateKey, value: string) => {
  const val = value.trim();
  if (val && state.note) {
    state.note[key] = val;
  }
};

export const processStateKeys = (state: ParseState, key: string, value: string): boolean => {
  if (state.note) {
    if (isOfStateKey(key)) {
      setStateText(state, key, value);
      return true;
    }
  }
  return false;
};

export const stringToDate = (date: string): Date | null => {
  if (date.length < 16) return null;

  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);
  const hour = date.substring(9, 11);
  const minute = date.substring(11, 13);
  const second = date.substring(13, 15);
  const datetime = Date.parse(
    `${year}-${month}-${day}T${hour}:${minute}:${second}Z`,
  );

  if (isNaN(datetime)) return null;

  return new Date(datetime);
};
