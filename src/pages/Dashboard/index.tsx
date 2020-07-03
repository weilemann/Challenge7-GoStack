import React, { useState, useEffect } from 'react';

// import { FiChevronDown } from 'react-icons/fi';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  async function removeTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  }

  // async function sortTransactions(): Promise<void> {
  //   const sortedTransactions = transactions.sort((a, b) => {
  //     if (a.title > b.title) {
  //       return 1;
  //     }
  //     if (a.title < b.title) {
  //       return -1;
  //     }
  //     return 0;
  //   });
  //   setTransactions(sortedTransactions);
  // }

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const { data } = await api.get('/transactions');
      setTransactions(data.transactions);
      setBalance(data.balance);
    }

    loadTransactions();
  }, [transactions]);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              {formatValue(Number(balance.income))}
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {formatValue(Number(balance.outcome))}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {formatValue(Number(balance.total))}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  Título
                  {/* <span id="title" onClick={sortTransactions}>
                    <FiChevronDown />
                  </span> */}
                </th>
                <th>
                  Preço
                  {/* <span id="price" onClick={sortTransactions}>
                    <FiChevronDown />
                  </span> */}
                </th>
                <th>
                  Categoria
                  {/* <span id="category" onClick={sortTransactions}>
                    <FiChevronDown />
                  </span> */}
                </th>
                <th>
                  Data
                  {/* <span id="date" onClick={sortTransactions}>
                    <FiChevronDown />
                  </span> */}
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  {transaction.type === 'outcome' ? (
                    <td className={transaction.type}>
                      - {formatValue(transaction.value)}
                    </td>
                  ) : (
                    <td className={transaction.type}>
                      {formatValue(transaction.value)}
                    </td>
                  )}
                  <td>{transaction.category.title}</td>
                  <td>{formatDate(new Date(transaction.created_at))}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeTransaction(transaction.id)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
