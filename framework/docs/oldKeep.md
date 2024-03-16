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

# Data
## Visualizing Code Repositories Metadata
[The code repository that builds this page](https://github.com/JustinGOSSES/repo_data_experiment)


### All GitHub Organizations Data Gathered in the Flattened CSV

```
const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();
```

##### Original data in flattened CSV from Ecosyste.ms
```js
// IMPORT LIBRARIES 

import Tabulator from "https://cdn.jsdelivr.net/npm/tabulator-tables/+esm";


// IMPORT DATA 
const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();

display(repos)
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
```
##### Samples 
```js
display(reposSamples)
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


### Counts of repositories with committer statistics that are not zero
It looks like as many repositories do not have committer data, but it is not clear if that is because 
they did not get pushes after public release or whether Ecosyste.ms only collects committer data on 
some subset of repositories?


<div class="grid grid-cols-3">
  <div class="card">
    <h2>NASA (US government agency)</h2>
    <span class="big">${repos_cohort_processed.filter((d) => d.owner === "nasa" && d.committersNonZero == true).length.toLocaleString("en-US")}</span>
  </div>
   <div class="card">
    <a href="https://github.com/cmsgov"><h2>Centers for Medicare & Medicaid Services (US government agency)</h2></a>
    <span class="big">${repos_cohort_processed.filter((d) => d.owner === "CMSgov" && d.committersNonZero == true).length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>National Security Agency (US government agency)</h2>
    <span class="big">${repos_cohort_processed.filter((d) => d.owner === "NationalSecurityAgency"  && d.committersNonZero == true).length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>AirBnB (tech company known for creating open source tools)</h2>
    <span class="big">${repos_cohort_processed.filter((d) => d.owner === "airbnb"  && d.committersNonZero == true).length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>home-assistant (one of the most forked and contributed to open source projects)</h2>
    <span class="big">${repos_cohort_processed.filter((d) => d.owner === "home-assistant"  && d.committersNonZero == true).length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>houstondatavis (local meetup for data visualization)</h2>
    <span class="big">${repos_cohort_processed.filter((d) => d.owner === "houstondatavis"  && d.committersNonZero == true).length.toLocaleString("en-US")}</span>
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

```js
display(reposWithMoreThan100Committers)


```



<div id="table-veryLargeCommunity"></div>


```js

import {Tabulator} from "https://cdn.jsdelivr.net/npm/tabulator-tables/+esm";

var table = new Tabulator("#table-veryLargeCommunity", {
    data:reposWithMoreThan100Committers, //assign data to table
    autoColumns:true, //create columns from data field names
    columns:[{title:"full_name", field:"full_name", frozen:true}]
});

```

</br>
</br>

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


### TEST

<!-- <div id="test-1" style="display: flex; flex-wrap: wrap; justify-content: center;"></div>

<pre id="test-2"></pre>

<div id="button-container"></div>




```js

// import {Tabulator} from "https://cdn.jsdelivr.net/npm/tabulator-tables/+esm";

import {button_cohort_filter,get_list_of_cohort_columns, cohort_column_state, filter_repos_by_cohort} from "./components/cohorts.js"

import {addFilterButton, get_object_of_cohort_columns} from "./components/cohorts.js"

var cohort_columns = get_list_of_cohort_columns(repos_cohort_processed)

var cohort_columns_state = cohort_column_state(cohort_columns)

var cohort_columns_object = get_object_of_cohort_columns(repos_cohort_processed)

const hoursAgoInput = Inputs.range([4, 0], {step: 1, value: 0, width: 150});


const flavor = Inputs.checkbox(["Salty", "Spicy", "Sour", "Umami"], {label: "Flavor"})

var flavor_selected = Generators.input(flavor)

display(cohort_columns)

display(cohort_columns_object)

const checkboxes = Object.keys(cohort_columns_object).map(key => {
  return Inputs.checkbox(cohort_columns_object[key], { label: key });
});

const checkboxesObject2 =  Object.keys(cohort_columns_object).reduce((obj, key) => {
  obj[key] = Inputs.checkbox(cohort_columns_object[key]);
  return obj;
}, {});


function getClickedObjects(inputCheckboxObject) {
  console.log("inputCheckboxObject = ",inputCheckboxObject)
  var generatorsObject = {};
  for (const key in inputCheckboxObject) {
      console.log("key is ",key, " and inputCheckboxObject = ",inputCheckboxObject)
      generatorsObject[key] = Generators.input(inputCheckboxObject[key]);
  }
  console.log("generatorsObject = ",generatorsObject)
  console.log("typeof generatorsObject", typeof(generatorsObject) )
  return generatorsObject; -->
<!-- } -->
<!-- 
// const checkboxes_object_clicked =  getClickedObjects(checkboxesObject2 )


// const checkboxes_object_clicked = await (async function() {
//   const obj = {};
//   for (const key in checkboxesObject2) {
//     obj[key] = await Generators.input(checkboxesObject2[key]).next().value;
//   }
//   return obj;
// })();


// const checkboxes_object_clicked_age  = Generators.input(checkboxesObject2.age);
// const checkboxes_object_clicked_committers  = Generators.input(checkboxesObject2.committers);
// const checkboxes_object_clicked_sample  = Generators.input(checkboxesObject2.sample);

// const checkboxes_object = {
//   "age":Generators.input(checkboxesObject2.age) ,
//   "committers":checkboxes_object_clicked_committers,
//   "sample":checkboxes_object_clicked_sample
// } -->

<!-- 
//

// const checkout = view(
//   Inputs.checkbox(["B", "A", "Z", "Z", "⚠️F", "D", "G", "G", "G", "⚠️Q"], {
//     disabled: ["⚠️F", "⚠️Q"],
//     sort: true,
//     unique: true,
//     value: "B",
//     label: "Choose categories:"
//   })
// );

// const checkboxes_object_clicked = function(){
//    const generatorsObject = {};
//   for (const key in checkboxesObject2) {
//       // console.log("key is ",key, " and inputCheckboxObject = ",inputCheckboxObject)
//       generatorsObject[key] = Generators.input(checkboxesObject2[key]);
//   }
//   console.log("generatorsObject = ",generatorsObject)
//   console.log("typeof generatorsObject", typeof(generatorsObject) )
//   return generatorsObject;
// }

// const checklist_age = view(
//   Inputs.checkbox(cohort_columns_object.age, {
//     disabled: ["⚠️F", "⚠️Q"],
//     sort: true,
//     unique: true,
//     value: "cohort_age_seniorMore1095d",
//     label: "Choose one or more from this category:"
//   })
// ); -->
<!-- 
// function makeCheckListForEachCohortGroup(cohort_columns_object){
//   const checklists = {};
//   for (var key in cohort_columns_object) {
//     checklists[key] = view(
//       Inputs.checkbox(cohort_columns_object.key, {
//         disabled: ["⚠️F", "⚠️Q"],
//         sort: true,
//         unique: true,
//         value: cohort_columns_object[key][0],
//         label: "Choose one or more from this category:"
//       })
//     );
//   }
//   return checklists;
// }

// var checklists = makeCheckListForEachCohortGroup(cohort_columns_object)


// const checkboxes_list = Inputs.checkbox(cohort_columns)
// const checkboxes_list_clicked = Generators.input(checkboxes_list);

// button_cohort_filter(repos_cohort_processed, cohort_columns_object, cohort_columns_state, "test-1")

// addFilterButton(repos_cohort_processed, cohort_columns_state)

// display(repos_cohort_processed)

// display(cohort_columns_state)



// var filtered_repos = filter_repos_by_cohort(repos_cohort_processed, cohort_columns_state)

// display(filtered_repos)

// const ageCheckboxes = checkboxes.filter(checkbox => checkbox.label === "age");

// display(checkboxes_view)
// var = Inputs.table(filtered_repos , {rows: 16})
// display(p)

// var n = Inputs.table(filtered_repos , {rows: 16})
// display(n)

// var table = new Tabulator("#table-cohorts_filter", {
//     data:filtered_repos, //assign data to table
//     autoColumns:true, //create columns from data field names
//     // columns:[{title:"full_name", field:"full_name", frozen:true}]
    
// });


// function createTable(filtered_repos) {
//   // Make sure filtered_repos is defined and accessible here
//   const filtered_repos2 = filtered_repos; // Replace this with your actual code to get filtered_repos

//   // Now you can use Inputs.table
//   return Inputs.table(filtered_repos2, {rows: 16});
// }

// // Use the createTable function to create the table and assign it to a new Observable cell
// viewof table = createTable(); -->

<!-- ``` -->

<!-- 
<p>PRE with id test-3</p>
<pre id="test-3"></pre>

<p>cohorts filtered table</p>
<div id="table-cohorts_filter"></div>


<!-- <p>Inputs.table</p> -->
<!-- <div id="filtered_repos_table_1_holder" class="card" style="padding: 0;" data-repos=`${filtered_repos}`>data holder</div>
<div id="filtered_repos_table_1" class="card" style="padding: 0;">${Inputs.table(document.getElementById('filtered_repos_table_1_holder').getAttribute('data-repos'), {rows: 16})}</div> -->

<!-- <div id="filtered_repos_table_1" class="card" style="padding: 0;" data-repos=`${filtered_repos}`>${Inputs.table(document.getElementById('filtered_repos_table_1').getAttribute('data-repos'), {rows: 16})}</div> -->


--------


<!-- <div id="flavor" style="">${flavor}</div>
<div id="flavor" style="">${flavor_selected}</div>

-----
<div id="checkboxes" style="">${checkboxesObject2.sample}</div>
</br>
<div id="checkboxes" style="">${checkboxesObject2.age}</div>
</br>
<div id="checkboxes" style="">${checkboxesObject2.committers}</div>
</br>
</br>
<p>${checkboxes_object_clicked }</p>
<p>${checkboxes_object_clicked.age }</p>
--
<p>${checkboxes_object_clicked_age  }</p>
<p>${checkboxes_object_clicked_committers  }</p>
------- 3
<p>${checkboxes_object.age}</p>
<p>${checkboxes_object.committers}</p>
<p>${checkboxes_object["sample"]}</p>

-----
<div id="checkboxes_list" style="">${checkboxes_list}</div>

<p>${checkboxes_list_clicked}</p>
 --> 



<!-- ${JSON.stringify(filtered_repos)} -->


<!-- 
This page reenvisions parts of the US Energy Information Administration’s Hourly Electric Grid Monitor. Visit About the EIA-930 data to learn more about data collection and quality, the US electric grid, and balancing authorities responsible for nationwide electricity interchange. -->

<!-- % <p>Inputs.table</p> <div id="filtered_repos_table_1" class="card" style="padding: 0;"> ${Inputs.table(filtered_repos , {rows: 16})} </div>   -->

<!-- ------
------
<p>CHECKOUT age = ${checklists.age }</p> -->