import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Analytics from "./pages/Analytics/Analytics";
import ResetPage from "./pages/ResetPage/ResetPage";
import Board from "./pages/Board/Board";
import Layout from "./components/Layout/Layout";
import Test from "./components/Test/Test";
import { Toaster } from "react-hot-toast";
import ViewTodo from "./pages/ViewTodo/ViewTodo";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Board />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reset" element={<ResetPage />} />
          </Route>
            <Route path="/view/:todoId" element={<ViewTodoWrapper />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

const ViewTodoWrapper = () => {
  const { todoId } = useParams();
  return <ViewTodo todoId={todoId} />;
};
