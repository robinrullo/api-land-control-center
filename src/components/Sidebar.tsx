import {FC} from "react";
import {SideNav, SideNavItems, SideNavMenu, SideNavMenuItem} from "carbon-components-react";
import {Link, useLocation} from "react-router-dom";

export enum ELocation {
    HOME = "/",
    SCRIPTS_LIST = "/scripts",
    NEW_SCRIPT = "/scripts/new",
    EDIT_SCRIPT = "/scripts/edit",
    DELETE_SCRIPT = "/scripts/delete",
    INJECTION_STATUS = "/injection/status",
    API_COLLECTIONS = "/api/collections"
}

export const Sidebar: FC = () => {
    const {pathname} = useLocation()

    const isActive = (location: ELocation) => pathname === location

    return (
        <SideNav
            isFixedNav
            expanded={true}
            isChildOfHeader={false}
            aria-label="Side navigation">
            <SideNavItems>
                <SideNavMenuItem
                    // @ts-ignore
                    element={Link}
                    to={ELocation.HOME}
                    isActive={isActive(ELocation.HOME)}
                >
                    Home
                </SideNavMenuItem>
                <SideNavMenu title="Scripts" defaultExpanded={true}>
                    <SideNavMenuItem
                        // @ts-ignore
                        element={Link}
                        to={ELocation.SCRIPTS_LIST}
                        isActive={pathname.startsWith(ELocation.SCRIPTS_LIST)}
                    >
                        Script list
                    </SideNavMenuItem>
                </SideNavMenu>
                <SideNavMenu title="APIs" defaultExpanded={true}>
                    <SideNavMenuItem
                        // @ts-ignore
                        element={Link}
                        to={ELocation.INJECTION_STATUS}
                        isActive={isActive(ELocation.INJECTION_STATUS)}
                    >
                        Injection Status
                    </SideNavMenuItem>
                    <SideNavMenuItem
                        // @ts-ignore
                        element={Link}
                        to={ELocation.API_COLLECTIONS}
                        isActive={isActive(ELocation.API_COLLECTIONS)}
                    >
                        Collections
                    </SideNavMenuItem>
                </SideNavMenu>
            </SideNavItems>
        </SideNav>
    )
}
