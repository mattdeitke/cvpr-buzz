import React from "react";
import Latex from "react-latex";
import { Button } from "antd";
import { Helmet } from "react-helmet";
import { css } from "@emotion/react";
import color from "~styles/color";
import { graphql } from "gatsby";

interface PaperData {
  abstract: string;
  citations: number;
  title: string;
  twitter: {
    likes: number;
    replies: number;
    retweets: number;
  };
  id: number;
  s2id: string;
  pdf: string;
  authors: string[];
  arXiv: string;
}

function Paper(props: PaperData) {
  return (
    <div>
      <h2>{props.title}</h2>
      <h2>{props.pdf}</h2>
    </div>
  );
}

export default function Home({ data }) {
  let papers = data.allPaperDataJson.edges;
  papers = papers.slice(0, 5);

  console.log(papers);

  return (
    <div>
      <Helmet>
        <title>My title</title>
      </Helmet>
      <h1>Hello, world!</h1>
      <Latex>
        The center of the universe is at $5+4$. One can also do something like
        $5+4$.
      </Latex>
      {papers.map((paper: { node: PaperData }) => (
        <Paper key={paper.node.id} {...paper.node} />
      ))}
      <br />
      <br />
      <Button type="primary">Hello, world</Button>
      <div
        css={css`
          color: ${color.light.blue6};
          &:hover {
            background-color: green;
          }
        `}
      >
        Hello, world
      </div>
      <br />
      <br />
    </div>
  );
}

export const query = graphql`
  {
    allPaperDataJson {
      edges {
        node {
          abstract
          citations
          title
          twitter {
            likes
            replies
            retweets
          }
          id
          s2id
          pdf
          authors
          arXiv
        }
      }
    }
  }
`;
