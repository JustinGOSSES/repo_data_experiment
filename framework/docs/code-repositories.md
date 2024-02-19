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

# Over time
## Visualizing Code Repositories Metadata
[The code repository that builds this page](https://github.com/JustinGOSSES/repo_data_experiment)


<!-- ### AirBnB data loaded as JSON

```
const forecast = FileAttachment("./data/airbnb_repos.json").json();
```


```js
const forecast = FileAttachment("./data/airbnb_repos.json").json();
```

```js
display(forecast)
``` -->

<!-- ### All GitHub Organizations Data Gathered in the Flattened CSV -->
<!-- ```
const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();
``` -->
```js
const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();
```

<!-- ```js
display(repos)
``` -->
<!-- 
## Number of code repositories 
Important to note that this data comes from Ecosyste.ms API. Ecosyste.ms 
doesn't collect data on all repositories but rather the subset with engagement, 
that are source for a package, etc. The total number of repositories actually 
in each GitHub organization is larger than what is captured here. 

<div class="grid grid-cols-3">
  <div class="card">
    <h2>NASA (US government agency)</h2>
    <span class="big">${repos.filter((d) => d.owner === "nasa").length.toLocaleString("en-US")}</span>
  </div>
   <div class="card">
    <a href="https://github.com/cmsgov"><h2>Centers for Medicare & Medicaid Services (US government agency)</h2></a>
    <span class="big">${repos.filter((d) => d.owner === "CMSgov").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>National Security Agency (US government agency)</h2>
    <span class="big">${repos.filter((d) => d.owner === "NationalSecurityAgency").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>AirBnB (tech company known for creating open source tools)</h2>
    <span class="big">${repos.filter((d) => d.owner === "airbnb").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>home-assistant (one of the most forked and contributed to open source projects)</h2>
    <span class="big">${repos.filter((d) => d.owner === "home-assistant").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>houstondatavis (local meetup for data visualization)</h2>
    <span class="big">${repos.filter((d) => d.owner === "houstondatavis").length.toLocaleString("en-US")}</span>
  </div>
</div>
 -->


```js
const color = Plot.scale({
  color: {
    type: "categorical",
    domain: d3.groupSort(repos, (D) => -D.length, (d) => d.owner).filter((d) => d !== "Other"),
    unknown: "var(--theme-foreground-muted)"
  }
});

const colorLanguage = Plot.scale({
  color: {
    type: "categorical",
    domain: d3.groupSort(repos, (D) => -D.length, (d) => d.language).filter((d) => d !== "Other"),
    unknown: "var(--theme-foreground-muted)"
  }
});
```

```js
const reposWithYear = repos.map((repo) => {
  const createdAt = new Date(repo.created_at);
  const year = createdAt.getUTCFullYear();
  return { ...repo, created_at_year: year };
});

```

<!-- ```js
display(reposWithYear)
``` -->



### Count of Repositories Created Over Time
```js
display(
    Plot.plot({
    // title: "Repos Created Overt Time",
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

### Count of Repositories by Last Update Date
```js
display(
    Plot.plot({
    // title: "Repos Last Updated Over Time",
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

The fact that NASA has repositories created in the older years but that doesn't 
show up much in those same years for "last updated" would seem to suggest those early 
repositories tended to stay active. 

On a proportional basis, HoustonDataViz has far more repositories last updated 
only shortly after their creation, which makes since as those repositories tend to 
be demos, data jams, presentations, and other short-lived repositories tied to 
events. 

## Languages Over Time

### Languages over time based on last update to repository and most used language
```js
display(
    Plot.plot({
    title: "Repos Last Updated Over Time",
    width: 800,
    height: 300,
    y: {grid: true, label: "?"},
    color: {...colorLanguage, legend: true},
    marks: [
      Plot.rectY(repos, Plot.binX({y: "count"}, {x: "updated_at", fill: "language", interval: "year", tip: true})),
      Plot.ruleY([0])
    ]
  })
)
```


<!-- CODE TO ADD COLUMN AND SORT FOR MULTILINE CHART -->
```js
function createCountData(data) {
  const counts = new Map();
  for (const row of data) {
    const key = `${row.language}-${row.created_at_year}`;
    if (counts.has(key)) {
      counts.set(key, counts.get(key) + 1);
    } else {
      counts.set(key, 1);
    }
  }
  const countData = [];
  for (const [key, count] of counts.entries()) {
    const [language, created_at_year] = key.split("-");
    countData.push({ language, created_at_year, count });
  }
  countData.sort((a, b) => {
    if (a.created_at_year === b.created_at_year) {
      return a.language.localeCompare(b.language);
    }
    return a.created_at_year - b.created_at_year;
  });
  return countData;
}

const countData = createCountData(reposWithYear);
display(countData )
```

### Language Over Time based on Created_at Year (1/2)
```js
// function filterData() {
//   const selectedLanguage = document.getElementById("languageSelect").value;
//   const filteredData = countData.filter(item => item.language === selectedLanguage);
  const filteredData = countData
  display(
    Plot.plot({
      width: 800,
      height: 300,
      y: {grid: true, label: "?"},
      color: {...colorLanguage, legend: true},
      marks: [
        Plot.ruleY([0]),
        Plot.lineY(filteredData, {x: "created_at_year", y: "count", stroke: "language"}),
        Plot.text(filteredData, Plot.selectLast({x: "created_at_year", y: "count", z: "language", text: "language", textAnchor: "start", dx: 3}))
      ]
    })
  );
// }
// filterData()

```
<!-- <select id="languageSelect" onchange="filterData()">
  <option value="">All Languages</option>
  <option value="JavaScript">JavaScript</option>
  <option value="Python">Python</option>
  <option value="Java">Java</option>
</select> -->

### Language Over Time based on Created_at Year (2/2)
```js
display(
  Plot.plot({
     width: 800,
      height: 300,
      y: {grid: true, label: "?"},
      color: {...colorLanguage, legend: true},
    marks: [
      Plot.barY(countData, {x: "created_at_year", y: "count", fill: "language", tip: true}),
      Plot.ruleY([0])
    ]
  })
)
```