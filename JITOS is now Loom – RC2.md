# Loom

> Minds are not clocks. They are looms.

***Loom*** is a history-native computational system in which execution is woven into an immutable fabric.

Classical computing exposes only the final execution trace: the result. The constraints, ordering decisions, and near-misses that shaped that result are discarded or overwritten. Loom makes that hidden structure explicit.

It treats computation not as the transformation of values, but as the construction of history under constraint.

## Architecture

Loom separates the enumeration of possibility from the commitment of reality.

### Classical systems
```
Input + Code → State Change
(history is implicit and overwritten)
```
### Loom
```
Possibilities + Constraints → Selection → History
(history is structural and append-only)
```

In Loom, history is not an incidental artifact of execution; history is the product.

## Vocabulary

Loom uses a precise ontology to describe how events are ordered and committed.

### The Loom (Fabric)

The realized, immutable history of execution. If an event is in the Loom, it is real in the strongest operational sense: it happened. The Loom is append-only.

### The Stylus (Commit)

The mechanism that performs the irreversible write. The Stylus does not calculate; it finalizes. Once the Stylus moves, a choice becomes history.

### The Scheduler (Constraint)

The logic that governs when and how the Stylus may act. Schedulers determine which Worldlines (candidate trajectories) are admissible at each step. Schedulers do not write history; they constrain it.

### The Umbra (Shadow Index)

A structured archive of unrealized possibilities. When the Stylus commits to one path, valid alternatives are not discarded—they are indexed in the Umbra. This makes counterfactuals (“what could have happened”) queryable and comparable without collapsing them into reality.

## From JITOS to Loom

This project was previously known as JITOS.

JITOS began as an abstract label for a set of ideas. As the system matured, its architecture converged on a concrete topological model: managing independent threads, resolving constraints, and weaving them into a linear, irreversible history.

The machine is a loom: a structural description of the scheduler and the system it governs.
