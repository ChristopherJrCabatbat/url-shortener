// lib/slug.ts
import { customAlphabet } from "nanoid";
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nano = customAlphabet(alphabet, 6); // 6 chars default (changeable)


export function makeSlug(len = 6) {
return nano().substring(0, len);
}