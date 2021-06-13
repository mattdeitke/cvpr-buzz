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
          color: black;
        }
        width: 100%;
        /* max-width: 1200px; */
        /* margin: auto; */
        /* margin-bottom: 25px; */
        text-align: left;
        /* background-color: white; */
        padding: 30px 0px;
        /* box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1); */
        border-bottom: 1px solid ${color.gray5};
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
  // papers = papers.slice(0, 150);

  console.log(papers);

  return (
    <div
      css={css`
        background-color: ${color.gray1};
        min-height: 100vh;
        color: white;
        text-align: center;
      `}
    >
      <Helmet>
        <title>My title</title>
      </Helmet>
      {/* <header
        css={css`
          box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.15);
          padding-top: 10px;
          padding-bottom: 10px;
          position: relative;
          z-index: 99 !important;
        `}
      >
        <h2>Hello, world!</h2>
        <Latex>
          The center of the universe is at $5+4$. One can also do something like
          $5+4$.
        </Latex>
      </header> */}
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
            background-color: ${color.dark.blue1};
            color: white;
            grid-row: 1;
            grid-column: 1;
            height: 100vh;
            overflow-y: auto;
            position: sticky;
            top: 0px;
            padding: 20px 15px;
            text-align: left;
          `}
        >
          Here is the sidebar
          <br />
          <Button type="primary">Hello, world</Button>
        </div>
        <div
          css={css`
            grid-row: 1;
            grid-column: 2;
          `}
        >
          <div
            css={css`
              /* background-color: white; */
              margin-right: 5%;
              margin-left: 5%;
              margin-top: 25px;
              margin-bottom: 85px;
              text-align: left;
            `}
          >
            <h1
              css={css`
                text-align: left;
                font-weight: 600;
              `}
            >
              CVPR Buzz{" "}
              <span
                css={css`
                  font-weight: normal;
                `}
              >
                (2021)
              </span>
            </h1>
            <h3>2021</h3>
            {papers.map((paper: { node: PaperData }) => (
              <Paper key={paper.node.id} {...paper.node} />
            ))}
          </div>
        </div>
      </div>
      <footer
        css={css`
          padding-top: 15px;
          padding-bottom: 15px;
          background-color: #182430;
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
