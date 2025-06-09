import { useRef, useState } from "react";
import { SendHorizontal, X } from "lucide-react";
import { useAutoResizeTextarea } from "../../hooks/UseZutoResizeTextarea";

type Props = {
    onSubmit: (content: string) => void | Promise<void>;
    disabled?: boolean;
};

export default function CommentInput( { onSubmit, disabled  } : Props ) {
    const [value, setValue] = useState("");
    const textareaRef = useAutoResizeTextarea(value, 3);
    const [showSendButton, setShowSendButton] = useState(false);

    const handleInput = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
            const maxHeight = lineHeight * 3;

            textarea.style.height = "auto"; // reset
            textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        setShowSendButton(e.target.value.trim() !== "");
    };

    const handleCancel = () => {
        setValue("");
        setShowSendButton(false);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.blur();      // enlève le focus/cursor
        }
    };

    const handleSend = () => {
        if (onSubmit && value.trim() !== "") {
            onSubmit(value.trim());
            setValue("");
            setShowSendButton(false);
            if (textareaRef.current) {
                textareaRef.current.blur();
                textareaRef.current.style.height = "auto";
            }
        }
    };

    return (
        <div className="flex items-center bg-white w-full">
            <textarea
                ref={textareaRef}
                value={value}
                onInput={handleInput}
                onChange={handleChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }} 
                placeholder="Écrire un commentaire"
                rows={1}
                className="commentInput flex-1 outline-none text-sm resize-none overflow-hidden leading-tight min-h-[2.25rem] py-[0.5rem]"
            />
            {showSendButton && (

                <>

                    <button
                        type="button"
                        onClick={handleCancel}
                        aria-label="Annuler"
                        className="ml-2 flex-shrink-0 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>


                    <SendHorizontal
                        className="text-primary-green hover:text-hover-green ml-2 flex-shrink-0 cursor-pointer w-7 h-7"
                        onClick={handleSend}
                    />

                </>
                
            )}
        </div>
    );
}
