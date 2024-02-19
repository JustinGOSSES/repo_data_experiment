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

# Data
## Visualizing Code Repositories Metadata
[The code repository that builds this page](https://github.com/JustinGOSSES/repo_data_experiment)


### All GitHub Organizations Data Gathered in the Flattened CSV
```
const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();
```
```js
const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();
```

```js
display(repos)
```

<!-- Data utilities  -->

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

<!-- Filtering repos to those with commit stats -->

```js
const reposWithYear = repos.map((repo) => {
  const createdAt = new Date(repo.created_at);
  const year = createdAt.getUTCFullYear();
  const updatedRepo = { ...repo, created_at_year: year };

  for (const key in updatedRepo) {
    if (key.includes("commit_stats.total") || key.includes("commit_stats.mean") || key.includes(" commit_stats.dds")  ) {
      updatedRepo[key] = parseInt(updatedRepo[key]);
    }
  }
  return updatedRepo;
});

function createCohort(data, column, cohortColName, baseThreshold, topThreshold) {
  return data.map((item) => {
    if (item[column] > baseThreshold && item[column] < topThreshold) {
      return { ...item, [cohortColName]: true };
    } else {
      return { ...item, [cohortColName]: false };
    }
  });
}

function filterData(data, columnName, trueOrFalse) {
  return data.filter((item) => item[columnName] === trueOrFalse);
}

const reposWithMoreCols_A = createCohort(reposWithYear,"commit_stats.total_committers", "committersNonZero", 0.2,100000)

const reposWithMoreCols_B = createCohort(reposWithMoreCols_A,"commit_stats.total_committers", "committers1-20", 0.2,20.5)
const reposWithMoreCols_C = createCohort(reposWithMoreCols_B,"commit_stats.total_committers", "committers20-100", 20.5,100.5)
const reposWithMoreCols_D = createCohort(reposWithMoreCols_C,"commit_stats.total_committers", "committers100plus", 100.5,10000000)

const reposFinalAfterCohorts = reposWithMoreCols_D

display(reposFinalAfterCohorts)


const reposWithYearCommitData = filterData(reposFinalAfterCohorts,"committersNonZero", true)

const reposWithMoreThan100Committers = filterData(reposFinalAfterCohorts,"committers100plus", true)

const reposWith20to100Committers = filterData(reposFinalAfterCohorts,"committers20-100", true)

```



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


### Counts of repositories with committer statistics that are not zero
It looks like as many repositories do not have committer data, but it is not clear if that is because 
they did not get pushes after public release or whether Ecosyste.ms only collects committer data on 
some subset of repositories?


<div class="grid grid-cols-3">
  <div class="card">
    <h2>NASA (US government agency)</h2>
    <span class="big">${reposWithYearCommitData.filter((d) => d.owner === "nasa").length.toLocaleString("en-US")}</span>
  </div>
   <div class="card">
    <a href="https://github.com/cmsgov"><h2>Centers for Medicare & Medicaid Services (US government agency)</h2></a>
    <span class="big">${reposWithYearCommitData.filter((d) => d.owner === "CMSgov").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>National Security Agency (US government agency)</h2>
    <span class="big">${reposWithYearCommitData.filter((d) => d.owner === "NationalSecurityAgency").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>AirBnB (tech company known for creating open source tools)</h2>
    <span class="big">${reposWithYearCommitData.filter((d) => d.owner === "airbnb").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>home-assistant (one of the most forked and contributed to open source projects)</h2>
    <span class="big">${reposWithYearCommitData.filter((d) => d.owner === "home-assistant").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>houstondatavis (local meetup for data visualization)</h2>
    <span class="big">${reposWithYearCommitData.filter((d) => d.owner === "houstondatavis").length.toLocaleString("en-US")}</span>
  </div>
</div>


### Repositories with more than 100 committers

For the small subset of repositories with very large communities developing them, neither 
HoustonDataViz or CMSgov have repositories on this list. 

```js
display(
  Plot.plot({
  marginLeft: 200,
  marginRight:50,
  x: { axis: null },
  y: { label: null },
  color: {legend: true},
  marks: [
    Plot.barX(reposWithMoreThan100Committers, {
      // x: "commit_stats.total_committers",
      x: d => `${d["commit_stats.total_committers"]}`,
      y: "full_name",
      fill: "owner",
      channels: {topics: "topics", stargazers_count: "stargazers_count", commit_stats__total_commits: "commit_stats.total_commits", commit_stats__mean_commits: "commit_stats.mean_commits", commit_stats__dds: "commit_stats.dds"},
      tip: true,
      sort: { y: "x", reverse: true, }
    }),

    Plot.text(reposWithMoreThan100Committers, {
      text: d => `${d["commit_stats.total_committers"]}`,
      //text: d => `${d.value}`,
      y: "full_name",
      x: "commit_stats.total_committers",
       sort: { y: "x", reverse: true, },
      textAnchor: "start",
      dx: 1,
      fill: "black"
    })
  ]
})
)
```

### Looking at repositories with 20-100 committers

```js
display(
  Plot.plot({
  marginLeft: 200,
  marginRight:50,
  x: { axis: null },
  y: { label: null },
  color: {legend: true},
  marks: [
    Plot.barX(reposWith20to100Committers, {
      // x: "commit_stats.total_committers",
      x: d => `${d["commit_stats.total_committers"]}`,
      y: "full_name",
      fill: "owner",
      channels: {topics: "topics", stargazers_count: "stargazers_count", commit_stats__total_commits: "commit_stats.total_commits", commit_stats__mean_commits: "commit_stats.mean_commits", commit_stats__dds: "commit_stats.dds"},
      tip: true,
      sort: { y: "x", reverse: true, }
    }),

    Plot.text(reposWith20to100Committers, {
      text: d => `${d["commit_stats.total_committers"]}`,
      //text: d => `${d.value}`,
      y: "full_name",
      x: "commit_stats.total_committers",
       sort: { y: "x", reverse: true, },
      textAnchor: "start",
      dx: 1,
      fill: "black"
    })
  ]
})
)
```

```js
display(reposWithMoreThan100Committers)
```

```js
import repos_cohort_processed from './components/cohorts';
display(epos_cohort_processed)
```