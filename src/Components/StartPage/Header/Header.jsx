import React from 'react';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>WebHomeAccounting</div>
            <nav className={styles.navigation}>

                <a href="/entry">
                    <button className={styles.button}>Вход</button>
                </a>

                <a href = "/register">
                    <button className={`${styles.button} ${styles.primaryButton}`} >
                        Зарегистрироваться
                    </button>
                </a>

            </nav>
        </header>
    );
};