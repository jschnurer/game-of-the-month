import Header from "./components/layout/header/Header";
import Page from "./components/layout/page/Page";
import Routing from "./routing/Routing";

function App() {
  return (
    <>
      <Header />
      <Page>
        <Routing />
      </Page>
    </>
  );
}

export default App;
