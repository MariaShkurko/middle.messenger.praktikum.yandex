import { expect } from "chai";
import * as sinon from "sinon";
import Route from "./Route";
import Block from "./Block";
import renderDOM from "./renderDOM";

interface GlobalWithRenderDOM extends NodeJS.Global {
  renderDOM?: typeof import("./renderDOM");
}

class MockBlock extends Block<Record<string, any>> {
  getContent = () => {
    return document.createElement("div");
  };
}

describe("Route", () => {
  let sandbox: sinon.SinonSandbox;
  let OriginalRoute: typeof Route;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    OriginalRoute = Route;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("match()", () => {
    it("должен возвращать true, если путь совпадает", () => {
      const route = new Route("/home", MockBlock, {}, "div");
      expect(route.match("/home")).to.be.true;
    });

    it("должен возвращать false, если путь не совпадает", () => {
      const route = new Route("/home", MockBlock, {}, "div");
      expect(route.match("/about")).to.be.false;
    });
  });

  describe("leave()", () => {
    it("должен удалить блок из DOM и обнулить _block", () => {
      const route = new Route("/test", MockBlock, {}, "section");
      const block = new MockBlock("section", {});

      Object.defineProperty(route, "_block", {
        value: block,
        writable: true,
        configurable: true,
      });

      const element = document.createElement("div");
      const removeSpy = sandbox.spy(element, "remove");
      const getContentStub = sandbox.stub(block, "getContent").returns(element);

      route.leave();

      expect(getContentStub.called).to.be.true;
      expect(removeSpy.called).to.be.true;
      expect((route as unknown as { _block: Block<any> | null })._block).to.be.null;
    });
  });

  describe("render()", () => {
    let renderDomStub: sinon.SinonStub;

    beforeEach(() => {
      Object.defineProperty(global, "renderDOM", {
        value: sandbox.stub(),
        configurable: true,
      });
      renderDomStub = (global as GlobalWithRenderDOM).renderDOM as unknown as sinon.SinonStub;
    });

    afterEach(() => {
      Object.defineProperty(global, "renderDOM", {
        value: renderDOM,
        configurable: true,
      });
    });

    it("должен создать блок и вызвать renderDOM, если _block не существует", () => {
      const route = new OriginalRoute("/test", MockBlock, {}, "section");
      route.render("body");

      expect((route as unknown as { _block: Block<any> | null })._block).to.be.instanceOf(
        MockBlock,
      );
    });

    it("не должен создавать блок повторно, если _block уже существует", () => {
      const route = new OriginalRoute("/test", MockBlock, {}, "section");
      const block = new MockBlock("section", {});

      Object.defineProperty(route, "_block", {
        value: block,
        writable: true,
        configurable: true,
      });

      route.render("body");

      expect(renderDomStub.called).to.be.false;
    });
  });
});
