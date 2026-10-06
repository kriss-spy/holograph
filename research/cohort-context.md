# Fubuki dual membership and Sana Council/Promise context — issue #9

Research date: 2026-10-06. Primary official profiles and announcements were read directly. Issue #9's reader comment is a lead, not membership evidence. No code or data changes are made by this research note.

## Verified claims

| Claim | Primary evidence | Publication / event date |
| --- | --- | --- |
| Shirakami Fubuki belongs to both hololive 1st Generation and hololive GAMERS. | Her official English profile's DATA / Unit explicitly reads “hololive 1st Generation/hololive GAMERS”. The Japanese profile confirms both. [English profile](https://hololive.hololivepro.com/en/talents/shirakami-fubuki/), [Japanese profile](https://hololive.hololivepro.com/talents/shirakami-fubuki/). | Undated living profile; checked 2026-10-06. It separately gives debut stream date 2018-06-01; this is not evidence of the date GAMERS membership began. |
| Tsukumo Sana is an alum whose historical unit remains Council. | Her official English profile is headed `[Alum] Tsukumo Sana`; DATA / Unit identifies hololive English -Council-. [Official profile](https://hololive.hololivepro.com/en/talents/tsukumo-sana/). | Undated living profile; checked 2026-10-06. Debut stream date shown is 2021-08-23. |
| Sana graduated from Council on 2022-07-31. | The official shop's notice names her Council affiliation and the graduation date. [Graduation and related merchandise notice](https://shop.hololivepro.com/blogs/news/notice-regarding-the-graduation-of-tsukumo-sana-and-related-merchandise). COVER also has a graduation announcement, although the currently retrieved HTML exposes its title/date without the original announcement body. [COVER announcement](https://cover-corp.com/en/news/detail/20220712b). | Shop notice published 2022-07-12; effective graduation 2022-07-31. COVER's live page date displays 2022-07-11. |
| Promise was announced with five members: IRyS, Ceres Fauna, Ouro Kronii, Nanashi Mumei and Hakos Baelz. | COVER's official announcement explicitly lists these five and explains Project:HOPE closure and IRyS's official Promise affiliation. It does not list Sana. [Promise formation announcement](https://hololive.hololivepro.com/en/news/20231009-01-211/). | Published 2023-10-09; official Promise affiliation begins 2023-10-08 PDT. |

The implementation implication is an inference from the dated evidence: Sana graduated before Promise formed, and the official retained profile identifies Council. Preserve Council as her actual historical membership. Cross-linking Council and Promise for browsing is a display decision; it should be explicitly labelled as such and must not claim Sana joined or debuted in Promise.

## holoplus claim investigation

The reader claim that holoplus places Sana with Promise remains **unverified**. The supplied [reader comment](https://www.reddit.com/r/Hololive/comments/1wwsgy9/comment/pdnj9vc/) could not be retrieved by the web reader. Searches for `"holoplus" "Sana" "Promise"` and `"ホロプラス" "九十九" "Promise"` produced no primary evidence for the claimed talent grouping.

The [official holoplus site](https://www.holoplus.com/en/) and [official global-release announcement](https://hololive.hololivepro.com/en/news/20240821-01-289/) establish that holoplus is COVER's iOS/Android app, with talent news, My Oshi, community and stream-schedule features. The public pages do not expose Sana's in-app cohort classification. No authenticated mobile app state or screenshot was inspected in this pass. This is a limit of the available evidence, not proof that the app does or does not use that grouping.

The claim is not needed to provide explicit Council/Promise navigation context. Do not cite holoplus as support for Sana's Promise membership or display grouping without a dated, directly inspected app capture or primary explanation.

## Source candidates for data integration

- `official-fubuki-profile`: official_profile; undated; https://hololive.hololivepro.com/en/talents/shirakami-fubuki/ — exact dual-membership claim.
- `official-sana-profile`: official_profile; undated; https://hololive.hololivepro.com/en/talents/tsukumo-sana/ — Council historical unit, alum status and debut stream date.
- `official-sana-graduation-shop`: official_announcement; 2022-07-12; https://shop.hololivepro.com/blogs/news/notice-regarding-the-graduation-of-tsukumo-sana-and-related-merchandise — Council graduation effective 2022-07-31.
- `official-promise-formation`: official_announcement; 2023-10-09; https://hololive.hololivepro.com/en/news/20231009-01-211/ — five founding members, with effective date 2023-10-08 PDT.

Use the repository's actual source type enum rather than assuming the proposed descriptive categories above match it. Undated profiles should retain no invented publication date; a retrieval date is a separate concept.

## Implementation and verification — 6 October 2026

Implemented locally: Fubuki has one overview portrait with an explicit secondary-affiliation label, both affiliations in the directory and source panel, and cohort buttons. In selected cohort views, region placement follows that cohort, preserving the same canonical ID and relationship edges. Council, Promise and Project: HOPE have explicit related-cohort navigation with primary-source explanations. Sana retains only her historical Council membership. Browser checks verified Fubuki’s GAMERS navigation, Sana’s dated context, Promise’s five-member view, Back restoration, and Project: HOPE’s one-member view. The holoplus claim remains unverified and is not used as data evidence.

`npm run check` passes all 10 regressions, data/portrait validation, production build and public-link checks. No GitHub issue has been closed or commented on.
