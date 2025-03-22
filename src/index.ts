import { Agentica } from "@agentica/core";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import typia from "typia";

dotenv.config();

import fs from "fs";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class FsClass {
  /**
   * Indicates the current folder path.
   *
   * ```ts
   * The directory name of the current module. This is the same as the
   * `path.dirname()` of the `__filename`.
   * @since v0.1.27
   * __dirname;
   * ```
   *
   * @returns dirname
   */
  async __dirname(): Promise<string> {
    return __dirname;
  }

  /**
   * Reads the contents of the directory.
   *
   * See the POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3.html) documentation for more details.
   *
   * The optional `options` argument can be a string specifying an encoding, or an
   * object with an `encoding` property specifying the character encoding to use for
   * the filenames returned. If the `encoding` is set to `'buffer'`,
   * the filenames returned will be passed as `Buffer` objects.
   *
   * If `options.withFileTypes` is set to `true`, the result will contain `fs.Dirent` objects.
   * @since v0.1.21
   */
  async readdirSync(input: {
    path: string;
    options?:
      | {
          encoding: "utf-8";
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        }
      | "utf-8"
      | null;
  }): Promise<string[]> {
    return fs.readdirSync(input.path, input.options);
  }

  /**
   * Returns the contents of the `path`.
   *
   * For detailed information, see the documentation of the asynchronous version of
   * this API: {@link readFile}.
   *
   * If the `encoding` option is specified then this function returns a
   * string. Otherwise it returns a buffer.
   *
   * Similar to {@link readFile}, when the path is a directory, the behavior of
   * `fs.readFileSync()` is platform-specific.
   *
   * ```js
   * import { readFileSync } from 'fs';
   *
   * // macOS, Linux, and Windows
   * readFileSync('<directory>');
   * // => [Error: EISDIR: illegal operation on a directory, read <directory>]
   *
   * //  FreeBSD
   * readFileSync('<directory>'); // => <data>
   * ```
   * @since v0.1.8
   * @param path filename
   */
  async readFileSync(input: { path: string }): Promise<string> {
    return fs.readFileSync(input.path, { encoding: "utf-8" }) as string;
  }

  /**
   * Writes data to the specified file.
   *
   * The `mode` option only affects the newly created file. See {@link open} for more details.
   *
   * For detailed information, see the documentation of the asynchronous version of
   * this API: {@link writeFile}.
   * @since v0.1.29
   * @param file filename or file descriptor
   */
  async writeFileSync(input: { file: string; data: string }): Promise<void> {
    return fs.writeFileSync(input.file, input.data);
  }
}

export const agent = new Agentica({
  model: "chatgpt",
  vendor: {
    api: openai,
    model: "gpt-4o-mini",
  },
  controllers: [
    {
      name: "File Connector",
      protocol: "class",
      application: typia.llm.application<FsClass, "chatgpt">(),
      execute: new FsClass(),
    },
  ],
});

const main = async () => {
  console.log(await agent.conversate("What can you do?"));
};

main();
