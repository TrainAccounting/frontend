import logo from './logo.svg';
//import './App.css';

import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';

import Header from './FirstPage/Header'
import Button from './DefaultButton/Button';
import style from './DefaultButton/Button.module.css'
import Card from './FirstPage/SomeInfoCard'
import AdCard from './FirstPage/AdvertisingCard';
import Register from './Register/RegisterPage'
import Entry from './Entry/Entry';
import HomePage from './HomePage/HomePage'


function App() {
  return (

    <Routes>
      <Route path = '/' element = { <> <Header /> <Card /> <AdCard />  </>} ></Route>
      <Route path = '/register' element = {<Register />} ></Route>
      <Route path = '/entry' element = {<Entry />} ></Route>
      <Route path = '/homePage' element = { <HomePage />}></Route>
    </Routes>
  );
}

export default App;


