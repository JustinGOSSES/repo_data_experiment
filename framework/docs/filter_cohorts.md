---
toc: true
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

# Filter by Cohort
## Visualizing Code Repositories Metadata
[The code repository that builds this page](https://github.com/JustinGOSSES/repo_data_experiment)


### All GitHub Organizations Data Gathered in the Flattened CSV

```
const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();
```

```js
// IMPORT LIBRARIES & DATA

import Tabulator from "https://cdn.jsdelivr.net/npm/tabulator-tables/+esm";


// IMPORT DATA 
const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();

// display(repos)

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

const repos_cohort_processed = repos_cohort_processed_BaseCohorts(repos)


// FILTERED DOWN DATA

function filterData(data, columnName, trueOrFalse) {
  return data.filter((item) => item[columnName] === trueOrFalse);
}

const reposWithYearCommitData = filterData(repos_cohort_processed,"cohort_committers__NonZero", true)

const reposWithMoreThan100Committers = filterData(repos_cohort_processed,"cohort_committers_100plus", true)

const reposWith20to100Committers = filterData(repos_cohort_processed,"cohort_committers_20-100", true)

const reposSamples = filterData(repos_cohort_processed,"cohort_sample", true)


```

##### Processed data with cohorts calculated
```js

display(repos_cohort_processed)

// const table_all = view(
//   Inputs.table(repos_cohort_processed, {
//     disabled: ["⚠️F", "⚠️Q"],
//     sort: true,
//     unique: true,
//     value: "B",
//     label: "Choose categories:"
//   })
// );

const table_all2 = 
  Inputs.table(repos_cohort_processed, {
   rows:16
  })

```

-------------

## Number of code repositories 
Important to note that this data comes from Ecosyste.ms API. Ecosyste.ms 
doesn't collect data on all repositories but rather the subset with engagement, 
that are source for a package, etc. The total number of repositories actually 
in each GitHub organization is larger than what is captured here. 

<div class="grid grid-cols-3">
  <div class="card">
    <h2>NASA (US government agency)</h2>
    <span class="big">${repos_cohort_processed.filter((d) => d.owner === "nasa").length.toLocaleString("en-US")}</span>
  </div>
   <div class="card">
    <a href="https://github.com/cmsgov"><h2>Centers for Medicare & Medicaid Services (US government agency)</h2></a>
    <span class="big">${repos_cohort_processed.filter((d) => d.owner === "CMSgov").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>National Security Agency (US government agency)</h2>
    <span class="big">${repos_cohort_processed.filter((d) => d.owner === "NationalSecurityAgency").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>AirBnB (tech company known for creating open source tools)</h2>
    <span class="big">${repos_cohort_processed.filter((d) => d.owner === "airbnb").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>home-assistant (one of the most forked and contributed to open source projects)</h2>
    <span class="big">${repos_cohort_processed.filter((d) => d.owner === "home-assistant").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>houstondatavis (local meetup for data visualization)</h2>
    <span class="big">${repos_cohort_processed.filter((d) => d.owner === "houstondatavis").length.toLocaleString("en-US")}</span>
  </div>
</div>

-------------

<h2>Unfiltered Table of All Repositories:</h2>
<div id="filtered_repos_table_1" class="card" style="padding: 0;">${table_all2} </div> 

---------------

## Filtered by Cohorts:


```js

import {button_cohort_filter,get_list_of_cohort_columns, cohort_column_state, filter_repos_by_cohort} from "./components/cohorts.js"

import {addFilterButton, get_object_of_cohort_columns} from "./components/cohorts.js"

var cohort_columns = get_list_of_cohort_columns(repos_cohort_processed)

var cohort_columns_state = cohort_column_state(cohort_columns)

var cohort_columns_object = get_object_of_cohort_columns(repos_cohort_processed)

display(cohort_columns)

display(cohort_columns_object)

const checkboxesObject2 =  Object.keys(cohort_columns_object).reduce((obj, key) => {
  obj[key] = Inputs.checkbox(cohort_columns_object[key],{value:["cohort_sample"]});
  return obj;
}, {});


const checkboxes_object_clicked_age  = Generators.input(checkboxesObject2.age);
const checkboxes_object_clicked_committers  = Generators.input(checkboxesObject2.committers);
const checkboxes_object_clicked_sample  = Generators.input(checkboxesObject2.sample);


```

## Select one or more within each Repository Cohort Group
<p>Repositories kept when they meet 1 or more selected cohorts within each cohort group</p>

<pre>FUTURE WORK: BUILD DEFINITIONS SHOW ON HOVER</pre>

<h3>Sample</h3>
<div id="checkboxes" style="">${checkboxesObject2.sample}</div>
</br>

<h3>Age</h3>
<div id="checkboxes" style="">${checkboxesObject2.age}</div>
</br>

<h3>Committers</h3>
<div id="checkboxes" style="">${checkboxesObject2.committers}</div>
</br>
</br>


<!-- <h4>Selected Sample Cohorts</h4>
<div id="checkedCohort_sample"></div>


<h4>Selected Age Cohorts</h4>
<div id="checkedCohort_age"></div>

<h4>Selected Committers Cohorts</h4>
<div id="checkedCohort_committers"></div> -->

```js

function addUnorderedListtoDivID(arrayOfCheckedItems, divID){
  const divElement = document.getElementById(divID);
  const ulElement = document.createElement("ul");
  
  // Clear the ul element first
  divElement.innerHTML = '';
  
  if (arrayOfCheckedItems.length === 0) {
    const liElement = document.createElement("li");
    liElement.textContent = "None selected";
    ulElement.appendChild(liElement);
  } else {
    arrayOfCheckedItems.forEach(item => {
      const liElement = document.createElement("li");
      liElement.textContent = item;
      ulElement.appendChild(liElement);
    });
  }
  
  divElement.appendChild(ulElement);
}

console.log("checkedCohort_sample type = ",typeof(checkboxes_object_clicked_age))
console.log("checkedCohort_sample = ",checkboxes_object_clicked_age)

// addUnorderedListtoDivID(checkboxes_object_clicked_age , "checkedCohort_sample")
// addUnorderedListtoDivID(checkboxes_object_clicked_committers, "checkedCohort_age")
// addUnorderedListtoDivID(checkboxes_object_clicked_sample , "checkedCohort_committers")


function filterBasedOnCohortGroup(repos_cohort_processed, arrayOfColumnNameLists=[checkboxes_object_clicked_age, checkboxes_object_clicked_committers, checkboxes_object_clicked_sample]) {
  // Check if arrayOfColumnNameLists is empty or only contains empty lists
  if (arrayOfColumnNameLists.length === 0 || arrayOfColumnNameLists.every(list => list.length === 0)) {
    return [];
  }

  let filteredRows = [];

  // Find rows where at least one column in each list is true
  for (const columnNameList of arrayOfColumnNameLists) {
    if (columnNameList.length > 0) {
      const filteredRowsForList = repos_cohort_processed.filter(row => {
        return columnNameList.some(columnName => row[columnName]);
      });
      filteredRows.push(filteredRowsForList);
    }
  }

  // Find the intersection of the filtered rows
  const intersection = filteredRows.reduce((acc, curr) => {
    return acc.filter(row => curr.includes(row));
  });

  return intersection;
}

const cohortFilteredData = filterBasedOnCohortGroup(repos_cohort_processed, [checkboxes_object_clicked_age, checkboxes_object_clicked_committers, checkboxes_object_clicked_sample])

// display(cohortFilteredData)


const table_cohortFiltered = 
  Inputs.table(cohortFilteredData, {
   row:16
  } )

```

<p>Number of repositories after filtering by cohort checkboxes is: ${cohortFilteredData.length}</p>

<h2>Repositories that are True for Selected Cohorts:</h2>
<div id="filtered_repos_table_2" class="card" style="padding: 0;">${table_cohortFiltered} </div> 

### Bar chart that displays repositories filtered by cohort checkboxes sorted by a selected variable

```js

function findColsThatAreNumbers(tableOfData) {
  let listOfColumnStrings = [];

  // Get the keys of the first row
  const keys = Object.keys(tableOfData[0]);

  // Iterate over each key
  for (const key of keys) {
    let isNumber = false;
    // Check if the value of the key is a number in each row
    for (const row of tableOfData) {
      var value = row[key];
      try { 
        if (!isNaN(value)) {
          value = parseInt(value);
        }
        if (typeof value === 'number' && (Number.isInteger(value) || Number.isFinite(value))) {
          isNumber = true;
          break;
        }
      // Skip if the value is blank or not a number
      if (value === "" || isNaN(value)) {
        isNumber = false;
      }
        }
       catch (error) {
        // Handle any errors that occur during the conversion
        // Do nothing and continue to the next column
      }
    }
    // If all values are numbers, add the key to the list
    if (isNumber) {
      listOfColumnStrings.push(key);
    }
  }
  return listOfColumnStrings;
}
console.log("findColsThatAreNumbers(cohortFilteredData) = ",findColsThatAreNumbers(cohortFilteredData))

var barChartVariable = Inputs.select([null].concat(findColsThatAreNumbers(cohortFilteredData)), {label: "variable", value:"stargazers_count"})

display(barChartVariable)

const barChartVariable_selected  = Generators.input(barChartVariable)

```

```js

display(
  Plot.plot({
  marginLeft: 200,
  marginRight:50,
  x: { axis: null },
  y: { label: null },
  color: {legend: true},
  marks: [
    Plot.barX(cohortFilteredData, {
      // x: "commit_stats.total_committers",
      x: d => `${d[barChartVariable_selected]}`,
      y: "full_name",
      fill: "owner",
      channels: {topics: "topics", stargazers_count: "stargazers_count", commit_stats__total_commits: "commit_stats.total_commits", commit_stats__mean_commits: "commit_stats.mean_commits", commit_stats__dds: "commit_stats.dds"},
      tip: true,
      sort: { y: "x", reverse: true, }
    }),

    Plot.text(cohortFilteredData, {
      text: d => `${d[barChartVariable_selected]}`,
      //text: d => `${d.value}`,
      y: "full_name",
      x: barChartVariable_selected,
       sort: { y: "x", reverse: true, },
      textAnchor: "start",
      dx: 1,
      fill: "black"
    })
  ]
})
)
```

## Bar charts of cohort groups

```js

```