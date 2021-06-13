import React, { useState } from "react";
import Latex from "react-latex";
import {
  Button,
  Radio,
  Space,
  Checkbox,
  Select,
  Tooltip,
  Input,
  Slider,
  InputNumber,
  Row,
  Col,
} from "antd";
import { Helmet } from "react-helmet";
import { css } from "@emotion/react";
import color from "~styles/color";
import { graphql } from "gatsby";
import { Emoji } from "emoji-mart";
import { MenuFoldOutlined } from "@ant-design/icons";

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
  i?: number;
}

function DecimalStep(props: { startingValue: number }) {
  const [inputValue, setInputValue] = useState(props.startingValue);
  return (
    <Row>
      <Col span={12}>
        <Slider
          min={0}
          max={1}
          onChange={(value: number) => {
            if (isNaN(value)) {
              return;
            }
            setInputValue(value);
          }}
          value={typeof inputValue === "number" ? inputValue : 0}
          step={0.01}
          tooltipVisible={false}
        />
      </Col>
      <Col
        span={4}
        css={css`
          margin-top: -12px;
        `}
      >
        <InputNumber
          min={0}
          max={1}
          style={{ margin: "0 16px" }}
          step={0.01}
          value={inputValue}
          onChange={(value: number) => {
            if (isNaN(value)) {
              return;
            }
            setInputValue(value);
          }}
        />
      </Col>
    </Row>
  );
}

function Paper(props: PaperData) {
  return (
    <div
      css={css`
        * {
          color: black;
        }
        width: 100%;
        text-align: left;
        padding: 30px 0px;
        border-bottom: 1px solid ${color.gray5};
      `}
    >
      <div
        css={css`
          position: relative;
          margin-bottom: 2px;
        `}
      >
        <div
          css={css`
            display: inline-block;
            width: 100px;
            position: absolute;
            left: -110px;
            text-align: right;
            top: 2px;
          `}
        >
          <div
            css={css`
              font-weight: normal;
              text-align: right !important;
              font-size: 18px;
            `}
          >
            [{props.i + 1}]
          </div>
        </div>
        <h2
          css={css`
            font-weight: 600;
            margin-bottom: 0px;
          `}
        >
          {props.title}
        </h2>
      </div>
      <h4
        css={css`
          font-size: 15px;
          color: ${color.gray8};
          margin-bottom: 3px;
        `}
      >
        {props.authors.join(", ")}
      </h4>
      <p
        css={css`
          text-align: left;
          font-size: 14px;
        `}
      >
        {props.abstract}
      </p>
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
            padding: 15px 15px;
            text-align: left;
            * {
              color: white;
            }
          `}
        >
          <div
            css={css`
              font-weight: 600;
              margin-bottom: 8px;
              text-align: left;
              font-size: 16px;
              margin-bottom: 15px;
            `}
          >
            <span
              css={css`
                .emoji-mart-emoji {
                  vertical-align: middle;
                }
              `}
            >
              <Emoji emoji="bee" size={18} /> CVPR Buzz{" "}
              <span
                css={css`
                  font-weight: normal;
                `}
              >
                - 2021
              </span>
            </span>
            <MenuFoldOutlined
              css={css`
                float: right;
                margin-top: 5px;
                font-size: 18px;
                * {
                  color: ${color.dark.geekblue8} !important;
                }

                &:hover {
                  cursor: pointer;
                }
              `}
            />
          </div>
          <div
            css={css`
              font-weight: 600;
              margin-bottom: 10px;
              margin-top: 30px;
            `}
          >
            Sorting Weights
          </div>
          <div
            css={css`
              > div {
                margin-bottom: 0px;
                * {
                  color: black;
                }
                > div:nth-child(1) {
                  color: white !important;
                  margin-bottom: -8px;
                  /* display: inline-block; */
                }
              }
            `}
          >
            <div>
              <div>Citations:</div> <DecimalStep startingValue={1} />
            </div>
            <div>
              <div>Retweets:</div> <DecimalStep startingValue={0.5} />
            </div>
            <div>
              <div>Favorites:</div> <DecimalStep startingValue={0.5} />
            </div>
            <div>
              <div>Replies:</div> <DecimalStep startingValue={0.5} />
            </div>
          </div>
          <div
            css={css`
              font-weight: 600;
              margin-bottom: 3px;
              margin-top: 30px;
            `}
          >
            Poster Session
          </div>
          <div
            css={css`
              > div {
                margin-bottom: 3px;
              }
            `}
          >
            <div>
              <Checkbox>Monday</Checkbox>
            </div>
            <div>
              <Checkbox>Tuesday</Checkbox>
            </div>
            <div>
              <Checkbox>Wednesday</Checkbox>
            </div>
            <div>
              <Checkbox>Thursday</Checkbox>
            </div>
            <div>
              <Checkbox>Friday</Checkbox>
            </div>
          </div>
          <div
            css={css`
              font-weight: 600;
              margin-bottom: 8px;
              margin-top: 30px;
            `}
          >
            Abstracts
          </div>
          <Radio.Group
            css={css`
              width: 100%;

              * {
                background-color: transparent !important;
                /* width: 100% !important; */
              }

              .ant-radio-button-checked {
                background-color: ${color.dark.geekblue4} !important;
                z-index: -99 !important;
              }
              .ant-radio-button-wrapper {
                &:before {
                  background-color: ${color.dark.geekblue7} !important;
                }
                border-color: ${color.dark.geekblue7} !important;
                width: 33% !important;
                text-align: center;
              }
              .ant-radio-button-wrapper-checked > span {
                color: white !important;
              }
            `}
            // value={1}
          >
            <Radio.Button value={1}>Full</Radio.Button>
            <Radio.Button value={2}>Partial</Radio.Button>
            <Radio.Button value={3}>Hide</Radio.Button>
          </Radio.Group>
          <div
            css={css`
              font-weight: 600;
              margin-bottom: 3px;
              margin-top: 30px;
            `}
          >
            Preferences
          </div>
          <div
            css={css`
              > div {
                margin-bottom: 5px;
              }
            `}
          >
            <div>
              <Checkbox>Dark Mode</Checkbox>
            </div>
            <div>
              <Checkbox>Lazy Loading</Checkbox>
            </div>
          </div>
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
              margin-bottom: 80px;
              text-align: left;
            `}
          >
            <h1
              css={css`
                text-align: left;
                font-weight: 600;
              `}
            >
              <span
                css={css`
                  .emoji-mart-emoji {
                    vertical-align: middle;
                  }
                `}
              >
                <Emoji emoji="bee" size={28} /> CVPR Buzz{" "}
              </span>
              <span
                css={css`
                  font-weight: normal;
                `}
              >
                - 2021
              </span>
            </h1>
            <h3>Built by Matt Deitke</h3>
            {papers.map((paper: { node: PaperData }, i: number) => (
              <Paper key={paper.node.id} {...paper.node} i={i} />
            ))}
          </div>
        </div>
      </div>
      {/* <footer
        css={css`
          padding-top: 15px;
          padding-bottom: 15px;
          background-color: #182430;
        `}
      >
        Built by Matt Deitke | MIT License
      </footer> */}
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
