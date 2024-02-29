# repo_data_experiment
This repository was an experiment for grabbing metadata about open source code 
repositories across entire GitHub organizations with the idea that the data could be 
used as the dataset of a Houston Data Visualization meetup Saturday data jam, which 
it was on Saturday February 17th, 2024. 

## Structure of this repository
At a high level this repository is broken into 3 parts: 
1. The `data` directory holds the collected data. 
2. The `src` directory holds the python code used to harvest the data via the Ecosyste.ms API.
3. The `framework` directory holds a quick experiment using the new Observable Framework library to create a static page that visualizes the data briefly. 

There's also a index.html at the top level for quickly inspecting the data CSVs.

## Data

*The datasets can potentially be used in a Houston Data Jam.*

### Example datasets
#### data/nasa_repos.json

This data file was created by grabbing all the NASA repositories that Ecosyste.ms has data on (not every repository) 
for the NASA organization on GitHub.com. Approximately 270 repositories, so not every repository. The ones with 
low engagement are probably the skipped ones. 

#### data/nasa_repos_flat.csv 

This is the same data as in `data/nasa_repos.json` but flattened into a CSV using the `flattenJSON()` function in `src/main.py`.

The CSV can be seen in an easy to see formatted manner on github.com direct link: https://github.com/JustinGOSSES/repo_data_experiment/blob/main/data/nasa_repos_flat.csv

#### combined_org_data/all_orgs_merged_20240120.csv

The `all_orgs_merged_20240120.csv` file has 1111 repositories from the GitHub organizations 
nasa, CMSgov, airbnb, houstondataviz, home-assistant, NationalSecurityAgency.

These organizations were selected as they represented organizations with different histories or patterns of how they use GitHub 
for open source. 

