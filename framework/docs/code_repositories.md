---
toc: true
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 2rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

<div class="hero">
  <h1>Houston Data Jam</h1>
  <h2>Visualizing Code Repositories Metadata</h2>
  <a href="https://github.com/JustinGOSSES/repo_data_experiment" target="_blank">The code repository that builds this pagess<span style="display: inline-block; margin-left: 0.25rem;">↗︎</span></a>
</div>

### AirBnB data loaded as JSON

```js
const forecast = FileAttachment("./data/airbnb_repos.json").json();
```

```js
display(forecast)
```

### All GitHub Organizations Data Gathered in Flattened CSV
```js
const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();
```

```js
display(repos)
```



### Plot histogram of stargazers
```js

display(
 Plot.plot({
    y: {grid: true},
    color: {legend: true},
    marks: [
        Plot.rectY(repos, Plot.binX({x: "count"}, {y: "forks_count", fill: "owner"}, {bins: [0, 10, 100, 1000, 2000, Infinity]})),
        Plot.ruleY([0])
    ]
 })
)
```

```js
display(
    Plot.plot({
    marks: [
        Plot.rectY(repos, 
                Plot.binX(
                    {y: "count"},
                    {fill: "owner"},
                    {x: "forks_count",
                    }
                ))
    ]
    })
)
```

Plot.plot({
  y: {grid: true},
  color: {legend: true},
  marks: [
    Plot.rectY(data, Plot.binX({y: "count"}, {x: "flipper_length_mm", fill: "sex"})),
    Plot.ruleY([0])
  ]
})

```js
const color = Plot.scale({
  color: {
    type: "categorical",
    domain: d3.groupSort(repos, (D) => -D.length, (d) => d.owner).filter((d) => d !== "Other"),
    unknown: "var(--theme-foreground-muted)"
  }
});
```



### Created Over Time
```js
display(
    Plot.plot({
    title: "Repos Created Overt Time",
    width: 800,
    height: 300,
    y: {grid: true, label: "Launches"},
    color: {...color, legend: true},
    marks: [
      Plot.rectY(repos, Plot.binX({y: "count"}, {x: "created_at", fill: "owner", interval: "year", tip: true})),
      Plot.ruleY([0])
    ]
  })
)
```

### Last pushed over time
```js
display(
    Plot.plot({
    title: "Repos Last Updated Over Time",
    width: 800,
    height: 300,
    y: {grid: true, label: "Launches"},
    color: {...color, legend: true},
    marks: [
      Plot.rectY(repos, Plot.binX({y: "count"}, {x: "updated_at", fill: "owner", interval: "year", tip: true})),
      Plot.ruleY([0])
    ]
  })
)
```

### Last pushed over time
```js
display(
    Plot.plot({
    title: "Repos Last Updated Over Time",
    width: 800,
    height: 300,
    y: {grid: true, label: "?"},
    color: {...color, legend: true},
    marks: [
      Plot.rectY(repos, Plot.binX({y: "count"}, {x: "updated_at", fill: "language", interval: "year", tip: true})),
      Plot.ruleY([0])
    ]
  })
)
```

### Last synced?
```js
display(
    Plot.plot({
    title: "Repos Last synched Over Time",
    width: 800,
    height: 300,
    y: {grid: true, label: "Synced"},
    color: {...color, legend: true},
    marks: [
      Plot.rectY(repos, Plot.binX({y: "count"}, {x: "synced_at", fill: "owner", interval: "year", tip: true})),
      Plot.ruleY([0])
    ]
  })
)
```