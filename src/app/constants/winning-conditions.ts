import { WinningConditions } from "../models/winning-conditions.model";

export const winningConditions: WinningConditions[] = [
  {
    winIndex: [0, 1, 2],
    stripe: {
      top: "calc(var(--board-field-height) / 2)",
      left: "0",
      rotate: '0deg',
    },
  },
  {
    winIndex: [3, 4, 5],
    stripe: {
      top: "calc(var(--board-field-height) * 1.5)",
      left: "0",
      rotate: '0deg',
    },
  },
  {
    winIndex: [6, 7, 8],
    stripe: {
      top: "calc(var(--board-field-height) * 2.5)",
      left: "0",
      rotate: "0deg"
    },
  },
  {
    winIndex: [0, 3, 6],
    stripe: {
      top: "calc(50% - 5px)",
      left: "calc(0px - var(--board-field-width))",
      rotate: "90deg"
    },
  },
  {
    winIndex: [1, 4, 7],
    stripe: {
      top: "calc(50% - 5px)",
      left: "0",
      rotate: "90deg"
    },
  },
  {
    winIndex: [2, 5, 8],
    stripe: {
      top: "calc(50% - 5px)",
      left: "var(--board-field-width)",
      rotate: "90deg"
    },
  },
  {
    winIndex: [0, 4, 8],
    stripe: {
      top: "calc(0px + var(--board-field-height) * 1.5)",
      left: "0",
      rotate: "45deg"
    },
  },
  {
    winIndex: [2, 4, 6],
    stripe: {
      top: "calc(0px + var(--board-field-height) * 1.5)",
      left: "0",
      rotate: "-45deg"
    },
  }
];