import './App.scss'
import {HashRouter, Route, Routes} from "react-router-dom";
import {Scripts} from "./pages/Scripts";
import {Home} from "./pages/Home";
import {Header} from "./components/Header";
import {ELocation, Sidebar} from "./components/Sidebar";
import {InjectionStatus} from "./pages/InjectionStatus";
import {ToastContextProvider} from "./contexts/ToastContextProvider";

function App() {

    return (
        <>
            <HashRouter>
                <ToastContextProvider>
                    <Header/>
                    <Sidebar/>
                    <main className="main-content">

                        <Routes>
                            <Route path={ELocation.HOME} element={<Home/>}/>
                            <Route path={ELocation.SCRIPTS_LIST} element={<Scripts/>}/>
                            <Route path={ELocation.NEW_SCRIPT} element={<Scripts/>}/>
                            <Route path={`${ELocation.EDIT_SCRIPT}/:id`} element={<Scripts/>}/>
                            <Route path={`${ELocation.DELETE_SCRIPT}/:id`} element={<Scripts/>}/>
                            <Route path={ELocation.INJECTION_STATUS} element={<InjectionStatus/>}/>
                        </Routes>
                    </main>
                </ToastContextProvider>
            </HashRouter>
        </>
    )
}

export default App
