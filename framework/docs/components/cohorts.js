



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
        {"createCohortStringListPossibleValues":["full_name", "cohort_Sample_fullName", ["sample","demo","example","tutorial"]]},
        {"createCohortStringListPossibleValues":["description", "cohort_Sample_Description", ["sample","demo","example","tutorial"]]},
        {"createCohortIfEitherColumnIsTrue":["cohort_Sample_fullName", "cohort_Sample_Description", "cohort_Sample"]},
        //// committer community size cohorts ////
        {"createCohortNumericalCol":["commit_stats.total_committers", "cohort_committersNonZero", 0.2,100000]},
        {"createCohortNumericalCol":["commit_stats.total_committers", "cohort_committers1-20", 0.2,20.5]},
        {"createCohortNumericalCol":["commit_stats.total_committers", "cohort_committers20-100", 20.5,100.5]},
        {"createCohortNumericalCol":["commit_stats.total_committers", "cohort_committers100plus", 100.5,10000000]},
        //// age cohorts ////
        {"createCohortNumericalCol":["age_in_days", "cohort_age_baby30d", 0,30]},
        {"createCohortNumericalCol":["age_in_days", "cohort_age_toddler30to90d", 30,90]},
        {"createCohortNumericalCol":["age_in_days", "cohort_age_teen90to365d", 90,365]},
        {"createCohortNumericalCol":["age_in_days", "cohort_age_adult365to1095d", 365,1095]},
        {"createCohortNumericalCol":["age_in_days", "cohort_age_seniorMore1095d", 1095,100000000000000]},
        ////
    ])
}



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
  