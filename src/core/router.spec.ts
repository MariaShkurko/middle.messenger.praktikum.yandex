/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { expect } from "chai";
import * as sinon from "sinon";
import Router from "./Router";
import Route from "./Route";
import Block from "./Block";

describe("Router", () => {
  let router: Router;

  beforeEach(() => {
    const app = document.createElement("div");
    app.id = "app";
    document.body.appendChild(app);

    router = Router.getInstance("#app");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("#getInstance", () => {
    it("возвращает один и тот же инстанс", () => {
      const instance1 = Router.getInstance("#root");
      const instance2 = Router.getInstance("#another-root");
      expect(instance1).to.equal(instance2);
    });
  });

  describe("#use", () => {
    const BlockMock = class extends Block<Record<string, any>> {
      constructor() {
        super("div", {});
      }

      getContent() {
        return document.createElement("div");
      }
    };

    const pathname = "/test-route";

    it("добавляет маршрут в маршрутизатор", () => {
      router.use(pathname, BlockMock, {}, "div");

      const renderSpy = sinon.spy(Route.prototype, "render");
      const leaveSpy = sinon.spy(Route.prototype, "leave");

      router.go(pathname);

      expect(renderSpy.called).to.be.true;
      expect(leaveSpy.called).to.be.false;
    });
  });

  describe("#init", () => {
    let renderSpy: sinon.SinonSpy;

    beforeEach(() => {
      router.use(
        window.location.pathname,
        class extends Block<Record<string, any>> {
          getContent() {
            return document.createElement("div");
          }
        },
        {},
        "div",
      );

      renderSpy = sinon.spy(Route.prototype, "render");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("запускает маршрутизацию при инициализации (вызывает render для текущего пути)", () => {
      router.use(
        "/test-route",
        class extends Block<Record<string, any>> {
          getContent() {
            return document.createElement("div");
          }
        },
        {},
        "div",
      );
      router.go("/test-route");
      router.init();

      expect(renderSpy.called).to.be.true;
    });

    it("устанавливает обработчик onpopstate", () => {
      router.init();
      expect(window.onpopstate).to.exist;
    });
  });

  describe("#go", () => {
    it("изменяет историю браузера через pushState", () => {
      const pushStateSpy = sinon.spy(window.history, "pushState");

      const pathname = "/new-path";
      router.go(pathname);

      expect(pushStateSpy.called).to.be.true;
      expect(pushStateSpy.calledWith({}, "", pathname)).to.be.true;

      pushStateSpy.restore();
    });
  });

  describe("#back / #forward", () => {
    it("делегируют вызовы в window.history", () => {
      const backSpy = sinon.spy(window.history, "back");
      const forwardSpy = sinon.spy(window.history, "forward");

      router.back();
      expect(backSpy.called).to.be.true;

      router.forward();
      expect(forwardSpy.called).to.be.true;
    });
  });

  describe("#isInitialized", () => {
    it("возвращает false при пустом _currentRoute", () => {
      (router as any)._currentRoute = null;
      expect(router.isInitialized()).to.be.false;
    });

    it("возвращает true после go()", () => {
      router.use(
        "/test-route",
        class extends Block<Record<string, any>> {
          getContent() {
            return document.createElement("div");
          }
        },
        {},
        "div",
      );
      router.use(
        "/new-path",
        class extends Block<Record<string, any>> {
          getContent() {
            return document.createElement("div");
          }
        },
        {},
        "div",
      );

      router.go("/test-route");

      expect(router.isInitialized()).to.be.true;
    });
  });
});
