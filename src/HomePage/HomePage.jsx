import style from './HomePage.module.css'
import TabRecords from  './TabRecords'


export default function HomePage(){
    return(
        <>
        <CreateNewAcc > Создать новый учёт</CreateNewAcc>
        <TabRecords />
        </>
    );

}

function CreateNewAcc({ children, onClick }){
    return (
    <button className={style.bigButton} onClick={onClick}>
      {children}
    </button>
  );
};




