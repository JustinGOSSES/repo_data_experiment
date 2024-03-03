



// const repos = FileAttachment("./data/all_orgs_merged_20240120.csv").csv();


function addYearToRepos(repos) {
    return repos.map((repo) => {
        const createdAt = new Date(repo.created_at);
        const year = createdAt.getUTCFullYear();
        const updatedRepo = { ...repo, created_at_year: year };
        return updatedRepo;
    });
}

function addAgeInDaysCol(repos) {
    return repos.map((repo) => {
        const createdAt = new Date(repo.created_at);
        const currentDate = new Date();
        const timeDiff = Math.abs(currentDate - createdAt);
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const updatedRepo = { ...repo, age_in_days: daysDiff };
        return updatedRepo;
    });
}

function addDaysSinceCols(repos,colName,newColName) {
    return repos.map((repo) => {
        const At = new Date(repo[colName]);
        const currentDate = new Date();
        const timeDiff = Math.abs(currentDate - At);
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const updatedRepo = { ...repo, [newColName]: daysDiff };
        return updatedRepo;
    });
}

function createRatioColumn(repos, col1, col2, newColName) {
    return repos.map((repo) => {
        const ratio = repo[col1] / repo[col2];
        const updatedRepo = { ...repo, [newColName]: ratio };
        return updatedRepo;
    });
}

function parseColumnsIntoIntegersFromStrings(repos, arrayOfKeys) {
    for (const repo of repos) {
        for (const column of arrayOfKeys) {
            if (repo.hasOwnProperty(column)) {
                repo[column] = parseInt(repo[column]);
            }
        }
    }
    return repos;
}

function createCohortNumericalCol(data, column, cohortColName, baseThreshold, topThreshold) {
    return data.map((item) => {
      if (item[column] > baseThreshold && item[column] <= topThreshold) {
        return { ...item, [cohortColName]: true };
      } else {
        return { ...item, [cohortColName]: false };
      }
    });
}
  
function createCohortStringListPossibleValues(data, column, cohortColName, valueList) {
    return data.map((item) => {
        const columnValue = item[column];
        const isSubstring = valueList.some((value) => columnValue.includes(value));
        return { ...item, [cohortColName]: isSubstring };
    });
}

function createCohortIfEitherColumnIsTrue(data, column1, column2, cohortColName) {
        return data.map((item) => {
            if (item[column1] || item[column2]) {
                return { ...item, [cohortColName]: true };
            } else {
                return { ...item, [cohortColName]: false };
            }
        });
}

export function createCohortColumns(repos, functionList) {
    let modifiedRepos = [...repos];
    for (const funcObj of functionList) {
        const funcName = Object.keys(funcObj)[0];
        const args = funcObj[funcName];
        switch (funcName) {
            case "addYearToRepos":
                modifiedRepos = addYearToRepos(modifiedRepos);
                break;
            case "addAgeInDaysCol":
                modifiedRepos = addAgeInDaysCol(modifiedRepos);
                break;
            case "addDaysSinceCols":
                modifiedRepos = addDaysSinceCols(modifiedRepos, ...args);
                break;
            case "parseColumnsIntoIntegersFromStrings":
                modifiedRepos = parseColumnsIntoIntegersFromStrings(modifiedRepos, args);
                break;
            case "createCohortNumericalCol":
                modifiedRepos = createCohortNumericalCol(modifiedRepos, ...args);
                break;
            case "createCohortStringListPossibleValues":
                modifiedRepos = createCohortStringListPossibleValues(modifiedRepos, ...args);
                break;
            case "createRatioColumn":
                modifiedRepos = createRatioColumn(modifiedRepos, ...args);
                break;
            case "createCohortIfEitherColumnIsTrue":
                modifiedRepos = createCohortIfEitherColumnIsTrue(modifiedRepos, ...args);
                break;
            default:
                break;
        }
    }
    return modifiedRepos;
}

