import { beforeEach, describe, expect, it, jest } from "@jest/globals";

describe("test_connection", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("hace query, loguea exito y cierra pool", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const queryMock = jest.fn<() => Promise<{ rows: Array<{ current_time: string }> }>>();
    const endMock = jest.fn<() => Promise<void>>();

    queryMock.mockResolvedValue({ rows: [{ current_time: "2026-04-03T00:00:00.000Z" }] });
    endMock.mockResolvedValue();

    jest.unstable_mockModule("../../src/infrastructure/database/pg-pool.js", () => ({
      pool: {
        query: queryMock,
        end: endMock,
      },
    }));

    await import("../../src/infrastructure/database/test_connection.js");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(queryMock).toHaveBeenCalledWith("SELECT NOW() as current_time");
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(String(logSpy.mock.calls[0][0])).toContain("exitosa");
    expect(logSpy.mock.calls[0][1]).toBe("2026-04-03T00:00:00.000Z");
    expect(errorSpy).not.toHaveBeenCalled();
    expect(endMock).toHaveBeenCalledTimes(1);
  });

  it("loguea error y siempre cierra pool", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const queryError = new Error("db down");
    const queryMock = jest.fn<() => Promise<{ rows: Array<{ current_time: string }> }>>();
    const endMock = jest.fn<() => Promise<void>>();

    queryMock.mockRejectedValue(queryError);
    endMock.mockResolvedValue();

    jest.unstable_mockModule("../../src/infrastructure/database/pg-pool.js", () => ({
      pool: {
        query: queryMock,
        end: endMock,
      },
    }));

    await import("../../src/infrastructure/database/test_connection.js");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(queryMock).toHaveBeenCalledWith("SELECT NOW() as current_time");
    expect(logSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(String(errorSpy.mock.calls[0][0])).toContain("Error");
    expect(errorSpy.mock.calls[0][1]).toBe(queryError);
    expect(endMock).toHaveBeenCalledTimes(1);
  });
});
