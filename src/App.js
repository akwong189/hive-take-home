import logo from './logo.svg';
import Dropdown from './dropdown/dropdown';

function App() {
  // const options = ["test1", "test2", "test3", "test4"];
  const options = [];

  for (let i = 0; i < 20; i++) {
    options.push(`test${i}`)
  }

  return (
    <div className="App">
      <Dropdown multiple={true} options={options} tag={"Random Desc"} style={{
        display: 'flex',
        justifyContent: 'center',
        margin: "10px"
      }} />
      <img src={logo} alt="test logo"></img>
    </div>
  );
}

export default App;
