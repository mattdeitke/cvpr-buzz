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
import { MenuFoldOutlined, GithubOutlined } from "@ant-design/icons";
import { lighten, darken } from "polished";

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
  posterSession: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
}

interface PaperComponent extends PaperData {
  i: number;
  abstractDisplayStyle: string;
}

const STARTING_WEIGHTS = {
  citations: 1,
  retweets: 0.5,
  likes: 0.25,
  replies: 0.25,
};

function Paper(props: PaperComponent) {
  const [expandAbstract, setExpandAbstract] = useState(false);

  let abstract: string | React.ReactNode;
  switch (props.abstractDisplayStyle) {
    case "full":
      abstract = props.abstract;
      break;
    case "preview":
      if (expandAbstract) {
        abstract = (
          <>
            {props.abstract}{" "}
            <span
              onClick={() => setExpandAbstract(false)}
              className="noselect"
              css={css`
                color: ${color.light.blue6};
                &:hover {
                  cursor: pointer;
                }
              `}
            >
              [Collapse]
            </span>
          </>
        );
      } else {
        abstract = (
          <>
            {props.abstract.substring(0, props.abstract.indexOf(". ") + 1)}{" "}
            <span
              onClick={() => setExpandAbstract(true)}
              className="noselect"
              css={css`
                color: ${color.light.blue6};
                &:hover {
                  cursor: pointer;
                }
              `}
            >
              [Expand]
            </span>
          </>
        );
      }
      break;
    case "hide":
      abstract = "";
      break;
    default:
      throw `No idea what ${props.abstractDisplayStyle} is! Must be in {"full", "preview", "hide"}.`;
  }

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
        {abstract}
      </p>
      <div>Poster Session: {props.posterSession}</div>
      <div>Citations: {props.citations}</div>
      {props.twitter === null ? (
        <></>
      ) : (
        <>
          <div>Likes: {props.twitter.likes}</div>
          <div>Retweets: {props.twitter.retweets}</div>
          <div>Replies: {props.twitter.replies}</div>
        </>
      )}
    </div>
  );
}

function DecimalStep(props: { inputValue: number; setInputValue; setDirty }) {
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
            props.setInputValue(value);
            props.setDirty(true);
          }}
          value={typeof props.inputValue === "number" ? props.inputValue : 0}
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
          value={props.inputValue}
          onChange={(value: number) => {
            if (isNaN(value)) {
              return;
            }
            props.setInputValue(value);
            props.setDirty(true);
          }}
        />
      </Col>
    </Row>
  );
}

