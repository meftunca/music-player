import { observable, action, decorate} from "mobx"

class Store {
     open = false;
     openUpdate = (par) => this.open=par
}
decorate(
    Store,
    {
        open:observable,
        openUpdate:action
    }
)
const Search = new Store();

export default Search