export default function ErrorMessage({ message }: { message?: string }) {
    return <span className="text-sm text-red-600">{message}</span>;
}