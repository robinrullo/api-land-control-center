import {FC, useCallback, useEffect, useState} from "react";
import {APICollectionResource} from "../interfaces/api.interface";
import {HttpClient} from "../core/httpClient/HttpClient";
import {
    Button, InlineLoading,
    Table, TableBody, TableCell, TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    TableToolbar,
    TableToolbarContent, Tag
} from "carbon-components-react";
import {API_LAND_URL, INJECTED_CHECK_REGEXP, INJECTION_CHECK_INTERVAL, WORKER_URL} from "../config";


export const InjectionStatus: FC = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [status, setStatus] = useState<{ name: string, children: { name: string, status: boolean }[] }[]>([])
    const [APICollections, setAPICollections] = useState<APICollectionResource[]>([])

    const isInjected = (res: string): boolean => res.search(INJECTED_CHECK_REGEXP) !== -1

    const updateStatus = (apis: APICollectionResource[]) => {
        setLoading(true)
        return Promise.all(apis.map(async api => ({
            name: api.name,
            children: await Promise.all(api.children.map(async child => ({
                name: child.name,
                status: await HttpClient.get({url: `${API_LAND_URL}/${api.path}/${child.path}`}).then((res) => isInjected(JSON.stringify(res)))
            })))
        })))
        .then((value) => setStatus(value))
        .finally(() => setLoading(false))
    }

    useEffect(() => {
        HttpClient.get<APICollectionResource[]>({url: `${WORKER_URL}/api/apis`}).then((res) => {
            setAPICollections(res)
            updateStatus(res)
        })
        const updateInterval = setInterval(() => updateStatus(APICollections), INJECTION_CHECK_INTERVAL)
        return () => clearInterval(updateInterval)
    }, [])

    const injectAll = useCallback(() => {
            setLoading(true)
            HttpClient.get({url: `${WORKER_URL}/api/inject/all`})
            .then(() => updateStatus(APICollections))
        },
        [updateStatus]
    )

    const resetAll = useCallback(() => {
            setLoading(true)

            HttpClient.get({url: `${WORKER_URL}/api/inject/resetAll`})
            .then(() => updateStatus(APICollections))
        },
        [updateStatus]
    )

    const headers = ['Land', 'API 1', 'API 2']
    return (
        <TableContainer
            title="Injection status"
            description="Monitor the injection status on the API Land">
            <TableToolbar>
                <TableToolbarContent>
                    {loading && <div><InlineLoading style={{height: '100%'}}/></div>}
                    <Button kind="secondary" onClick={resetAll}>
                        Reset All APIs
                    </Button>
                    <Button kind="primary" onClick={injectAll}>
                        Inject All APIs
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {status.map((s) => (
                        <TableRow key={s.name}>
                            <TableCell>{s.name}</TableCell>
                            {s.children.map((child) => (
                                <TableCell key={child.name}>
                                    <Tag type={child.status ? 'green' : 'red'} size="md">
                                        {child.name}
                                    </Tag>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
