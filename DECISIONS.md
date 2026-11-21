# Decisions

Where the build departed from the original brief, settled something the brief
left open, or checked something it marked as unverified. Newest facts are as
of November 2026.

## Departures from the brief

**Shortcodes became components.** The brief's example used
`{% theorem(name="…") %} … {% end %}`. Zola 0.23 (August 2026) removed
shortcodes and replaced them with Tera components, so the syntax is
`{% <theorem name="…"> %} … {% </theorem> %}`. There was no choice here short
of pinning an old Zola.

**Maths is written `` $`…`$ ``, not `$…$`.** Zola still has no maths support
(getzola/zola#2791 is open, unmerged), so markdown sees a formula as ordinary
text and rewrites it: `\\` becomes `\`, `\{` becomes `{`, `\,` loses its
backslash, and a pair of `*` becomes emphasis. The damage is silent and the
formula still renders, wrongly. Wrapping the TeX in a code span is the one
form markdown is guaranteed to leave alone. It is also GitHub's own inline
maths syntax. Plain `$…$` is deliberately not rendered, so that a forgotten
backtick is obvious at once instead of being subtly wrong later.

**Maths needs either Node at build time or JavaScript in the browser, and the
theme offers both from one copy of KaTeX.** "No JavaScript" and "only the Zola
binary" cannot both hold for maths until Zola renders it natively. The theme
vendors KaTeX and ships a build script that uses that copy directly: Node is
needed but nothing is installed, and the output has no scripts. The shipped CI
workflow runs it. Without that step (and under `zola serve`) the same KaTeX
runs in the browser as a progressive enhancement, on pages with maths only,
and readers without JavaScript see the TeX source. So `zola build` alone
always yields a working site, and the recommended deploy yields a script-free
one. When Zola gains native maths this should be revisited.

**Footnotes become margin notes by position, not by pairing.** Without
JavaScript a stylesheet cannot move a footnote next to its reference. It can
float the definition into the margin from wherever it is written. So: a
definition written right after its paragraph sits beside that paragraph's last
line; definitions gathered at the end of a file are detected and set as
ordinary footnotes; `bottom_footnotes = true` gives classic end-of-page
footnotes with back-links. Exact placement beside the reference is what the
`sidenote` component is for.

**Sidenotes use letters on pages that also have footnotes.** The two are
numbered independently (one by CSS, one by Zola), so a page using both would
show two notes numbered 1. On such pages only, sidenote marks become a, b, c.

**Custom table borders are presets.** LaTeX.css puts border classes on
individual rows and cells, which markdown tables cannot carry. The `table`
component offers `booktabs`, `grid` and `none`; finer control means an HTML
table with the LaTeX.css classes, which remain available.

**No hand-written HTML prototype.** The brief suggested designing in static
HTML first. With LaTeX.css fixing most of the look, it was quicker to write
the templates directly and review rendered screenshots at each step.

**The base font size is 17px, not 16px.** Latin Modern is light on screens.
Everything in LaTeX.css is in `rem` and `ch`, so the column is still 80ch.

**The owner's name is not in the licence or `theme.toml`.** The brief says
nothing about the owner belongs in the repository, so both credit "Camera
Ready contributors". The repository URL necessarily contains the GitHub
account name. Changing the credit is a two-line edit if wanted.

**The homepage follows Xuning Yang's organisation, set in LaTeX type.** A
first version gave the homepage a centred paper-style title block. The owner
rejected it: the reference is her layout. Every page now has the same header
(name and subtitle on the left; menu and icon links on the right), and the
homepage runs bio with portrait, dated news, then selected works with venue
tags, slash-separated links (as on Jon Barron's site) and optional tinted rows. Posts keep the centred
title, author and date of a paper underneath that header. Nothing was copied
from her GPL code.

**Header links can be icons.** The reference header relies on them. They are
sixteen inline SVGs from Font Awesome Free (CC BY 4.0) in one template, so no
icon font and no request. Links without an `icon` show as text.

**Icon links moved to the footer; words under the bio.** The owner tried the
icons in the header and preferred them at the right of the footer, with the
same links as plain words under the bio, as on Jon Barron's page.
`links_position = "header"` and `bio_links = false` undo either.

**An optional light/dark button, in JavaScript.** The brief replaced
LaTeX.css's toggle with "follow the system". The owner later asked for a
button. It is off by default (`scheme_toggle`), is the only script outside
maths, is about 30 lines inline, remembers the choice in localStorage, and is
hidden in the markup so that without JavaScript there is no dead button and
the page follows the system.

**An optional search field that points at DuckDuckGo.** The brief listed
search under "not goals" because it needs a server or third party. This is a
plain GET form with the query limited to the site: no script, nothing loaded
from DuckDuckGo, and it fails soft. It is off by default (`search`) because a
site owner should choose to send visitors to a third party.

**Figures can be inverted in dark mode.** `dark_invert` on a figure,
publication or project marks an image as dark ink on white. Dark mode then
inverts its lightness and rotates the hue back, so colours keep their names.
Light mode is untouched. Borrowed in
spirit from Terenin's academic-paper theme. It is opt-in per image because
it ruins photographs.

**"/" focuses the search field, optionally.** `search_shortcut` adds a
ten-line script. Off by default, like the search field itself.

**Your name is underlined, not bold; co-authors can be linked.** The owner
asked for this in place of the bold name. Co-author pages live in an optional
`data/authors.toml`, so a page is entered once and applies to every paper.
Linked names are text-coloured and take the owner's underline on hover.

**The "NEW!" badge follows the news text.** It first led the item, which
pushed new items' text out of line with the rest.

**A `links` field picks which links an entry shows.** By default every
filled-in link field appears. `talk` was added and `website` is now labelled
"webpage".

**Phone layout was checked at 390px and 320px, not just narrowed.** Below
34rem the header stacks (name, then menu with the search field filling the
row), the portrait shrinks and the sections start beneath it, publication
thumbnails sit above their text at a small fixed height, project cards
go two across, the notes index puts dates under titles, and wide numbered
equations scroll with their number instead of having it printed over them.

**The portrait hangs in the margin.** On screens wide enough for sidenotes
the homepage portrait sits in the right margin, positioned exactly as
LaTeX.css positions a sidenote, so the bio and sections use the full column.
Below 1050px it floats inside the column. `photo_position = "inline"` turns
this off.

**The portrait can be left out on phones.** `photo_on_phones = false`, at
the owner's request; shown by default.

**The portrait float is not cleared, except on phones.** With a short bio the next section
starts beside the picture, as on the owner's current site, instead of leaving
a gap.

**The homepage is set one step smaller than running text.** Same typeface,
column and colours, but 0.92 of the body size with tighter leading: LaTeX.css's
1.8 line height suits a paper and made a page of short rows look heavy. Posts
are unchanged.

**Small publication lists stay on the homepage.** Up to `papers_limit`
entries (20, roughly a Google Scholar profile page) the homepage lists
everything and no papers page is needed; past it the homepage shows the
`selected` entries and links to the full list. The owner asked for this in
place of an always-separate papers page.

**The demo has no papers page; "View all" goes to Scholar.** The brief asked
for a full papers page. The owner later preferred a single homepage whose
"View all" link points at a Google Scholar profile. `papers_page` now takes
any URL and defaults to none. The year-grouped papers page is still in the
theme (`papers.html`) for sites that want their own list.

**The demo's section is "Blog", and the kitchen sink is a post in it.** A
general audience reads "blog" more readily than "notes", and one menu entry
is tidier than three. The section name is still whatever its `_index.md` says.

**A second colour, for the note tag only.** The brief preferred one accent.
The owner asked for "Spotlight" and "Oral" to stand out in magenta, so there
is a `note_color`, used nowhere else.

**The "NEW!" badge is a GIF.** The brief preferred pure CSS. A CSS/SVG
redrawing was built and the owner preferred the original animated GIF from
Saqib Javed's site, so the theme ships that file (1 KB) and uses it by
default. Its original author and licence are unknown; `new_badge` swaps it
for any other image, and `new_badge = ""` uses the redrawn SVG. The SVG is
also what visitors with reduced motion see, since a GIF cannot be paused.

**A "Miscellanea" section, set like a CV.** Jon Barron's page ends with
coloured label blocks beside short lists. Here the label is small caps in the
thumbnail column with a hairline between groups, so no new colour or box is
introduced. Items are plain lines, as on his page: a
right-aligned date column was tried and made the section read like a résumé.

**Projects are cards; publications are rows.** The owner chose Yang-style
cards (image on top) for projects. `projects_style = "rows"` gives the
publication layout instead.

**Publication thumbnails are frameless and sized by their text.** No border
or backing, never cropped, and never taller than the row's text, so a square
figure and a wide one sit comfortably in the same list. Figures drawn for
a white page can opt in to `dark_invert`.

**Publication titles are regular weight.** They were bold. Latin Modern's
only bold is bold extended, and a list of bold, green, multi-line titles
looked heavy. Titles are now a little larger than the text around them, tags
are regular weight, and the link row is a little smaller.

**Rows keep the thumbnail column.** When any publication has a thumbnail,
rows without one show a blank slot instead of spreading to full width, so the
text stays aligned and a missing image is obvious.

**Hover thumbnails.** `thumbnail_hover` lays a second image over the first
while the row is hovered, Barron's effect without his script.

## Open questions, settled

**How to carry LaTeX.css.** Vendored unmodified (`static/latex.css/`, version
1.14.0) with one hand-written stylesheet layered on top. Upgrading LaTeX.css
is a file copy. Only the `woff2` fonts are shipped; the older formats its
stylesheet also lists are never requested by a current browser.

**Publications from BibTeX.** Verified: `load_data(format="bibtex")` works and
passes unknown fields through, so `selected`, `thumbnail`, `blurb` and the
link fields live in the `.bib` file. Entries keep file order. A small set of
LaTeX accents is converted; the rest should be Unicode.

**How homepage sections are switched and ordered.** One list,
`home_sections = ["news", "selected", "projects"]`. A section whose data file
is missing hides itself.

**How "New!" expires.** By age at build time (90 days by default), with a
weekly scheduled rebuild in the workflow so badges expire unattended. A per
item `new = true/false` overrides it.

**Tags, feed, table of contents.** Tags are opt-in: declare the `tags`
taxonomy and the notes index gains a "view by tag" row and each tag a page;
without it nothing changes and the section stays flat. An
Atom feed is on in the example config, using Zola's built-in template. A
table of contents is opt-in per page (`toc = true`).

**Font option.** `font = "libertinus"` switches the whole site. Both families
are in the theme (about 1.3 MB on disk) but a visitor downloads only the one
in use.

**Accent colour.** Default `#0a7d55`, a darker relative of the green on
Xuning Yang's site (`#0eb077`), which fails contrast for body-size text on the
LaTeX.css background. The dark-mode variant is `#58d0a3`. The rest of the
LaTeX.css dark palette is untouched.

**Syntax highlighting.** Zola 0.22 moved to the Giallo highlighter and
TextMate themes. The theme ships two small theme files in the colours of
LaTeX.css's Prism stylesheet. One colour differs: Prism's light-mode orange
(`#e90`) is darkened to `#b37400` for contrast.

**Extra environments.** Proposition, corollary, example and remark were added,
following amsthm conventions and sharing the theorem counter. Their labels are
not translated. Cross-references by number are not offered, because a
stylesheet cannot put a counter's value into link text; results can be linked
by `id`.

**Target version.** Zola 0.23.6; minimum 0.23.0.

## Facts the brief marked unverified

- Zola's `load_data` reads BibTeX: yes, but the format must be given
  explicitly for a `.bib` file.
- Zola's image resizing covers thumbnails: yes (`resize_image`), used for
  thumbnails, the portrait and figures.
- Barron's nested tables and hover scripts: not examined, since nothing was
  taken from that code. Rows are CSS grid.
- The theme name: no "camera-ready" in the Zola themes directory at the time
  of writing. Check again before submitting.

## Keeping private content out

The owner's real content is used for previews from a separate folder outside
this repository, which pulls the theme in through `themes/`. A local,
untracked pre-commit hook refuses any commit whose staged changes match a
private pattern list. The development brief itself is git-ignored because it
names the owner.
