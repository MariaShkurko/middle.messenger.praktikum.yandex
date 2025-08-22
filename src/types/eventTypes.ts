import { BLOCK_EVENTS } from "../constants/BLOCK_EVENTS";

export interface IAppEvents<TProps = unknown> {
  [BLOCK_EVENTS.INIT]: [];
  [BLOCK_EVENTS.FLOW_CDM]: [];
  [BLOCK_EVENTS.FLOW_CDU]: [oldProps: TProps, newProps: TProps];
  [BLOCK_EVENTS.FLOW_RENDER]: [];
}
