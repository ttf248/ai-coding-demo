// 对比和截图集读取单条实验；主题页仍可一次读取完整主题。
export function recordDetailOutputs(topicDetails) {
  return new Map(
    topicDetails.runs.map((run) => [
      `assets/generated/records/${run.id}.json`,
      JSON.stringify({
        scoringRubric: {
          visualChecks: topicDetails.scoringRubric.visualChecks,
          tasks: Object.fromEntries(
            Object.entries(topicDetails.scoringRubric.tasks).filter(
              ([key]) => key === `${run.topicId}/${run.promptId}`,
            ),
          ),
        },
        runs: [run],
      }) + "\n",
    ]),
  );
}
