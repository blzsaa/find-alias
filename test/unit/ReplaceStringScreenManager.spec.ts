import sinon, { stubInterface } from "ts-sinon";
import ScreenManager from "inquirer/lib/utils/screen-manager";
import ReplaceStringScreenManager from "@/ReplaceStringScreenManager";
import { Interface as ReadLineInterface } from "readline";

describe("ReplaceStringScreenManager", () => {
  describe("render", () => {
    it("should first replace searchValue in content then call super", () => {
      const underTestSuper = sinon.mock(ScreenManager.prototype);
      const readLineInterfaceStub = stubInterface<ReadLineInterface>();
      const underTest = new ReplaceStringScreenManager(
        readLineInterfaceStub,
        "<searchValue>",
        "<newValue>"
      );
      underTestSuper
        .expects("render")
        .withArgs("<prefix><newValue><suffix>", "bottomContent<searchValue>")
        .once();
      underTest.render(
        "<prefix><searchValue><suffix>",
        "bottomContent<searchValue>"
      );
      underTestSuper.verify();
    });
  });
});
