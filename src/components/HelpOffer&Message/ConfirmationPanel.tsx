interface ConfirmationPanelProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationPanel({ message, onConfirm, onCancel }: ConfirmationPanelProps) {
    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <span className="text-secondary-lightgray text-center italic text-sm px-2">
                {message}
            </span>
            <div className="flex gap-4">
                <button
                    className="btn-secondary"
                    onClick={onConfirm}
                >
                    Oui
                </button>
                <button
                    className="btn btn-base"
                    onClick={onCancel}
                >
                    Non
                </button>
            </div>
        </div>
    );
}
