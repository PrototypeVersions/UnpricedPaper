---
title: Unpriced
subtitle: An open laboratory for market prediction
tagline: Testing in public whether AI forecasts of stock returns and market risk lead to better decisions, and finding out without fooling ourselves
date: Project paper · November 11, 2026 · provisional revision
---

::: {.provisional}
**About this version.** This is a provisional revision of the November 5 paper, prepared for sharing while the live record is just beginning. It narrows the paper to the research itself: what the two labs forecast, how the forecasts are recorded and graded, and which experiments come next. Business possibilities are set aside for now. A fuller revision will follow once the first independently computed grades are in (due November 12–13, 2026).
:::

# At a glance {#at-a-glance}

- **What it is:** two public research labs that make stock and market-risk forecasts every evening, lock them before the market opens, and have them graded afterwards by a separate record-keeping process.
- **What is different:** only forecasts made in advance count; every idea tried is logged, including failures; every model must beat a simple rule; forecasting and buying are tested separately; two AI systems build the labs and review each other's work.
- **What it has shown so far:** no live forecasting or trading advantage yet. The live record began in the first week of November 2026. Confirming a realistic edge would take one to two years of evidence.
- **Why it could matter:** it is built to tell skill from luck, and to show where a forecast's value survives, or disappears, when it is turned into a decision.
- **What happens next:** the first independent grades (November 12–13), a historical test of sizing stock positions by forecast risk (late November), and three side-by-side paper portfolios that test it live (from mid-to-late December).

# Overview {#overview}

Most claims that artificial intelligence can pick stocks rest on backtests: a model is built today and then shown how well it would have done in the past. Backtests are cheap, endlessly adjustable and almost impossible to check from the outside. Unpriced is built around the opposite idea. Every forecast is written down and locked before the market opens, a separate process keeps its own copy, and the evidence that counts is what happens afterwards.

