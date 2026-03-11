/**
 * Better Auth ile uyumlu şifre hash (scrypt).
 * Sadece sunucu tarafında kullanın (admin şifre sıfırlama vb.).
 */
import { scryptAsync } from '@noble/hashes/scrypt.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import crypto from 'node:crypto';

const SCRYPT = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64,
  maxmem: 128 * 16384 * 16 * 2
} as const;

/**
 * Şifreyi Better Auth'ın kullandığı formatta hash'ler (salt:hexKey).
 */
export async function hashPasswordForBetterAuth(
  password: string
): Promise<string> {
  const saltBytes = crypto.randomBytes(16);
  const saltHex = bytesToHex(saltBytes);
  const key = await scryptAsync(password.normalize('NFKC'), saltHex, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
    dkLen: SCRYPT.dkLen,
    maxmem: SCRYPT.maxmem
  });
  return `${saltHex}:${bytesToHex(key)}`;
}
