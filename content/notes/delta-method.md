+++
title = "The delta method, with the one picture you need"
date = 2026-02-11
description = "Smooth functions of asymptotically normal estimators are asymptotically normal. A statement, a proof sketch, and the ratio example."

[taxonomies]
tags = ["asymptotics", "statistics"]
+++

Almost every standard error in applied work that is not read straight off a regression table comes from the delta method. It says that a smooth function of an asymptotically normal estimator is itself asymptotically normal, with a variance you can write down.

{% <theorem name="Delta method"> %}
Let $`\sqrt{n}\,(\hat\theta_n - \theta) \to \mathcal{N}(0, \Sigma)`$ in distribution, and let $`g`$ be differentiable at $`\theta`$ with Jacobian $`G`$. Then

$$`
\sqrt{n}\,\bigl(g(\hat\theta_n) - g(\theta)\bigr) \;\to\; \mathcal{N}\bigl(0,\; G \Sigma G^\top\bigr) .
`$$
{% </theorem> %}

{% <proof> %}
Expand $`g`$ to first order around $`\theta`$: $`g(\hat\theta_n) - g(\theta) = G(\hat\theta_n - \theta) + o(\lVert \hat\theta_n - \theta \rVert)`$. Multiply by $`\sqrt{n}`$. The first term converges to $`G`$ times a normal vector, and the remainder vanishes in probability because $`\hat\theta_n - \theta = O_p(n^{-1/2})`$.
{% </proof> %}

## The ratio example

The instrumental-variables estimator from [the previous note](@/notes/instrumental-variables/index.md) is a ratio of two sample covariances, $`\hat\beta = \hat a / \hat b`$. With $`g(a, b) = a / b`$ the Jacobian is $`G = (1/b,\; -a/b^2)`$, so

$$`
\operatorname{Var}(\hat\beta) \approx \frac{1}{n}\left( \frac{\sigma_a^2}{b^2} - \frac{2a\,\sigma_{ab}}{b^3} + \frac{a^2 \sigma_b^2}{b^4} \right).
`$$

Every term has a power of $`b`$ in the denominator. This is the weak-instrument problem in one line: as $`b \to 0`$ the linear approximation that the whole argument rests on stops being any good.{% <sidenote> %}A second-order expansion gives the bias as well, which is of order $`1/n`$ and also grows as $`b`$ shrinks.{% </sidenote> %}

{% <corollary> %}
For a scalar estimator and $`g(\theta) = \log\theta`$, the asymptotic variance of $`\log\hat\theta_n`$ is $`\sigma^2 / \theta^2`$: the squared coefficient of variation.
{% </corollary> %}
