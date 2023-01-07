import {FC} from "react";
import {ClickableTile, Column, Grid} from "carbon-components-react";
import {useNavigate} from "react-router-dom";
import {ELocation} from "../components/Sidebar";

export const Home: FC = () => {
    const navigate = useNavigate()
    return (
        <Grid fullWidth>
            <Column sm={4} md={4} lg={6} className="nav-card">
                <ClickableTile className="nav-content" onClick={() => {
                    navigate(ELocation.SCRIPTS_LIST)
                }}>
                    <h2 className="nav-title">Scripts</h2>
                    <p className="nav-description">Here, you can CRUD the scripts and try them.</p>
                </ClickableTile>
            </Column>
            <Column sm={4} md={4} lg={6} className="nav-card">
                <ClickableTile className="nav-content" onClick={() => {
                    navigate(ELocation.INJECTION_STATUS)
                }}>
                    <h2 className="nav-title">Injections</h2>
                    <p>There you make manage the XSS injections in the APIs. You can inject or reset
                        all APIs and check if injection still in.</p>
                </ClickableTile>
            </Column>
            <Column sm={4} md={4} lg={6} className="nav-card">
                <ClickableTile className="nav-content" onClick={() => {
                    navigate(ELocation.API_COLLECTIONS)
                }}>
                    <h2 className="nav-title">Collections</h2>
                    <p>Here, you can CRUD the collections of APIs.</p>
                </ClickableTile>
            </Column>
        </Grid>
    )
}
