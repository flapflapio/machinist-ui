/**
 * This package encapsulates all API calls made from the web app
 */
import { PutResult, StorageGetOutput } from "@aws-amplify/storage";
import { Storage } from "aws-amplify";
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

const toPreppedMachine = (machine: PreppedMachine | Graph): PreppedMachine =>
  isPreppedMachine(machine) ? machine : prepareMachine(machine);

const simulate = async (
  machine: PreppedMachine | Graph,
  tape: string
): Promise<SimulationResponse> => {
  const mach = toPreppedMachine(machine);
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

const cleanFilename = (filename: string) =>
  !filename.endsWith(".json") ? `${filename}.json` : filename;

/**
 * @param filename The filename to save the machine under
 * @param machine The machine as an object
 * @returns The result of calling Storage.Put
 */
const saveMachine = (
  filename: string,
  machine: PreppedMachine | Graph
): Promise<PutResult> => {
  const mach = toPreppedMachine(machine);
  const file = cleanFilename(filename);
  return Storage.put(file, JSON.stringify(mach, null, 2), {
    level: "private",
  });
};

/**
 * @param filename The name of the file to grab
 * @returns A deserialized machine
 */
const loadMachine = async (filename: string) => {
  const file = cleanFilename(filename);
  const got = await Storage.get(file, { level: "private", download: true });
  const data = await (got.Body as Blob).text();
  const graph: Graph = JSON.parse(data);
  return graph;
};

export { simulate, prepareMachine, isPreppedMachine, saveMachine, loadMachine };
export type { PreppedMachine };
