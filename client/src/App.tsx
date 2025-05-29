import { BrowserRouter } from "react-router-dom";
import Header from "./components/layout/header/Header";
import Page from "./components/layout/page/Page";
import { UserProvider } from "./contexts/UserContext";
import Routing from "./routing/Routing";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Header />
        <Page>
          <Routing />
        </Page>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
