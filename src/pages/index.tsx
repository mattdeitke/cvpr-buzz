import React from "react"
import Latex from "react-latex"
import { Button } from "antd"
import { Helmet } from "react-helmet"
import { css } from "@emotion/react";
import color from "~styles/color";

/**
 * @param {number} a some number.
 * @param {number} b some other number.
 */
export default function Home() {
  return (
    <div>
      <Helmet>
        <title>My title</title>
      </Helmet>
      <h1>Hello, world!</h1>
      <Latex>
        The center of the universe is at $5+4$. One can also do something like $5+4$.
      </Latex>
      <br />
      <br />
      <Button type="primary">Hello, world</Button>
      <div css={css`
        color: ${color.light.blue6};
        &:hover {
          background-color: green;
        }
      `}>
        Hello, world
      </div>
      <br />
      <br />
    </div>
  )
}
