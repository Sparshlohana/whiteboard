import { auth } from "@/auth";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

export async function POST(request) {
    const session = await auth();

    if (!session || !session.user) {
        return new Response("Unauthorized", { status: 403 });
    }

    const { room } = await request.json();
    if (!room) {
        return new Response("Room ID is required", { status: 400 });
    }


    const user = {
        id: session.user.email, // Using email as ID for simplicity
        info: {
            name: session.user.name,
            avatar: session.user.image,
        },
    };

    const sessionUser = liveblocks.prepareSession(
        user.id,
        { userInfo: user.info }
    );

    sessionUser.allow(room, sessionUser.FULL_ACCESS);

    const { status, body } = await sessionUser.authorize();

    return new Response(body, { status });
}
