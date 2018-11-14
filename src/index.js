import React from "react"
import ReactDOM from "react-dom"
import { Provider} from "mobx-react"
import Search from "./store/search"
import Player from "./store/player"
import Header from "./router/header"
import Loader from "./components/loader"
const Loading = () => (
	<Provider search={Search} player={Player}>
		<Header />
	</Provider>
)

// render(<LoadableComponent />, document.getElementById("root"))
ReactDOM.render(<Loading />, document.getElementById("root"))
module.hot.accept()
