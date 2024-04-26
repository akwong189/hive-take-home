import logo from './logo.svg';
import Dropdown from './dropdown/dropdown';

function App() {
  const options = ["test1", "test2", "test3", "test4"];
  const lotsOptions = [];

  for (let i = 0; i < 10000; i++) {
    lotsOptions.push(`test${i}`);
  }
  lotsOptions.push(`this is a long test of a long string to make sure that the string will be cut off`);

  return (
    <div className="App">
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        displayDirection: "row",
        gap: "40px",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}>
          <h1>{options.length} items (single)</h1>
          <Dropdown multiple={false} options={options} desc={"Random Desc"} />
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}>
          <h1>{options.length} items (multiple)</h1>
          <Dropdown multiple={true} options={options} desc={"Random Desc"} />
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}>
          <h1>{lotsOptions.length} items (single)</h1>
          <Dropdown multiple={false} options={lotsOptions} desc={"Long Random Desc"} />
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}>
          <h1>{lotsOptions.length} items (multiple)</h1>
          <Dropdown multiple={true} options={lotsOptions} desc={"Long Random Description that should be cut off"} />
        </div>
      </div>
      <img src={logo} alt="test logo"></img>
    </div>
  );
}

export default App;
