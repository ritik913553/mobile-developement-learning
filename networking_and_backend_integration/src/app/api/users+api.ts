import { db } from "@/lib/db";

// GET request handler
export async function GET() {
    try {
        const result = await db.execute("SELECT * FROM users_data ORDER BY id DESC;");
        return Response.json({
            data: result.rows
        });
    } catch (error) {
        console.error("Error fetching users", error);
        return Response.json({
            error: "Failed to fetch users"
        }, { status: 500 });
    }
}  

// POST request handler
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, avatar } = body;

        if (!name || !email) {
            return Response.json({
                error: "Name and email are required"
            }, { status: 400 });
        }

        const seed = name.trim().replace(/\s+/g, '-');
        const avatarUrl = avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;

        const result = await db.execute({
            sql: "INSERT INTO users_data (name, email, phone, avatar) VALUES (?, ?, ?, ?) RETURNING *;",
            args: [name, email, phone || null, avatarUrl]
        });

        return Response.json({
            message: "User created successfully",
            data: result.rows[0]
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating user:", error);
        if (error.message && error.message.includes("UNIQUE constraint failed")) {
            return Response.json({
                error: "Email already exists"
            }, { status: 409 });
        }
        return Response.json({
            error: "Failed to create user"
        }, { status: 500 });
    }
}