export interface RefreshTokenDto {
  refreshToken: string;
}

export function validateRefreshTokenDto(body: unknown): RefreshTokenDto {
  if (typeof body !== "object" || body === null) {
    throw new Error("Request body is missing");
  }

  const { refreshToken } = body as Record<string, unknown>;

  if (typeof refreshToken !== "string" || refreshToken.trim() === "") {
    throw new Error("refreshToken is required");
  }

  return { refreshToken: refreshToken.trim() };
}
