import Handlebars from "handlebars";
import { v4 as makeUUID } from "uuid";
import type { IAppEvents } from "../types/eventTypes";
import deepClone from "../utils/deepClone";
import EventBus from "./EventBus";

type EventHandler = (e: Event) => void;
type Events = Record<string, EventHandler>;
export interface Props {
  className?: string;
  attrs?: Record<string, string>;
  events?: Events;
  [key: string]: unknown;
}
type Children = Record<string, Block | Block[]>;

interface Meta<T = Props> {
  tagName: string;
  props: T;
}

class Block<TProps extends Props = Props> {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  };

  private _element: HTMLElement | null = null;
  private _meta: Meta<TProps>;
  private _id: string = makeUUID();
  private _eventBus: EventBus<IAppEvents>;

  protected children: Children;

  public props: TProps;

  /** JSDoc
   * @param {string} tagName
   * @param {Object} propsAndChildren
   *
   * @returns {void}
   */
  constructor(tagName = "div", propsAndChildren = {} as TProps) {
    const { children, props } = this.getChildrenAndProps(propsAndChildren);

    this.children = children;
    this._meta = { tagName, props };

    this._eventBus = new EventBus<IAppEvents>();
    this.props = this._makePropsProxy(props);
    this.registerEvents(this._eventBus);
    this._eventBus.emit(Block.EVENTS.INIT);
  }

  private _makePropsProxy(props: TProps): TProps {
    const emit = this._eventBus.emit.bind(this._eventBus);
    return new Proxy(props, {
      get(target, prop) {
        if (typeof prop === "string" && prop in target) {
          const value = target[prop];
          return typeof value === "function" ? value.bind(target) : value;
        }
      },
      set(target, prop, value) {
        if (typeof prop === "string" && prop in target) {
          const oldTarget = deepClone(target);
          target[prop as keyof TProps] = value;
          emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
          return true;
        }

        throw new Error("Invalid prop key type");
      },
      deleteProperty() {
        throw new Error("Нет доступа");
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  private registerEvents(eventBus: EventBus<IAppEvents>): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private createResources(): void {
    const { tagName, props } = this._meta;
    this._element = this._createDocumentElement(tagName);

    if (typeof props.className === "string") {
      const classes = props.className.split(" ");
      this._element?.classList.add(...classes);
    }

    if (typeof props.attrs === "object") {
      Object.entries(props.attrs).forEach(([attrName, attrValue]) => {
        if (typeof attrValue === "string") this._element?.setAttribute(attrName, attrValue);
      });
    }
  }

  private addEvents(): void {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  private removeEvents(): void {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      this._element?.removeEventListener(eventName, events[eventName]);
    });
  }

  private getChildrenAndProps(propsAndChildren: TProps): { children: Children; props: TProps } {
    const children: Children = {};
    const props: Partial<TProps> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.every((item) => item instanceof Block)) {
          children[key] = value as Block[];
        } else {
          props[key as keyof TProps] = value as TProps[keyof TProps];
        }
      } else if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key as keyof TProps] = value as TProps[keyof TProps];
      }
    });

    return { children, props: props as TProps };
  }

  private _componentDidMount(): void {
    this.componentDidMount();
    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((c) => c.dispatchComponentDidMount());
      } else {
        child.dispatchComponentDidMount();
      }
    });
  }

  private _componentDidUpdate(oldProps: TProps, newProps: TProps): void {
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps);
    if (shouldUpdate) {
      this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  private compile(): DocumentFragment {
    const propsAndStubs = { ...this.props };

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key as keyof TProps] = child.map(
          (component) => `<div data-id="${component._id}"></div>`,
        ) as TProps[keyof TProps];
      } else {
        propsAndStubs[key as keyof TProps] =
          `<div data-id="${child._id}"></div>` as TProps[keyof TProps];
      }
    });

    const fragment = this._createDocumentElement("template") as HTMLTemplateElement;
    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((component) => {
          const stub = fragment.content.querySelector(`[data-id="${component._id}"]`);
          stub?.replaceWith(component.getContent() as Node);
        });
      } else {
        const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
        stub?.replaceWith(child.getContent() as Node);
      }
    });

    return fragment.content;
  }

  private _render(): void {
    this.removeEvents();
    const block = this.compile();

    if (this._element?.children.length === 0) {
      this._element.appendChild(block);
    } else {
      this._element?.replaceChildren(block);
    }

    this.addEvents();
  }

  protected init(): void {
    this.createResources();
    this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  protected componentDidMount(_oldProps?: TProps): void {}

  protected componentDidUpdate(_oldProps: TProps, _newProps: TProps): boolean {
    return true;
  }

  public addClassName(className: string) {
    this._element?.classList.add(className);
  }

  public removeClassName(className: string) {
    this._element?.classList.remove(className);
  }

  public dispatchComponentDidMount(): void {
    this._eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  public setProps(nextProps: Partial<TProps>): void {
    if (!nextProps) {
      return;
    }

    const oldProps = deepClone(this.props);
    Object.assign(this.props, nextProps);
    this._eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, this.props);
  }

  public get element(): HTMLElement | null {
    return this._element;
  }

  public getContent(): HTMLElement | null {
    return this._element;
  }

  protected render(): string {
    return "";
  }
}

export default Block;
