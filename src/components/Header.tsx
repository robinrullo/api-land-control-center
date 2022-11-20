import {FC} from "react";
import {Header as CarbonHeader, HeaderGlobalBar, HeaderName} from "carbon-components-react";

export const Header: FC = () => {
    return (
        <CarbonHeader aria-label="IBM Platform Name">
            <HeaderName href="#" prefix="API Land">
                Control Center
            </HeaderName>
            <HeaderGlobalBar>
            </HeaderGlobalBar>
        </CarbonHeader>
    )
}
