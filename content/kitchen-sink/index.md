+++
title = "Kitchen sink"
description = "Every feature of the Camera Ready theme on one page, following the LaTeX.css demo."
date = 2026-11-21
authors = ["Mira Castellane"]

[extra]
toc = true
abstract = "This page follows the [LaTeX.css](https://latex.vercel.app) demo section by section and shows how each feature is reached from markdown, a component, or the site config. Nothing on it needs hand-written HTML, and nothing is loaded from another site."
+++

## Class-less elements

Plain markdown is styled with no further effort: headings, paragraphs, **bold**, *italic*, [links](https://example.org), `inline code`, lists, quotations, tables and images. The title, author line, date and abstract above come from the page's front matter:

```toml
+++
title = "Kitchen sink"
date = 2026-11-21

[extra]
abstract = "This page follows the LaTeX.css demo…"
toc = true
+++
```

## Theorems, definitions, lemmas and proofs

Wrap the statement in a component. Leave the `name` off if the result has none.

{% raw %}
```jinja
{% <theorem name="Cantor"> %}
The real numbers $`\mathbb{R}`$ are uncountable.
{% </theorem> %}
```
{% endraw %}

{% <theorem name="Cantor"> %}
The real numbers $`\mathbb{R}`$ are uncountable.
{% </theorem> %}

{% <proof> %}
If $`\mathbb{R}`$ is countable, then $`[0, 1]`$ is countable as well. Hence there exists a map $`C`$ from $`\mathbb{N}`$ onto $`[0, 1]`$ with

$$`
C(n) = \sum_{i=1}^{\infty} c_i(n)\, 10^{-i},
`$$

where $`c_i(n) \in \{0, 1, \ldots, 9\}`$ are the digits in the decimal expansion. Now consider a real number

$$`
x = \sum_{i=1}^{\infty} \bar{c}_i\, 10^{-i} \in [0, 1]
`$$

with $`\bar{c}_i \neq c_i(i)`$. Then $`C(n) \neq x`$ for all $`n \in \mathbb{N}`$, so $`C`$ is not onto. A contradiction.
{% </proof> %}

{% <lemma> %}
An even number plus an even number results in an even number.
{% </lemma> %}

{% <definition> %}
A definition is a statement of the meaning of a word or word group or a sign or symbol.
{% </definition> %}

LaTeX.css stops there. The theme adds four more in the same style, sharing the theorem counter as `amsthm` would:

{% <proposition> %}
The sum of two odd numbers is even.
{% </proposition> %}

{% <corollary> %}
The sum of four odd numbers is even.
{% </corollary> %}

{% <example> %}
$`3 + 5 + 7 + 9 = 24`$.
{% </example> %}

{% <remark> %}
Remarks are not numbered.
{% </remark> %}

## Mathematics

Write TeX between dollar signs *and backticks*: `` $`e^{i\pi} + 1 = 0`$ `` gives $`e^{i\pi} + 1 = 0`$. The backticks stop markdown from reading underscores and backslashes in the formula as formatting. Two dollar signs make a display:

$$`
\hat\beta = \operatorname*{arg\,min}_{\beta \in \mathbb{R}^p} \; \frac{1}{2n} \lVert y - X\beta \rVert_2^2 + \lambda \lVert \beta \rVert_1 .
`$$

Environments work, including numbered and aligned equations:

$$`
\begin{align}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0}, & \nabla \cdot \mathbf{B} &= 0, \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t}, & \nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}.
\end{align}
`$$

A display that is wider than the column scrolls sideways on its own instead of pushing the page wider:

$$`
(a + b)^{12} = a^{12} + 12a^{11}b + 66a^{10}b^2 + 220a^9b^3 + 495a^8b^4 + 792a^7b^5 + 924a^6b^6 + 792a^5b^7 + 495a^4b^8 + 220a^3b^9 + 66a^2b^{10} + 12ab^{11} + b^{12}
`$$

## Paragraphs and justification

Three switches in the site config control the typesetting of every page: `indent_paragraphs` gives the first-line indentation of a {{ <latex /> }} article, `justify` sets text flush on both margins, and `numbered_headings` numbers sections. A single page can opt in or out of indentation with `indent = true` or `indent = false` in its `[extra]` front matter.

Hyphenation is automatic and follows the site's `default_language`. To keep a phrase on one line, or to let a long string break anywhere, there are two small components: {% <nowrap> %}this phrase will never be split across lines{% </nowrap> %}, and this one may break at any character: {% <breakall> %}pneumonoultramicroscopicsilicovolcanoconiosis-and-then-some-more-letters-to-be-sure{% </breakall> %}.

## Language support

Theorem, proof, figure and table labels are translated when `default_language` in the site config is one of the languages LaTeX.css ships: cs, da, de, es, fr, hu, it, ja, ka, ko, mwl, nl, pl, pt, ro, ru, si, sl, sv, tr, zh-hans or zh-hant.

## Sidenotes

A sidenote sits in the margin on a wide screen.{% <sidenote> %}Like this one. On a phone, tap the number to open it in place.{% </sidenote> %} It is written inline, where its number should appear:

{% raw %}
```jinja
A claim.{% <sidenote> %}The fine print.{% </sidenote> %}
```
{% endraw %}

A note can go without a number and show a symbol instead,{% <sidenote symbol="⊕"> %}This note has no number.{% </sidenote> %} or sit in the left margin.{% <sidenote side="left" symbol="※"> %}This one is on the left.{% </sidenote> %}

## Footnotes

Ordinary markdown footnotes work too.[^fn] On wide screens they are set in the margin beside the place they are written, so put each one directly after its paragraph. Set `bottom_footnotes = true` in the site config to collect them at the end of the page instead.

[^fn]: This is a markdown footnote: `[^fn]` in the text, and `[^fn]: …` on its own line below the paragraph.

## Dark mode and typeface

The page follows the reader's system setting, using the LaTeX.css dark palette unchanged. Set `color_scheme` to `"light"` or `"dark"` to force one. Set `font = "libertinus"` to use Libertinus instead of Latin Modern on the whole site. Neither has a toggle button, because a button would need JavaScript.

## HTML elements

### Text formatting

Markdown covers **bold**, *italic*, ~~deleted~~ and `code`. For the rarer ones, inline HTML tags are passed through and styled: <mark>highlighted</mark>, <ins>inserted</ins>, <small>small</small>, H<sub>2</sub>O, x<sup>2</sup>, <abbr title="Hypertext Markup Language">HTML</abbr>, and <kbd>Ctrl</kbd> + <kbd>C</kbd>. Small caps have a component: {% <smallcaps> %}Small Caps{% </smallcaps> %}.

### Blockquotes

> The purpose of computing is insight, not numbers.
>
> Richard Hamming

### Lists

1. First ordered item
2. Second ordered item
   - An unordered item inside it
   - And another
3. Third ordered item

### Definition lists

Markdown
: A plain-text format that is readable as written.

Zola
: A static site generator in a single binary.

### Tables

A markdown table gets rules above and below, in the manner of `booktabs`. Column alignment uses markdown's own colons.

| Estimator | Bias     | Variance | Consistent |
|:----------|:--------:|:--------:|-----------:|
| OLS       | high     | low      | no         |
| 2SLS      | low      | medium   | yes        |
| LIML      | lower    | high     | yes        |

Wrap a table in the `table` component for a numbered caption and a choice of borders.

{% raw %}
```jinja
{% <table caption="Every cell ruled." borders="grid"> %}
| a | b |
|---|---|
| 1 | 2 |
{% </table> %}
```
{% endraw %}

{% <table caption="The default borders." > %}
| Method | Year | Citations |
|:-------|-----:|----------:|
| Alpha  | 1998 | 1,204     |
| Beta   | 2011 | 388       |
{% </table> %}

{% <table caption="Every cell ruled." borders="grid"> %}
| Method | Year | Citations |
|:-------|-----:|----------:|
| Alpha  | 1998 | 1,204     |
| Beta   | 2011 | 388       |
{% </table> %}

{% <table caption="No rules at all." borders="none"> %}
| Method | Year | Citations |
|:-------|-----:|----------:|
| Alpha  | 1998 | 1,204     |
| Beta   | 2011 | 388       |
{% </table> %}

### Scroll overflow

A table that is too wide for the column scrolls sideways, with no wrapper to add.

| Quarter | North | South | East | West | Central | Coastal | Highland | Island | Overseas | Online | Wholesale | Total |
|:--------|------:|------:|-----:|-----:|--------:|--------:|---------:|-------:|---------:|-------:|----------:|------:|
| Q1 2026 | 1,204 | 2,315 | 987  | 1,432 | 2,208  | 1,876   | 654      | 432    | 3,210    | 5,432  | 2,109     | 21,859 |
| Q2 2026 | 1,315 | 2,290 | 1,043 | 1,398 | 2,301 | 1,902   | 701      | 455    | 3,388    | 5,870  | 2,256     | 22,919 |

### Images and figures

The `figure` component takes an image stored next to the page, numbers it, and resizes large images when the site is built.

{{ <figure src="dag.png" dark_invert={true} width="22rem" caption="An instrument $`Z`$, a treatment $`X`$, an outcome $`Y`$ and an unobserved confounder $`U`$." alt="A directed graph: Z points to X, X points to Y, and a dashed node U points to both X and Y." /> }}

## Syntax highlighting

Code is highlighted when the site is built, in the colours of the LaTeX.css Prism theme, light and dark.

```rust,name=main.rs
use std::collections::HashMap;

/// Count the words in a string.
fn word_count(text: &str) -> HashMap<&str, usize> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word).or_insert(0) += 1; // one more
    }
    counts
}
```

```css
body {
  font-family: 'Latin Modern', Georgia, serif;
  max-width: 80ch;
}
```

```python,linenos,hl_lines=3
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```
