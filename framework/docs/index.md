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


<div class="hero">
  <h1>Houston Data Jam</h1>
  <h2>Visualizing metadata about hundreds of repositories using data sourced from Ecosyste.ms API</h2>
</div>


## The dataset is metadata about open source code repositories. 

Historically, you would have to read code repositories to find out what is in them. 
This obviously doesn't scale to hundreds or thousands of repositories in a single 
GitHub organization, let along many organizations. And as a result, there's certain 
classes of insights that come from analyzing GitHub organizations at scale that 
few people every do as it was too much of a pain to get the data. 

While the GitHub API lets you grab metadata about repositories, it is typically 
very pinpoint information and only one little piece at a time. 
The recent advancement in this space is there are starting to be more APIs that 
provide pre-aggregated repository-level metadata in a single API call. 
[Ecosyste.ms](https://ecosyste.ms/) is one example that is used in this data jam.
This lets you get a description of hundreds of repositories across an GitHub
organization in seconds instead what previously took hours. 

## The dataset today is a flattened CSV of several different Organizations on GitHub. 

### Harvesting more data
The `src` folder holds the python code used to call the ecosyste.ms API. 
You can use that to collect more data or adapt it in your preferred language. 
Ecosyste.ms also has a webpage where some information can be accessed via GUI.

### Pre-harvested data
The `data` directory holds the pre-gathered data for the data jam. 
The data is returned from the API calls in JSON format. We've also created a 
flattened and merged CSV in the `combined_org_data` subdirectory. The merged and 
flattened `all_orgs_merged_20240120.csv` file is probably the easiest place to start 
if you want to focus on data visualization today. 
