# Anima (.moe)

<table>
  <tr>
    <td> <img src="anima-home-and-metadata.gif?raw=true" ></td>
    <td><img src="anima-player.gif?raw=true"></td>
  </tr>
</table>

Spiritual successor to [Puray!](https://github.com/fernandordev/puray.moe).

Anima is a community & platform centered around japanese animations (Animes) while also providing a way to watch them from different online sources.
Anima does not (nor pretends to) host any of the video streams used in the application, they are merely scraped from the internet and displayed as is while being paired to the metadata (title, description and preview information of animes, seasons and episodes).

## Features
- Multi-language (i18n)
- Custom player (Based on Vidstack)
  - HLS & Dash streams
  - Quality Selector
  - ASS Subtitles
  - SRT Subtitles
  - VTT Subtitles
  - Thumbnails
  - Language Swap
  - Audio Swap
  - Chapters (External API's)
  - Skip Intro/Credits/Ending (configurable by user)
  - Automatic Next Episode
  - Season Browser
  - Theater mode
  - Automatically resume from watch history
- User Profile
  - Custom Bio
  - Badges
  - Continue watching (Watch history)
  - Favorite animes
  - Accent color
- Comments
  - Displays user accent colors & Badges
  - Nesting/Responses
- Watch Togheter (W2G)
  - Syncs to host automatically (and manually if needed)
  - Transfer room ownership
  - Make watchparties by controlling the room with bots (Check Midori Bot @Anima-moe)
- Custom protocols
  - Navigate to any current or future pages by using the custom protocol <br/>
  - Opens Anima when called
  ex: `anima://anime/12` or `anima://user/2` or `anima://episode/66`
- Metadata
 - Traillers
 - Static & Animated Background for custom series (mp4, webm, png, gif, jpg...)
 - Rating
 - Voice actors
 - Characters
 - Genres
 - Release information

### Planned/Unreleased Features
- Manga reading from Mangadex.org
- Sync with other anime tracking apps (Hello, Anilist & Kitsu)

#### Figma file
Anima was first designed at Figma, the figma project is also public:<br/>
https://www.figma.com/proto/7lM0ZvMQhPj5YOIn24urf4/Anima?page-id=692%3A413&node-id=704-1666&viewport=80%2C1530%2C0.64&scaling=min-zoom&starting-point-node-id=704%3A1666

#### Screencaps
[Home Page](https://media.discordapp.net/attachments/1066166955750457456/1101969826206986380/image.png)
[Overall (outdated player)](https://cdn.discordapp.com/attachments/729245319392657459/1097751686673596476/explorer_64tusRp0GC.mp4)
[Nested Comments (outdated)](https://media.discordapp.net/attachments/1066347628691996753/1080369385199390760/anima-desktop_0MbC3kQmW9.gif)<br/>
[User Profile (outdated)](https://cdn.discordapp.com/attachments/1066347628691996753/1077823877427777567/anima-desktop_wyjR2GlxBJ.mp4)<br/>
[Immersive mode (up to date)](https://cdn.discordapp.com/attachments/1066166955750457456/1102464336305332354/NVIDIA_Share_eQR5uE7v6q.mp4)<br/>
[Filter Search & search (up to date)](https://media.discordapp.net/attachments/1066166955750457456/1104843205435990097/image.png)<br/>
[Watch party controlled by the discord bot](https://media.discordapp.net/attachments/1066166955750457456/1104835670557602002/image.png)<br/>
[Episode sort by launch date/episode number](https://media.discordapp.net/attachments/1066166955750457456/1103539160993779762/anima-desktop_k9jncrsAM7.gif)<br/>
[Quick search (up to date, black users are their own accent color choice)](https://media.discordapp.net/attachments/1066166955750457456/1098249390419869817/image.png)<br/>



### The goal
> Our goal is to connect users by allowing them to interact with each other via comments, watchrooms and profile lists while also providing top notch UX and a decent UI.

### Contributors
[@Nodge](https://github.com/nodgear)

[@Gabriel](https://github.com/GabrielMar)

---
> Copyright protected content<br/>
> This application & it's API doesn't hold any copyrighted video streams, if you are a legitimate owner of any content being shown on anima we would be glad to show from where said data is coming from, or, if necessary, remove it from the platform.

> API<br/>
> This repository doesn't contain the API required to run ANIMA.<br/>
> This means you must find or implement an API compatible with the format anima expects.<br/>
> The needed types can be seen at index.d.ts.<br/>


