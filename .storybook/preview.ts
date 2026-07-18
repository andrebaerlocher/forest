import type { Preview } from "@storybook/sveltekit";
import "../src/lib/styles/forest.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },

  globalTypes: {
    mode: {
      description: "Color Mode (Light / Dark)",
      defaultValue: "light",
      toolbar: {
        title: "Mode",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light Mode (Closed Lid)" },
          { value: "dark", title: "Dark Mode (Opened Box)" },
        ],
        dynamicTitle: true,
      },
    },
    hue: {
      description: "Design System Hue Rotation",
      defaultValue: "282",
      toolbar: {
        title: "Hue",
        icon: "paintbrush",
        items: [
          { value: "282", title: "282° · Classic Oolong" },
          { value: "350", title: "350° · Rose Hip" },
          { value: "45", title: "45° · Ginger" },
          { value: "120", title: "120° · Green Matcha" },
          { value: "200", title: "200° · Mint" },
          { value: "240", title: "240° · Blue Indigo" },
          { value: "0", title: "0° · Earth Red" },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (storyFn, context) => {
      const { mode, hue } = context.globals;

      if (typeof document !== "undefined") {
        const element = document.documentElement;
        element.setAttribute("data-mode", mode || "light");
        element.style.setProperty("--hue", hue || "282");
      }

      return storyFn();
    },
  ],
};

export default preview;
