# Japanese collaboration-name audit — issue #10

Observed 7 October 2026. The original batch integrated **30 additional primary-supported records** and retained a **65-candidate ledger**, including already documented names. The subsequent [connection reconciliation and Holodex expansion](connection-knowledge-final.md) resolves additional names and retains external guests in complete unit lineups. That report and the current machine-readable ledger supersede the first-pass unfinished decisions below. Neither batch establishes the size of the full Japanese wiki index or current activity. The roster observation remains 3 October; historical roster evidence remains 6 October.

## Discovery coverage and access

The [supplied Seesaa index](https://seesaawiki.jp/hololivetv/d/%a5%db%a5%ed%a5%e9%a5%a4%a5%d6%a1%da%a5%b3%a5%f3%a5%d3%a1%bf%a5%e6%a5%cb%a5%c3%a5%c8%cc%be%b0%ec%cd%f7%a1%db?order=0,1,2,3&keyword=%E3%83%AD%E3%83%9C%E5%AD%90%E3%81%95%E3%82%93) could not be inspected. Direct HTTP/HTTPS and the in-app browser returned 403. The web reader replaced its legacy EUC-JP bytes with Unicode replacement characters and returned 404, including when following the wiki homepage's actual index link. A UTF-8 page-name URL did not restore access. A reader-proxy attempt also failed. These failures are retained as access limits, not as evidence that a name is absent.

The readable [AZKi unit table](https://seesaawiki.jp/hololivetv/d/AZKi) and [ReGLOSS cohort table](https://seesaawiki.jp/hololivetv/d/ReGLOSS) supplied Japanese spellings, membership hypotheses and citation leads. Recoverable search-index excerpts of Mio/Mel tables provided further discovery leads. The wiki homepage distinguishes internal/external unit lists, and the ReGLOSS cohort page explicitly reproduces its relevant index section. This is a partial audit of those recoverable tables and the prioritized candidates from issues #3/#5/#6/#7, **not a reconstructed full-index census**. No missing-coverage percentage is claimed.

The [machine-readable ledger](wiki-name-audit.json) compares candidates with canonical names, aliases and complete memberships. Each row records discovery URLs, member IDs, classification, primary evidence, timestamps or uninspected segment leads, verification state and remaining uncertainty. Different lineups and different names sharing a lineup are not automatically merged. Verified `external:` identifiers now live in a separate canonical guest registry, never in the Hololive portrait roster.

## Accepted batch

- Eleven previously deferred AZKi collaborations: AzuIro, AzuMion, FubuAZ, WataAZ, KanaAZ, KoyoAZ, Sakazuki, AZRyS, AZBae, AzuNose and RoARiS. [Evidence and fourteen-candidate reconciliation](wiki-azki-followup.md).
- Momosuzu Family (complete Miko/Mel/Nene trio), Dabuchizu and six-person Dorobou Kensetsu. [Evidence and historical-lineup investigation](wiki-korone-nene-followup.md).
- Twelve ReGLOSS names: the ten cohort duos (including 21歳拳で組 with the independently attested らではじ alias), AHO3, and 社長番長口八丁. [All seventeen cohort candidates and primary citations](wiki-regloss-followup.md).
- Four additional primary-attested names: KanaAzuKoro, RoboMioTaru, AzuLamyKoro (あずらみころ), and AkiSuba (アキスバ). The first pass retained their verified metadata names; the subsequent pass verifies Christmas Mukaetai and Angel Heaven and consolidates those names into the same records.

[AZKi's 2025-04-15 stream](https://www.youtube.com/watch?v=bExr7NEqNwQ) explicitly prints かなあずころ and names AZKi, Kanata and Korone. [Roboco's 2025-01-23 stream](https://www.youtube.com/watch?v=-jDyV9vW8WA) prints ロボミオタール and lists Aki and Mio as collaborators. These primary metadata inspections are retained in [additional evidence](wiki-additional-primary-metadata.json).

Japanese spellings are preserved exactly, including small ぉ in あずみぉーん and mixed scripts in フブあず. Romanizations are reading/search aids unless the primary source explicitly supplies a Latin name. Unsupported competing names such as KoZKi, AZKoyo, SakAZKi and Double Chi remain reported discovery labels in the ledger; they are not asserted performer-used aliases. No record claims a formation date merely from the selected upload's date.

All new records have aligned global/inline primary sources and derived edges. Groups retain complete membership spokes; they do not create all-pairs friendships. Dorobou uses the official shop's explicit six-person narrative, not an old interview applicant list as proof of hiring. Its source panel now labels it **In-game roleplay company**, alongside Kanaken; game-origin units and gaming teams have separate labels.

## Subsequent evidence recovery

The later pass recovered Chrome playback, original caption exports, original source scenes and archived original audio. RiONAZKi is printed at 14:47, Christmas Mukaetai at 32:04, and Angel Heaven is explicit in an alternate Aki-owned stream. WAZ’s original audio at 1:23:30–1:24:23 establishes the spoken name ワズ and letter discussion; Latin spelling is not claimed to be printed in the inspected frame. SoARo combines the uploader’s そあろ title with the inspected complete three-player lobby.

Kinpatsu-gumi’s preserved original intro actually prints 金髪組こらぼ with Aki/Haato/Choco/Mel, followed by all four in Choco’s clinic. Mirror-reported original title/date/owner remain distinct from inspected original footage. Mel’s original retrospective audio corroborates the name, but is not used alone as quartet evidence.

Chikumaro retains all four members through sourced guest context. あずこと, あずみみずしー and Shotgun Rose now have primary names and complete external lineups. These groups appear as explicitly partial graph nodes when only one Hololive portrait is visible. Current guest agencies are not guessed.

All named candidates in issues #3/#5/#6/#7 are now supported. Unsupported translations, competing aliases and naming-history claims remain explicitly logged; they are not graph facts. The subsequent pass resolves the remaining ReGLOSS candidates. Its 65 selected entries now have primary support, including an expressly provisional trio; the full legacy index remains inaccessible. Ri-A-Ra and オトヒバナ are resolved by composite original-stream and exact primary written-name evidence. See the [current reconciliation](connection-knowledge-final.md) for subsequent additions and final verification.

## Verification

`npm run check` passes model/layout regressions, candidate-ledger consistency, source/member/derived-edge validation, local portrait checks, production build and public links. Browser checks on the built preview verified Japanese alias lookup, Dorobou's six-person source panel and roleplay label, Momosuzu Family's complete historical lineup after hiding former members, and route navigation. Unsupported competing aliases remain excluded. The subsequently verified provisional ReGLOSS name is explicitly labelled provisional; it is not asserted as a final adoption.
