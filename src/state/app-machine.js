import { createMachine, assign, interpret } from "xstate";
import { updateTeamWithScores } from "../pages/api.js";

const appMachine = createMachine({
  id: "app",
  // type: 'parallel',
  initial: "loading",
  context: {
    num: 0,
      scores: [],
  },
  states: {
    loading: {
      invoke: {
        src: updateTeamWithScores,// updateTeamWithScores,
        id: "getScores",
        onDone: {
          target: "idle",
          actions: assign((context, event) => {
            console.log(event.data)
            return { scores: event.data };
          }),
        },
      },
    },
    idle: {},
  },
  on: {
    INCREMENT: {
      actions: assign((context, event) => {
        return { num: context.num + 1 };
      }),
    },
  },
});

const service = interpret(appMachine).start();

export { service };
