import React from "react";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/LoginPage/LoginPage";




const Router = () => {
    return(
        <BrowserRouter>
            <App>
                <Routes>
                    <Route exact path="/"  element={<LoginPage/>}/>
                    <Route exact path="/login"  element={<LoginPage/>}/>
                </Routes>
            </App>
        </BrowserRouter>
    )
}

export default Router