# Korone / Aki connection completion: primary evidence

Research date: 2026-10-07. Compact original metadata and inspection observations are retained in `connection-korone-aki-final-evidence.json`. No data, application code, audit state, or external posts were changed by this researcher.

## Christmas Mukaetai — resolved

The complete group is **AZKi, Inugami Korone, Yukihana Lamy**. Exact Japanese name: **クリスマス☆むかえ隊**. This is an additional name for the existing あずらみころ trio, rather than a new membership set.

Primary source: [Lamy's original stream, inspected at 32:04](https://www.youtube.com/watch?v=SEuGEowBpCA&t=1924s), **【急遽雑談】#あずらみころ 女子会するぞ～！！【​AZKi・戌神ころね・雪花ラミィ /ホロライブ】**, streamed **2026-09-18**. Owner: **Lamy Ch. 雪花ラミィ**, `@YukihanaLamy`, `UCFKOVgVbGmX65RxO3EtH3iw`.

The original player was directly inspected in Chrome, paused at **32:04 (1924 seconds)**. The frame displays **グループ名：クリスマス☆むかえ隊**, with Lamy on the left, AZKi in the center and Korone on the right. The star and hiragana were read from this original frame. A YouTube transcript exported through the browser independently places the naming discussion at 30–32 minutes and the announcement at approximately 32:01–32:15; its ASR mangles names and does not preserve the exact written spelling, so it is corroboration rather than the spelling source. Title and description identify the same trio. Earlier title-only retrieval could not establish this alias; actual playback inspection now does.

## Angel Heaven — resolved aliases, no formation date assertion

The complete pair is **Aki Rosenthal and Oozora Subaru**, the existing アキスバ / AkiSuba duo. The primary source supports both spellings **エンジェルヘブン** and **エンジェルヘヴン**.

Primary source: [Aki's original stream](https://www.youtube.com/watch?v=bUeZ9E-mdoU), **エンジェルヘブン再出発【アキ・ローゼンタール×大空スバル/ホロライブ】**, streamed **2023-08-31**. Owner: **アキロゼCh。Vtuber/ホロライブ所属**, `@AkiRosenthal`, `UCFTLzh12_nrtzqBPsTCqenA`. Description begins `5年の時を経て再び`, links `@OozoraSubaru`, and explicitly includes **#エンジェルヘブン #エンジェルヘヴン**. These are literal uploader-authored metadata, not fan dictionary claims. The retrospective five-year wording is insufficient to establish a precise original formation date.

## Chikumaro — full four-person lineup verified

The complete group **ちくまろ / Chikumaro** is **Yuzuki Choco, Aki Rosenthal, Honma Himawari (Nijisanji), Yakumo Beni (VSPO!)**. A two-member Aki/Choco projection would misrepresent the named group.

Primary source: [Original cover](https://www.youtube.com/watch?v=L93enlVyak8), **【歌ってみた】ようこそ！ジャパリパークへ/Covered by癒月ちょこ＆アキロゼ＆本間ひまわり＆八雲べに【ホロライブ/にじさんじ/ぶいすぽ】**, premiered **2024-05-07**. Original watch page directly inspected in Chrome: owner **Choco Ch. 癒月ちょこ**, `@YuzukiChoco`, channel `UC1suqwovbL1kzsoaZgFZLKg`. The expanded description and collaborators dialog both establish talent ownership. The title lists all four, and description says `今回は #ちくまろ の ４人でようこそ！ジャパリパークへ` followed by these complete vocal credits:

```
癒月ちょこ @YuzukiChoco
アキロゼ @AkiRosenthal
本間ひまわり @HonmaHimawari
八雲べに @八雲べに
```

Official profile verification: [本間ひまわり — Nijisanji](https://www.nijisanji.jp/talents/l/himawari-honma), [八雲べに — VSPO member roster](https://vspo.jp/member/). VSPO's page contains Beni's profile in-page; no separate individual profile URL was verified. It gives the Romanized name YAKUMO BENI; Nijisanji's official store also gives Honma Himawari. Parent is implementing `external:honma-himawari` and `external:yakumo-beni` in a context-only external participant registry, with named guest chips and an explicit graph subset indicator. This supports complete group membership without placing either person in a Hololive cohort or depicting a duo as the whole group.

## Kinpatsu-gumi — original speech and quartet footage recovered

Requested membership is **Aki Rosenthal, Akai Haato, Yuzuki Choco, Yozora Mel**. Reused generic 金髪組 labels refer to different lineups, so they cannot establish this exact group:

- The official 2021-05-28 `from 1st` performance identifies an Aki/Mel/Haato trio; it omits Choco.
- A 2020-08-14 four-person stream identifies Mel/Choco/Flare/Watame and is associated with 金髪組卍; it is a different quartet.
- AkiLove's two archive-search hits for 金髪 identify Aki/Choco/Watame APEX and Aki/Mel ARK, respectively; neither resolves this quartet.

A secondary retrospective clip links Mel's original **ASHMZVS7HQk**, which is unavailable on YouTube but survives as a complete original recording on Ragtag: [archived player](https://archive.ragtag.moe/embed/ASHMZVS7HQk), [archival search metadata](https://archive.ragtag.moe/api/v1/search?v=ASHMZVS7HQk). Title: **【朝メル#19】もうすこしでハロウィン！！ということは…！！？【ホロライブ/夜空メル】**; owner **Mel Channel 夜空メルチャンネル**, `UCD8HOxPs4Xvsm8H0ZxXGiBw`; actual start **2022-10-26T22:06:08Z**, or **2022-10-27 07:06:08 JST**. The archive's UTC upload date is 2022-10-26, while the Japanese stream date is October 27. Archived at 2022-10-27T06:15:02.629491.

Viewer comments around 1:36:40–1:38:45 mention 金髪組 and collective bans. These were used only to locate the retrospective speech; viewer comments are not evidence of membership. A frame at 1:36:35 was directly inspected and confirms original Mel footage, without written quartet names. Original audio at **1:36:15–1:39:00** was extracted for local Japanese ASR through an isolated `uv run --with faster-whisper` runtime. The `small` model was recovered from its official public repository and SHA256 verified as `3e305921506d8872816023e4c273e75d2419fb89b24da97b4fe7bce14170d671`. Reading the PCM WAV into NumPy avoided a PyAV version mismatch without project dependency changes.

Actual original-recording speech at **1:36:26.5–1:36:29 (5786.5–5789 seconds)** is transcribed as **金髪組みほとんど全滅だったね**; at **1:36:29–1:36:32** she says **チョコ先生もダメだったし**. Mel then recounts her own demonetization and her conversation with Choco. Thus the talent's speech verifies the 金髪組 name and associates Mel and Choco with it. Neither the inspected 1:36:15–1:39:00 excerpt nor its preceding 1:33:15–1:36:15 excerpt explicitly names Aki/Haato. The speech source alone must not be treated as complete quartet proof. ASR occasionally mangles unrelated words, so the JSON preserves raw segment text and its method rather than pretending it is an official transcript.

The missing visual membership evidence is preserved in [Bilibili's fan-subtitled excerpt of Choco's original collaboration](https://www.bilibili.com/video/BV1Yb411g77o/). The mirror explicitly links original **pa5Q-yLWb08**, reports its title **【金髪組コラボ】悪魔の保健医が金髪組メンバーに○○する** and original date **2018-11-09**; mirror uploader is **圈外神明**, mirror date **2019-04-05**. These reported title/date fields and attribution to Choco are secondary metadata; the currently unavailable original watch page cannot independently verify its title/date/owner fields. The recording itself was successfully played in Chrome at 360p, then **directly inspected at clip 00:16 and paused at clip 00:31**. Actual original footage shows **Haato, Mel, Aki, Choco together from left to right** in Choco's classroom/clinic layout. This goes beyond the mirror's fan tags or thumbnail: all four original avatars are visibly present in the moving recording. After the video fully loaded, it was sought back to the start and replayed: **actual opening video at clip 00:03–00:04** displays **金髪組こらぼ**, with **Mel, Choco, Haato, Aki** left-to-right. This extra playback inspection resolves the earlier uncertainty about whether the named graphic was merely the poster. The accessibility time showed 00:04 while the rendered paused timer showed 00:03; the same title graphic is visible across that interval. Chinese subtitles and annotations are fan additions and were not used to establish membership. Original stream timestamp mapping for this edited excerpt is not known.

Taken together, the directly inspected historical quartet recording and Mel's original retrospective use of the name support the requested **Aki / Haato / Choco / Mel 金髪組** rather than either different trio/quartet above. The complete historical quartet can be represented with archival provenance; do not invent a formation date. Cite the original [Choco stream URL](https://www.youtube.com/watch?v=pa5Q-yLWb08) with its accessible mirror, and the [Mel recording via Ragtag](https://archive.ragtag.moe/embed/ASHMZVS7HQk). Neither original YouTube page is currently available. Ragtag preserves an original recording; Bilibili preserves an edited original-recording excerpt through a fan uploader. This limitation should remain explicit in the source notes.

Complete implementation IDs: `aki-rosenthal`, `akai-haato`, `yuzuki-choco`, `yozora-mel`.
