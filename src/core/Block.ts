import Handlebars from "handlebars";
import { v4 as makeUUID } from "uuid";
import type { IAppEvents } from "../types/eventTypes";
import EventBus from "./EventBus";
import { BLOCK_EVENTS } from "../constants/BLOCK_EVENTS";

type EventHandler = (e: Event) => void;
type Events = Record<string, EventHandler>;
type Children = Record<string, Block | Block[]>;
type StyleProps = Partial<CSSStyleDeclaration> & {
  // eslint-disable-next-line no-unused-vars
  [key in `--${string}`]?: string;
};

export interface Props {
  className?: string;
  attrs?: Record<string, string>;
  events?: Events;
  style?: StyleProps;
  [key: string]: unknown;
}

interface Meta<T = Props> {
  tagName: string;
  props: T;
}

abstract class Block<TProps extends Props = Props> {
  #element: HTMLElement | null = null;

  #meta: Meta<TProps>;

  #id: string = makeUUID();

  #eventBus: EventBus<IAppEvents<TProps>>;

  protected children: Children;

  public props: TProps;

  constructor(tagName = "div", propsAndChildren = {} as TProps) {
    const { children, props } = this.#getChildrenAndProps(propsAndChildren);
    this.children = children;
    this.#meta = { tagName, props };

    this.#eventBus = new EventBus<IAppEvents<TProps>>();
    this.props = this.#makePropsProxy(props);
    this.#registerEvents(this.#eventBus);
    this.#eventBus.emit(BLOCK_EVENTS.INIT);
  }

  #makePropsProxy(props: TProps): TProps {
    const emit = this.#eventBus.emit.bind(this.#eventBus);

