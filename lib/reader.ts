import { createReadStream, SparkMD5, toByteArray, WritableStream } from "../deps.ts";
import { MimeTypes, Note, ParseState } from "./types.ts";
import { processStateKeys, resetState, stringToDate } from "./util.ts";
import { VALID_TAGS, WHITESPACE_REGEX } from "./consts.ts";
import { parseContentAsMarkdown } from "./content.ts";

export interface ParseOptions {
  debug?: boolean;
  parseAsMarkdown?: boolean;
}

export const readAndParseToNotes = (
  path: string,
  { debug, parseAsMarkdown }: ParseOptions = {},
): Promise<Note[]> => {
  return new Promise((resolve, reject) => {
    const notes: Note[] = [];
    const state: ParseState = { attributes: {}, text: "", ignore: true };

    const parserStream = new WritableStream({
      onopentag(name: string) {
        resetState(state);

        if (name === "note") {
          state.note = { tags: [], resources: [] };
        } else if (name === "resource") {
          state.resource = {};
        }

        if (VALID_TAGS.includes(name)) {
          state.ignore = false;
        } else if (debug) {
          console.log("ignored tag", name);
        }
      },
      onclosetag(name: string) {
        if (state.note) {
          const value = (state.text || "").trim();
          const processed = processStateKeys(state, name, value);

          if (!processed) {
            switch (name) {
              case "created": {
                state.note.created = stringToDate(value);
                break;
              }
              case "content": {
                if (parseAsMarkdown) {
                  state.note.markdown = parseContentAsMarkdown(value);
                }
                state.note.content = value;
                break;
              }
              case "subject-date": {
                state.note.subjectDate = stringToDate(value);
                break;
              }
              case "updated": {
                state.note.updated = stringToDate(value);
                break;
              }
              case "tag": {
                state.note.tags.push(value);
                break;
              }
              case "source-url": {
                state.note.sourceUrl = value;
                break;
              }
              case "source-application": {
                state.note.sourceApplication = value;
                break;
              }
              case "place-name": {
                state.note.placeName = value;
                break;
              }
              case "content-class": {
                state.note.contentClass = value;
                break;
              }
              case "application-data": {
                state.note.applicationData = value;
                break;
              }
              case "resource": {
                if (state.resource) {
                  state.note.resources.push(state.resource);
                }
                break;
              }
              default:
                break;
            }
          }
        }

        if (state.resource) {
          switch (name) {
            case "data": {
              const data = toByteArray(state.text.replace(WHITESPACE_REGEX, ""));
              state.resource.data = data;
              state.resource.hash = SparkMD5.ArrayBuffer.hash(data);

              break;
            }
            case "mime": {
              state.resource.mime = state.text as MimeTypes;
              break;
            }
            case "width": {
              state.resource.width = parseInt(state.text);
              break;
            }
            case "height": {
              state.resource.height = parseInt(state.text);
              break;
            }
            case "file-name": {
              state.resource.filename = state.text;
              break;
            }
            default:
              break;
          }
        }

        if (name === "note" && state.note) {
          notes.push(state.note);
        }
      },
      ontext(data: string) {
        if (!state.ignore) {
          state.text += data;
        } else if (debug) {
          console.log("ignored text", (data || "").trim());
        }
      },
    }, {
      xmlMode: false,
      lowerCaseTags: false,
      lowerCaseAttributeNames: false,
      recognizeSelfClosing: true,
      recognizeCDATA: true,
      decodeEntities: false,
    });

    const fileStream = createReadStream(path);

    fileStream
      .pipe(parserStream)
      .on("finish", () => {
        resolve(notes);
      })
      .on("error", (err: unknown) => {
        reject(err);
      });
  });
};
