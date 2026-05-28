import styles from "./Button.module.css";

function Button({
    children,
    onClick,
    type = "button",
}) {
    return (
        <button
            className={styles.button}
            type={type}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;