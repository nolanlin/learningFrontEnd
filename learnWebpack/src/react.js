import React from "react";
import { render } from "react-dom";
import "./style.css";

const App = () => <div>App</div>;

render(<App />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept(App, () => {
    render(<App />, document.querySelector("#app"));
  });
}
// 如果 App 组件是外部文件创建的，通常写作（与import导入的路径一致）：
if (module.hot) {
  module.hot.accept(App, () => {
    render(<App />, document.querySelector("#app"));
  });
}
