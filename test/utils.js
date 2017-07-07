export function testInProd(f) {
  process.env.NODE_ENV = "production";
  let res = f();
  process.env.NODE_ENV = "test";
  return res;
}
