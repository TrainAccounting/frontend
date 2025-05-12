import style from './Button.module.css'

export default function Button ({children , href}) {
    return (

    <button> <a href = {href}> {children} </a></button>
    
    );
}
