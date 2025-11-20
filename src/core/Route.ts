import Block, { type Props } from "./Block";
import renderDOM from "./renderDOM";

export default class Route<TProps extends Props> {
  private _pathname: string;
  private _blockClass: new (props?: TProps) => Block<TProps>;
  private _block: Block<TProps> | null = null;
  private _props: TProps;

  constructor(pathname: string, view: new (props?: TProps) => Block<TProps>, props: TProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._props = props;
  }

  match(pathname: string) {
    return pathname === this._pathname;
  }

  leave() {
    this._block?.getContent()?.remove();
    this._block = null;
  }

  render(rootQuery: string) {
    if (!this._block) {
      this._block = new this._blockClass(this._props);
      renderDOM(this._block, rootQuery);
    }
  }
}
