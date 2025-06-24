import type { Preview } from "@storybook/react";
import React from "react";
import "../src/index.css";

const preview: Preview = {
  decorators: [
    (Story) => React.createElement(
      "div",
      { className: "p-4 bg-white text-black min-h-screen" },
      React.createElement(Story)
    )
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
};

export default preview; 