function SortWeights(props: { setSortWeights }) {
  const [citationsInput, setCitationsInput] = useState(
      STARTING_WEIGHTS.citations
    ),
    [retweetsInput, setRetweetsInput] = useState(STARTING_WEIGHTS.retweets),
    [likesInput, setLikesInput] = useState(STARTING_WEIGHTS.likes),
    [repliesInput, setRepliesInput] = useState(STARTING_WEIGHTS.replies),
    [isDirty, setDirty] = useState(false);

  return (
    <>
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
            }
          }
        `}
      >
        <div>
          <div>Citations</div>{" "}
          <DecimalStep
            inputValue={citationsInput}
            setInputValue={setCitationsInput}
            setDirty={setDirty}
          />
        </div>
        <div>
          <div>Retweets</div>{" "}
          <DecimalStep
            inputValue={retweetsInput}
            setInputValue={setRetweetsInput}
            setDirty={setDirty}
          />
        </div>
        <div>
          <div>Likes</div>{" "}
          <DecimalStep
            inputValue={likesInput}
            setInputValue={setLikesInput}
            setDirty={setDirty}
          />
        </div>
        <div>
          <div>Replies</div>{" "}
          <DecimalStep
            inputValue={repliesInput}
            setInputValue={setRepliesInput}
            setDirty={setDirty}
          />
        </div>
        <Button
          css={css`
            width: 100%;
            margin-top: 8px;
            background-color: ${isDirty
              ? darken(0.1, "#7f9ef3")
              : darken(0.4, "#7f9ef3")} !important;
            filter: ${isDirty ? "saturate(1)" : "saturate(0.3)"};
            border-color: transparent !important;
            &:hover {
              cursor: ${isDirty ? "pointer" : "default"} !important;
            }
            > span {
              color: ${isDirty ? color.gray1 : color.gray4 + "aa"} !important;
            }
          `}
          onClick={() => {
            // Checks if already sorted
            if (!isDirty) {
              return;
            }

            props.setSortWeights({
              citations: citationsInput,
              retweets: retweetsInput,
              likes: likesInput,
              replies: repliesInput,
            });
            setDirty(false);
          }}
        >
          Sort
        </Button>
      </div>
    </>
  );
}

function PosterSessionDate(props: {
  date: string;
  posterSessions;
  setPosterSessions;
}) {
  return (
    <div>
      <Checkbox
        value={props.posterSessions.has(props.date)}
        onChange={() => {
          props.posterSessions.has(props.date)
            ? props.setPosterSessions((prev) => {
                prev = new Set(prev);
                prev.delete(props.date);
                return prev;
              })
            : props.setPosterSessions((prev) => {
                prev = new Set(prev);
                prev.add(props.date);
                return prev;
              });
        }}
      >
        {props.date}
      </Checkbox>
    </div>
  );
}

export default function Home({ data }) {
  let papers = data.allPaperDataJson.edges;

  const [abstractDisplayStyle, setAbstractDisplayStyle] = useState("full"),
    [foldMenu, setFoldMenu] = useState(false),
    [sortWeights, setSortWeights] = useState({
      citations: STARTING_WEIGHTS.citations,
      retweets: STARTING_WEIGHTS.retweets,
      likes: STARTING_WEIGHTS.likes,
      replies: STARTING_WEIGHTS.replies,
    }),
    [posterSessions, setPosterSessions] = useState(new Set([]));

  if (posterSessions.size !== 0) {
    papers = papers.filter((paper: { node: PaperData }) => {
      return posterSessions.has(paper.node.posterSession);
    });
  }

  papers.sort((p1: { node: PaperData }, p2: { node: PaperData }) => {
    let citations1 = p1.node.citations == null ? 0 : p1.node.citations;
    let likes1: number, retweets1: number, replies1: number;
    if (p1.node.twitter === null) {
      likes1 = 0;
      retweets1 = 0;
      replies1 = 0;
    } else {
      likes1 = p1.node.twitter.likes;
      retweets1 = p1.node.twitter.retweets;
      replies1 = p1.node.twitter.replies;
    }

    let citations2 = p2.node.citations == null ? 0 : p2.node.citations;
    let likes2: number, retweets2: number, replies2: number;
    if (p2.node.twitter === null) {
      likes2 = 0;
      retweets2 = 0;
      replies2 = 0;
    } else {
      likes2 = p2.node.twitter.likes;
      retweets2 = p2.node.twitter.retweets;
      replies2 = p2.node.twitter.replies;
    }

    return (
      sortWeights.citations * (citations2 - citations1) +
      sortWeights.likes * (likes2 - likes1) +
      sortWeights.retweets * (retweets2 - retweets1) +
      sortWeights.replies * (replies2 - replies1)
    );
  });

  // papers = papers.slice(0, 100);

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
        <title>CVPR Buzz</title>
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
          grid-template-columns: ${foldMenu
            ? "45px calc(100% - 45px)"
            : "256px calc(100% - 256px)"};
        `}
      >
        <div
          css={css`
            background-color: ${foldMenu ? "transparent" : color.dark.blue1};
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
          {foldMenu ? (
            <MenuFoldOutlined
              css={css`
                margin-top: 2px;
                font-size: 18px;
                transform: rotate(180deg);
                * {
                  color: ${color.dark.geekblue5} !important;
                }
                padding: 3px;
                border-radius: 2px;
                transition-duration: 0.1s;

                &:hover {
                  cursor: pointer;
                  background-color: ${color.gray4};
                }
              `}
              onClick={() => setFoldMenu((prev) => !prev)}
            />
          ) : (
            <div>
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
                    margin-top: 2px;
                    font-size: 18px;
                    * {
                      color: ${color.dark.geekblue8} !important;
                    }
                    padding: 3px;
                    border-radius: 2px;
                    transition-duration: 0.1s;

                    &:hover {
                      cursor: pointer;
                      background-color: ${color.gray9};
                    }
                  `}
                  onClick={() => setFoldMenu((prev) => !prev)}
                />
              </div>
              <SortWeights setSortWeights={setSortWeights} />
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
                <PosterSessionDate
                  date="Monday"
                  posterSessions={posterSessions}
                  setPosterSessions={setPosterSessions}
                />
                <PosterSessionDate
                  date="Tuesday"
                  posterSessions={posterSessions}
                  setPosterSessions={setPosterSessions}
                />
                <PosterSessionDate
                  date="Wednesday"
                  posterSessions={posterSessions}
                  setPosterSessions={setPosterSessions}
                />
                <PosterSessionDate
                  date="Thursday"
                  posterSessions={posterSessions}
                  setPosterSessions={setPosterSessions}
                />
                <PosterSessionDate
                  date="Friday"
                  posterSessions={posterSessions}
                  setPosterSessions={setPosterSessions}
                />
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
                onChange={(e) => setAbstractDisplayStyle(e.target.value)}
                value={abstractDisplayStyle}
              >
                <Radio.Button value="full">Full</Radio.Button>
                <Radio.Button value="preview">Preview</Radio.Button>
                <Radio.Button value="hide">Hide</Radio.Button>
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
          )}
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
            <div
              css={css`
                float: right;
                margin-top: -55px;
              `}
            >
              <a href="//github.com/mattdeitke/cvpr-buzz" target="_blank">
                <GithubOutlined
                  css={css`
                    font-size: 28px;
                    vertical-align: middle;
                    color: black;
                    transition-duration: 0.3s;
                    &:hover {
                      color: ${color.gray8};
                    }
                  `}
                />
              </a>
              <div
                css={css`
                  vertical-align: middle;
                  display: inline-block;
                  font-size: 18px;
                  margin-left: 10px;
                  color: black;
                  margin-left: 15px;
                  padding-left: 15px;
                  border-left: 1px solid black;
                `}
              >
                MIT License
              </div>
            </div>
            <h3>Built by Matt Deitke</h3>
            <div
              css={css`
                color: black;
              `}
            >
              {papers.length} results
            </div>
            {papers.map((paper: { node: PaperData }, i: number) => (
              <Paper
                abstractDisplayStyle={abstractDisplayStyle}
                key={paper.node.id}
                {...paper.node}
                i={i}
              />
            ))}
          </div>
        </div>
      </div>
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
          posterSession
          authors
          arXiv
        }
      }
    }
  }
`;
