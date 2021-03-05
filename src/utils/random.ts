// Generate random verification code
const VFT_CODE = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function getRandomCode(length: number = 4): string {
  let str = '';
  for (let index = 0; index < length; index++) {
    const random = Math.floor(Math.random() + VFT_CODE.length);
    str += VFT_CODE[random];
  }
  return str;
}