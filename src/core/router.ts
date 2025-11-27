import Route from "./Route";
import Block, { type Props } from "./Block";
import { ROUTES } from "../constants/ROUTES";

interface RouteInfo<TProps extends Props> {
  route: Route<TProps>;
  guard?: () => boolean;
}

export default class Router {
  private static __instance: Router | null = null;

  private routes: RouteInfo<Props>[] = [];
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
    block: new (tagName?: string, props?: TProps) => Block<TProps>,
    props: TProps = {} as TProps,
    tagName: string = "div",
    guard?: () => boolean,
  ): this {
    const route = new Route<TProps>(pathname, block, props, tagName);
    this.routes.push({ route: route as unknown as Route<Props>, guard });
    return this;
  }

  public init(): void {
    this._onRoute(window.location.pathname);
    window.onpopstate = () => this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string) {
    const routeInfo = this.getRouteInfo(pathname);
    if (!routeInfo) return;

    const { route, guard } = routeInfo;

    if (guard && !guard()) {
      if (pathname !== ROUTES.SIGN_IN) {
        this.go(ROUTES.SIGN_IN);
      }
      return;
    }

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

  private getRouteInfo(pathname: string): RouteInfo<Props> | undefined {
    return this.routes.find((info) => info.route.match(pathname));
  }

  public isInitialized(): boolean {
    return this._currentRoute !== null;
  }
}
