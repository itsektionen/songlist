# Songlist for the IN-Chapter

This is the IN-Chapters songlist. The songs are stored as Markdown files in the [`/songs`](/songs) folder and generated into songlists in various formats.

You can also find information on how to contribute to this repository, either by adding/editing songs, or by contributing to the codebase.

## Table of Contents <!-- omit in toc -->

- [Contributing (general)](#contributing-general)
  - [Quick guide](#quick-guide)
- [Contributing (songs)](#contributing-songs)
  - [Format](#format)
  - [Creating](#creating)
  - [Modifying](#modifying)
  - [Validating](#validating)
  - [Building](#building)
- [Contributing (codebase)](#contributing-codebase)
- [Scripts](#scripts)
  - [Song scripts](#song-scripts)
  - [Project scripts](#project-scripts)
- [Getting help](#getting-help)

## Contributing (general)

Do you wish to contribute? Great! Here you'll find all you need to know on how to do it in the right way.

First of all all the code in this project is written in [TypeScript](http://typescriptlang.org/), so to be able to use it you'll need [Node.js](https://nodejs.dev/) installed and (optionally but recomended) [Yarn (classic)](https://classic.yarnpkg.com/) installed. If you do not wish to use Yarn you can use NPM instead, but be aware that all documentation is written with Yarn in mind.

This is needed so that builds for new songs, testing and linting can be performed.

### Quick guide

#### **1. Fork and clone**

To get started first create a fork of the repo and clone it. Help with all this can be found on GitHub and google.

#### **2. Install dependencies**

In your terminal go to the directory of your clone and run:

```sh
yarn install
```

#### **3. Make changes**

Now you can make changes! When you do make sure to follow the proper guidelines for your contribution which you can find in this README.

#### **4. Make sure nothing is broken**

Before you commit your changes make sure that nothing is broken by running [`yarn test`](#yarn-test) and that the styling ruleset is being followed by running [`yarn lint`](#yarn-lint) (if the linter is displeased it will be fixed by running [`yarn format`](#yarn-format) in most cases).

#### **5. Commit, push and pull-request**

Now you can commit your changes, make sure to provide a relevant commit message that explains what changes you've made. Then push that commit to your fork, when pushed GitHub actions should run some tests to make sure everything is as it should be and if GitHub is okay you can make a pull request to this repository. Help with all this can be found on GitHub and google.

#### **6. Review and merge**

After someone has reviewed your changes they will be merged into the repository and that's it! You've contributed to the IN-Chapters songlist!

## Contributing (songs)

This section describes how to add to, or edit the songlist. All songs are stored in markdown (`.md`) files following a specific format so they can be read by the builder. Song's filenames should begin with an unique ID (0-4095) and optionally (but recomended) something to identify the song separated by `_`. Generally the identifier will be based on the title of the song, e.g. "Moder Kista" is `0_Moder_Kista.md`. Read more here for the process of how to [add a new song](#creating) and [modifying an existing song](#modifying).

### Format

All files are named contain two sections, YAML front matter first and content second. The YAML front matter contains the songs metadata, and the content contains the lyrics.

The front matter is contained by one line with `---` each before and after the section. Possible fields in the front matter are:

- `title`, the name or title of the song **(required)**
- `author`, the person or persons who wrote the lyrics of the song
- `melody`, the melody the song is sung to
- `composer`, the composer of the melody
- `tags`, list of categories the songs fall in to and other identifiers (valid tags can be found in [`/src/definitions/tags.ts`](/src/definitions/tags.ts#L1-L12)) **(required)**
- `deleted`, marks the song as deleted or not (should only be `true` if the song is removed and not be specified otherwise)
- `sorting`, number defining where to sort the song when generating xml format files (primarily exists for "En liten blå förgätmigej")

Any field without a value should be omitted.

#### **Example:**

```yml
---
title: Moder Kista
author: David Larsson, IT00
melody: Längtan till landet
composer: Otto Lindblad
tags: [gasque, swe]
---
```

The content is in markdown format but with a limited featureset. Currently supported types of content are paragraphs, comments and headers.

Comments are defined as lines starting with `> `, for comments with multiple lines all lines start with `> `. Headers are defined as lines starting with `# `. Paragraphs are any other line.

All parts are separated by one empty line.

#### **Example:**

```md
Paragraph
Line 2 of pragraph

# Header

> Comment
> Line 2 of comment
```

Content and front matter are separated with one empty line and all files should have one empty line at the end.

There's a lot to consider, but generally just using existing songs as an example should be enough to figure it out. There are also [scripts](#scripts) that can help with formatting.

### Creating

You can create and add new songs to the song list in two ways. Either manually or using the built-in commands.

Use the command [`yarn script create`](#yarn-script-create-title) to add a new song. The command will create the file with the next valid id and the given title. After the file has been created, you can add the lyrics and other song information.

When adding new songs manually make sure to use the id that is directly after the last existing song id and that you format the file correctly.

### Modifying

If you want to modify a song, find the correct song file in the "songs" folder and modify its content. Make sure that the file still follows the formatting guidelines.

### Validating

To ensure that all songs are valid there are scripts to check their names, content and format. Although you're not required to use them it is highly recomended as they will be run before any changes can be included in the repository. You can test the songs by running [`yarn test:songs`](#yarn-testsongs) and test the formatting by running [`yarn lint`](#yarn-lint) (if the formatting fails you can solve it by running [`yarn format`](#yarn-format) in most cases).

### Building

The songs have to be built before they can be accepted into the repository. To make a new build run [`yarn build`](#yarn-script-build-alt-yarn-build). If you want to make sure that the build has been successful you can run [`yarn test:build`](#yarn-testbuild).

## Contributing (codebase)

If you want to contribute to the codebase there are only a few things to consider that aren't covered by the general [guidelines](#contributing-general).

#### **Tests**

If your code updates the way builds work in any make sure to also update the tests to minimize the risk of errors.

#### **Language**

All code should be written in TypeScript for a unified codebase.

#### **Documentation**

Make sure to make any relevant updates to the documentation.

## Scripts

This project has several scripts to aid you when contributing, to make sure rules for the project are followed and to make sure nothing breaks.

The scripts are divided into two sections: "song scripts" and "project scripts".

### Song scripts

#### `yarn script build` (alt. `yarn build`)

Builds files. Can optionally provide a date in the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601/) format to mark as date of most recent update.

`yarn build [date?]`

#### `yarn script create [title]`

Creates a new song with the next possible id and the given title. Front matter becomes populated with empty fields to make is as easy as possible to add them in. Optionally values to fields can be provided when running the script, e.g. `yarn script create "Moder Kista" --author="David Larsson, IT00" --tags=gasque` will have the following front matter:

```yaml
---
title: Moder Kista
author: David Larsson, IT00
melody:
composer:
tags: [gasque]
---
```

Multiple tags can be set during creation by separating them with `=`, e.g. `--tags=gasque=swe` will result in `tags: [gasque, swe]`.

#### `yarn script updateFileNames [id?]`

Will update all filenames to be `[id]_[normalized_title]`, e.g. "Système International" has ID 9 and will become `9_Systeme_International.md`.

If an ID is specified only the song with that ID will be updated, e.g. `yarn script updateFileNames 0` will only the filename of update Moder Kista.

#### `yarn script remove [id]`

Will remove the song with the provided ID, this action will delete all content and all fields, leaving only the deleted field to mark it as removed.

Optionally `--soft` can be added which alters the song only by adding `deleted: true` to the front matter.

### Project scripts

#### `yarn test`

Runs all test suites, will be run automatically by GitHub to ensure that all code is in working condition.

#### `yarn test:songs`

Runs test suites to validate songs, is

#### `yarn test:build`

Runs tests to validate that the build is valid and up to date.

#### `yarn lint`

Checks that all files (code and songs) follows style rules.

#### `yarn format`

Formats all files (code and songs) to follow style rules.

## Getting help

This might all sound like alot so if there's ever anything you're wondering about you can always ask for help! We want anyone to be able to contribute, even if you've never contributed to an open-source repository before or never used git. So if there's anything you don't understand or need clarification on feel free to create an issue on this repository marking it as a question. And of course there's always the good old fashioned asking someone you know for help.
