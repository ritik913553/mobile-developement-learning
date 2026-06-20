import { db } from "@/lib/db";

type ctx = {
    id:string
};

// GET single user
export async function GET(_req: Request, { id }: ctx) {
    try {
       
        if (isNaN(parseInt(id, 10))) {
            return Response.json({ error: "Invalid ID" }, { status: 400 });
        }

        const result = await db.execute({
            sql: "SELECT * FROM users_data WHERE id = ?;",
            args: [parseInt(id, 10)]
        });

        if (result.rows.length === 0) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        return Response.json({
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return Response.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

// PUT update user
export async function PUT(req: Request, { id }: ctx) {
    console.log(id)
    try {
       
        if (isNaN(parseInt(id, 10))) {
            return Response.json({ error: "Invalid ID" }, { status: 400 });
        }

        const body = await req.json();
        const { name, email, phone, avatar } = body;

        if (!name || !email) {
            return Response.json({ error: "Name and email are required" }, { status: 400 });
        }

        // Check if user exists
        const checkUser = await db.execute({
            sql: "SELECT * FROM users_data WHERE id = ?;",
            args: [parseInt(id, 10)]
        });
        if (checkUser.rows.length === 0) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        // Update user
        const result = await db.execute({
            sql: "UPDATE users_data SET name = ?, email = ?, phone = ?, avatar = ? WHERE id = ? RETURNING *;",
            args: [name, email, phone || null, avatar || null, id]
        });

        return Response.json({
            message: "User updated successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        console.error("Error updating user:", error);
        if (error.message && error.message.includes("UNIQUE constraint failed")) {
            return Response.json({ error: "Email already exists" }, { status: 409 });
        }
        return Response.json({ error: "Failed to update user" }, { status: 500 });
    }
}

// DELETE user
export async function DELETE( _req: Request, {  id }: ctx) {
    try {
       
        if (isNaN(parseInt(id, 10))) {
            return Response.json({ error: "Invalid ID" }, { status: 400 });
        }

        // Check if user exists
        const checkUser = await db.execute({
            sql: "SELECT * FROM users_data WHERE id = ?;",
            args: [parseInt(id, 10)]
        });
        if (checkUser.rows.length === 0) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        await db.execute({
            sql: "DELETE FROM users_data WHERE id = ?;",
            args: [parseInt(id, 10)]
        });

        return Response.json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return Response.json({ error: "Failed to delete user" }, { status: 500 });
    }
}