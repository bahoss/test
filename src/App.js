import React, { Component } from "react";
import "./App.css";
import { async } from "q";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      position: "",
      results: [],
      quiz: [],
      currentPage: 1,
      currentQuiz: 0,
      points: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch(`/result`)
      .then(response => response.json())
      .then(state => this.setState({ results: state }));

    fetch(`/api`)
      .then(response => response.json())
      .then(state => this.setState({ quiz: state }));
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {}

  setPage = page => {
    this.setState({ currentPage: page });
  };

  runTest = () => {
    const { name, position } = this.state;
    let submitDisabled = name.length > 0 && position.length > 0;
    if (submitDisabled) {
      this.setState({ currentQuiz: 1 });
    }
  };

  sendData = async () => {
    const { name, position, results, points } = this.state;
    let newResult = { name, position, points };
    let copyResult = [...results, newResult];
    await fetch("/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(copyResult)
    });
    this.setState({ results: copyResult });
  };

  setAnswer = async (answer, rightAnswer) => {
    const { currentQuiz, points } = this.state;
    if (answer === rightAnswer) {
      await this.setState({ points: points + 1 });
    }
    if (currentQuiz < 8) {
      this.setState({ currentQuiz: currentQuiz + 1 });
    }
    if (currentQuiz === 5) {
      this.sendData();
    }
  };

  render() {
    const {
      name,
      position,
      results,
      quiz,
      currentPage,
      currentQuiz,
      points
    } = this.state;
    let submitDisabled = name.length > 0 && position.length > 0;

    return (
      <div className="App">
        <div className="header">
          <input
            type="button"
            className={currentPage === 1 ? "active" : "notActive"}
            value="Тест"
            onClick={() => this.setPage(1)}
          />
          <input
            type="button"
            className={currentPage === 2 ? "active" : "notActive"}
            value="Результаты"
            onClick={() => this.setPage(2)}
          />
        </div>
        {currentPage === 1 ? (
          currentQuiz === 0 ? (
            <>
              <form className="forms" onSubmit={this.handleSubmit}>
                <label htmlFor="name">Ваше имя: </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={this.handleChange}
                />
                <label htmlFor="name">Должность: </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={position}
                  onChange={this.handleChange}
                />
                <input
                  type="button"
                  className={submitDisabled ? "submit" : "submit notSubmit"}
                  value="Вперед"
                  onClick={this.runTest}
                />
              </form>
            </>
          ) : currentQuiz < 6 ? (
            <div className="quiz">
              <h3>{quiz[currentQuiz - 1].question}</h3>
              <div className="answers">
                {quiz[currentQuiz - 1].answers.map((answer, index) => (
                  <span
                    className="answer"
                    onClick={() =>
                      this.setAnswer(
                        index,
                        quiz[currentQuiz - 1].rightAnswer - 1
                      )
                    }
                  >
                    {answer}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="message">
              {points < 3 ? "Тест провален" : "Тест пройден"}
            </div>
          )
        ) : (
          <div className="resTable">
            <table id="customers">
              <tr>
                <th>Имя</th>
                <th>Должность</th>
                <th>Баллы</th>
                <th>Результат</th>
              </tr>
              {results.length > 0 ? (
                results.map(item => (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.position}</td>
                    <td>{item.points}</td>
                    <td>
                      {item.points < 3 ? "Тест провален" : "Тест успешно сдан"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>Пока нет результатов</td>
                </tr>
              )}
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default App;
