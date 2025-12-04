/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { expect } from "chai";
import * as sinon from "sinon";
import HTTP, { HTTPError } from "./HTTP";

describe("HTTP", () => {
  let http: HTTP;

  beforeEach(() => {
    http = new HTTP("/api");
  });

  afterEach(() => {
    sinon.restore();
  });

  const mockSuccessResponse = (xhr: XMLHttpRequest, data: unknown, status = 200) => {
    Object.defineProperty(xhr, "status", {
      value: status,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(xhr, "responseText", {
      value: JSON.stringify(data),
      writable: true,
      configurable: true,
    });
    return new Promise<void>((resolve) => {
      const loadHandler = () => {
        xhr.removeEventListener("load", loadHandler);
        resolve();
      };

      xhr.addEventListener("load", loadHandler);
      xhr.dispatchEvent(new window.Event("load"));
    });
  };

  const mockErrorResponse = (xhr: XMLHttpRequest, status: number, reason: string) => {
    Object.defineProperty(xhr, "status", {
      value: status,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(xhr, "responseText", {
      value: JSON.stringify({ reason }),
      writable: true,
      configurable: true,
    });
    return new Promise<void>((resolve) => {
      const loadHandler = () => {
        xhr.removeEventListener("load", loadHandler);
        resolve();
      };

      xhr.addEventListener("load", loadHandler);
      xhr.dispatchEvent(new window.Event("load"));
    });
  };

  const mockNetworkError = (xhr: XMLHttpRequest) => {
    return new Promise<void>((resolve) => {
      xhr.addEventListener("error", (event) => {
        Object.defineProperty(event, "target", {
          value: xhr,
          writable: true,
          configurable: true,
        });
        resolve();
      });
      xhr.dispatchEvent(new window.Event("error", { bubbles: true }));
    });
  };

  const mockTimeout = (xhr: XMLHttpRequest) => {
    return new Promise<void>((resolve) => {
      xhr.addEventListener("timeout", (event) => {
        Object.defineProperty(event, "target", {
          value: xhr,
          writable: true,
          configurable: true,
        });
        resolve();
      });
      xhr.dispatchEvent(new window.Event("timeout", { bubbles: true }));
    });
  };

  describe("#get", () => {
    it("отправляет GET-запрос с query-параметрами", async () => {
      const xhr = new XMLHttpRequest();
      const openSpy = sinon.spy(xhr, "open");
      sinon.stub(global, "XMLHttpRequest").returns(xhr);

      await http.get("/users", { data: { page: 1, limit: 10 } });

      expect(openSpy.called).to.be.true;
      expect(openSpy.calledWith("GET", "https://ya-praktikum.tech/api/users?page=1&limit=10")).to.be
        .true;
    });

    it("возвращает данные при успешном ответе (200)", async () => {
      const xhr = new XMLHttpRequest();
      sinon.stub(global, "XMLHttpRequest").returns(xhr);

      await mockSuccessResponse(xhr, { id: 1, name: "Alice" }, 200);

      const result = await http.get("/user/1");

      expect(result.success).to.be.true;
      expect(result.data).to.deep.equal({ id: 1, name: "Alice" });
    });
  });

  describe("#post", () => {
    it("отправляет POST-запрос с JSON-данными", async () => {
      const xhr = new XMLHttpRequest();
      const xhrOpenSpy = sinon.spy(xhr, "open");
      const xhrSetRequestHeaderSpy = sinon.spy(xhr, "setRequestHeader");
      const xhrSendSpy = sinon.spy(xhr, "send");
      sinon.stub(global, "XMLHttpRequest").returns(xhr);

      await http.post("/users", { data: { name: "Bob" } });

      expect(xhrOpenSpy.calledWith("POST", "https://ya-praktikum.tech/api/users")).to.be.true;
      expect(xhrSetRequestHeaderSpy.calledWith("Content-Type", "application/json")).to.be.true;
      expect(xhrSendSpy.called).to.be.true;
      expect(xhrSendSpy.callCount).to.equal(1);
      expect(xhrSendSpy.calledWith('{"name":"Bob"}')).to.be.true;
    });

    it("не устанавливает Content-Type для FormData", async () => {
      const xhr = new XMLHttpRequest();
      const xhrSetRequestHeaderSpy = sinon.spy(xhr, "setRequestHeader");
      const xhrSendSpy = sinon.spy(xhr, "send");
      sinon.stub(global, "XMLHttpRequest").returns(xhr);

      const formData = new FormData();
      formData.append("file", new Blob(["content"]), "test.txt");

      await http.post("/upload", { data: formData });

      expect(xhrSetRequestHeaderSpy.calledWith("Content-Type", "application/json")).to.be.false;
      expect(xhrSendSpy.called).to.be.true;
      expect(xhrSendSpy.callCount).to.equal(1);
      expect(xhrSendSpy.calledWith(formData)).to.be.true;
    });
  });

  describe("#put", () => {
    it("отправляет PUT-запрос", async () => {
      const xhr = new XMLHttpRequest();
      const xhrOpenSpy = sinon.spy(xhr, "open");
      const xhrSendSpy = sinon.spy(xhr, "send");
      sinon.stub(global, "XMLHttpRequest").returns(xhr);

      await http.put("/user/1", { data: { name: "Charlie" } });

      expect(xhrOpenSpy.calledWith("PUT", "https://ya-praktikum.tech/api/user/1")).to.be.true;
      expect(xhrSendSpy.called).to.be.true;
      expect(xhrSendSpy.callCount).to.equal(1);
      expect(xhrSendSpy.calledWith('{"name":"Charlie"}')).to.be.true;
    });
  });

  describe("#delete", () => {
    it("отправляет DELETE-запрос", async () => {
      const xhr = new XMLHttpRequest();
      const xhrOpenSpy = sinon.spy(xhr, "open");
      const xhrSendSpy = sinon.spy(xhr, "send");
      sinon.stub(global, "XMLHttpRequest").returns(xhr);

      await http.delete("/user/1");

      expect(xhrOpenSpy.calledWith("DELETE", "https://ya-praktikum.tech/api/user/1")).to.be.true;
      expect(xhrSendSpy.called).to.be.true;
      expect(xhrSendSpy.callCount).to.equal(1);
    });
  });

  describe("Обработка ответов", () => {
    it("обрабатывает 404 ошибку с reason", async () => {
      const xhr = new XMLHttpRequest();
      sinon.stub(global, "XMLHttpRequest").returns(xhr);

      await mockErrorResponse(xhr, 404, "Not found");

      const result = await http.get("/unknown");

      expect(result.success).to.be.false;
      expect(result.error).to.deep.equal({
        status: 404,
        message: "Not found",
        details: null,
      });
    });

    it("обрабатывает сетевую ошибку (onerror)", async () => {
      const xhr = new XMLHttpRequest();
      sinon.stub(global, "XMLHttpRequest").returns(xhr);

      await mockNetworkError(xhr); // Вызывает событие `error`

      try {
        await http.get("/user/1");
      } catch (error) {
        expect(error).to.be.instanceOf(HTTPError);
        expect((error as HTTPError).status).to.equal(500);
        expect((error as HTTPError).message).to.equal("Network Error");
        expect((error as HTTPError).details).to.equal(
          "Не удалось установить соединение с сервером",
        );
      }
    });

    it("обрабатывает таймаут (ontimeout)", async () => {
      const xhr = new XMLHttpRequest();
      sinon.stub(global, "XMLHttpRequest").returns(xhr);

      await mockTimeout(xhr); // Вызывает событие `timeout`

      try {
        await http.get("/slow", { timeout: 1000 });
      } catch (error) {
        expect(error).to.be.instanceOf(HTTPError);
        expect((error as HTTPError).status).to.equal(504);
        expect((error as HTTPError).message).to.equal("Request timed out");
        expect((error as HTTPError).details).to.equal("Запрос занял больше 1000 мс");
      }
    });

    it("корректно парсит не-JSON ответ (текст)", async () => {
      const xhr = new XMLHttpRequest();
      Object.defineProperty(xhr, "status", {
        value: 200,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(xhr, "responseText", {
        value: "OK",
        writable: true,
        configurable: true,
      });
      sinon.stub(global, "XMLHttpRequest").returns(xhr);

      const result = await http.get("/status");
      expect(result.success).to.be.true;
      expect(result.data).to.equal("OK");
    });
  });
});
