// Helpers HTTP genéricos, usables desde los tests de cualquier feature.
export const jsonRequest = (method: string, body: unknown): RequestInit => ({
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
});