The project has two labs. The **Stock Lab** ([UnpricedX](https://prototypeversions.github.io/UnpricedX/)) ranks about 1,000 US stocks each evening by how well it expects each to do over the next five trading days, relative to the others. The **Risk Lab** ([UnpricedZ](https://prototypeversions.github.io/UnpricedZ/)) forecasts how much the market and nine of its sectors will swing, and how likely a fall of more than 3% is, over the same kind of window. Each evening a separate record-keeping service ([UnpricedHub](https://prototypeversions.github.io/UnpricedHub/)) collects both labs' forecasts before the open and later grades them with prices it downloads itself. Two different AI systems build the labs: Claude oversees the Stock Lab, GPT oversees the Risk Lab, and each reviews the other's work without being able to change it.

The design keeps apart three things that are usually blurred. It separates **discovering** ideas (on history, where it is cheap) from **proving** them (live, where it is slow and much harder to fake). It separates **forecasting** (what is likely to happen) from **deciding** (what to hold, and how much), so a good forecast and a good trading rule are each tested on their own terms. And it separates **making** forecasts from **grading** them, so no lab is the only judge of its own record.

Each lab runs a $1,000 paper portfolio whose buying rules are fixed in advance and deliberately simple. They are a baseline, not the product. Keeping them still while the forecasting models change makes it possible to compare forecasts under the same rules.

The project's central question is broader than "can AI predict stocks?" It is: **when does a forecast improve a decision, compared with what a simple alternative would have done, and how can we tell?** A model can rank stocks better on paper while the improvement disappears once only ten stocks are bought and trading costs are paid. A risk forecast can score better while changing no allocation at all. The first planned experiment (Section 9) asks exactly this of the two labs together: do the Risk Lab's forecasts improve how the Stock Lab's picks are sized, beyond what a cheap rule of thumb would do?

Nothing has been proven yet, and this paper says so. What the project already has is a way of finding out that is designed not to flatter itself.

# 1. The problem with AI and stock picking {#section-1}

Prediction in markets is unusually easy to fake, even honestly. Six problems recur in academic work and in commercial products alike.

### Backtests can be tuned until they look good

A researcher who tries many ideas on the same history will eventually find one that looks excellent by chance. Harvey, Liu and Zhu counted hundreds of published return predictors and argued that, given how many had been tried, a new one should clear a t-statistic of about 3, not the usual 2. Bailey and López de Prado showed that a backtest's Sharpe ratio must be discounted for the number of trials behind it (the "deflated" Sharpe ratio). Many AI stock projects never publish how many things were tried, so no reader can apply either correction.

### Edges fade once found

McLean and Pontiff studied 97 published predictors and found their returns were about 26% lower outside the original sample period and about 58% lower after publication. Chordia, Subrahmanyam and Tong found that returns to well-known anomalies roughly halved as markets became more liquid and trading cheaper. The mechanism is competition: when many traders, or many AI bots, spot the same mispricing and trade on it, their trades move the price and close the gap. Not every advantage disappears; some persist because they are compensation for risk, depend on information few people have, or are too costly for others to trade. But historical profitability often overstates what a strategy can achieve in future, and an edge everyone can find with the same off-the-shelf AI tool is unlikely to last.

### Costs and practicalities are ignored

Many apparent edges live in small, illiquid stocks where trading costs eat them. Novy-Marx and Velikov showed that a large share of published anomalies do not survive realistic costs. Backtests also often assume trading at a price that was not available when the decision was made, such as the same day's close.

### Language models remember the future

A large language model has read the internet up to its training cutoff. Asked in a backtest whether a 2021 headline was good news, it may already know how the stock moved. Glasserman and Lin documented this look-ahead problem for GPT-based sentiment, along with a second one: the model's general knowledge of famous companies can distract from what the text actually says. A backtest of a language model on events before its cutoff is not a clean test.

### A good forecast is not a good trade

The M6 competition (Makridakis and co-authors) asked participants both to forecast the relative performance of 100 assets and to invest on their forecasts, scored live over a year. Beating the benchmark was very hard, and the link between forecasting accuracy and investment results was weak. Turning a forecast into a portfolio is a second problem with its own ways to fail.

### A short winning streak proves little

Someone who gives an AI trading bot $100 and reports a profit may be telling the truth, but a few weeks of gains are well within what luck produces. What would count is a long, verifiable record that includes losses, costs, a benchmark and the strategies that were abandoned. The US Commodity Futures Trading Commission has warned the public about trading bots marketed with promises of AI-driven returns. That warning is about hype, not proof that every bot fails; the point is that the evidence usually offered cannot tell the difference.

Unpriced is designed so that each of these six problems has a specific, checkable answer. Section 6 sets them side by side.

# 2. The design in one picture {#section-2}

![Figure 1. Both labs read public data and freeze forecasts every evening before the open. A separate record-keeping process saves its own copies and later grades them. The labs can read each other's records but cannot change them. Combining them is a planned experiment, not yet running.](figure-1.png){#fig-design}

Each lab answers a different question, and each is deliberately limited.

| Part | Question it answers | What it is not allowed to do |
|:-----------------|:---------------------------------------------|:---------------------------------------------|
| Stock Lab ([UnpricedX](https://prototypeversions.github.io/UnpricedX/)) | Which of about 1,000 US stocks will do better than the others over the next five trading days? | Edit a frozen forecast, backfill a missed day, or move its own gates or holdout to make a result pass. |
| Risk Lab ([UnpricedZ](https://prototypeversions.github.io/UnpricedZ/)) | How much will the market and each sector swing, and how likely is a fall of more than 3%, over the next five sessions? | Promote a model on a short winning streak, rewrite its registered protocol, or build trading rules for the Stock Lab. |
| Record and grading ([UnpricedHub](https://prototypeversions.github.io/UnpricedHub/)) | Did each forecast exist before the market opened, and how good was it, by a published method? | Edit a lab, convert one kind of forecast into another, or choose a model. |

Splitting the project this way costs some convenience. It buys a record in which each claim can be checked by a process other than the one that made it.

# 3. The Stock Lab (UnpricedX) {#section-3}

## 3.1 The question

Every trading evening the Stock Lab ranks roughly the 1,000 most-traded US stocks priced above $5 by how it expects each to perform over the next five trading days, from the next morning's opening price to the opening price five sessions later. It forecasts ranks, not prices. A rank asks which stocks will beat the others, so a market-wide rally or crash does not count as skill. This is the standard question in academic asset pricing, and it is the one where machine learning has the most published evidence: Gu, Kelly and Xiu found that trees and neural networks modestly but reliably outperformed linear methods at it.

The universe is chosen each day using only information available that day: the price that actually printed and the past three months of trading volume. A stock cannot enter or leave the universe because of something that happens to it later.

## 3.2 What the models look at

The lab has 33 features, each ranked within the day so that only relative standing matters, and each tied to published research. They fall into seven families: momentum (stocks that rose over the past year tend to keep rising), short-term reversal (last week's losers tend to bounce, after Jegadeesh), risk (volatility and market sensitivity), liquidity, earnings events from SEC filings, fundamentals from SEC financial data, and valuation. A test deletes future data and checks that no past feature value changes, so a feature cannot quietly peek ahead.

Stocks are also grouped into about 20 statistical sectors: groups of roughly 50 stocks whose day-to-day moves, after removing the market, moved together over the past year. These groups are recomputed each January and July from past data only, and are used to stop the portfolio loading up on one theme.

## 3.3 The models

| Kind | What it is | Role |
|:-------------|:---------------------------------------------|:-----------------------------|
| Single-signal rules | One feature with the sign the literature gives it, e.g. "favor last week's losers". | Benchmarks. One runs live as a permanent yardstick (3.7). |
| Ridge regression | A linear model on all ranked features, shrunk toward zero to avoid overfitting. | Candidate model. |
| Gradient-boosted trees | Hundreds of small decision trees, each correcting the last; stopped early on a time-ordered validation block. | Candidate model; several run live as challengers. |
| Ensemble | The average of several models' standardized scores. | The current champion ("ens_all"). |
| AI filing reader | Claude (Haiku 5.5) reads earnings releases and reports whether guidance was raised, kept, lowered or withdrawn. | Feeds two shadow challengers, tested live only (3.8). |

## 3.4 Discovering ideas on history

New ideas are tested on about twenty years of history using purged walk-forward evaluation: a model is trained only on data whose outcomes were already known, used to forecast the next half-year, then retrained and moved forward. A gap is left between training and testing so overlapping five-day outcomes cannot leak across.

Every experiment is written to an append-only ledger, including failures; it held 66 trials on November 5. The ledger matters because the bar for success rises with the number of trials. A model must reach a ranking-skill t-statistic of at least 3, raised further by a Bonferroni correction for the number of ideas tried; its long–short returns after realistic trading costs must be positive; and its deflated Sharpe ratio must be convincing. Costs are charged by liquidity tier, from 4 basis points per side for the most-traded stocks to 30 for the least.

Recent history (2022 onward) is a sealed holdout. A model that passes the development gates gets at most a few logged looks at it, capped per week and per year. Passing both earns a place as a live challenger. Every Saturday an automated sweep runs queued experiments and small variations of the best model.

Scheduled AI sessions also maintain the lab. A weekly research session reads the ledger and live record and may propose at most two new ideas, as code with tests, through a reviewed change; an evening health check confirms the nightly cycle ran; a monthly review writes up what the evidence says. None of these sessions can touch the gates, the holdout or the records.

## 3.5 Proving ideas live

After each close the lab downloads the day's data, runs every live model and freezes the forecasts into a file before the next open. Each file contains the exact inputs the models saw, so anyone can recompute the scores, and a SHA-256 hash that chains it to the previous day's file, so changing any past forecast would break every later link. An automated check refuses any change to the frozen files. If a run is too late to finish before the open, the day is recorded as missed; it is never filled in afterwards.

The champion is the model whose forecasts drive the portfolio. Challengers run alongside it on identical data. A challenger replaces the champion only when live, paired, non-overlapping weekly comparisons show it is better under an anytime-valid confidence sequence (Waudby-Smith and co-authors), and only after at least 26 weeks. An ordinary significance test becomes unreliable if you check it every week and stop when it looks good; a confidence sequence is designed to stay valid however often it is checked. Simulations in the test suite put the false-alarm rate at about 6% or less over ten years of weekly checks.

## 3.6 The $1,000 stock portfolio

The paper portfolio turns the champion's ranking into trades under rules fixed in advance: hold the 10 top-ranked stocks from the 500 most liquid, equally weighted; keep a holding until it falls below rank 40; at most 3 stocks from one statistical sector; rebalance every five sessions at the first open after the decision; charge 2 basis points plus the liquidity-tier cost per side; skip trades smaller than 2% of the portfolio; include dividends; and compare against $1,000 in SPY, an exchange-traded fund that tracks the S&P 500, bought at the same moment.

The rules are intentionally plain. On its first day the portfolio held ten semiconductor and hardware stocks: the ranking was not wrong to like them, but it was one bet, not ten. That is why the sector cap was added before the first rebalance and recorded in the decisions log. After its first day the portfolio stood at $978.49 against $1,005.01 for SPY, a meaningless sample shown exactly as it happened.

## 3.7 The benchmark that must be beaten

On history, the single rule "favor last week's losers" ranked stocks almost as well as the champion blend (a development ranking skill of 0.0154 against 0.0156). If a sophisticated model cannot beat a one-line rule, its sophistication is not earning anything. So the rule runs live as a permanent benchmark: forecast, frozen and graded like every model, and never eligible to take charge.

## 3.8 The AI filing reader

Language models are the most publicized kind of AI in finance and the hardest to test honestly, because of the look-ahead problem in Section 1. The Stock Lab's reader is designed around that problem.

- **It is judged only live.** No backtest is run on filings the model could have seen in training.
- **It answers one narrow question.** For each earnings release, did management raise, maintain, lower, withdraw or first give its guidance? It must quote the sentence that supports its answer, and it may say "unclear".
- **It must beat a cheap rule.** A keyword rule reads the same text. Two shadow challengers run side by side: the champion nudged by the AI's reading, and the champion nudged by the rule's. If the AI cannot beat a keyword search, it is not adding value.
- **Its timing is strict.** A reading counts only for forecasts frozen after the reading finished, and reading is capped at 15 minutes so it can never delay the forecast.
- **Everything is recorded:** model name, prompt version, time, document size and tokens used. The reader costs a few dollars a year.

The reader was narrowed to this design on November 5, 2026, before it read a single filing, after review by the Risk Lab's author. A design chosen before seeing results cannot have been tuned to them.

# 4. The Risk Lab (UnpricedZ) {#section-4}

## 4.1 The question

The Risk Lab forecasts risk rather than direction, for SPY and nine sector funds (materials, energy, financials, industrials, technology, staples, utilities, health care and consumer discretionary). Each evening it forecasts, for the next five sessions from the next open, the variance of returns (how much prices will swing) and the probability of a fall of more than 3% from a running peak.

Risk is a different and, in one sense, easier question. Returns are close to unpredictable; volatility is strongly persistent, and a calm week tends to follow a calm week. That makes risk forecasting one of the most reliable results in financial econometrics, and a natural partner for a return forecaster.

## 4.2 The models

| Task | Model | Idea |
|:----------|:---------------------|:------------------------------------------------|
| Variance | EWMA | Recent squared moves, with weight decaying on older days (the RiskMetrics approach). |
| Variance | HAR | Blends daily, weekly and monthly volatility, after Corsi. |
| Variance | GARCH(1,1) | Volatility reacts to shocks and drifts back to a long-run level (Bollerslev). |
| Drawdown | Event frequency | How often a fall of more than 3% happened in the past. |
| Drawdown | Volatility-only logistic | Turns the current volatility estimate into a probability, calibrated on separate data. |

Every model is a fixed benchmark registered before evaluation and refit monthly on a trailing five-year window. There is no hyperparameter search and no automatic winner. Variance is scored with QLIKE, a loss that is robust to the noise in measuring realized variance (Patton) and that punishes underestimating risk more than overestimating it. Drawdown probabilities are scored with the Brier score.

## 4.3 What history says so far

On 2019–2024 history (1,510 forecast dates), GARCH had lower variance loss than EWMA for both SPY and the sectors, with date-block intervals that excluded zero. HAR did not consistently beat EWMA. The volatility-only drawdown model was slightly worse than simple event frequency. These results are reported as they came out, including the ones that disappoint, and treated as development evidence only.

## 4.4 The sector-direction portfolio, and why it holds cash

The Risk Lab also continues its original experiment: a forecast of which sector funds will beat SPY, with its own $1,000 paper portfolio. Its rule buys a fund only when the calibrated probability of beating SPY over the window is at least 55% and the expected excess return is above 0.20%. Otherwise it holds cash.

Since live forecasting began, no forecast has met that rule. Across the forecast dates from November 3 to 10, the highest calibrated probability for any fund was about 50.1%, so the portfolio has held cash throughout. Over its first settled window (the November 4 open to the November 10 close), it ended at $1,000.00 while the same $1,000 in SPY ended at $982.87. That is not evidence of skill: permanent cash would have done the same, and would lag whenever stocks rise.

The informative result is the clustering near 50%. Once calibrated against history, the direction model is saying that it has little usable confidence about which sector will beat the market. The threshold will not be lowered to produce trades, since that would change the experiment rather than fix it. The portfolio continues as a recorded result, alongside earlier findings that it showed no edge over simple baselines and that a registered macroeconomic extension added nothing.

## 4.5 Why it is a separate lab

The Risk Lab answers a different question, with different assets, targets and scores. Merging it into the Stock Lab would mean one codebase, one set of habits and one builder checking its own work. Keeping it separate, built by a different AI system, gives the project two independent methods, an outside reviewer for each, and a clean way to combine them later (Section 9). The cross-review has already paid for itself: GPT's review of the Stock Lab found a real look-ahead bug in its backtest portfolios (Section 11), and Claude's review of the Risk Lab produced checks on its drawdown definition and price adjustments.

# 5. How forecasts are recorded and graded {#section-5}

A lab that stores its own forecasts and grades its own results is asking to be trusted. Even with a hash chain, a lab could in principle re-run a day, publish late, or compute its score in a flattering way. A separate record-keeping service, UnpricedHub, makes those things harder and much easier to detect.

- **It keeps its own copy.** It collects each lab's latest forecast file at many points between the evening and 9:10 the next morning, saves the exact bytes, and stamps its own receipt time.
- **It judges timeliness itself.** A forecast first received after the 9:30 open is marked late and never graded as live, whatever the lab says. A file that changes after receipt is recorded as a conflict; the first copy stays canonical.
- **It grades with its own prices**, using the standard measure for each kind of forecast: rank correlation for the Stock Lab's rankings, QLIKE for variance, and the Brier score for drawdown probabilities. It never converts one kind of forecast into another.

Labs send forecasts in a shared, versioned format that states the task, the entry and exit, the information cutoff, the models and their roles, and a pointer back to the lab's own frozen file.

As of November 11 it had recorded six on-time exports from the Stock Lab, and eight on-time and two late exports from the Risk Lab. Grades are computed the evening after a forecast window ends. The first Stock Lab grades are due the evening of November 12 and the first Risk Lab grades the evening of November 13. The first milestone is simple: an on-time forecast from each lab, matured, graded by the record-keeper, and matching the lab's own score.

Its independence has limits. It is a separate codebase with its own records, but it belongs to the same owner, runs on the same platform (GitHub), and relies on that platform's history for timing and on the same free price source. It is a separate check, not an outside auditor. Anchoring each day's record with an outside timestamping service, and letting others reproduce the grades, would close most of that gap; both are possible later steps.

# 6. How this differs from the usual approach {#section-6}

The differences are not about cleverer models. The models used here are standard and well documented. The differences are about what is allowed to count as evidence. Serious academic studies and professional quantitative firms do many of these things; the left-hand column describes what is often seen in AI trading products and posts, not the best of the field. The individual techniques are not new. What is distinctive is combining them in one evolving system that is open from the first day.

| Often seen | In Unpriced |
|:---------------------------------------------|:-------------------------------------------------------------|
| Results come from backtests built after the fact. | Only forecasts frozen before the open count as live evidence. History is for discovering ideas. |
| The number of ideas tried is unknown. | Every trial is in an append-only ledger, and the pass mark rises with the count. |
| Results are self-reported. | A separate process keeps its own copy, its own receipt time and its own grade. |
| Bad periods are explained away or quietly dropped. | Missed days stay missed, failures stay published, and rule changes are logged with reasons before they apply. |
| Language models are backtested on events they may remember. | The AI reader is tested only live, on a narrow question, against a keyword rule, with strict timing. |
| Sophistication is assumed to help. | Every model must beat a simple rule run alongside it. |
| A good forecast is assumed to be a good trade. | Forecasting and buying are tested separately, with buying rules fixed as a baseline. |
| Costs and execution are idealized. | Trades at the next open after the decision, with liquidity-based costs and a no-trade band. |
| Success is a headline return. | Success is a pre-stated test on live data, with a confidence band that stays valid however often it is checked. |
| The AI is the decision-maker. | AI builds, maintains and reviews; fixed rules and live evidence decide. |

Many projects are optimized to produce an impressive result. This one is designed to produce a believable result, whatever it turns out to be. If the answer after two years is that nothing beats a simple rule, that is a real finding, and the record will show how it was reached.

# 7. Forecasting and buying are kept apart {#section-7}

## 7.1 Why separate them

A trading result mixes two things: how good the forecast was and how good the rule for acting on it was. When both change at once, a good month cannot be attributed to either. Unpriced therefore treats them as separate experiments. The forecasts are graded on their own measures (ranking skill, QLIKE, Brier). The portfolios are graded on money, after costs, against SPY.

The two can disagree, and the sites say so. A ranking can be right about the order of 1,000 stocks while the ten names at the top have a bad week. The M6 competition found exactly this weak link between forecasting skill and investment results, which is why each needs its own record.

## 7.2 Why the buying rules are fixed first

Both $1,000 portfolios follow simple rules written down in advance. They are not the best possible rules, and that is deliberate. While the forecasting models change, the buying rules stay still. That makes comparisons fair: two forecasts run through the same fixed rules over the same weeks can be compared directly. It does not make changes over time attributable to the forecasts alone, because the market changes too; comparisons are made side by side, not before and after.

Fixed rules also cannot be quietly tuned to recent results, which is the commonest way paper portfolios start to look better than they are. Changes to them, like the sector cap, are made only for a stated reason, recorded with a date, and apply only going forward.

## 7.3 How buying will eventually learn

Once the forecasts have a live track record, the buying process can start to learn, one decision at a time, each tested the same way the forecasts are. The first candidate is when to replace a holding. Today a stock stays until it drops below rank 40. That threshold trades off two costs: holding a stock whose forecast has faded, and paying to trade too often. It is a single, well-defined choice that can be studied on the frozen record and measured against the fixed rule. Later candidates are how many stocks to hold and how much to put in each, which is where the Risk Lab comes in.

Each learned rule would run as a separate paper portfolio beside the fixed one, never replacing it until live evidence says so. The fixed portfolio continues as the control.

# 8. What makes a forecast useful here {#section-8}

The design choices above follow from a small set of questions that apply to any forecast. They are developed in a companion book in progress, *By What Measure: Six Questions to Ask of Any Forecast*. The ideas behind them are established in statistics, economics and forecasting research; the book's contribution is to put them in a usable order. Here is how each question shows up in Unpriced.

| Question | What it asks | How Unpriced answers it |
|:----------------|:----------------------------------|:-----------------------------------------------------|
| What does it claim? | Which quantity, over what window, from what information? | Each forecast states its task, assets, entry and exit prices, horizon and information cutoff, and is frozen before the open. |
| Why believe it? | How many ideas were tried, and has the edge held up on new data? | The trial ledger, rising pass marks, a sealed holdout, and promotion only on live evidence. |
| Compared with what? | Does it beat what a simple alternative already provides? | Every model faces a simple rule: last week's losers for the Stock Lab, EWMA and event frequency for the Risk Lab, a keyword rule for the AI reader, and a plain volatility rule for risk-based sizing. |
| For whom? | Which decision is it for, and which score matches that decision? | Forecast scores and portfolio results are kept apart; each planned experiment names its yardstick in advance. |
| Who can act on it? | Does it survive costs, delays and limits on concentration? | Next-open execution, liquidity-tiered costs, a no-trade band and a sector cap. |
| What changes when it is used? | Does acting on it erode its value? | Not tested yet. At $1,000 in paper trades the project does not move prices, so this question matters only if the strategies ever scale. |

One idea from this framework shapes the next experiments more than any other. In a market, what matters about a forecast is what it **adds** to what is already known, not how accurate it is on its own. A model that predicts poorly in isolation can still carry information that improves a system built on simpler signals, and a highly accurate model can add nothing if it merely repeats them. Econometricians test this as *forecast encompassing* (Chong and Hendry; Fair and Shiller). In Unpriced it means every new source of forecasts, whether a model, an AI reader or a whole lab, is judged by whether adding it improves a decision compared with the same decision made without it.

# 9. The first planned experiment: combining the two labs {#section-9}

## 9.1 The question

A stock ranking helps decide which stocks to hold. A risk forecast can help decide how much exposure to take. Neither settles the decision on its own: that also depends on the investor's objective, costs and limits. A long line of research suggests that scaling exposure down when volatility is forecast to be high can improve risk-adjusted returns (Moreira and Muir), though later work found the benefit fragile out of sample (Cederburg and co-authors). That is the kind of claim that should be tested live, with a simple alternative alongside it.

The specific question is: **does the Risk Lab supply information that improves the Stock Lab's decisions beyond what a cheap rule already provides?**

## 9.2 The design

Three paper portfolios would run side by side, all using the same Stock Lab picks:

- **A. Stock Lab alone:** the current fixed rules, unchanged. The control.
- **B. Sized by the Risk Lab:** the same picks, with exposure scaled by the Risk Lab's variance forecast for each stock's sector and the market.
- **C. Sized by a simple volatility rule:** the same picks, scaled by each stock's own recent volatility. This tests whether the Risk Lab adds anything beyond a cheap rule, the same logic as the AI reader's keyword baseline.

Portfolios B and C will be compared with A at a similar average exposure, so the comparison measures the *timing* of risk, not simply holding more or less of the market.

## 9.3 What must be written down first

Before any of the three start, the rules will be written down and dated:

- how individual stocks map to the Risk Lab's sector funds, which describe sector risk, not each stock's own risk;
- how the Risk Lab's forecast window is aligned with the Stock Lab's open-to-open window;
- what happens when a risk forecast is missing or late, how cash is handled, and costs;
- **the main yardstick**, chosen in advance: for example, risk-adjusted return at matched exposure, or the size of the worst fall. Choosing it after seeing results would make the test meaningless.

## 9.4 Where it lives, and when

The combined portfolios will live in the Stock Lab, which will only read the Risk Lab's published forecasts. The Risk Lab keeps forecasting risk; the record-keeper keeps grading each lab's raw forecasts. The Risk Lab has already published its 2019–2024 out-of-sample variance forecasts as a read-only file, clearly labelled as a simulation rather than a live record, for the historical part of the study.

The historical test comes first, in late November. If the rules look sound, the three live paper portfolios start in mid-to-late December. A first meaningful review is about February 2027, and a firm conclusion will take considerably longer. This combination is a proposal at this stage: it is not yet registered, implemented or running.

## 9.5 Other planned questions

Two further questions follow the same logic and can be studied on history without touching the live record. Each would be entered in the trial ledger like any other idea:

- **Does the champion add anything beyond the simple rule?** On history the champion and "favor last week's losers" score almost the same. The test asks whether the champion still ranks stocks once the part of its signal that the simple rule already explains is removed.
- **Is the ranking graded on the part that is used?** The ranking is graded across about 1,000 stocks, but the portfolio buys only the top ten of the 500 most liquid. A ranking can be good overall and weak at the top, which may be why the champion passes the ranking test but fails the cost gate on history. The test grades the top of the ranking within the tradable 500, after costs.

# 10. The kinds of AI in use {#section-10}

"AI" covers very different things in this project. It helps to name each one and its job.

| Kind | Where | Job | Limits on it |
|:----------------|:-------------|:--------------------------------------------|:--------------------------------------|
| Classical statistics | Both labs, record-keeper | Rank correlations, Newey–West t-statistics, Bonferroni corrections, deflated Sharpe ratios, confidence sequences, QLIKE and Brier scores. | Fixed formulas, written in tests. |
| Econometric risk models | Risk Lab | EWMA, HAR and GARCH variance; frequency and logistic drawdown odds. | Registered in advance; no search. |
| Machine learning | Stock Lab | Ridge regression, gradient-boosted trees and ensembles that rank stocks. | Trial count, gates, sealed holdout, live promotion. |
| Unsupervised learning | Stock Lab | Principal components and k-means to find statistical sectors. | Past data only; refreshed twice a year. |
| Language model as a reader | Stock Lab | Claude Haiku 5.5 reads earnings releases for guidance changes. | Live only, narrow question, keyword baseline, strict timing. |
| AI agents as engineers | Both labs | Claude and GPT write the code, run health checks, propose research and review each other. | Cannot change records, gates or holdouts; changes go through tests and logs. |

The last row is unusual. The AI systems that build this project do not decide what is true about it. They propose; the record and the fixed tests decide. That is a sensible division of labor for any project that uses AI: let it do the work, but do not let it grade the work.

# 11. Why things stay as they are for now {#section-11}

The hardest discipline in this project is not changing it.

**The evidence takes time.** A weekly ranking score across 1,000 stocks is noisy: its standard deviation is roughly 0.05 to 0.10, while a good edge is around 0.02 to 0.05. The lab's own power calculation puts the median time to confirm a true edge at about 28 weeks for 0.05, 59 weeks for 0.03 and 119 weeks for 0.02. Six months of data is the minimum before promotion is even possible; one to two years is realistic.

**Changes muddy the record.** Every change to a live rule raises the question of whether later results reflect the forecasts or the change. A new model can be added safely because it enters as a challenger and earns its place under the same tests. A change to the gates, the holdout, the buying rules or the scoring would contaminate the record, so those are frozen unless there is a stated reason, logged before it applies.

**Bad weeks are expected.** A real edge of 0.03 will still produce many losing weeks. Reacting to them is how most strategies end up fitted to noise. The rule is simple: no retuning because of a bad week, and no celebration because of a good one.

What does change is the safe kind of work: bug fixes with tests (recorded with whether live forecasts were affected), new ideas entering as trials, data improvements, and operational fixes. One correction already shows the process working. GPT's review found that the Stock Lab's backtest portfolios dropped stocks whose exit price was missing before choosing holdings, which in effect told them in advance which stocks would stop trading. The fix chooses holdings without that knowledge and counts a missing exit as a 0% return. The old results remain in the ledger, labelled with the older calculation, and every idea is re-scored under the corrected one. The ranking scores the gates use, and the live forecasts, were not affected.

# 12. Where things stand {#section-12}

| Item | Status |
|:-------------------------|:-----------------------------------------------------------------|
| Stock Lab champion | "ens_all", a blend of models, provisional: it was registered as the default because no model has yet passed every gate. |
| Champion on history | Development ranking skill 0.0156 (t = 3.67); holdout (2022 on) 0.0257 (t = 3.43). It failed the development cost gate: long–short net return was negative, so it is not yet a proven trading signal even on history. |
| Simple benchmark on history | "Favor last week's losers": development ranking skill 0.0154, almost the same as the champion. Added to the live record as a permanent benchmark from the November 7 sweep. |
| Experiments in the ledger | 66 trials as of November 5. |
| $1,000 stock portfolio | Trading live since November 4 under fixed rules; after its first day, $978.49 against $1,005.01 for SPY. Current figures are on the Stock Lab site. |
| AI filing reader | Live since November 5, alongside the keyword rule. Too early for any comparison. |
| Risk Lab | Live forecasts since November 3–4 for SPY and nine sector funds; GARCH best on history; no live skill established yet. |
| Sector-direction portfolio | In cash since launch: no forecast has reached its 55% rule. $1,000.00 against $982.87 for SPY over its first settled window. |
| Record-keeping and grading | Six on-time Stock Lab exports; eight on-time and two late Risk Lab exports (as of November 11). First grades due November 12 (Stock Lab) and November 13 (Risk Lab). |
| Combining the labs | Proposed (Section 9). Not yet registered, implemented or running. |

# 13. Roadmap {#section-13}

Dates are targets and depend on each earlier step working.

| When | What happens | What it tells us |
|:-------------|:--------------------------------------------|:-------------------------------------------|
| Every weekday evening | Both labs freeze forecasts; the record-keeper collects them before the open; an automated check restarts late runs. | Whether the record is complete and on time. |
| November 12–13 | First independently computed grades for each lab. | Whether the whole chain works end to end. |
| Ongoing | AI reader and keyword rule collect live readings each evening. | Over months: whether reading guidance adds anything beyond a rule. |
| Late November | Historical test of risk-based sizing, with the simple volatility rule as the baseline; written rules for portfolios A, B and C. | Whether sizing by risk is worth testing live. |
| December 1 | Monthly review: benchmark against models, early AI-versus-rule counts, on-time rate, and whether the sector-direction model's probabilities still cluster near 50%. | Early warning signs only; not a verdict. |
| Mid-to-late December | Portfolios A, B and C start as separate paper records, if the historical test supports it. | The live test of combining the labs. |
| About February 2027 | First review of the portfolios and of the AI reader. | Whether early patterns are holding. |
| About May 2027 | 26 weeks of live forecasts: the earliest point a challenger can replace the champion. | The first possible live promotion. |
| Late 2027 onward | A realistic edge becomes confirmable; a first learned buying rule (when to replace a holding) could run beside the fixed one. | Whether the system has real skill, and whether buying can learn too. |

# 14. Limitations and risks {#section-14}

A credible project is clear about what it cannot yet claim.

- **Survivorship bias in history.** Free price data covers only companies listed today, so the Stock Lab's history omits companies that later failed. This flatters backtests and is one more reason only live evidence counts. The live universe has no such bias.
- **Free data.** The project uses free Yahoo prices, which can be revised after the fact and occasionally fail validation (two Risk Lab runs on November 10 rejected bad price data and recovered on retry). Small differences between downloads are expected and recorded.
- **Paper, not real, trading.** Fills are at the opening price with modelled costs. Real orders would face slippage, especially in less liquid names.
- **Statistical assumptions.** The promotion test is an asymptotic confidence sequence, not an exact finite-sample guarantee, and market data are neither independent nor stable over time. Repeated looks at the same holdout, even capped, can leak some selection information.
- **Small Risk Lab universe.** Nine sector funds and SPY say little about individual stocks; the sizing study must map stocks to sectors carefully.
- **Operations.** GitHub's free scheduler has run jobs hours late. Extra attempts and automated checks reduce missed days but cannot eliminate them; a missed day stays missed.
- **The record-keeper is not an outside auditor.** It is separate from the labs in code and records but not in ownership, platform or data source.
- **AI builders make mistakes.** The look-ahead bug in Section 11 was written by one AI and found by another. Cross-review, tests and append-only records limit the damage, but they do not make errors impossible.
- **A language model can change.** If the AI reader's model is changed, its record starts again rather than being mixed with the old one.

# 15. Why it is promising {#section-15}

The promise of Unpriced is not a particular return. It is that whatever the project finds will have been found fairly, in a way others can check. Errors are still possible, and some have already been caught, but the record is built so that they are visible and correctable rather than hidden.

The project has several things going for it beyond care with evidence. It forecasts the kinds of quantities where the research evidence is strongest: relative stock returns, where machine learning has shown modest but real gains, and volatility, which is genuinely predictable. It runs at a scale, roughly 1,000 stocks every day, where a small edge is detectable in a reasonable time. It tests the newest kind of AI, language models, in the only way that avoids their look-ahead problem. And it asks a question that matters beyond any one strategy: where does a forecast's value survive when it is turned into a decision, and where does it disappear?

If, after a year or two, a model beats both chance and the simple benchmark, live and independently graded, that will be a rare and credible result. If nothing does, the project will have shown, in public, how hard the problem is, and that too is worth knowing.

The same record-keeping might one day be useful to other forecasters who want their own claims checked. That possibility is set aside until the research itself has a track record.

# References {#references}

Bailey, D. H. and López de Prado, M. (2014). The deflated Sharpe ratio: correcting for selection bias, backtest overfitting and non-normality. *Journal of Portfolio Management*, 40(5).

Bollerslev, T. (1986). Generalized autoregressive conditional heteroskedasticity. *Journal of Econometrics*, 31(3).

Cederburg, S., O'Doherty, M. S., Wang, F. and Yan, X. (2020). On the performance of volatility-managed portfolios. *Journal of Financial Economics*, 138(1).

Chong, Y. Y. and Hendry, D. F. (1986). Econometric evaluation of linear macro-economic models. *Review of Economic Studies*, 53(4), 671–690.

Chordia, T., Subrahmanyam, A. and Tong, Q. (2014). Have capital market anomalies attenuated in the recent era of high liquidity and trading activity? *Journal of Accounting and Economics*, 58(1), 41–58.

Commodity Futures Trading Commission (2024). Customer advisory: AI won't turn trading bots into money machines. cftc.gov.

Corsi, F. (2009). A simple approximate long-memory model of realized volatility. *Journal of Financial Econometrics*, 7(2).

Fair, R. C. and Shiller, R. J. (1990). Comparing information in forecasts from econometric models. *American Economic Review*, 80(3), 375–388.

Glasserman, P. and Lin, C. (2023). Assessing look-ahead bias in stock return predictions generated by GPT sentiment analysis. arXiv:2309.17322.

Gu, S., Kelly, B. and Xiu, D. (2020). Empirical asset pricing via machine learning. *Review of Financial Studies*, 33(5).

Harvey, C. R., Liu, Y. and Zhu, H. (2016). …and the cross-section of expected returns. *Review of Financial Studies*, 29(1).

Jegadeesh, N. (1990). Evidence of predictable behavior of security returns. *Journal of Finance*, 45(3).

Makridakis, S., Spiliotis, E., Hollyman, R., Petropoulos, F., Swanson, N. and Gaba, A. (2025). The M6 forecasting competition: bridging the gap between forecasting and investment decisions. *International Journal of Forecasting*, 41(4), 1315–1354.

McLean, R. D. and Pontiff, J. (2016). Does academic research destroy stock return predictability? *Journal of Finance*, 71(1).

Moreira, A. and Muir, T. (2017). Volatility-managed portfolios. *Journal of Finance*, 72(4).

Novy-Marx, R. and Velikov, M. (2016). A taxonomy of anomalies and their trading costs. *Review of Financial Studies*, 29(1).

Patton, A. J. (2011). Volatility forecast comparison using imperfect volatility proxies. *Journal of Econometrics*, 160(1).

Waudby-Smith, I., Arbour, D., Sinha, R., Kennedy, E. H. and Ramdas, A. (2024). Time-uniform central limit theory and asymptotic confidence sequences. *Annals of Statistics*.

Project sources: the repositories [PrototypeVersions/UnpricedX](https://github.com/PrototypeVersions/UnpricedX), [PrototypeVersions/UnpricedZ](https://github.com/PrototypeVersions/UnpricedZ) and [PrototypeVersions/UnpricedHub](https://github.com/PrototypeVersions/UnpricedHub). Figures for the Risk Lab's sector-direction portfolio and the record-keeper's export counts are from GPT's read-only review of those repositories on November 11, 2026. The companion book is at [PrototypeVersions/ByWhatMeasure](https://github.com/PrototypeVersions/ByWhatMeasure).

# Glossary {#glossary}

**Benchmark.** A simple rule the models must beat; forecast and graded live but never put in charge.

**Brier score.** Squared gap between a forecast probability and what happened (1 or 0), averaged. Lower is better; always saying 50% scores 0.25.

**Calibrated.** A probability forecast is calibrated if events it calls 30% happen about 30% of the time, and so on for every value it uses.

**Champion / challenger.** The model whose forecasts drive the portfolio, and the models running beside it hoping to replace it.

**Confidence sequence.** A range for the true value that stays valid however often it is checked, unlike an ordinary confidence interval.

**Drawdown.** The largest fall from a running peak during a window.

**Forecast encompassing.** One forecast encompasses another if adding the second does not improve the first. A forecast that is encompassed by simpler signals adds nothing, however accurate it is.

**Hash chain.** Each day's file contains a fingerprint of the previous day's, so changing any past file breaks every later link.

**Holdout.** Recent history kept sealed while ideas are developed, then used for a limited number of logged checks.

**IC (information coefficient).** The rank correlation between forecast ranks and actual returns. 0 is chance; 0.02–0.05 held over months is very good.

**QLIKE.** A standard loss for variance forecasts; 0 is perfect, and underestimating risk costs more than overestimating it.

**SPY.** An exchange-traded fund that tracks the S&P 500 index of large US companies; the project's yardstick for "just holding the market."

**Walk-forward.** Train on the past, test on the next period, move forward, repeat, so no test uses data from its own future.
