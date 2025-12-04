import { expect } from "chai";
import * as sinon from "sinon";
import Block from "./Block";
import type { Props } from "./Block";
import { BLOCK_EVENTS } from "../constants/BLOCK_EVENTS";

class TestBlock extends Block<Props> {
  protected render(): string {
    return "<div>Test</div>";
  }
  public getChildren(): Record<string, Block | Block[]> {
    return this.children;
  }
}

describe("Block", () => {
  let block: Block;

  beforeEach(() => {
    block = new TestBlock("div", {
      className: "test-class",
      attrs: { id: "test-id" },
      events: { click: () => {} },
      style: { color: "red", "--custom": "value" },
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("public methods", () => {
    it("addClassName добавляет класс элементу", () => {
      block.addClassName("new-class");
      expect(block.element?.classList.contains("new-class")).to.be.true;
    });

    it("removeClassName удаляет класс у элемента", () => {
      block.removeClassName("test-class");
      expect(block.element?.classList.contains("test-class")).to.be.false;
    });

    it("dispatchComponentDidMount вызывает событие FLOW_CDM", () => {
      const emitStub = sinon.stub(block.getEventBus(), "emit");
      block.dispatchComponentDidMount();
      expect(emitStub.calledWith(BLOCK_EVENTS.FLOW_CDM)).to.be.true;
      emitStub.restore();
    });

    it("dispatchComponentDidUpdate вызывает событие FLOW_CDU", () => {
      const emitStub = sinon.stub(block.getEventBus(), "emit");
      block.dispatchComponentDidUpdate();
      expect(emitStub.calledWith(BLOCK_EVENTS.FLOW_CDU)).to.be.true;
      emitStub.restore();
    });

    it("setProps обновляет props и вызывает FLOW_CDU", () => {
      const newProps = { className: "updated-class" };
      const emitStub = sinon.stub(block.getEventBus(), "emit");

      block.setProps(newProps);
      expect(block.props.className).to.equal("updated-class");
      expect(emitStub.calledWith(BLOCK_EVENTS.FLOW_CDU)).to.be.true;

      emitStub.restore();
    });

    it("get element возвращает HTMLElement", () => {
      expect(block.element).to.exist;
      expect(block.element!.tagName).to.equal("DIV");
    });

    it("getContent возвращает HTMLElement", () => {
      expect(block.getContent()).to.equal(block.element);
    });

    it("addChild добавляет дочерний блок", () => {
      const child = new TestBlock("span");
      block.addChild("child1", child);

      expect(block.getChildren()["child1"]).to.equal(child);
    });

    it("addChild добавляет массив дочерних блоков", () => {
      const child1 = new TestBlock("span");
      const child2 = new TestBlock("span");
      block.addChild("children", [child1, child2]);

      expect(Array.isArray(block.getChildren()["children"])).to.be.true;
      expect(block.getChildren()["children"] as Block[]).to.have.length(2);
      expect((block.getChildren()["children"] as Block[])[0]).to.equal(child1);
    });
  });
});
