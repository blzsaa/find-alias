import sinon from "sinon";
import ScreenManager from "inquirer/lib/utils/screen-manager.js";
import ReplaceStringScreenManager from "../../src/ReplaceStringScreenManager.js";

describe("ReplaceStringScreenManager", () => {
  describe("render", () => {
    it("should first replace searchValue in content then call super", () => {
      const underTestSuper = sinon.mock(ScreenManager.prototype);
      const underTest = new ReplaceStringScreenManager(
        {},
        "<searchValue>",
        "<newValue>"
      );
      underTestSuper
        .expects("render")
        .withArgs(
          "<prefix><newValue><suffix>",
          "bottomContent<searchValue>",
          true
        )
        .once();
      underTest.render(
        "<prefix><searchValue><suffix>",
        "bottomContent<searchValue>",
        true
      );
      underTestSuper.verify();
    });
  });
});
