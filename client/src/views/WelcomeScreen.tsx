export default function WelcomeScreen() {
    return <div className="h-full w-full flex flex-col gap-4 items-center justify-center" data-testid="welcome-screen">
        <h1 className="text-5xl font-bold">Welcome</h1>
        <p className="text-gray-500">Click on create chat or on existing chat to start chatting</p>
    </div>;
}