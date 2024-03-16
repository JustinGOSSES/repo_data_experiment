---
toc:
---



<head>
<link href="https://unpkg.com/tabulator-tables@5.6.1/dist/css/tabulator.min.css" rel="stylesheet">
<script type="text/javascript" src="https://unpkg.com/tabulator-tables@5.6.1/dist/js/tabulator.min.js"></script>
</head>

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

# Filter by Cohort with SQL
## Visualizing Code Repositories Metadata
[The code repository that builds this page](https://github.com/JustinGOSSES/repo_data_experiment)


### All GitHub Organizations Data Gathered in the Flattened CSV

```
const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();
```


```js
// IMPORT LIBRARIES & DATA

import Tabulator from "https://cdn.jsdelivr.net/npm/tabulator-tables/+esm";

import {sql} from "npm:@observablehq/duckdb";

import * as duckdb from "npm:@duckdb/duckdb-wasm";
import {DuckDBClient} from "npm:@observablehq/duckdb";

// IMPORT DATA 
const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();


```



```js

//  Data utilities for plotting
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

// CREATING COHORTS 

import {createCohortColumns} from "./components/cohorts.js";

import {repos_cohort_processed_BaseCohorts} from "./components/cohorts.js";

var repos_cohort_processed = repos_cohort_processed_BaseCohorts(repos)

function replaceDotInColNameWithUnderscore(repos_cohort_processed){
  return repos_cohort_processed.map(obj => {
    const newObj = {};
    for (let key in obj) {
      newObj[key.replace(/\./g, '_')] = obj[key];
    }
    return newObj;
  });
}

repos_cohort_processed = replaceDotInColNameWithUnderscore(repos_cohort_processed)

```

##### Processed data with cohorts calculated
```js

display(repos_cohort_processed)


const table_all2 = 
  Inputs.table(repos_cohort_processed, {
   rows:16
  })

```

-------------


## Filtering by SQL

```js

//const dbRepos = DuckDBClient.of({reposSQL: FileAttachment("./data/all_orgs_merged_20240120.csv")});
const dbRepos = DuckDBClient.of({reposSQL: repos_cohort_processed});

```

```js
//// THIS LINE DOES NOT WORK YET
// const text = view(Inputs.text({label:"SQL query",value:`SELECT * FROM reposSQL LIMIT 10`}));
// const sub = `WHERE size`

const sizeMin = view(Inputs.range([0, 5000000], {label: "size in bytes",value:1000}));
const stargazer_count_min = view(Inputs.range([0, 10000], {label: "stargazers_count min",value:20}));
const limitNumberRowsToShow = view(Inputs.range([0, 5000], {label: "max number of rows to show",value:10,step:1}));



```

```js
```


```js
const dbRepos_FilteredBySQL = dbRepos.sql`SELECT * FROM reposSQL WHERE size > ${sizeMin} AND stargazers_count > ${stargazer_count_min} LIMIT ${limitNumberRowsToShow}`

```
### Table of repositories filtered by query 
SELECT * FROM reposSQL WHERE size > ${sizeMin} AND stargazers_count > ${stargazer_count_min} LIMIT ${limitNumberRowsToShow}
```js
display(dbRepos_FilteredBySQL.length)

const table_SQLunfiltered = 
  view(Inputs.table(dbRepos_FilteredBySQL))

```

### A second filter by SQL to find NASA repositories built in distributed fashion by a community
[Distributed development score or DDS](https://report.opensustain.tech/chapters/development-distribution-score.html) 
is an approximation of how much the project has been developed by a single person using commit distribution.
It is one way to calculated a bus score, meaning would the community that produces the package survive if one of the core contributors got hit by a bus.
Higher scores mean a project is more likely to continue if one person leaves.

```js 
const dbRepos_FilteredBySQL_b = dbRepos.sql`SELECT * FROM reposSQL WHERE "commit_stats_total_committers" > 100 AND "commit_stats_total_committers" < 1000000000`
```
#### Query = 
```
SELECT * FROM reposSQL WHERE "commit_stats_total_committers" > 100 AND "commit_stats_total_committers" < 1000000000
```

```js
display( dbRepos_FilteredBySQL_b.length)

const table_SQLunfiltered = 
  view(Inputs.table( dbRepos_FilteredBySQL_b))

```

### Third filtering: same filter as above but filtering to senior citizen repositories


```js 
const dbRepos_FilteredBySQL_c = dbRepos.sql`SELECT * FROM reposSQL WHERE "commit_stats_total_committers" > 100 AND "commit_stats_total_committers" < 1000000000 AND "cohort_age_seniorMore1095d" == true AND "full_name" IS NOT NULl`
```
#### Query = 
```
SELECT * FROM reposSQL WHERE "commit_stats_total_committers" > 100 AND "commit_stats_total_committers" < 1000000000 AND "cohort_age_seniorMore1095d" == true AND "full_name" IS NOT NULl
```

```js
display( dbRepos_FilteredBySQL_c.length)

const table_SQLunfiltered = 
  view(Inputs.table( dbRepos_FilteredBySQL_c))

```