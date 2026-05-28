import styles from "./Input.module.css";

function Input({
    type = "text",
    placeholder,
    value,
    onChange,
}) {
    return (
        <input
            className = {styles.input}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
}

export default Input;