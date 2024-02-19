




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

function parseColumnsIntoIntegersFromStrings(repos, arrayOfKeys) {
    for (const key in repos) {
        for (const column of arrayOfKeys) {
            if (key.includes(column)) {
                repos[key] = parseInt(repos[key]);
            }
        }
    }
    return repos;
}

function createCohortNumericalCol(data, column, cohortColName, baseThreshold, topThreshold) {
    return data.map((item) => {
      if (item[column] > baseThreshold && item[column] < topThreshold) {
        return { ...item, [cohortColName]: true };
      } else {
        return { ...item, [cohortColName]: false };
      }
    });
}
  
function createCohortStringSingleVal(data, column, cohortColName, valueList) {
    return data.map((item) => {
      if (valueList.includes(item[column])) {
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
            case "parseColumnsIntoIntegersFromStrings":
                modifiedRepos = parseColumnsIntoIntegersFromStrings(modifiedRepos, args);
                break;
            case "createCohortNumericalCol":
                modifiedRepos = createCohortNumericalCol(modifiedRepos, ...args);
                break;
            case "createCohortStringSingleVal":
                modifiedRepos = createCohortStringSingleVal(modifiedRepos, ...args);
                break;
            default:
                break;
        }
    }
    return modifiedRepos;
}

export const repos_cohort_processed = createCohortColumns(repos, [
    {"addYearToRepos":[]},
    {"addAgeInDaysCol":[]},
    {"parseColumnsIntoIntegersFromStrings":["commit_stats.total", "commit_stats.mean", "commit_stats.dds"]},
    {"createCohortNumericalCol":["commit_stats.total_committers", "committersNonZero", 0.2,100000]},
    {"createCohortNumericalCol":["commit_stats.total_committers", "committers1-20", 0.2,20.5]},
    {"createCohortNumericalCol":["commit_stats.total_committers", "committers20-100", 20.5,100.5]},
    {"createCohortNumericalCol":["commit_stats.total_committers", "committers100plus", 100.5,10000000]}
])


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
  