    return new Proxy<TProps>(props, {
      get(target, prop, receiver): unknown {
        if (typeof prop === "string" && Object.prototype.hasOwnProperty.call(target, prop)) {
          const value = Reflect.get(target, prop, receiver);
          if (typeof value === "function" && !["caller", "callee", "arguments"].includes(prop)) {
            return value.bind(target);
          }
          return value;
        }
        return undefined;
      },
      set(target, prop, value, receiver): boolean {
        if (typeof prop === "string" && Object.prototype.hasOwnProperty.call(target, prop)) {
          const oldTarget: Partial<TProps> = {};
          Object.keys(target).forEach((key) => {
            const val = target[key as keyof TProps];
            if (typeof val !== "function") oldTarget[key as keyof TProps] = val;
          });
          const result = Reflect.set(target, prop, value, receiver);
          emit(BLOCK_EVENTS.FLOW_CDU, oldTarget, target);
          return result;
        }
        throw new Error("Invalid prop key type");
      },
      deleteProperty() {
        throw new Error("Нет доступа");
      },
    });
  }

  static createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  #registerEvents(eventBus: EventBus<IAppEvents<TProps>>): void {
    eventBus.on(BLOCK_EVENTS.INIT, this.init.bind(this));
    eventBus.on(BLOCK_EVENTS.FLOW_CDM, this.#componentDidMount.bind(this));
    eventBus.on(BLOCK_EVENTS.FLOW_CDU, this.#componentDidUpdate.bind(this));
    eventBus.on(BLOCK_EVENTS.FLOW_RENDER, this.#render.bind(this));
  }

  #createResources(): void {
    const { tagName, props } = this.#meta;
    this.#element = Block.createDocumentElement(tagName);

    if (typeof props.className === "string") {
      const classes = props.className.split(" ");
      this.#element?.classList.add(...classes);
    }

    if (typeof props.attrs === "object") {
      Object.entries(props.attrs).forEach(([attrName, attrValue]) => {
        if (typeof attrValue === "string") {
          this.#element?.setAttribute(attrName, attrValue);
        }
      });
    }

    if (this.props?.style && typeof this.props.style === "object") {
      const style = this.props.style as Partial<CSSStyleDeclaration>;
      for (const [key, value] of Object.entries(style)) {
        if (typeof value === "string") {
          if (key.startsWith("--")) {
            this.#element.style.setProperty(key, value);
          } else if (key in this.#element.style) {
            const kebabKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
            this.#element.style.setProperty(kebabKey, value);
          }
        }
      }
    }
  }

  #addEvents(): void {
    const { events = {} } = this.props;
    Object.keys(events).forEach((eventName) => {
      this.#element?.addEventListener(eventName, events[eventName]);
    });
  }

  #removeEvents(): void {
    const { events = {} } = this.props;
    Object.keys(events).forEach((eventName) => {
      this.#element?.removeEventListener(eventName, events[eventName]);
    });
  }

  #getChildrenAndProps(propsAndChildren: TProps): { children: Children; props: TProps } {
    const children: Children = {};
    const props: Partial<TProps> = {};
    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value) && value.every((item) => item instanceof Block)) {
        children[key] = value as Block[];
      } else if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key as keyof TProps] = value as TProps[keyof TProps];
      }
    });
    return { children, props: props as TProps };
  }

  #componentDidMount(): void {
    this.componentDidMount();
    this.#eventBus.emit(BLOCK_EVENTS.FLOW_RENDER);
  }

  #componentDidUpdate(oldProps: TProps, newProps: TProps): void {
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps);
    if (shouldUpdate) {
      this.#eventBus.emit(BLOCK_EVENTS.FLOW_RENDER);
    }
  }

  #compile(): DocumentFragment {
    const propsAndStubs = { ...this.props };
    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key as keyof TProps] = child.map(
          (component) => `<div data-id="${component.#id}"></div>`,
        ) as TProps[keyof TProps];
      } else {
        propsAndStubs[key as keyof TProps] =
          `<div data-id="${child.#id}"></div>` as TProps[keyof TProps];
      }
    });

    const fragment = Block.createDocumentElement("template") as HTMLTemplateElement;
    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((component) => {
          const stub = fragment.content.querySelector(`[data-id="${component.#id}"]`);
          stub?.replaceWith(component.getContent() as Node);
        });
      } else {
        const stub = fragment.content.querySelector(`[data-id="${child.#id}"]`);
        stub?.replaceWith(child.getContent() as Node);
      }
    });

    return fragment.content;
  }

  #render(): void {
    this.#removeEvents();
    const block = this.#compile();

    if (this.#element?.children.length === 0) {
      this.#element.appendChild(block);
    } else {
      this.#element?.replaceChildren(block);
    }

    this.#addEvents();
  }

  protected init(): void {
    this.#createResources();
    this.#eventBus.emit(BLOCK_EVENTS.FLOW_CDM);
  }

  protected componentDidMount(_oldProps?: TProps): void {}

  protected componentDidUpdate(_oldProps: TProps, _newProps: TProps): boolean {
    return true;
  }

  protected render(): string {
    return "";
  }

  public addClassName(className: string) {
    this.#element?.classList.add(className);
  }

  public removeClassName(className: string) {
    this.#element?.classList.remove(className);
  }

  public dispatchComponentDidMount(): void {
    this.#eventBus.emit(BLOCK_EVENTS.FLOW_CDM);
  }

  public dispatchComponentDidUpdate(): void {
    this.#eventBus.emit(BLOCK_EVENTS.FLOW_CDU);
  }

  public setProps(nextProps: Partial<TProps>): void {
    if (!nextProps) return;
    const oldProps = JSON.parse(JSON.stringify(this.props)) as TProps;
    Object.assign(this.props, nextProps);
    this.#eventBus.emit(BLOCK_EVENTS.FLOW_CDU, oldProps, this.props);
  }

  public get element(): HTMLElement | null {
    return this.#element;
  }

  public getContent(): HTMLElement | null {
    return this.#element;
  }

  public addChild(name: string, child: Block<Props> | Block<Props>[]) {
    this.children[name] = child;
  }
}

export default Block;