export function repos_cohort_processed_BaseCohorts(repos){
    return createCohortColumns(repos, [
        //// created calculated columns used in cohorts ////
        {"addYearToRepos":[]},
        {"addAgeInDaysCol":[]},
        {"addDaysSinceCols":["updated_at","cohort_daysSinceUpdated"]},
        {"parseColumnsIntoIntegersFromStrings":["commit_stats.total_commits", "commit_stats.total_committers","commit_stats.mean_commits", "commit_stats.dds"]},
        {"createRatioColumn":["stargazers_count","commit_stats.total_committers","ratio_stargazersToCommitters"]},
        {"createRatioColumn":["stargazers_count","forks_count","ratio_stargazersToForks"]},
        {"createRatioColumn":["subscribers_count","commit_stats.total_committers","ratio_watchersToCommitters"]},
        //// sample or demo or example cohorts ////
        {"createCohortStringListPossibleValues":["full_name", "cohort_sample_fullName", ["sample","demo","example","tutorial"]]},
        {"createCohortStringListPossibleValues":["description", "cohort_sample_Description", ["sample","demo","example","tutorial"]]},
        {"createCohortIfEitherColumnIsTrue":["cohort_sample_fullName", "cohort_sample_Description", "cohort_sample"]},
        //// committer community size cohorts ////
        {"createCohortNumericalCol":["commit_stats.total_committers", "cohort_committers_NonZero", 0.2,100000]},
        {"createCohortNumericalCol":["commit_stats.total_committers", "cohort_committers_1-20", 0.2,20.5]},
        {"createCohortNumericalCol":["commit_stats.total_committers", "cohort_committers_20-100", 20.5,100.5]},
        {"createCohortNumericalCol":["commit_stats.total_committers", "cohort_committers_100plus", 100.5,10000000]},
        //// age cohorts ////
        {"createCohortNumericalCol":["age_in_days", "cohort_age_baby30d", 0,30]},
        {"createCohortNumericalCol":["age_in_days", "cohort_age_toddler30to90d", 30,90]},
        {"createCohortNumericalCol":["age_in_days", "cohort_age_teen90to365d", 90,365]},
        {"createCohortNumericalCol":["age_in_days", "cohort_age_adult365to1095d", 365,1095]},
        {"createCohortNumericalCol":["age_in_days", "cohort_age_seniorMore1095d", 1095,100000000000000]},
        ////
    ])
}

export function get_list_of_cohort_columns(repos){
    const cohortColumns = Object.keys(repos[0]).filter((col) => col.includes("cohort_"));
    return cohortColumns;
}

export function cohort_column_state(cohortColumns) {
    const state = {};
    cohortColumns.forEach((column) => {
        state[column] = "false";
    });
    return state;
}


export function button_cohort_filter(repos_cohort_processed, cohort_columns, cohort_columns_state, divId) {
    const createButton = (columnName, text, backgroundColor = "#5362a1", textColor = "#ffffff") => {
        const button = document.createElement("button");
        button.className = "button-cta";
        button.id = columnName;
        // button.style.color = textColor;
        button.innerText = text;
        button.style.padding = "0.5rem"; // Add padding of 1rem on all sides
        button.style.border = "0.3rem solid black"; // Add border of 1rem with solid black color
        button.dataset.state = "true"; // Set the initial state of the button to true
        button.addEventListener("click", () => {
            console.log('button clicked')
            // const selectedColumns = cohort_columns.slice(0, index + 1);
            //     return selectedColumns.every((column) => repo[column]);
            // });
            button.dataset.state = button.dataset.state === "true" ? "false" : "true"; // Toggle the state
            // button.dataset.state = currentState; // Set the button's state
            // const columnName = button.innerText.toLowerCase();
            const columnName = button.id;
            cohort_columns_state[columnName] = button.dataset.state; 
            if (button.dataset.state === "false") {
                button.style.background = "gray"; // Change background color to gray
            } else {
                button.style.background = backgroundColor; // Reset background color
            }
        });
        if (button.dataset.state === "false") {
            button.style.background = "gray"; // Change background color to gray
        } else {
            button.style.background = backgroundColor; // Reset background color
        }
        return button;
    }

    const buttons = cohort_columns.map((column) => {
        const buttonText = column.replace("cohort_", "");
        return createButton(column, buttonText);
    });

    const divElement = document.getElementById(divId);
    buttons.forEach((button) => {
        divElement.appendChild(button);
    });

    // return cohort_columns_state;
}

// import {Tabulator} from "https://cdn.jsdelivr.net/npm/tabulator-tables/+esm";

