import style from './SomeInfoCard.module.css'
import Imag from './Mavrody.jpg'

export default function Card () {
    return(
    <div className={style.card}>
        <img src= {Imag}  className = {style.cardImage}/>
        <div className = {style.cardContent}>
        <h2 className ={style.cardTitle}>WebHomeAccounting</h2>
        <p className ={style.cardText}> - это удобное приложение для контроля ваших финансов.</p>
    </div>
</div>
    );
}