import {FC} from "react";
import {
    Button,
    DataTableSkeleton, Link,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableHeader,
    TableRow, TableToolbar, TableToolbarContent
} from "carbon-components-react";
import {Edit, TrashCan, View} from "@carbon/icons-react"
import {IScript} from "../interfaces/script.interface";
import {useNavigate} from "react-router-dom";
import {ELocation} from "./Sidebar";
import {WORKER_URL} from "../config";

export type DataTableProps = {
    scripts: IScript[],
    loading: boolean
}
export const ScriptsDataTable: FC<DataTableProps> = ({loading, scripts}) => {

    const navigate = useNavigate()

    const headers: Array<keyof IScript> = ['id', 'name', 'isActivated'];

    const onAdd = () => {
        navigate(ELocation.NEW_SCRIPT)
    }
    const onEdit = (script: IScript) => {
        navigate(`${ELocation.EDIT_SCRIPT}/${script.id}`)
    }

    const onDelete = (script: IScript) => {
        navigate(`${ELocation.DELETE_SCRIPT}/${script.id}`)
    }

    if (loading) {
        return (
            <DataTableSkeleton/>
        )
    }

    return (
        <TableContainer
            title="Scripts"
            description="Add, Edit or Delete the scripts from the Random API LAND Injector application">
            <TableToolbar>
                <TableToolbarContent>
                    <Button onClick={onAdd}>
                        Add new
                    </Button>
                </TableToolbarContent>
            </TableToolbar>
            <Table size="md" useZebraStyles={false}>
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableHeader id={header} key={header}>
                                {header}
                            </TableHeader>
                        ))}
                        <TableHeader/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {scripts.map((script) => (
                        <TableRow key={script.id}>
                            {headers.map((key) => {
                                return <TableCell key={key}>{script[key]?.toString()}</TableCell>;
                            })}
                            <TableCell>
                                <Link
                                    href={`${WORKER_URL}/test/${script.id}`}
                                    target="_blank">
                                    <View/>
                                </Link>
                                <Edit onClick={() => onEdit(script)}/>
                                <TrashCan onClick={() => onDelete(script)}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
