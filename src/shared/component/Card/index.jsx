export function Card({className, children}) {
    return <div className={`rounded-[10px] shadow bg-white ${className}`}>{children}</div>
}