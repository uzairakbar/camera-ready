+++
title = "Instrumental variables in twenty minutes"
date = 2026-06-02
description = "What an instrument buys you, the one-line estimator, and why a weak first stage is worse than it looks."

[taxonomies]
tags = ["causal inference", "statistics"]

[extra]
abstract = "Regression answers a question about association. When the treatment is confounded, an *instrument* (something that moves the treatment and touches the outcome in no other way) recovers the causal slope. This note states the identification result, proves it in three lines, and shows the estimator in code."
+++

## The problem

Suppose we want the effect of a treatment $`x`$ on an outcome $`y`$, and the world is linear:

$$`
y = x\beta + u, \qquad \mathbb{E}[u] = 0 .
`$$

If $`x`$ and $`u`$ are correlated, least squares does not estimate $`\beta`$. It converges to $`\beta + \operatorname{Cov}(x, u) / \operatorname{Var}(x)`$, and no amount of data removes the second term.{% <sidenote> %}The classic example is schooling and wages: unobserved ability raises both, so the regression slope overstates the return to schooling.{% </sidenote> %} We need variation in $`x`$ that is unrelated to $`u`$.

## Instruments

{% <definition name="Instrument"> %}
A variable $`z`$ is an *instrument* for $`x`$ if it is

1. **relevant**: $`\operatorname{Cov}(z, x) \neq 0`$, and
2. **excluded**: $`\operatorname{Cov}(z, u) = 0`$.
{% </definition> %}

Relevance can be checked in the data. Exclusion cannot: it is an assumption about the world, and the whole analysis is only as good as the argument for it.[^1]

[^1]: Draft lotteries, distance to the nearest college, and rainfall have all served as instruments. Each has also been criticised on exactly this point.

{% <theorem name="Identification"> %}
If $`z`$ is an instrument for $`x`$, then

$$`
\beta = \frac{\operatorname{Cov}(z, y)}{\operatorname{Cov}(z, x)} .
`$$
{% </theorem> %}

{% <proof> %}
Take the covariance of both sides of the model with $`z`$. By linearity, $`\operatorname{Cov}(z, y) = \beta \operatorname{Cov}(z, x) + \operatorname{Cov}(z, u)`$. Exclusion removes the last term, and relevance lets us divide.
{% </proof> %}

With $`n`$ observations stacked into matrices, and as many instruments as treatments, the sample version is

$$`
\hat\beta_{\mathrm{IV}} = (Z^\top X)^{-1} Z^\top y .
`$$

{% <remark> %}
With more instruments than treatments, $`Z^\top X`$ is not square. Two-stage least squares first projects $`X`$ onto the columns of $`Z`$ and then proceeds as before.
{% </remark> %}

## In code

The estimator is one line of linear algebra. The simulation below has a true effect of $`1`$ and a confounder that pushes least squares the wrong way.

```python
import numpy as np

rng = np.random.default_rng(0)
n = 10_000

u = rng.normal(size=n)                  # unobserved confounder
z = rng.normal(size=n)                  # instrument
x = 0.9 * z + u + rng.normal(size=n)    # treatment
y = 1.0 * x - 1.6 * u + rng.normal(size=n)

ols = (x @ y) / (x @ x)                 # 0.43: badly biased
iv = (z @ y) / (z @ x)                  # 1.00: recovers the effect
```

{{ <figure src="two-stage.png" dark_invert={true} caption="Left: regressing the outcome on the treatment gives the wrong slope. Right: regressing it on the part of the treatment explained by the instrument gives the right one." alt="Two scatter plots with fitted lines; the left slope is too shallow, the right slope is close to one." /> }}

## Weak instruments

The estimator divides by $`\operatorname{Cov}(z, x)`$. When that is close to zero the instrument is *weak*, and two things go wrong at once: the variance explodes, and the estimate is pulled back towards the biased least-squares answer.[^2]

[^2]: The usual rule of thumb asks for a first-stage $`F`$ statistic above ten. It is a rule of thumb.

{% <table caption="Median estimate over 2,000 simulations with $`n = 500`$. The true effect is 1."> %}
| First-stage $`F`$ | OLS  | IV   | IV interquartile range |
|:------------------|-----:|-----:|-----------------------:|
| 2                 | 0.43 | 0.71 | 1.94                   |
| 10                | 0.43 | 0.95 | 0.58                   |
| 100               | 0.43 | 1.00 | 0.17                   |
{% </table> %}

Tests that stay valid however weak the instrument is, such as the Anderson--Rubin test, are the subject of [another paper](@/papers.md).
