import { STORE_EVENTS } from "../constants/STORE_EVENTS";
import type Block from "../core/Block";
import type { Props } from "../core/Block";
import store from "../store/Store";
import type { TIndexed } from "../types/TIndexed";
import isEqual from "./isEqual";

export function connect<TProps extends Props>(
  Component: typeof Block<TProps>,
  mapStateToProps: (state: TIndexed) => Partial<TProps>,
) {
  return class extends Component {
    private state: Partial<TProps>;

    constructor(tagName: string = "div", props: TProps = {} as TProps) {
      super(tagName, { ...props, ...mapStateToProps(store.getState()) });

      this.state = mapStateToProps(store.getState());

      store.on(STORE_EVENTS.UPDATED, () => {
        const newState = mapStateToProps(store.getState());

        if (!isEqual(this.state, newState)) {
          this.setProps({ ...newState });
        }

        this.state = newState;
      });
    }
  };
}