[The NASA GitHub organization](https://github.com/nasa) has a comparably longer history on GitHub for a 
government organization. They also have more than normal suspect pattern of "publishing" code that then 
quickly has not other development happening with it due to the culture of 
"publishing" papers, reports, etc. that exists in the organization. 

[NationalSecurityAgency](https://github.com/NationalSecurityAgency) is the GitHub organization of 
the US government's National Security Agency or NSA. It has a more narrow scope of the 
type and reasons for open source and less suspected tendency to drop repositories without continued development. 

[Home-assistant is an extremely popular open source home automation](https://github.com/home-assistant) collection of products and tools with expected extremely diverse and large contribution community. 
The GitHub organization ~ the product ~ the people organization. 

[AirBnB is a tech company](https://github.com/airbnb) founded as a digital first company. They also have an engineering blog and a record of contributing 
open source used by others in some cases. 

[houstondataviz is the GitHub organization](https://github.com/houstondatavis) used by the Houston DataViz Meetup. Most of the use is associated with 
brief one-time only data jams as opposed to being repositories of products, tools, packages, websites, etc. 

[CMSgov is the GitHub Organization](https://github.com/CMSgov) of the Centers for Medicare & Medicaid Services. 
It is suspect to not have as long of a history on GitHub compared to NASA with more of a focus on 
actual products and services run by the organization with GitHub being used in part as a way to make it others 
to use, build upon, and contribute to the code bases. 

See the combined CSV as an HTML table here: https://justingosses.github.io/repo_data_experiment/

## Why repository metadata?

This work is motivated by the idea that a lot of understanding of open source 
presence and activity is prevented by the need to manually read so many repositories. 

### Context

There are times when it is useful to be able to generate high level descriptions of the types of 
repositories in an organization. This can be useful to compare the types of open source an 
organization releases. It can also be useful for the organizations as it helps to identify 
repositories that are highly used, build packages, are primarily samples, or any of a variety of 
other "repository types" that otherwise require a person to manually read the repository to figure out
what is there, a task that isn't possible with hundreds or thousands of repositories. 

### Purpose of this experiment

The purpose of this repository is to test out functionality and performance of 
using ecosyte.ms API for gathering repository metrics on all the repositories in an 
organization. 

In past efforts to do this, I have used the GitHub API to gather data on an entire organization
as seen in https://github.com/JustinGOSSES/awesome-list-visual-explorer-template/
but for large organizations in hundreds of organizations it would take dozens of minutes to 
gather all the data. 

## Early results so far...

#### Ecosyste.ms API does not have data on all repositories in an organization

Ecosyst.ms [has 270 repositories](https://repos.ecosyste.ms/hosts/GitHub/owners/nasa) while the 
[number of repositories in the GitHub organization is 504.](https://github.com/orgs/nasa/repositories)

It seems likely based on the repositories that are captured in ecosyste.ms are limited to those that are
more active or used in terms of being source for package, stars, forks, etc. which makes sense as ecosyste.mss
might be trying to ignore the repositories without engagement that make up the bulk of the repositories on GitHub. 

#### Speed of getting data for Ecosyste.ms is far better than GitHub API past experience

Gathering basic repository metrics for the 270 repositories that Ecosyste.ms has took a couple seconds. 
Previous experiences with the scripts on https://github.com/JustinGOSSES/awesome-list-visual-explorer-template/
was dozens of minutes.

### Does ecosyste.ms repository API results have the right data to construct repository cohorts?

Repository cohorts is a concept that forms the basis of a talk that has been submitted to the 
Open Source Summit North America Conference. 

It refers to the idea that it can be advantageous to have pre-calculated cohorts of repositories identified 
based on threshold boundaries across key data dimensions. 

#### Repository cohort categories 

These are potential thresholds you might use to create categorical data from continuous data. 

##### Age
- Age: [YES, CAN CREATE WITH ECOSYSTE.MS]
  - baby: 0-30 days
  - toddler: 31-90 days
  - teen:91-365 days
  - adult: 366 - 1095 
  - senior: >1095 

##### Activity

- Last update in days: [YES, CAN CREATE WITH ECOSYSTE.MS]
  - past 7 days
  - past 8-30 days
  - past 31-90 days
  - past 90-365 days
  - past 366-730 days
  - past 731 + days

- Number of commits in past 90 days: [NOT WITH FIRST SET OF API RESULTS?????? MAYBE REPO API ENDPOINT]
  - 0
  - 1-10
  - 11-200
  - 200+

##### Community

- Size of contributor community [NOT WITH FIRST SET OF API RESULTS?????? MAYBE REPO API ENDPOINT]
  - 1
  - 2-4
  - 5-10
  - 10-75
  - 76+

- External vs. internal contributors (probably not possible in this context)

- Ehgbal type community types: [YES, CAN CREATE WITH ECOSYSTE.MS]
  - toys (small size and low ratio of watches/stars are contributors)
  - clubs (small size and high ratio of watches/stars are contributors)
  - federation (large size and high ratio of watches/stars are contributors)
  - stadium (large size and low ratio of watches/stars are contributors)

##### Content

- GitHub Actions [YES, CAN CREATE WITH ECOSYSTE.MS]
  - True
  - False

- Samples [YES, with more work]
  - True (based on seeing works like 'sample', 'demo', 'example' in org name or repo name)
  - False


### Potential questions for Houston Data Viz Meetup Data Jam
1. How would you quickly summarize how each of these organizations' open source presence?
2. What repositories are most impactful for each organization? What metrics could you pick for 'impact'?
3. What are dimensions you might use to group similar organizations across GitHub? For example, how would you find all the organizations that are apparently trying to do similar things with their open source presence as the National Security Administration?
4. What organization is most similar to CMSgov and why?
5. Make a visualization that summarizes for management the organization's open source presence in order to give them a quick overview of the ways the GitHub organization is used and benefits for individuals and organization?

Or whatever you want to answer or try.


## Installation of Python virtual environment.

Clone repository: 

1. Run in terminal `git clone https://github.com/JustinGOSSES/repo_data_experiment.git`
2. `cd repo_data_experiment`

Only basic python packages are used (pandas, requests, etc.) so you existing base environment might be fine.
However, best practice is to you virtual environments.

### Using conda

1. Create a new conda environment:
    ```shell
    conda create --name myenv
    ```

2. Activate the environment:
    ```shell
    conda activate myenv
    ```

3. Install the required packages from the requirements.txt file:
    ```shell
    conda install --file requirements.txt
    ```

### Using virtualenv

1. Create a new virtual environment:
    ```shell
    python -m venv myenv
    ```

2. Activate the environment:
    - On Windows:
      ```shell
      myenv\Scripts\activate
      ```
    - On macOS and Linux:
      ```shell
      source myenv/bin/activate
      ```

3. Install the required packages from the requirements.txt file:
    ```shell
    pip install -r requirements.txt
    ```
## Usage (getting more data and processing data)

### Getting data from another GitHub organization on the subset of repositories that Ecosyste.ms API has data on

In a terminal, call the functions like this replacing the string after --orgName, in this case `houstondatavis`.

`Python src/main.py --orgName houstondatavis --function call_api`

### Flattening the JSON that is returned in the last step into a flat CSV to make it easier to work with the data
In a terminal, call the functions like this replacing the strings after --inputFilePath and after --outputFilePath.

`Python src/main.py --inputFilePath data/houstondatavis_repos.json --outputFilePath data/houstondatavis_repos_flat.csv  --function flattenJSON`

### Creating a combined CSV files of all the org specific CSV files.

`Python src/main.py --folderPathToLookForCSVsToMerge data --outputFilePath data/combined_org_data/all_orgs_merged_20240120.csv  --function mergeMultipleOrgCSV`

See the `src/main.py` file for how this all works.

### Quickly checking out the data visually 
There is a top-level `index.html` page which when stood up and viewed in a browser or as a GitHub pages page
will make it easy to see all the columns and the amount of empty cells. 

I have the node.js program `http-server` [installed globally](https://www.npmjs.com/package/http-server) 
so I start up a local server like `http-server` and then 
navigate to `http://127.0.0.1:8080/` in a browser. A python option that does the same thing 
is [http.server](https://docs.python.org/3/library/http.server.html)
The GitHub pages URL is [https://justingosses.github.io/repo_data_experiment/](https://justingosses.github.io/repo_data_experiment/)
