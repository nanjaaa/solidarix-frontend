import { useState, useEffect, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "../../utils/ClassNames";
import { ChatBubbleAddressInput, isAddressValid } from "./ChatBubbleAddressInput";

interface ChatBubbleFormProps {
    question: string;
    type: "text" | "select" | "datetime" | "address";
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    placeholder: string;
    options?: string[];
}


export function ChatBubbleForm({
    question,
    value,
    onChange,
    onSend,
    placeholder,
    type = "text",
    options = []
}: ChatBubbleFormProps) {

    // Ref sur l'input
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputWidth, setInputWidth] = useState("150px");
    const [selected, setSelected] = useState<string>("");
    const [addressRaw, setAddressRaw] = useState("");

    useEffect(() => {
        const updateWidth = () => {
            if (!inputRef.current) return;

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (!context) return;

            const style = window.getComputedStyle(inputRef.current);
            const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            context.font = font;

            const placeholderText = placeholder;
            const text = value.length > 0 ? value : placeholderText;

            const textWidth = context.measureText(text).width + 30;

            const minWidth = 150;
            const maxWidth = 400;
            const newWidth = Math.min(Math.max(textWidth, minWidth), maxWidth);

            setInputWidth(`${newWidth}px`);
        };
        updateWidth(); // Appelé immédiatement au premier rendu
    }, [value, placeholder, type]);


    const isValid = () => {
        if (type === "text") return value.trim().length > 0;
        if (type === "select") return options.includes(value);
        if (type === "datetime") {
            const date = new Date(value);
            return !isNaN(date.getTime());
        }
        if (type === "address") {
            const matchi =  isAddressValid(value);
            console.log(matchi)
            return matchi
        }

        return false
    };


    const handleSelect = (option: string) => {
        onChange(option);
        setSelected(option);
    };


    return (
        <div className="card flex flex-col py-2 px-2">

            {/* Question à gauche */}
            <div className="self-start bg-primary-green text-white px-4 py-2 rounded-br-3xl rounded-tl-3xl rounded-tr-3xl max-w-[60%] shadow-md select-none">
                {question}
            </div>

            {/* Champ input + bouton à droite*/}
            {/*<div className="self-end flex flex-wrap items-end gap-2 mt-2 max-w-full" >*/}
            <div className="flex flex-row-reverse items-center gap-2 w-full">

                {type == "text" && (       
                    <textarea
                        ref={inputRef as unknown as React.RefObject<HTMLTextAreaElement>}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="order-2 w-[60%] min-h-[80px] max-h-[300px] bg-background-ow outline-none px-4 py-2 rounded-bl-3xl rounded-tr-3xl rounded-tl-3xl shadow-inner border border-gray-300 resize-none overflow-y-auto whitespace-pre-wrap"
                        autoFocus
                    />
                )}

                {type == "select" && (
                    <input
                        type="text"
                        ref={inputRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}                    
                        placeholder={placeholder}
                        className="order-2 bg-background-ow outline-none px-4 py-2 rounded-bl-3xl rounded-tr-3xl rounded-tl-3xl shadow-inner border border-gray-300"
                        style={{ width: inputWidth, minWidth: 150, maxWidth: 400 }}
                        autoComplete="off"
                        autoFocus
                    />
                )}

                {type === "datetime" && (
                    <input
                        type="datetime-local"
                        name="helpTime"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="order-2 bg-background-ow outline-none px-4 py-2 rounded-bl-3xl rounded-tr-3xl rounded-tl-3xl shadow-inner border border-gray-300 w-full max-w-[40%]"
                    />
                )}

                {type === "address" && (
                    <ChatBubbleAddressInput
                        value={value}
                        onChange={(val) => onChange(val)}
                        placeholder={placeholder}
                    />
                )}

                {isValid() && (
                <button
                    type="button"
                    onClick={onSend}
                    className="order-1 text-primary-green hover:text-hover-green transition-colors"
                    aria-label="Envoyer"
                >
                    <SendHorizontal className="w-7 h-7" />
                </button>
                )}

            </div>

            {/* Bulles options visibles en permanence */}
            {type === "select" && options.length > 0 && (
            <div className="self-center flex flex-wrap gap-2">
                {options.map((option) => (
                <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={cn(
                        "px-3 py-1 rounded-full border text-sm transition-colors",
                        value === option
                            ? "bg-primary-green text-white border-primary-green"
                            : "bg-muted text-gray-700 hover:bg-primary-green hover:text-white"
                    )}
                >
                    {option}
                </button>
                ))}
            </div>
            )}

        </div>
    );
}
        