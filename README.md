# book-highlights
Styled exports of books I read on Kindle https://beatobongco.com/book-highlights/

## Setup

This is a temporary setup. I plan to generalize this (perhaps on a separate repo) so others can use it.
For now, however, these instructions will suffice.

0. Clone this repo
1. Remove contents of `raw_notes` and `book` folders
1. `pip install requirements.txt`
2. Dump your Kindle notes in the `raw_notes` folder. See [file format](#File-format)
3. Run `python generate_pages.py`
4. Push
5. Make your repo available as a github page and you're done!

## File format

The filename becomes the HTML filename and thus the URL.

e.g. `a-mind-at-play` -> (run script) -> `a-mind-at-play.html` -> on github pages this can be accessed as <your URL>/a-mind-at-play

The following format is subject to change, but for now files are parsed by line number.

Line 1: Title
Line 2: Summary (appears after title)
Line 3: Short summary (appears as meta description and opengraph description)
Line 4+: The actual output of your Kindle Reader export

