import Route from "./Route";
import Block, { type Props } from "./Block";

export default class Router {
  private static __instance: Router | null = null;

  private routes: Route<Props>[] = [];
  private _currentRoute: Route<Props> | null = null;
  private readonly rootQuery: string;

  private constructor(rootQuery: string) {
    this.rootQuery = rootQuery;
  }

  public static getInstance(rootQuery: string): Router {
    if (!Router.__instance) {
      Router.__instance = new Router(rootQuery);
    }
    return Router.__instance;
  }

  public use<TProps extends Props>(
    pathname: string,
    block: new (props?: TProps) => Block<TProps>,
    props: TProps = {} as TProps,
  ): this {
    const route = new Route<TProps>(pathname, block, props);
    this.routes.push(route as unknown as Route<Props>);
    return this;
  }

  public init(): void {
    this._onRoute(window.location.pathname);
    window.onpopstate = () => this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string) {
    const route = this.getRoute(pathname);
    if (!route) return;

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render(this.rootQuery);
  }

  public go(pathname: string) {
    window.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  public back() {
    window.history.back();
  }

  public forward() {
    window.history.forward();
  }

  private getRoute(pathname: string): Route<Props> | undefined {
    return this.routes.find((route) => route.match(pathname));
  }
}
