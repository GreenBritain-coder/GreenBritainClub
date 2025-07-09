export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (username === "admin" && password === "greenbritain2024") {
    return new Response(JSON.stringify({ token: "success" }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({ error: "Invalid credentials" }), {
    status: 401,
    headers: { "Content-Type": "application/json" }
  });
}
