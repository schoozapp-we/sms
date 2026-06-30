declare module "bcryptjs" {
  export function hash(data: string, saltOrRounds: string | number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
}

declare module "jsonwebtoken" {
  export type Secret = string | Buffer;
  export interface SignOptions {
    expiresIn?: string | number;
  }

  export function sign(payload: string | object | Buffer, secretOrPrivateKey: Secret, options?: SignOptions): string;
  export function verify(token: string, secretOrPublicKey: Secret): string | object;
}
