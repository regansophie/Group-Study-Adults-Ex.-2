# Experiment 2 Counterbalance QA

Generated from the eight source decks in `Experiment 2/PPT Files`.

## Slide Ranges

- Intro/exposure range used for jsPsych assets: slides 5-16.
- Test range used for jsPsych assets: slides 17-28.
- Slides 1-4 and 29 were exported but are not currently included in exposure/test folders.

## Counterbalance Notes

- All decks contain 29 slides.
- The clean PNG export has been rebuilt one deck at a time and split into `all_slides`, `exposure`, and `test` folders for versions 1-8.
- Using only Version 1 PNGs would not preserve the counterbalancing because the visible text inside the slide images differs across versions.
- If we rebuild the experiment with jsPsych-rendered text over reusable image components, Version 1 can be used as a visual reference/base, but the current raw-PNG workflow should use the per-version PNGs.

## Detected Source Deck Issues To Review

Several test slides have a mismatch between the speech bubble text and the bottom prompt text:

- Version 2: slides 17 and 19 show `dalmatian`/`poodle` in the speech bubble, but the bottom prompt says `dog`.
- Version 3: slides 17 and 19 show `dalmatian`/`poodle` in the speech bubble, but the bottom prompt says `dog`.
- Version 4: slides 18 and 20 show `dalmatian`/`poodle` in the speech bubble, but the bottom prompt says `dog`.
- Version 6: slides 17 and 19 show `dalmatian`/`poodle` in the speech bubble, but the bottom prompt says `dog`.
- Version 7: slides 17 and 19 show `dalmatian`/`poodle` in the speech bubble, but the bottom prompt says `dog`.
- Version 8: slides 18 and 20 show `dalmatian`/`poodle` in the speech bubble, but the bottom prompt says `dog`.

Potential group-color mismatch in the exposure phase:

- Versions 5-8: the dalmatian exposure slide shows a person wearing a red shirt, but the caption says the person is a member of the blue group.

