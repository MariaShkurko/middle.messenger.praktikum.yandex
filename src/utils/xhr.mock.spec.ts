import * as sinon from "sinon";

export class MockXMLHttpRequest {
  public open = sinon.spy();
  public setRequestHeader = sinon.spy();
  public send = sinon.spy();
  public withCredentials = false;
  public timeout = 0;
  public status = 0;
  public responseText = "";

  public dispatchEvent(event: { type: string }) {
    if (event.type === "load") this.onload?.();
    if (event.type === "error") this.onerror?.();
    if (event.type === "timeout") this.ontimeout?.();
  }

  public onload?: () => void;
  public onerror?: () => void;
  public ontimeout?: () => void;
}
