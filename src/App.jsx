import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
// import RegisterPage from "./pages/RegisterPage/RegisterPage";
// import LoginPage from "./pages/LoginPage/LoginPage";
// import Analytics from "./pages/Analytics/Analytics";
// import ResetPage from "./pages/ResetPage/ResetPage";
// import Board from "./pages/Board/Board";
// import Layout from "./components/Layout/Layout";
// import Test from "./components/Test/Test";
// import ViewTodo from "./pages/ViewTodo/ViewTodo";
import { Suspense, lazy } from "react";

const RegisterPage = lazy(() => import("./pages/RegisterPage/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const Analytics = lazy(() => import("./pages/Analytics/Analytics"));
const ResetPage = lazy(() => import("./pages/ResetPage/ResetPage"));
const Board = lazy(() => import("./pages/Board/Board"));
const Layout = lazy(() => import("./components/Layout/Layout"));
const Test = lazy(() => import("./components/Test/Test"));
const ViewTodo = lazy(() => import("./pages/ViewTodo/ViewTodo"));

import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/test" element={<Test />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<ProtectedRoute element={Board} />} />
              <Route
                path="analytics"
                element={<ProtectedRoute element={Analytics} />}
              />
              <Route
                path="reset"
                element={<ProtectedRoute element={ResetPage} />}
              />
            </Route>
            <Route path="/view/:todoId" element={<ViewTodoWrapper />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;

const ViewTodoWrapper = () => {
  const { todoId } = useParams();
  return <ViewTodo todoId={todoId} />;
};
