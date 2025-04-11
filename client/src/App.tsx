import { Switch, Route } from "wouter";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import Proposals from "./pages/Proposals";
import ProposalEditor from "./pages/ProposalEditor";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/templates" component={Templates} />
        <Route path="/templates/:id" component={ProposalEditor} />
        <Route path="/proposals" component={Proposals} />
        <Route path="/proposals/new" component={ProposalEditor} />
        <Route path="/proposals/:id" component={ProposalEditor} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
