import type { HTMLAttributes } from 'svelte/elements';
import 'katex/dist/katex.min.css';
interface Props extends HTMLAttributes<HTMLSpanElement> {
    text: string;
    class?: string;
    block?: boolean;
    lang?: string;
}
declare const FormattedText: import("svelte").Component<Props, {}, "">;
type FormattedText = ReturnType<typeof FormattedText>;
export default FormattedText;
