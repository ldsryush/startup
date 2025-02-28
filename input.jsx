import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function InputForm() {
  const [rangeValue, setRangeValue] = useState(0);

  function handleRangeChange(event) {
    setRangeValue(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    alert('Form submitted!');
  }

  return (
    <div className="container">
      <h1>OyeeMarket</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor="text">Text: </label>
            <input type="text" id="text" name="varText" placeholder="your name here" required pattern="[Aa].*" />
          </li>
          <li>
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" name="varPassword" />
          </li>
          <li>
            <label htmlFor="email">Email: </label>
            <input type="email" id="email" name="varEmail" />
          </li>
          <li>
            <label htmlFor="textarea">TextArea: </label>
            <textarea id="textarea" name="varTextarea"></textarea>
          </li>
          <li>
            <label htmlFor="select">Select: </label>
            <select id="select" name="varSelect">
              <option>option1</option>
              <option selected>option2</option>
              <option>option3</option>
            </select>
          </li>
          <li>
            <label htmlFor="optgroup">OptGroup: </label>
            <select id="optgroup" name="varOptGroup">
              <optgroup label="group1">
                <option>option1</option>
                <option selected>option2</option>
              </optgroup>
              <optgroup label="group2">
                <option>option3</option>
                <option>option4</option>
              </optgroup>
              <optgroup label="group3">
                <option>option5</option>
                <option>option6</option>
              </optgroup>
            </select>
          </li>
          <li>
            <fieldset>
              <legend>checkbox</legend>
              <label htmlFor="checkbox1">checkbox1</label>
              <input type="checkbox" id="checkbox1" name="varCheckbox" value="checkbox1" defaultChecked />
              <label htmlFor="checkbox2">checkbox2</label>
              <input type="checkbox" id="checkbox2" name="varCheckbox" value="checkbox2" />
              <label htmlFor="checkbox3">checkbox3</label>
              <input type="checkbox" id="checkbox3" name="varCheckbox" value="checkbox3" />
              <label htmlFor="checkbox4">checkbox4</label>
              <input type="checkbox" id="checkbox4" name="varCheckbox" value="checkbox4" />
            </fieldset>
          </li>
          <li>
            <fieldset>
              <legend>radio</legend>
              <label htmlFor="radio1">radio1</label>
              <input type="radio" id="radio1" name="varRadio" value="radio1" defaultChecked />
              <label htmlFor="radio2">radio2</label>
              <input type="radio" id="radio2" name="varRadio" value="radio2" />
              <label htmlFor="radio3">radio3</label>
              <input type="radio" id="radio3" name="varRadio" value="radio3" />
              <label htmlFor="radio4">radio4</label>
              <input type="radio" id="radio4" name="varRadio" value="radio4" />
            </fieldset>
          </li>
          <li>
            <label htmlFor="file">File: </label>
            <input type="file" id="file" name="varFile" accept="image/*" multiple />
          </li>
          <li>
            <label htmlFor="search">Search: </label>
            <input type="search" id="search" name="varSearch" />
          </li>
          <li>
            <label htmlFor="tel">Tel: </label>
            <input type="tel" id="tel" name="varTel" placeholder="###-####" pattern="\d{3}-\d{4}" />
          </li>
          <li>
            <label htmlFor="url">URL: </label>
            <input type="url" id="url" name="varUrl" />
          </li>
          <li>
            <label htmlFor="number">Number: </label>
            <input type="number" name="varNumber" id="number" min="1" max="10" step="1" />
          </li>
          <li>
            <label htmlFor="range">Range: </label>
            <input type="range" name="varRange" id="range" min="0" max="100" step="1" value={rangeValue} onChange={handleRangeChange} />
            <output id="rangeOutput">{rangeValue}</output>
          </li>
          <li>
            <label htmlFor="progress">Progress: </label>
            <progress id="progress" max="100" value="75"></progress>
          </li>
          <li>
            <label htmlFor="meter">Meter: </label>
            <meter id="meter" min="0" max="100" value="50" low="33" high="66" optimum="50"></meter>
          </li>
          <li>
            <label htmlFor="datetime">DateTime: </label>
            <input type="datetime-local" name="varDatetime" id="datetime" />
          </li>
          <li>
            <label htmlFor="time">Time: </label>
            <input type="time" name="varTime" id="time" />
          </li>
          <li>
            <label htmlFor="month">Month: </label>
            <input type="month" name="varMonth" id="month" />
          </li>
          <li>
            <label htmlFor="week">Week: </label>
            <input type="week" name="varWeek" id="week" />
          </li>
          <li>
            <label htmlFor="color">Color: </label>
            <input type="color" name="varColor" id="color" defaultValue="#ff0000" />
          </li>
          <input type="hidden" id="secretData" name="varSecretData" value="1989 - the web was born" />
        </ul>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function App() {
  return <InputForm />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
