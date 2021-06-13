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
    <div
      css={css`
        * {
          color: white;
        }
        width: 85%;
        /* max-width: 1200px; */
        /* margin: auto; */
        margin-bottom: 25px;
        margin-right: 5%;
        margin-left: 5%;
        text-align: left;
      `}
    >
      <h2>{props.title}</h2>
      <h2
        css={css`
          text-align: left;
          font-size: 14px;
        `}
      >
        {props.abstract}
      </h2>
    </div>
  );
}

export default function Home({ data }) {
  let papers = data.allPaperDataJson.edges;
  papers = papers.slice(0, 7);

  console.log(papers);

  return (
    <div
      css={css`
        background-color: ${color.gray12};
        min-height: 100vh;
        color: white;
        text-align: center;
      `}
    >
      <Helmet>
        <title>My title</title>
      </Helmet>
      <h1>Hello, world!</h1>
      <Latex>
        The center of the universe is at $5+4$. One can also do something like
        $5+4$.
      </Latex>
      {/* TODO: link to github/license */}
      <div
        css={css`
          display: grid;
          grid-template-columns: 256px calc(100% - 256px);
          /* grid-gap: max(5%, 20px); */
        `}
      >
        <div
          css={css`
            background-color: ${color.dark.blue2};
            color: white;
            grid-row: 1;
            grid-column: 1;
            height: 100vh;
            overflow-y: auto;
            position: sticky;
            top: 0px;
          `}
        >
          Here is the sidebar
          <Button type="primary">Hello, world</Button>
        </div>
        <div
          css={css`
            grid-row: 1;
            grid-column: 2;
          `}
        >
          {papers.map((paper: { node: PaperData }) => (
            <Paper key={paper.node.id} {...paper.node} />
          ))}
        </div>
      </div>
      <footer
        css={css`
          padding-top: 15px;
          padding-bottom: 15px;
          background-color: green;
        `}
      >
        Built by Matt Deitke | MIT License
      </footer>
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
