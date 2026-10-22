(function (global) {
  "use strict";
  const U = global.ArchiveUI;
  function recommendations(data) {
    const candidates = data.runs.filter(
      (run) =>
        !U.isTopicArchived(
          data.topics.find((topic) => topic.id === run.topicId),
        ) &&
        run.status === "ready" &&
        run.preview?.embed &&
        run.preview.kind !== "none" &&
        run.score?.status === "rated" &&
        run.captureCount > 0 &&
        U.promptFor(data, run)?.hash &&
        run.modelId !== "unknown",
    );
    const types = [
      ["models", "同任务，不同模型", (a, b) => a.modelId !== b.modelId],
      [
        "efforts",
        "同模型，不同档位",
        (a, b) =>
          a.modelId === b.modelId &&
          a.effort !== b.effort &&
          ![a.effort, b.effort].includes("unknown"),
      ],
      [
        "rounds",
        "同模型同档位，不同轮次",
        (a, b) => a.modelId === b.modelId && a.effort === b.effort,
      ],
    ];
    const usedTopics = new Set();
    return types.flatMap(([kind, title, matches]) => {
      const pairs = [];
      for (let i = 0; i < candidates.length; i++) {
        const a = candidates[i];
        for (const b of candidates.slice(i + 1)) {
          if (
            a.topicId !== b.topicId ||
            U.promptFor(data, a).hash !== U.promptFor(data, b).hash ||
            !matches(a, b)
          )
            continue;
          const complete = [a, b].filter(
            (r) => r.input?.completeness === "recorded",
          ).length;
          pairs.push({
            a,
            b,
            rank:
              complete * 100 +
              Number(a.rawHash && a.rawHash === b.rawHash) * 50 +
              Number(!usedTopics.has(a.topicId)) * 10 +
              Math.min(a.captureCount, b.captureCount, 9),
          });
        }
      }
      pairs.sort(
        (a, b) =>
          b.rank - a.rank ||
          a.a.id.localeCompare(b.a.id) ||
          a.b.id.localeCompare(b.b.id),
      );
      if (!pairs.length) return [];
      const { a, b } = pairs[0];
      usedTopics.add(a.topicId);
      return [
        {
          kind,
          title,
          a,
          b,
          href:
            "compare.html?" +
            new URLSearchParams({ left: a.id, right: b.id, tab: "snapshot" }),
        },
      ];
    });
  }
  global.ArchiveDiscovery = { recommendations };
})(window);
