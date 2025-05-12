import style from './Header.module.css';
import Button from '../DefaultButton/Button';

export default function Header() {
    return (
        <div className={style.headerContainer}>
            <h1 className={style.name}>WebHomeAccounting</h1>
            <div className={style.buttons}>
                            <Button href = 'entry'>Войти</Button>
                            <Button href = 'register'>Зарегистрироваться</Button>
                </div>
        </div>
    );
}