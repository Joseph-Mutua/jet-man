import React from "react";
import carImage from "./assets/images/Img_06.png"
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="night">
        <div className="surface"></div>
        <div className="car">
          <img src={carImage} alt="car"/>
          </div>
      </div>
      <div><button className="m-5">Click me</button></div>
    </div>
  );
}

export default App;






// import React from "react";
// import "./App.css";
// import Car from "./components/Car";

// function App() {
//   return (
//     <div className="App">
//       <Car />
//     </div>
//   );
// }

// export default App;
