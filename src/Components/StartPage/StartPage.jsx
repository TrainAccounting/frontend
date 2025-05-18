import Header from "./Header/Header";
import Card from "./Card/Card";
import image from "./Card/MMM.jpg"
import image2 from "./Card/MMM2.jpg"
import image3 from "./Card/MMM3.jpg"

export default function Start() {

    return (
        <>
            <Header />
            <Card image={image}
                title="Первая в мире Онлайн Домашняя Бухгалтерия"
                description="Мы создаём инновационное веб-приложение для удобного контроля ваших финансов."
                marginLeft={40}
                marginTop={40}
            />

            <Card image={image2}
                title="Наши преимущества:"
                description=" - Конфиденциальность               - Я больше не прилумал"

                marginLeft={40}
                marginTop={80} 
            />

            <Card image={image3}
                title="Наш генеральный директор и основатель компании: "
                description=" - Виталий Цаль"

                marginLeft={40}
                marginTop={80} 
            />

        </>
    );
}