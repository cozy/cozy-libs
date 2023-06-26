import type { Preview } from "@storybook/react";

import 'cozy-ui/dist/cozy-ui.min.css'
import 'cozy-ui/dist/cozy-ui.utils.min.css'
import 'cozy-ui/transpiled/react/stylesheet.css'
import React from "react";
import { StoryContainer } from "./StoryContainer";

const preview: Preview = {
  decorators: [
    (Story) => (
      <StoryContainer>
        <div style={{position: "relative"}}>
          <Story />
        </div>
      </StoryContainer>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
