import logo from './logo.svg';
import Dropdown from './dropdown/dropdown';

function App() {
  // const options = ["test1", "test2", "test3", "test4"];
  const options = [];

  for (let i = 0; i < 100; i++) {
    options.push(`test${i}`)
  }
  options.push(`jafklhiuh3eklglkjbadlhaioweasdaisghdjuakgwyuiegol`)

  return (
    <div className="App">
      <div style={{
        display: "flex",
        displayDirection: "column",
        gap: "40px",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Dropdown multiple={false} options={options} desc={"Random Desc"} />
        <Dropdown multiple={true} options={options} desc={"Random Desc"} />
      </div>
      <img src={logo} alt="test logo"></img>
    </div>
  );
}

export default App;
