import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Login from './Components/Entry/Entry';
import Register from './Components/Register/Register';
import Records from './Components/Records/Records';
import Accounts from './Components/Accounts/Accounts';
import Deposits from './Components/Deposits/Deposits';
import Credits from './Components/Credits/Credits';
import Transactions from './Components/Transactions/Transactions';
import Restrictions from './Components/Restrictions/Restrictions';
import FinancialReport from './Components/FinancialReport/FinancialReport';
import Start from './Components/StartPage/StartPage';
import Header from './Components/Header/Header';
import RecordsHeader from './Components/RecordsHeader/RecordsHeader';
import RegularTransactions from './Components/Regular-Transaction/RegularTransaction';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Start />,
    },
    {
      path: '/entry',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/user/:userId',
      element: <Records />,
      //element: <UserProfile />,
    },
    {
      path: '/user/:userId/record/:recordId',
      element: (
        <>
          <Header text="Данные о записи" />
          <RecordsHeader />
          <Outlet /> {/* Добавлен для рендеринга дочерних маршрутов */}
        </>
      ),
      children: [
        {
          index: true,
          element: <Accounts />,
        },
        {
          path: 'accounts',
          element: <Accounts />,
        },
        {
          path: 'deposits',
          element: <Deposits />,
        },
        {
          path: 'credits',
          element: <Credits />,
        },
        {
          path: 'transactions',
          element: <Transactions />,
        },
        {
          path: 'ragular-transactions',
          element: <RegularTransactions />,
        },
        {
          path: 'restrictions',
          element: <Restrictions />,
        },
        {
          path: 'report',
          element: <FinancialReport />,
        },

      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;