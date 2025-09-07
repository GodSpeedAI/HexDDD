export type ValidationError = { type: 'ValidationError'; message: string };
export type NetworkError = { type: 'NetworkError'; message: string };
export type UnexpectedError = { type: 'UnexpectedError'; message: string };
export type AppError = ValidationError | NetworkError | UnexpectedError;

