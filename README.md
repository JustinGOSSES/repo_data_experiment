# repo_data_experiment
An experiment for grabbing repository data in preparation for analysis of the type of open source repositories an organization has under it.

There are two potential uses of data in this repository: 
1. Used in a Houston Data Visualization meetup Data Jam
2. Gathering public data for a potential future talk on repository cohorts.

## Data

*The datasets can potentially be used in a Houston Data Jam.*

### nasa_repos.json

This data file was created by grabbing all the NASA repositories that Ecosyste.ms has data on (not every repository) 
for the NASA organization on GitHub.com. Approximately 270 repositories. 
It used the `call_api()` function in the `src/api.py` file.
The function was called by running in a terminal located at the top of the repository ` Python src/api.py`.
At the time, the organization being `nasa` was hardcoded into the code.

### nasa_repos_flat.csv 

This is the same data as in `data/nasa_repos.json` but flattened into a CSV using the `flattenJSON()` function in `src/main.py`.
The function was called by running in a terminal located at the top of the repository `Python src/main.py`.
At the time, the applicable file paths were hardcoded into the code.

The CSV can be seen in an easy to see formatted manner on github.com direct link: https://github.com/JustinGOSSES/repo_data_experiment/blob/main/data/nasa_repos_flat.csv


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

##### Age
- Age: [YES, CAN CREATE WITH ECOSYSTE.MS]
  - baby: 0-30 days
  - toddler: 31-90 days
  - teen:90-365 days
  - adult: 366 - 730 

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
## Usage

### Getting data from another GitHub organization on the subset of repositories that Ecosyste.ms API has data on

In a terminal, call the functions like this replacing the string after --orgName, in this case `houstondatavis`.

`Python src/main.py --orgName houstondatavis --function call_api`

### Flattening the JSON that is returned in the last step into a flat CSV to make it easier to work with the data
In a terminal, call the functions like this replacing the strings after --inputFilePath and after --outputFilePath.

`Python src/main.py --inputFilePath data/houstondatavis_repos.json --outputFilePath data/houstondatavis_repos_flat.csv  --function flattenJSON`