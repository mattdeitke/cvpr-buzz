# CVPR Buzz

## Dataset

Scraping code is in `tasks.py`. Data is cached on the website, which makes it extremely fast to use with GraphQL, and allows us to rely on fewer dependencies.

### CVPR Accepted Papers

The accepted papers and their abstracts are extracted from [CVPR](https://openaccess.thecvf.com/CVPR2021?day=all).

### Citation Data

Citation data comes from [Semantic Scholar](https://semanticscholar.org). There is no easy way to get go from the paper title to Semantic Scholar's paper ID (i.e., it's not possible from the API). So we just search for it with Selenium and apply a few checks to see if it's the same paper.

This may take an hour or so to get through all the papers. There are also occasional hit limits where you may have to pick up from a point. Thus, one may need to monitor the window that opens. (It's possible to automate this by checking for the existence of certain elements on the screen, though I haven't been bothered enough by it to implement this.)

With the paper ID, we can then use [Semantic Scholar's API](https://api.semanticscholar.org/) to easily fetch the number of citations for the paper.

### Twitter

[Twint](https://github.com/twintproject/twint) is used to fetch the engagement for each paper on Twitter. We currently use 2 queries:

1. Searches for the title of the paper in quotes (e.g., ["VirTex: Learning Visual Representations From Textual Annotations"](https://twitter.com/search?q=%22VirTex%3A%20Learning%20Visual%20Representations%20From%20Textual%20Annotations%22&src=typed_query&f=live)). Paper titles are unique enough that I've found it extraordinarily rare for there to be a tweet with the title of a paper, and it not actually being about the paper.
2. Search for where the arXiv URL has been shared in quotes (e.g., ["arxiv.org/abs/2006.06666"](https://twitter.com/search?q=arxiv.org%2Fabs%2F2006.06666&src=typed_query&f=live)).

I'm considering also supporting the ability to add tweets manually (which aren't caught in the above criteria) and add the statistics from direct replies and quote tweets, though I haven't gotten around to it.

Each unique tweet is only counted once.

### GitHub Stars

We search the abstract

## Local Development

TODO.
