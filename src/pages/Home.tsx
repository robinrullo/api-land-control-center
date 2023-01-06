import {FC} from "react";
import {ClickableTile, Column, Grid} from "carbon-components-react";
import {Link, useNavigate} from "react-router-dom";
import {ELocation} from "../components/Sidebar";

export const Home: FC = () => {
    const navigate = useNavigate()
    return (
        <Grid>
            <Column sm={{span: 6, offset: 0}}
                    md={{span: 6, offset: 1}}
                    lg={{span: 6, offset: 1}}
            >
                <ClickableTile onClick={() => {
                    navigate(ELocation.SCRIPTS_LIST)
                }}>
                    Scripts
                </ClickableTile>
            </Column>
            <Column sm={{span: 6, offset: 2}}
                    md={{span: 6, offset: 5}}
                    lg={{span: 6, offset: 8}}
            >
                <ClickableTile onClick={() => {
                    navigate(ELocation.INJECTION_STATUS)
                }}>
                    Injections
                </ClickableTile>
            </Column>
        </Grid>
    )
}
