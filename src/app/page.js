import { auth, signIn, signOut } from "@/auth";
import CollaborativeWhiteboard from "@/components/CollaborativeWhiteboard";

export default async function Home() {
    const session = await auth();

    if (!session) {
        return (
            <main>
                <header className="landing-header">
                    <div className="container nav">
                        <div className="logo">
                            <span>✨</span> Whiteboard
                        </div>
                        <form
                            action={async () => {
                                "use server";
                                await signIn("google");
                            }}
                        >
                            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                                Sign In
                            </button>
                        </form>
                    </div>
                </header>

                <section className="hero-section">
                    <h1 className="main-title">
                        Ideate. Create.<br />
                        Collaborate.
                    </h1>
                    <p className="hero-subtitle">
                        The infinite canvas for creative teams. Brainstorm, design, and plan together in real-time with a powerful, intuitive whiteboard.
                    </p>

                    <form
                        action={async () => {
                            "use server";
                            await signIn("google");
                        }}
                    >
                        <button type="submit" className="btn-primary">
                            Get Started for Free <span>→</span>
                        </button>
                    </form>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3 className="feature-title">Real-time Sync</h3>
                            <p className="feature-desc">See changes instantly as your team works together from anywhere in the world.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎨</div>
                            <h3 className="feature-title">Infinite Canvas</h3>
                            <p className="feature-desc">Never run out of space. Our canvas grows with your ideas, letting you explore freely.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3 className="feature-title">Secure & Fast</h3>
                            <p className="feature-desc">Enterprise-grade security meets lightning-fast performance for seamless collaboration.</p>
                        </div>
                    </div>
                </section>
            </main>
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
