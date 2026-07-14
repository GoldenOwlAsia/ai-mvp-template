# Prompt: Write tests

CONTEXT: AcceptanceCriteria.md GIVEN/WHEN/THEN.
INPUT: Feature AC scenarios.
TASK: Map each scenario to unit/e2e test. Name mirrors AC.
OUTPUT: test files + coverage notes for this feature only.
CONSTRAINT: No production code changes unless bug found (then stop and report).
