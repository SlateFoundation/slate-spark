# Roadmap and Known Issues

## Known issues
- There is a lot of code duplicated between the teacher and student apps' controllers. They mirror each other
in a lot of ways but are also different in a lot of ways. Early attempts to have them mostly share code led
to overly complex abstractions with lots of branches. It was decided to just copy and paste code where needed
so that it could evolve independently, and then revisit what could be abstracted out into shared code as
the project matured. There are three strategies that can be employed to reduce code duplication between teacher
and student controllers:
  - Common chunks of code that read or write related UI state can be moved into a shared view component
  - Data transformation code might be moved into a shared store/model/proxy component
  - If a common overall workflow for the controller emergences, a common abstract controller might be founded
- Code sharing is awkward and incosistent for some of the work tabs. For some tabs, a shared base top-level
container view gets configured and decorated with teacher- or student-specific settings and UI components. Other
tabs, specifically the Apply tab, are so different between their containers are defined entirely independently but
use many of the same components. There is likely room to improve both approaches and maybe even merge them together,
it just wasn't a worhwhile thing to dwell on during the apps' initial rapid development phase.

## Roadmap
1. Finish **Priority 1** features and release v1.0.0
2. Improve code sharing between teacher and student apps
3. Improve tablet support, possibly with some alternate layouts where needed