import { auth, signIn, signOut } from "@/auth";
import CollaborativeWhiteboard from "@/components/CollaborativeWhiteboard";

export default async function Home() {
    const session = await auth();

    if (!session) {
        return (
            <div className="login-screen">
                <h1 className="login-title">Collaborative Whiteboard</h1>
                <form
                    action={async () => {
                        "use server";
                        await signIn("google");
                    }}
                >
                    <button type="submit" className="google-btn">
                        Sign in with Google
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <div className="auth-overlay">
                <div className="user-info">
                    {session.user?.image && (
                        <img
                            src={session.user.image}
                            alt={session.user.name}
                            className="user-avatar"
                        />
                    )}
                    <span className="user-name">{session.user?.name}</span>
                </div>
                <form
                    action={async () => {
                        "use server";
                        await signOut();
                    }}
                >
                    <button type="submit" className="sign-out-btn">
                        Sign Out
                    </button>
                </form>
            </div>
            <CollaborativeWhiteboard />
        </div>
    );
}
