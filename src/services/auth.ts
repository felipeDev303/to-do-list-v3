export async function fakeLogin(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 700)); // simulación delay
  return email === "admin@demo.com" && password === "123456";
}
