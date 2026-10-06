# Historical roster restoration: Yozora Mel and Uruha Rushia

Verified 2026-10-06 against COVER's announcements, COVER-authored press releases, and archived official talent profiles. Archive hosts preserve first-party material; they are not the authors of the profile claims.

## Proposed metadata

| Field | Yozora Mel | Uruha Rushia |
| --- | --- | --- |
| ID | `yozora-mel` | `uruha-rushia` |
| English name | Yozora Mel | Uruha Rushia |
| Japanese name / searchable alias | 夜空メル | 潤羽るしあ |
| Short search alias | Mel | Rushia |
| Branch | JP | JP |
| Historical cohort | hololive 1st Generation | hololive 3rd Generation / hololive Fantasy |
| Debut stream | 2018-05-13 | 2019-07-18 |
| Contract termination | 2024-01-16 | 2022-02-24 |
| Status wording | Former talent · Contract terminated | Former talent · Contract terminated |

The canonical names, debut-stream dates, and cohorts are stated in the [archived official English Mel profile](https://web.archive.org/web/20240116071423/https://hololive.hololivepro.com/en/talents/yozora-mel/) and [archived official English Rushia profile](https://web.archive.org/web/20220126170833/https://hololive.hololivepro.com/en/talents/uruha-rushia/). The short aliases are search conveniences derived from those names, not claims of official nicknames.

Mel's [archived official Japanese profile](https://archive.li/YVl95) distinguishes her 2018-05-03 debut announcement/history entry from her 2018-05-13 first stream. Use May 13 consistently with the atlas's debut-stream convention. The profile and [official from 1st event page](https://hololive.hololivepro.com/events/from1st/) identify her as a first-generation member.

Rushia's date and Fantasy membership have a surviving unarchived primary source: [COVER's July 12, 2019 press release](https://prtimes.jp/main/html/rd/p/000000093.000030268.html), which announces her first stream for July 18 at 21:00 JST and identifies the pair as members of the third-generation hololive Fantasy cohort. PR TIMES is the distributor; カバー株式会社 (COVER Corporation) is the identified author/source owner.

## Status sources

- [COVER: Announcement Regarding Termination of Contract with Yozora Mel](https://cover-corp.com/en/news/detail/20240116), published 2024-01-16. The [corrected official announcement PDF](https://files.microcms-assets.io/assets/6368857617454c2591b02acff18e76bb/860df842ade94b6ba322808bf0330420/240116_E_Announcement_rev_.pdf) states the agreement terminated that day. Use the corrected announcement, which includes agreement from the talent. This remains a termination, not a graduation.
- [COVER: Notice regarding Termination of Our Contract with Uruha Rushia](https://cover-corp.com/en/news/detail/20220224b), published 2022-02-24. The [official announcement PDF](https://files.microcms-assets.io/assets/6368857617454c2591b02acff18e76bb/66ec568cb10c477ab9415b73174f66e3/RU_v6_semifinal_EN__rev__clean_.pdf) states the agreement terminated that day and identifies her third-generation membership. The English landing URL ends in `20220224b`.

The PDF CDN is linked/embedded by COVER's own announcement pages. COVER Corporation owns both status claims. Neither historical cohort membership nor these former-talent records should imply present membership or activity. A former-member toggle should include these records while individual badges explain termination distinctly from graduation.

## Portrait provenance

Both files are original official raster assets, downloaded without generating or modifying the images. They were visually inspected and decoded successfully as RGBA PNGs.

| Local asset | Official original asset | Acquisition | Dimensions | SHA-256 |
| --- | --- | --- | --- | --- |
| `public/assets/yozora-mel.png` | `https://hololive.hololivepro.com/wp-content/uploads/2023/04/Yozora-Mel_pr-img_01-960x1440.png` | [Wayback image capture, 2024-01-16 07:08:16 UTC](https://web.archive.org/web/20240116070816id_/https://hololive.hololivepro.com/wp-content/uploads/2023/04/Yozora-Mel_pr-img_01-960x1440.png) | 960 × 1440 | `4bc8fd7dfcde747746261f5b79dca8567e35b57c3291e1e973bc6f8ce6e8bf91` |
| `public/assets/uruha-rushia.png` | [Live official asset](https://hololive.hololivepro.com/wp-content/uploads/2020/06/rushia_pr-img_2.png) | Downloaded from the live official server | 1000 × 1385 | `74e68e5f1d2d36134bfe95045bd1f11d93f7ec6e424d725f7ccd89005f027dd5` |

The exact Mel image URL is present in the archived official English Mel profile HTML, and the exact Rushia image URL is present in the archived official English Rushia profile HTML. These profile-to-image links establish provenance independently of third-party galleries. COVER Corporation is the publishing/source owner. Mel's current profile and original image URL return 404, so the archive capture supplies the preserved official file. Rushia's full-size original asset still returns 200.

Keep the original portrait URLs and archive acquisition URL in asset/source metadata so an asset audit can reproduce this verification. Do not silently replace the archived profile links with their removed live URLs.

## Implementation and verification — 6 October 2026

Implemented locally: canonical Mel and Rushia records, archived official profile links and original portraits, separate `former` contract-termination status, dated historical membership, and former-member filtering. Mel membership begins 2018-05-03 while her stream debut remains 2018-05-13. No collaboration edges were inferred. The current-roster observation remains 3 October; historical expansion is dated 6 October. Browser checks verified portraits, termination wording, and Gen 1 counts of five shown/four with former members hidden. Focused regressions also cover Gen 3 and both deep links.

`npm run check` passes all 10 regressions, data/portrait validation, production build and public-link checks. No GitHub issue has been closed or commented on.
