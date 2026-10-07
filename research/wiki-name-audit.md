# Japanese collaboration-name audit — issue #10

Observed 7 October 2026. This audit integrates **30 additional primary-supported records** and retains a **65-candidate ledger**, including already documented names. It does not establish the size of the full Japanese wiki index or current activity. The roster observation remains 3 October; historical roster evidence remains 6 October.

## Discovery coverage and access

The [supplied Seesaa index](https://seesaawiki.jp/hololivetv/d/%a5%db%a5%ed%a5%e9%a5%a4%a5%d6%a1%da%a5%b3%a5%f3%a5%d3%a1%bf%a5%e6%a5%cb%a5%c3%a5%c8%cc%be%b0%ec%cd%f7%a1%db?order=0,1,2,3&keyword=%E3%83%AD%E3%83%9C%E5%AD%90%E3%81%95%E3%82%93) could not be inspected. Direct HTTP/HTTPS and the in-app browser returned 403. The web reader replaced its legacy EUC-JP bytes with Unicode replacement characters and returned 404, including when following the wiki homepage's actual index link. A UTF-8 page-name URL did not restore access. A reader-proxy attempt also failed. These failures are retained as access limits, not as evidence that a name is absent.

The readable [AZKi unit table](https://seesaawiki.jp/hololivetv/d/AZKi) and [ReGLOSS cohort table](https://seesaawiki.jp/hololivetv/d/ReGLOSS) supplied Japanese spellings, membership hypotheses and citation leads. Recoverable search-index excerpts of Mio/Mel tables provided further discovery leads. The wiki homepage distinguishes internal/external unit lists, and the ReGLOSS cohort page explicitly reproduces its relevant index section. This is a partial audit of those recoverable tables and the prioritized candidates from issues #3/#5/#6/#7, **not a reconstructed full-index census**. No missing-coverage percentage is claimed.

The [machine-readable ledger](wiki-name-audit.json) compares candidates with canonical names, aliases and complete memberships. Each row records discovery URLs, member IDs, classification, primary evidence, timestamps or uninspected segment leads, verification state and remaining uncertainty. Different lineups and different names sharing a lineup are not automatically merged. `external:` identifiers exist only in the research ledger, never in the canonical talent roster.

## Accepted batch

- Eleven previously deferred AZKi collaborations: AzuIro, AzuMion, FubuAZ, WataAZ, KanaAZ, KoyoAZ, Sakazuki, AZRyS, AZBae, AzuNose and RoARiS. [Evidence and fourteen-candidate reconciliation](wiki-azki-followup.md).
- Momosuzu Family (complete Miko/Mel/Nene trio), Dabuchizu and six-person Dorobou Kensetsu. [Evidence and historical-lineup investigation](wiki-korone-nene-followup.md).
- Twelve ReGLOSS names: the ten cohort duos (including 21歳拳で組 with the independently attested らではじ alias), AHO3, and 社長番長口八丁. [All seventeen cohort candidates and primary citations](wiki-regloss-followup.md).
- Four additional primary-attested names: KanaAzuKoro, RoboMioTaru, AzuLamyKoro (あずらみころ), and AkiSuba (アキスバ). The last two retain the verified naming evidence without asserting Christmas Mukaetai or Angel Heaven as aliases.

[AZKi's 2025-04-15 stream](https://www.youtube.com/watch?v=bExr7NEqNwQ) explicitly prints かなあずころ and names AZKi, Kanata and Korone. [Roboco's 2025-01-23 stream](https://www.youtube.com/watch?v=-jDyV9vW8WA) prints ロボミオタール and lists Aki and Mio as collaborators. These primary metadata inspections are retained in [additional evidence](wiki-additional-primary-metadata.json).

Japanese spellings are preserved exactly, including small ぉ in あずみぉーん and mixed scripts in フブあず. Romanizations are reading/search aids unless the primary source explicitly supplies a Latin name. Unsupported competing names such as KoZKi, AZKoyo, SakAZKi and Double Chi remain reported discovery labels in the ledger; they are not asserted performer-used aliases. No record claims a formation date merely from the selected upload's date.

All new records have aligned global/inline primary sources and derived edges. Groups retain complete membership spokes; they do not create all-pairs friendships. Dorobou uses the official shop's explicit six-person narrative, not an old interview applicant list as proof of hiring. Its source panel now labels it **In-game roleplay company**, alongside Kanaken; game-origin units and gaming teams have separate labels.

## Unfinished evidence

WAZ, RiONAZKi, Christmas Mukaetai and Angel Heaven still need independently inspected spoken-name evidence. Real transcript/player attempts were made; readable metadata is available, but playback requests bot sign-in and transcript exports were unavailable. The ledger marks approximate secondary segment leads as uninspected, rather than verified timestamps. WAZ's original recording mirror was located and a few actual frames inspected without establishing the spoken name.

SoARo has a primary そあろ title and a recognizable three-person uploader thumbnail, but remains outside the graph pending explicit full-lineup evidence. Kinpatsu-gumi's requested four-person original archives are unavailable. An official three-person performance and a different four-person blonde lineup cannot stand in for the requested Aki/Haato/Choco/Mel group.

Chikumaro's primary four-person credits include Honma Himawari and Yakumo Beni. The ledger preserves all four; no Aki/Choco-only projection is added. Three additional external wiki groups require both primary verification and an external-roster design. SoAzKo's official card spelling corroborates a wiki lead, but its card effect is not treated as sole explicit event-unit membership evidence.

Issue #6's remaining two named candidates are now supported. Issues #3/#5/#7 retain the precise gaps above. Broad issue #10 remains open because the full legacy index is inaccessible and the ledger still contains unfinished primary investigations.

## Verification

`npm run check` passes model/layout regressions, candidate-ledger consistency, source/member/derived-edge validation, local portrait checks, production build and public links. Browser checks on the built preview verified Japanese alias lookup, Dorobou's six-person source panel and roleplay label, Momosuzu Family's complete historical lineup after hiding former members, and route navigation. Unverified naming leads never become searchable verified aliases.
