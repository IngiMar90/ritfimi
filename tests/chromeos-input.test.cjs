const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const input = {
  value: "",
  classList: { add() {}, remove() {} },
  setSelectionRange() {},
  addEventListener() {},
};
const feedback = { textContent: "", className: "" };
const app = {
  innerHTML: "",
  focus() {},
  querySelector(selector) {
    if (selector === "#typing-input") return input;
    if (selector === "#feedback") return feedback;
    return { addEventListener() {} };
  },
  querySelectorAll() { return []; },
};
const simpleElement = {
  textContent: "",
  style: {},
  addEventListener() {},
  setAttribute() {},
  close() {},
  showModal() {},
};

const sandbox = {
  console,
  setTimeout() {},
  clearTimeout() {},
  navigator: { userAgent: "ChromeOS" },
  localStorage: { getItem: () => "off", setItem() {} },
  document: {
    querySelector(selector) {
      if (selector === "#app") return app;
      return simpleElement;
    },
    querySelectorAll() { return []; },
  },
  window: {
    RITFIMI_LEVELS: [{ title: "Próf", description: "", color: "#000", items: ["á"] }],
    addEventListener() {},
  },
};

const source = fs.readFileSync(require.resolve("../app.js"), "utf8");
const tests = `
function resetFor(target) {
  state.round = [target];
  state.index = 0;
  state.typed = "";
  state.accentStarted = false;
  state.composing = false;
  state.locked = false;
  input.value = "";
}

resetFor("á");
let deadPrevented = false;
handleKeyDown({key:"Dead", isComposing:false, preventDefault(){deadPrevented=true;}});
assert.equal(deadPrevented, false, "Dead-takkinn má ekki vera stöðvaður á ChromeOS");
assert.equal(state.accentStarted, true);
handleCompositionStart();
handleCompositionEnd({data:"á"});
assert.equal(state.typed, "á", "compositionend á að samþykkja á");

resetFor("é");
handleKeyDown({key:"Dead", isComposing:false, preventDefault(){throw new Error("Dead stöðvaður");}});
processCharacter("e");
assert.equal(state.typed, "é", "grunnstafs-varaleið á að búa til é");

resetFor("í");
handleKeyDown({key:"Dead", isComposing:false, preventDefault(){throw new Error("Dead stöðvaður");}});
handleCompositionStart();
handleCompositionEnd({data:"ó"});
assert.equal(state.typed, "", "rangur broddstafur má ekki birtast");
assert.equal(state.accentStarted, false, "röng composition á að endurstilla broddinn");

resetFor("ú");
let directPrevented = false;
handleKeyDown({key:"ú", isComposing:false, preventDefault(){directPrevented=true;}});
assert.equal(directPrevented, true);
assert.equal(state.typed, "ú", "beinn samsettur stafur á að virka áfram");

resetFor("„");
handleKeyDown({key:'"', isComposing:false, preventDefault(){}});
assert.equal(state.typed, "„", "Shift+2 gæsalappalausnin má ekki bila");
`;

sandbox.assert = assert;
sandbox.input = input;
vm.runInNewContext(`${source}\n${tests}`, sandbox, { filename: "app.js" });
console.log("ChromeOS, beinir broddstafir og Shift+2 standast prófun.");
