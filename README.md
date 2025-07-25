# Songlist for the IT-Chapter

[Klicka här för att läsa på svenska](#sånglista-för-it-sektionen)

This is the IT-Chapters songlist. The songs are stored as Markdown files in the [`/songs`](/songs) folder and generated into songlists in various formats.

You can also find information on how to contribute to this repository, either by adding/editing songs, or by contributing to the codebase.

## Table of Contents <!-- omit in toc -->

- [Contributing (general)](#contributing-general)
  - [Quick guide](#quick-guide)
- [Contributing (songs)](#contributing-songs)
  - [Format](#format)
  - [Creating](#creating)
  - [Modifying](#modifying)
  - [Validating](#validating)
- [Contributing (codebase)](#contributing-codebase)
- [Scripts](#scripts)
  - [Song scripts](#song-scripts)
  - [Project scripts](#project-scripts)
- [Getting help](#getting-help)
- [Background](#background)

## Contributing (general)

Do you wish to contribute? Great! Here you'll find all you need to know on how to do it in the right way.

First of all, all the code in this project is written in [TypeScript](http://typescriptlang.org/), so to be able to use it you'll need [Node.js](https://nodejs.dev/) installed and (optional but recommended) [Yarn (classic)](https://classic.yarnpkg.com/) installed. If you do not wish to use Yarn you can use NPM instead, but be aware that all documentation is written with Yarn in mind.

This is needed so that builds for new songs, testing and linting can be performed.

### Quick guide

#### **1. Fork and clone**

To get started first create a fork of the repo and clone it. Help with all this can be found on GitHub and Google.

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

Now you can commit your changes, make sure to provide a relevant commit message that explains what changes you've made. Then push that commit to your fork, when pushed GitHub actions should run some tests to make sure everything is as it should be and if GitHub is okay you can make a pull request to this repository. Help with all this can be found on GitHub and Google.

#### **6. Review and merge**

After someone has reviewed your changes they will be merged into the repository and that's it! You've contributed to the IT-Chapters songlist!

## Contributing (songs)

This section describes how to add to, or edit the songlist. All songs are stored in markdown (`.md`) files following a specific format so they can be read by the builder. Song's filenames should begin with a unique ID (0-4095) and optionally (but recommended) something to identify the song separated by `_`. Generally, the identifier will be based on the title of the song, e.g. "Moder Kista" is `0_Moder_Kista.md`. Read more here for the process of how to [add a new song](#creating) and [modifying an existing song](#modifying).

### Format

All files are named and contain two sections, YAML front matter first and content second. The YAML front matter contains the song's metadata, and the content contains the lyrics.

The front matter is contained by one line with `---` each before and after the section. Possible fields in the front matter are:

- `title`, the name or title of the song **(required)**
- `alternativeTitles`, a list of alternative names or titles of the song
- `author`, information about the person or persons who wrote the lyrics of the song
  - `name`, the name of the person or persons who wrote the lyrics of the song
  - `event`, the event for which the song was made
  - `location`, the city or university where the song is from
  - `year`, the year the song was written
  - `comment`, a comment about the author (for example, if an author wrote one of the verses)
- `melody`, the melody the song is sung to
- `composer`, the composer of the melody
- `notes`, notes about the song, like its history or movements
- `tags`, list of categories the songs fall in to and other identifiers (valid tags can be found in [`/src/definitions/tags.ts`](/src/definitions/tags.ts#L1-L12)) **(required)**
- `deleted`, marks the song as deleted or not (should only be `true` if the song is removed and not be specified otherwise)
- `sorting`, number defining where to sort the song when generating xml format files (primarily exists for "En liten blå förgätmigej")

Any field without a value should be omitted.

#### **Example:**

```yml
---
title: Moder Kista
author:
  - name: David Larsson, IT-00
    event: IT-nØllningen
    location: KTH
    year: 2000
melody: Längtan till landet
composer: Otto Lindblad
notes:
  - Sjungs av IT-Sektionen i början av varje gasque.
tags: [gasque, swe]
---
```

The content is in markdown format but with a limited featureset. Currently supported types of content are paragraphs, comments and headers.

Comments are defined as lines starting with `> `, for comments with multiple lines all lines start with `> `. Headers are defined as lines starting with `# `. Paragraphs are any other line.

All parts are separated by one empty line.

#### **Example:**

```md
Paragraph
Line 2 of the same paragraph

# Header

> Comment
> Line 2 of the same comment
```

Content and front matter are separated with one empty line and all files should have one empty line at the end.

There's a lot to consider, but generally just using existing songs as an example should be enough to figure it out. There are also [scripts](#scripts) that can help with formatting.

### Creating

You can create and add new songs to the song list in two ways. Either manually or using the built-in commands.

Use the command [`yarn script create`](#yarn-script-create-title) to add a new song. The command will create the file with the next valid ID and the given title. After the file has been created, you can add the lyrics and other song information.

When adding new songs manually make sure to use the ID that is directly after the last existing song ID and that you format the file correctly.

### Modifying

If you want to modify a song, find the correct song file in the [`/songs`](/songs) folder and modify its content. Make sure that the file still follows the formatting guidelines.

### Validating

To ensure that all songs are valid there are scripts to check their names, content and format. Although you're not required to use them it is highly recommended as they will be run before any changes can be included in the repository. You can test the songs by running [`yarn test:songs`](#yarn-testsongs) and test the formatting by running [`yarn lint`](#yarn-lint) (if the formatting fails you can solve it by running [`yarn format`](#yarn-format) in most cases).

## Contributing (codebase)

If you want to contribute to the codebase there are only a few things to consider that aren't covered by the general [guidelines](#contributing-general).

#### **Tests**

If your code updates the way builds work in any way, make sure to also update the tests to minimize the risk of errors.

#### **Language**

All code should be written in TypeScript for a unified codebase.

#### **Documentation**

Make sure to make any relevant updates to the documentation.

## Scripts

This project has several scripts to aid you when contributing, to make sure rules for the project are followed and to make sure nothing breaks.

The scripts are divided into two sections: "song scripts" and "project scripts".

### Song scripts

#### `yarn script build` (alt. `yarn build`)

**Builds are performed automagically when changes to songs are commited, there should never be a need to use this except for testing**

Builds files. Can optionally provide a date in the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601/) format to mark as the date of the most recent update. If a date is not provided it will default to today's date.

`yarn build [date?]`

#### `yarn script create [title]`

Creates a new song with the next possible ID and the given title. Front matter becomes populated with empty fields to make it as easy as possible to add them in. Optionally values to fields can be provided when running the script, e.g. `yarn script create "Moder Kista" --author="David Larsson, IT-00" --tags=gasque` will have the following front matter:

```yaml
---
title: Moder Kista
author:
  - name: David Larsson, IT-00
    event:
    location:
    year:
    comment:
melody:
composer:
notes:
  -
tags: [gasque]
---
```

Multiple tags can be set during creation by separating them with `=`, e.g. `--tags=gasque=swe` will result in `tags: [gasque, swe]`.

#### `yarn script updateFileNames [ID?]`

Will update all filenames to be `[ID]_[normalized_title]`, e.g. "Système International" has ID 9 and will become `9_Systeme_International.md`.

If an ID is specified only the song with that ID will be updated, e.g. `yarn script updateFileNames 0` will only the filename of update "Moder Kista".

#### `yarn script remove [ID]`

Will remove the song with the provided ID, this action will delete all content and all fields, leaving only the `deleted` field to mark it as removed.

Optionally `--soft` can be added which alters the song only by adding `deleted: true` to the front matter.

### Project scripts

#### `yarn test`

Runs all tests, will be run automatically by GitHub to ensure that all code is in working condition.

#### `yarn lint`

Checks that all files (code and songs) follow style rules.

#### `yarn format`

Formats all files (code and songs) to follow style rules.

## Getting help

This might all sound like a lot so if there's ever anything you're wondering about you can always ask for help! We want anyone to be able to contribute, even if you've never contributed to an open-source repository before or never used Git. So if there's anything you don't understand or need clarification on feel free to create an issue on this repository marking it as a question. And of course, there's always the good old fashioned asking someone you know for help.

## Background

The songs in this IT-chapter song list are originally from Strängteoretiquerna's revised songbook (2009-2015) with additions, deletions and revisions made in the [in-sangbok repository](https://github.com/wsv-accidis/in-sangbok) between the years 2016 to 2022.

# Sånglista för IT-Sektionen

Detta är IT-Sektionens sånglista. Sångerna är sparade som Markdown filer i [`/songs`](/songs) mappen och genererade till sånglistor i olika format.

Du kan också hitta information hur du bidrar till detta repository, antingen genom att lägga till/ändra sånger eller genom att bidra till koden.

## Innehållsförteckning <!-- omit in toc -->

- [Bidra (allmänt)](#bidra-allmänt)
  - [Snabbguide](#snabbguide)
- [Bidra (sånger)](#bidra-sånger)
  - [Format](#format)
  - [Skapa](#skapa)
  - [Ändra](#ändra)
  - [Validera](#validera)
- [Bidra (koden)](#bidra-koden)
- [Script](#script)
  - [Sångscript](#sångskript)
  - [Projektscript](#projektscript)
- [Få hjälp](#få-hjälp)
- [Bakgrund](#bakgrund)

## Bidra (allmänt)

Vill du hjälpa till att bidra? Grymt! Här hittar du allt du behöver veta och hur du ska göra det på rätt sätt.

Först och främst, all kod i detta projektet är skrivet i [TypeScript](http://typescriptlang.org/), så för att kunna använda det behöver du [Node.js](https://nodejs.dev/) installerat och (valfritt men rekommenderat) [Yarn (classic)](https://classic.yarnpkg.com/) installerat. Om du inte vill använda Yarn kan du använda NPM istället, men all dokumentation är skriven med Yarn i åtanke.

Detta behövs för att kunna kompilera nya sånger, testa och linting.

### Snabbguide

#### **1. Fork:a och Clone:a**

För att komma igång, skapa först en fork av repot och klona det. Hjälp med detta kan du hitta på GitHub och Google.

#### **2. Installera dependencies**

Gå till mappen för din klon i din terminal och kör:

```sh
yarn install
```

#### **3. Gör ändringar**

Du kan nu börja göra ändringar! Se till att du följer de korrekta riktlinjerna för ditt bidrag som du hittar i denna README.

#### **4. Se till att inget är trasigt**

Innan du genomför dina ändringar, se till att inget till är trasigt genom att köra [`yarn test`](#yarn-test-1) och att stylingreglerna följs genom att köra [`yarn lint`](#yarn-lint-1) (om lintern är missnöjd kan det oftast fixas genom att köra [`yarn format`](#yarn-format-1)).

#### **5. Commit, push och pull-request**

Nu kan du genomföra dina ändringar, se till att skriva ett relevant commit-meddelande som förklarar vilka ändringar du har gjort. Sen kan du pusha till din fork, när de pushas kommer GitHub-actions att köra några tester för att se till att allt är som det ska vara och om GitHub är okej kan du göra en pull request till detta repository.

#### **6. Granska och merge:a**

Efter att någon har granskat dina ändringar kommer de att merge:as in i detta repository och det är allt! Du har bidragit till IT-sektionens sånglista!

## Bidra (sånger)

Denna delen förklarar hur du lägger till eller ändrar sånglistan. Alla sånger lagras i markdown (`.md`) filer enligt ett specifikt format så att de kan läsas av kompilatorn. Sångens filnamn ska börja med ett unikt ID (0-4095) och eventuellt (men rekommenderat) något som kan identifiera sången, separerat av `_`. Generellt är identifieringen baserad på sångens titel, t.ex. "Moder Kista" är `0_Moder_Kista.md`. Läs mer här hur du [lägger till en ny sång](#skapa) och [ändrar en befintlig sång](#ändra).

### Format

Alla filer är namngivna och innehåller två sektioner, YAML-front först och sedan sånginnehållet. YAML-front innehåller sångernas metadata och sånginnehållet innehåller texterna.

Fronten har en rad med `---` före och efter sektionen. Möjliga fält i fronten är:

- `title`, namnet eller titeln på sången **(obligatorisk)**
- `alternativeTitles`, en lista av alternativa namn eller titlar för sången
- `author`, information om personen eller personerna som skrev sångtexten
  - `name`, personen eller personerna som skrev sångtexten
  - `event`, evenemanget sången skrevs till
  - `location`, staden eller universitetet som sången kommer ifrån
  - `year`, året sången skrevs
  - `comment`, kommentar om skribenten (exempelvis om en skribent har skrivit en av verserna)
- `melody`, melodin som sången sjungs i
- `composer`, kompositör till melodin
- `notes`, noteringar om sången, som dess historia eller rörelser
- `tags`, lista med kategorier som sångerna tillhör och andra identifierare (giltiga taggar hittas i [`/src/definitions/tags.ts`](/src/definitions/tags.ts#L1-L12)) **(obligatorisk)**
- `deleted`, markerar sången som borttagen eller inte (ska bara vara "sann" om sången tas bort och inte anges på annat sätt)
- `sorting`, nummer som definierar var sången ska sorteras vid generering av filer i xml-format (finns primärt för "En liten blå förgätmigej")

Alla fält utan värde bör utelämnas.

#### **Exempel:**

```yml
---
title: Moder Kista
author:
  - name: David Larsson, IT-00
    event: IT-nØllningen
    location: KTH
    year: 2000
melody: Längtan till landet
composer: Otto Lindblad
notes:
  - Sjungs av IT-Sektionen i början av varje gasque.
tags: [gasque, swe]
---
```

Innehållet är i markdown-format men med en begränsad uppsättning funktioner. Typer av innehåll som för närvarande stöds är stycken, kommentarer och rubriker.

Kommentarer definieras av rader som börjar med `> `, för kommentarer med flera rader måste alla rader börja med `> `. Rubriker definieras av rader som börjar med `# `. Stycken är vilken annan rad som helst.

Alla delar separeras av en tom rad.

#### **Exempel:**

```md
Paragraf
Rad 2 i samma paragraf

# Rubrik

> Kommentar
> Rad 2 i samma kommentar
```

Innehållet och fronten separeras med en tom rad och alla filer ska ha en tom rad i slutet.

Det finns mycket att tänka på, men generellt sett så räcker det att bara använda befintliga sånger som exempel för att lista ut det. Det finns även [script](#script) som kan hjälpa till med formatering.

### Skapa

Du kan skapa och lägga till nya sånger i sånglistan på två sätt. Antingen manuellt eller med de inbyggda kommandona.

Använd kommandot [`yarn script create`](#yarn-script-create-titel) för att lägga till en ny låsångt. Kommandot skapar filen med nästa giltiga ID och den givna titeln. När filen har skapats kan du lägga till texten och annan sånginformation.

När du lägger till nya sånger manuellt, se till att använda ID:t som ligger direkt efter det senaste befintliga sång-ID:t och att du formaterar filen korrekt.

### Ändra

Om du vill modifiera en sång, hitta rätt sångfil i mappen [`/songs`](/songs) och ändra dess innehåll. Se till att filen fortfarande följer formateringsriktlinjerna.

### Validera

För att säkerställa att alla sånger är korrekta så finns det skript för att kontrollera deras namn, innehåll och format. Även om du inte är skyldig att använda dem är det starkt rekommenderat eftersom de kommer att köras innan några ändringar kan inkluderas i detta repository. Du kan testa sångerna genom att köra [`yarn test:songs`](#yarn-testsongs-1) och testa formateringen genom att köra [`yarn lint`](#yarn-lint-1) (om formateringen misslyckas kan du oftast lösa det genom att köra [`yarn format`](#yarn-format-1)).

## Bidra (koden)

Om du vill bidra till koden finns det bara några få saker att tänka på som inte täcks av de allmänna [riktlinjerna](#bidra-allmänt).

#### **Tests**

Om din kod uppdaterar hur kompileringen fungerar, se till att även uppdatera testen för att minimera risken för fel.

#### **Språk**

All kod ska skrivas i TypeScript för en enhetlig kod.

#### **Dokumentation**

Se till att göra relevanta uppdateringar av dokumentationen.

## Script

Det här projektet har flera skript för att hjälpa dig när du bidrar, för att se till att reglerna för projektet följs och för att se till att ingenting går sönder.
This project has several scripts to aid you when contributing, to make sure rules for the project are followed and to make sure nothing breaks.

The scripts are divided into two sections: "song scripts" and "project scripts".

### Sångskript

#### `yarn script build` (alt. `yarn build`)

**Sångerna kompileras automagiskt när förändingar till sångerna commit:as, det borde aldrig finnas behov att använda detta utom föt testning**

Kompilerar filer. Man kan valfritt ange ett datum i formatet [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601/) för att markera som datum för senaste uppdatering. Om ingen datum anges så används dagens datum.

`yarn build [date?]`

#### `yarn script create [titel]`

Skapar en ny sång med nästa möjliga ID och den givna titeln. Fronten fylls med tomma fält för att göra är så enkelt som möjligt att fylla i dem. Valfritt kan värden till fält tillhandahållas när man kör skriptet, t.ex. `yarn script create "Moder Kista" --author="David Larsson, IT-00" --tags=gasque` kommer att ha följande front:

```yaml
---
title: Moder Kista
author:
  - name: David Larsson, IT-00
    event:
    location:
    year:
    comment:
melody:
composer:
notes:
  -
tags: [gasque]
---
```

Flera taggar kan läggas till under skapandet genom att separera dem med `=`, t.ex. `--tags=gasque=swe` kommer att resultera i `taggar: [gasque, swe]`.

#### `yarn script updateFileNames [ID?]`

Kommer att uppdatera alla filnamn till "[ID]\_[normaliserad_titel]", t.ex. "Système International" har ID 9 och kommer att bli `9_Systeme_International.md`.

Om ett ID anges kommer endast sången med det ID:t att uppdateras, t.ex. `yarn script updateFileNames 0` kommer endast att uppdatera filnamnet på "Moder Kista".

#### `yarn script remove [ID]`

Tar bort sången med det angivna ID:t, den här åtgärden tar bort allt innehåll och alla fält, och lämnar bara `deleted` fältet för att markera sången som borttaget.

Man kan också lägga till `--soft`, som endast ändrar sången genom att lägga till `deleted: true` till fronten.

### Projektscript

#### `yarn test`

Kör alla tester, kommer att köras automatiskt av GitHub för att säkerställa att all kod är i fungerande skick.

#### `yarn lint`

Kontrollerar att alla filer (kod och sånger) följer stilregler.

#### `yarn format`

Formaterar alla filer (kod och sånger) så att de följer stilreglerna.

## Få hjälp

Allt detta kan låta mycket, så om det är något du undrar över kan du alltid be om hjälp! Vi vill att alla ska kunna vara med och bidra, även om du aldrig har bidragit till ett repository med öppen källkod tidigare eller aldrig använd Git. Så om det är något du inte förstår eller som behöver förtydligas få du gärna skapa en "Issue" i detta repository och markera det som en fråga. Och naturligtvis kan du också be någon du känner om hjälp.

## Bakgrund

Sångerna i denna sånglista för IT-sektionen är från början från Strängteoretiquernas reviderade sångbok (2009-2015) med tillägg, strykningar och ändringar gjorda i [in-sangbok repository](https://github.com/wsv-accidis/in-sangbok) mellan 2016 och 2022.
