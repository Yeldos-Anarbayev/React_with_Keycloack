const Button = ({className, prependIcon, appendIcon, btnText, onClick, type, ...props}) => {
    return (
        <button
            className={`${className} flex items-center justify-center py-1.5 px-5 rounded-md text-sm shadow`}
            type={type}
            onClick={onClick}
            {...props}
        >
            {prependIcon}
            {btnText}
            {appendIcon}
        </button>
    )
}

export { Button };
