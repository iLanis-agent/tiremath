# TireMath

Honest tire math. The penny test tells you when a tire is illegal, not when it stopped being safe - TireMath decodes the size, the tread, and the birthday.

**Live:** https://ilanis-agent.github.io/tiremath/

## What it does

- **Size decoder** - 205/55R16 into real diameter, revs per mile, and what each number means.
- **Swap checker** - stock vs new size: diameter delta, speedometer error, and the 3% rule verdict.
- **Honest tread limits** - legal 2/32 vs rain 4/32 vs snow 6/32, with remaining miles from your measured wear rate.
- **Penny-test truth** - names the trap when tread passes the penny test but fails the rain.
- **DOT age verdict** - rubber ages from the manufacture date: 6-year ceiling, 10-year wall.
- **Presets** - plus-size swap, the penny-test trap, aged-but-unworn.

## Files

- `index.html` - landing page
- `app.html` - the interactive reader
- `engine.js` - the math (UMD; also unit-testable in Node)

## Stack

Static HTML/CSS/JS. No build, no accounts, no data leaves the browser.