export function filter_repos_by_cohort(repos, cohort_columns_state) {
    const selectedColumns = Object.keys(cohort_columns_state).filter((column) => cohort_columns_state[column] === 'true');
    const filtered_repos = repos.filter((repo) => {
        return selectedColumns.every((column) => repo[column] === true);
    });
    console.log("selectedColumns = ", selectedColumns, "filtered_repos = ", filtered_repos);
    // var table = new Tabulator("#test-2", {
    //     data:filtered_repos, //assign data to table
    //     autoColumns:true,//create columns from data field names
    //     columns:[{title:"full_name", field:"full_name", frozen:true}]
    // });
//    
    const preElement = document.getElementById("test-2");
    preElement.innerHTML = JSON.stringify(filtered_repos.length, null, 2);
    if(filtered_repos.length < 10){
        const preElement2 = document.getElementById("test-3");
        preElement2.innerHTML = JSON.stringify(filtered_repos, null, 2);
    }
    else {
        const preElement2 = document.getElementById("test-3");
        preElement2.innerHTML = JSON.stringify("too long", null, 2);
    }
    
}

export function addFilterButton(repos, cohort_columns_state) {
    const button = document.createElement("button");
    button.innerText = "Filter Repos";
    button.addEventListener("click", () => {
        filter_repos_by_cohort(repos, cohort_columns_state);
    });
    const divElement = document.getElementById("button-container");
    divElement.appendChild(button);
}







// NEED TO BE ABLE TO SELECT MULTIPLE COHORTS OF THE SAME TYPE WHICH IS HARD TO DO SO WITH JUST TRUE AND FALSE

// HOW TO EFFECIENTLY SAY A or B or C of category 1 and D or E or F of category 2
///// Does the row have true for one of these columns... and true for one of these columns.....
////// Groups of cohorts are always "or" and "and" between groups of cohorts
////// So instead of a list of columns...have them be a object of colummns based on cohort groups...
////// cohort_text_sample, cohort_text_demo, etc. 
////// cohort_age, cohort_committers, etc. groups in object of 
////// {"cohort_age":{"cohort_age_baby30d":true, "cohort_age_toddler30to90d":true}, "cohort_committers":{"cohort_committers_20-100":true, "cohort_committers_100plus":true}}
////// And for each top-level group... use OR....and betweeen use AND.....by
////// filtering original repos dataset by each group using OR, then finding intersection
////// Negative of this approach is you can only use AND and not OR between cohort groups...






// export const repos_cohort_processed = createCohortColumns(repos, [
//     {"addYearToRepos":[]},
//     {"addAgeInDaysCol":[]},
//     {"parseColumnsIntoIntegersFromStrings":["commit_stats.total", "commit_stats.mean", "commit_stats.dds"]},
//     {"createCohortNumericalCol":["commit_stats.total_committers", "committersNonZero", 0.2,100000]},
//     {"createCohortNumericalCol":["commit_stats.total_committers", "committers1-20", 0.2,20.5]},
//     {"createCohortNumericalCol":["commit_stats.total_committers", "committers20-100", 20.5,100.5]},
//     {"createCohortNumericalCol":["commit_stats.total_committers", "committers100plus", 100.5,10000000]}
// ])


// // =======

// const reposWithYear = repos.map((repo) => {
//     const createdAt = new Date(repo.created_at);
//     const year = createdAt.getUTCFullYear();
//     const updatedRepo = { ...repo, created_at_year: year };
  
//     for (const key in updatedRepo) {
//       if (key.includes("commit_stats.total") || key.includes("commit_stats.mean") || key.includes(" commit_stats.dds")  ) {
//         updatedRepo[key] = parseInt(updatedRepo[key]);
//       }
//     }
//     return updatedRepo;
//   });
  
//   function createCohort(data, column, cohortColName, baseThreshold, topThreshold) {
//     return data.map((item) => {
//       if (item[column] > baseThreshold && item[column] < topThreshold) {
//         return { ...item, [cohortColName]: true };
//       } else {
//         return { ...item, [cohortColName]: false };
//       }
//     });
//   }
  
//   function filterData(data, columnName, trueOrFalse) {
//     return data.filter((item) => item[columnName] === trueOrFalse);
//   }
  
//   const reposWithMoreCols_A = createCohort(reposWithYear,"commit_stats.total_committers", "committersNonZero", 0.2,100000)
  
//   const reposWithMoreCols_B = createCohort(reposWithMoreCols_A,"commit_stats.total_committers", "committers1-20", 0.2,20.5)
//   const reposWithMoreCols_C = createCohort(reposWithMoreCols_B,"commit_stats.total_committers", "committers20-100", 20.5,100.5)
//   const reposWithMoreCols_D = createCohort(reposWithMoreCols_C,"commit_stats.total_committers", "committers100plus", 100.5,10000000)
  
//   const reposFinalAfterCohorts = reposWithMoreCols_D
  