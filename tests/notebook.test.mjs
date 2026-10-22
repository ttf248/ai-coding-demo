import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
function setup(initial = null) {
  const store = new Map(
    initial === null ? [] : [["archive-notebook-v1", initial]],
  );
  let fail = false;
  const c = {
    URLSearchParams,
    Event,
    Date,
    location: { pathname: "/index.html", search: "" },
    document: { addEventListener() {} },
    addEventListener() {},
    dispatchEvent() {},
    localStorage: {
      getItem: (k) => store.get(k) || null,
      setItem: (k, v) => {
        if (fail) throw Error("quota");
        store.set(k, v);
      },
    },
    ARCHIVE: { runs: [{ id: "a" }, { id: "b" }], topics: [{ id: "t" }] },
  };
  c.window = c;
  for (const file of ["core", "notebook"])
    vm.runInNewContext(fs.readFileSync(`assets/${file}.js`, "utf8"), c);
  return {
    N: c.ArchiveNotebook,
    store,
    block: () => {
      fail = true;
    },
  };
}
test("local notes survive deduplication, visits and removal and reject invalid comparison destinations", () => {
  const { N } = setup();
  assert.equal(N.save({ type: "run", id: "a" }, "个人备注"), true);
  N.save({ type: "run", id: "a" });
  N.visit({ type: "topic", id: "t" });
  assert.equal(N.read().saved.length, 1);
  assert.equal(N.read().saved[0].note, "个人备注");
  assert.equal(N.save({ type: "comparison", search: "left=a&right=a" }), false);
  assert.equal(
    N.save({
      type: "comparison",
      search: "left=a&right=b&redirect=javascript%3Aalert(1)&tab=snapshot",
    }),
    true,
  );
  const saved = N.read().saved[0];
  assert.equal(N.href(saved), "compare.html?left=a&right=b&tab=snapshot");
  N.clearRecent();
  assert.equal(N.read().saved.length, 2);
  assert.equal(N.read().recent.length, 0);
  N.remove(saved);
  assert.equal(N.read().saved.length, 1);
});
test("storage failures and corrupt old data never report successful persistence or overwrite the original", () => {
  const broken = setup("{bad");
  assert.equal(broken.N.save({ type: "run", id: "a" }), false);
  assert.equal(broken.store.get("archive-notebook-v1"), "{bad");
  const quota = setup();
  quota.block();
  assert.equal(quota.N.save({ type: "run", id: "a" }), false);
  assert.match(quota.N.problem(), /尚未保存/);
});
