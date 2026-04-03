import { describe, expect, it, jest } from "@jest/globals";
import type { AuthSessionService } from "../../src/presentation/interfaces/AuthSessionService.js";

describe("AuthSessionService interface contract", () => {
  it("permite una implementación con createSession e invalidateSession", async () => {
    const createSession = jest.fn<
      (userId: string, roles: string[]) => Promise<string>
    >();
    const invalidateSession = jest.fn<(token: string) => Promise<void>>();

    createSession.mockResolvedValue("session-token");
    invalidateSession.mockResolvedValue();

    const service: AuthSessionService = {
      createSession,
      invalidateSession,
    };

    const token = await service.createSession("user-123", ["admin", "user"]);
    await service.invalidateSession(token);

    expect(token).toBe("session-token");
    expect(createSession).toHaveBeenCalledWith("user-123", ["admin", "user"]);
    expect(invalidateSession).toHaveBeenCalledWith("session-token");
  });
});
