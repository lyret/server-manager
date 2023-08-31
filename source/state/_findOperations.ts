import * as JsonDiffPatch from "jsondiffpatch";
import * as ArrayDifferences from "fast-array-diff";

function findChangedProcesses(
  prevState: Manager.State,
  nextState: Manager.State
): Manager.Operations["processes"] {
  // Find modified processes
  let { added, removed } = ArrayDifferences.diff(
    prevState.processes,
    nextState.processes,
    (a, b) => !JsonDiffPatch.diff(a, b)
  );

  // Find out what processes are not modified, but moved
  let moved = ArrayDifferences.same(
    added,
    removed,
    (a, b) => !JsonDiffPatch.diff(a, b)
  );

  // Remove moved items from the list of removed and added processes
  // Needs to be stringified for the comparison to work
  let stringifiedMoved = moved.map((v) => JSON.stringify(v));

  added = added
    .map((v) => JSON.stringify(v))
    .filter((v) => !stringifiedMoved.includes(v))
    .map((v) => JSON.parse(v));
  removed = removed
    .map((v) => JSON.stringify(v))
    .filter((v) => !stringifiedMoved.includes(v))
    .map((v) => JSON.parse(v));

  // Return the deltas
  return { added, removed, moved };
}

function findChangedInternalRoutes(
  prevState: Manager.State,
  nextState: Manager.State
): Manager.Operations["internalRoutes"] {
  // Find modified internal routes
  let { added, removed } = ArrayDifferences.diff(
    prevState.internalRoutes,
    nextState.internalRoutes,
    (a, b) => !JsonDiffPatch.diff(a, b)
  );

  // Find out what internal routes were not modified, but moved
  let moved = ArrayDifferences.same(
    added,
    removed,
    (a, b) => !JsonDiffPatch.diff(a, b)
  );

  // Remove moved items from the list of removed and added internal routes
  // Needs to be stringified for the comparison to work
  let stringifiedMoved = moved.map((v) => JSON.stringify(v));

  added = added
    .map((v) => JSON.stringify(v))
    .filter((v) => !stringifiedMoved.includes(v))
    .map((v) => JSON.parse(v));
  removed = removed
    .map((v) => JSON.stringify(v))
    .filter((v) => !stringifiedMoved.includes(v))
    .map((v) => JSON.parse(v));

  // Return the deltas
  return { added, removed, moved };
}

function findChangedHostnames(
  prevState: Manager.State,
  nextState: Manager.State
): Manager.Operations["hostnames"] {
  // Find modified hostnames
  let { added, removed } = ArrayDifferences.diff(
    prevState.uniqueHostnames.map((v) => v.hostname),
    nextState.uniqueHostnames.map((v) => v.hostname)
  );

  // Find out what hostnames are not modified, but only moved
  let moved = ArrayDifferences.same(added, removed);

  // Remove moved items from the list of removed and added hostnames
  added = added.filter((v) => !moved.includes(v));
  removed = removed.filter((v) => !moved.includes(v));

  // Return the deltas
  return { added, removed, moved };
}

export function findOperationsFromChangeOfState(
  prevState: Manager.State,
  nextState: Manager.State
): Manager.Operations {
  return {
    processes: findChangedProcesses(prevState, nextState),
    internalRoutes: findChangedInternalRoutes(prevState, nextState),
    hostnames: findChangedHostnames(prevState, nextState),
  };
}