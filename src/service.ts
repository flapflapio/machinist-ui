/**
 * This package encapsulates all API calls made from the web app
 */
import { Graph } from "./components/data/graph";
import { api } from "./util/utils";

// Routes for all the different APIs
const apis = {
  simulate(tape: string): string {
    return api(`/simulate?tape=${tape}`);
  },
};

type PreppedMachine = {
  Type: string;
  Alphabet: string;
  Start: string;
  States: {
    Id: string;
    Ending: boolean;
  }[];
  Transitions: {
    Start: string;
    End: string;
    Symbol: string;
  }[];
};

type SimulationResponse = {
  Accepted: boolean;
  Path: string[];
  RemainingInput: string;
};

const isPreppedMachine = (
  machine: Graph | PreppedMachine
): machine is PreppedMachine => "Type" in machine;

const prepareMachine = (graph: Graph): PreppedMachine => ({
  Type: "DFA",
  Alphabet: (() => {
    let alpha = "";
    graph.transitions.forEach((t) =>
      t.symbol.split("").forEach((s) => {
        if (!alpha.includes(s)) alpha += s;
      })
    );
    return alpha;
  })(),
  Start: graph.starting,
  States: graph.states.map((s) => ({ Id: s.id, Ending: s.ending })),
  Transitions: graph.transitions.map((t) => ({
    Start: t.start.state,
    End: t.end.state,
    Symbol: t.symbol,
  })),
});

const simulate = async (
  machine: PreppedMachine | Graph,
  tape: string
): Promise<SimulationResponse> => {
  const mach = isPreppedMachine(machine) ? machine : prepareMachine(machine);
  // console.log(JSON.stringify({ a: 1, b: mach }));
  const posted = await fetch(apis.simulate(tape), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mach),
  });
  const response = await posted.json();
  if (!posted.ok) throw new Error(response.Err ?? "Something went wrong");
  return response;
};

export { simulate, prepareMachine, isPreppedMachine };
export type { PreppedMachine };
