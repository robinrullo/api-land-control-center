import React, {FC, useEffect, useState} from "react";
import {
    Button, DataTableSkeleton,
    InlineLoading, Modal, Table, TableBody, TableCell,
    TableContainer, TableHead, TableHeader, TableRow,
    TableToolbar,
    TableToolbarContent, Tag, TextInput
} from "carbon-components-react";
import {HttpClient} from "../../core/httpClient/HttpClient";
import {APICollectionResource, APIResource} from "../../interfaces/api.interface";
import {WORKER_URL} from "../../config";
import {AddFilled, Edit, TrashCan} from "@carbon/icons-react";
import {Editor} from "../../components/Editor";
import {useForm} from "react-hook-form";
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';

export const APICollections: FC = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [APICollections, setAPICollections] = useState<APICollectionResource[] | null>(null)
    const [editorState, setEditorState] = useState<string | undefined>();
    const forms = {
        landForm: useForm<Record<keyof Omit<APICollectionResource, 'children'>, unknown>>(),
        collectionForm: useForm<Record<keyof APIResource, unknown>>(),
    }


    // Modals management
    const [landModalOptions, setLandModalOptions] = useState<{ open: boolean, data?: Omit<APICollectionResource, 'children'>, new?: boolean }>({open: false})
    const [collectionModalOptions, setCollectionModalOptions] = useState<{ open: boolean, data?: APIResource, parent?: APICollectionResource, new?: boolean }>({open: false})
    const [deleteModalOptions, setDeleteModalOptions] = useState<{ open: boolean, message: string, kind?: 'land' | 'collection', data?: APIResource | APICollectionResource, parent?: APICollectionResource }>({
        open: false,
        message: ''
    })

    useEffect(() => {
        HttpClient.get<APICollectionResource[]>({url: `${WORKER_URL}/api/apis`}).then((res) => {
            setAPICollections(res)
            setAPICollections(res)
        }).finally(() => setLoading(false))
    }, [])

    const onCreateCollection = (data: Record<keyof APIResource, unknown>) => {
        const {parent, new: isNew} = collectionModalOptions
        const method = isNew ? 'post' : 'put'

        HttpClient[method]<APIResource>({
            url: `${WORKER_URL}/api/apis/${parent?.name}${isNew ? '' : `/${data.name}`}`,
            body: {...data, content: JSON.parse(editorState || '')}
        }).then((res) => {
            const collections = APICollections!

            const parentIdx = collections.findIndex((collection) => collection.name === parent?.name)
            if (isNew) {
                const newCollections = [...collections]
                newCollections[parentIdx].children.push(res)
                setAPICollections(newCollections)
            } else {
                const newCollections = [...collections]
                const idx = newCollections[parentIdx].children.findIndex(c => c.name === parent?.name)
                collections[parentIdx].children[idx] = res
                setAPICollections(newCollections)
            }
        }).finally(() => {
            setCollectionModalOptions({
                open: false,
                data: undefined,
                parent: undefined,
                new: true
            })
            setEditorState(undefined)
        })
    }

    const onDelete = () => {
        const {kind} = deleteModalOptions

        if (kind === 'land') {
            HttpClient.delete<APICollectionResource>({url: `${WORKER_URL}/api/apis/${deleteModalOptions.data?.name}`}).then((res) => {
                setAPICollections((collections) => collections?.filter((collection) => collection.name !== res.name) || null)
            }).finally(() => setDeleteModalOptions({
                open: false,
                message: '',
                kind: undefined,
                data: undefined,
                parent: undefined
            }))
        } else if (kind === 'collection') {
            HttpClient.delete<APIResource>({url: `${WORKER_URL}/api/apis/${deleteModalOptions.parent?.name}/${deleteModalOptions.data?.name}`}).then((res) => {
                setAPICollections(
                    (coll) => coll?.map(
                        (c) => ({
                            ...c,
                            children: c.children.filter((child) => child.name !== res.name)
                        })
                    ) || null
                )
            }).finally(() => setDeleteModalOptions({
                open: false,
                message: '',
                kind: undefined,
                data: undefined,
                parent: undefined
            }))
        }
    }

    const onCreateLand = (data: Record<keyof Omit<APICollectionResource, 'children'>, unknown>) => {
        const {new: isNew} = landModalOptions
        const method = isNew ? 'post' : 'put'

        HttpClient[method]<APICollectionResource>({
            url: `${WORKER_URL}/api/apis/${isNew ? '' : `${data.name}`}`,
            body: {...data, children: []}
        }).then((res) => {
            setAPICollections([...(APICollections || []), res])
        }).finally(() => setLandModalOptions({
            open: false,
            data: undefined,
            new: true
        }))
    }

    const updateLandForm = (data?: Record<keyof APICollectionResource, unknown>) => {
        if (data) {
            forms.landForm.reset(data)
        } else {
            forms.landForm.reset({
                name: '',
                path: '',
            })
        }
    }
    const updateCollectionForm = (data?: Record<keyof APIResource, unknown>) => {
        if (data) {
            forms.collectionForm.reset(data)
            setEditorState(prettier.format(JSON.stringify(data.content), {
                parser: 'json',
                plugins: [parserBabel]
            }))
        } else {
            forms.collectionForm.reset({
                name: '',
                path: '',
            })
            setEditorState(undefined)
        }
    }

    const headers = ['Land', 'Collection', 'Actions']

    if (!APICollections && loading) return <DataTableSkeleton
        headers={headers.map(header => ({header}))}/>
    return (
        <>
            <TableContainer
                title="Injection status"
                description="Monitor the injection status on the API Land">
                <TableToolbar>
                    <TableToolbarContent>
                        {loading && <div><InlineLoading style={{height: '100%'}}/></div>}
                        <Button kind="primary" onClick={() => {
                            setLandModalOptions({
                                open: true,
                                data: undefined,
                                new: true
                            })
                            updateLandForm()
                        }
                        }>
                            Add a new Land
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
                        {APICollections?.map((s) => (
                            <TableRow key={s.name}>
                                <TableCell>{s.name}</TableCell>
                                <TableCell>
                                    {s.children.map((child) => (
                                        <Tag key={child.name} type={'high-contrast'} size="md"
                                             onClick={() => {
                                                 setCollectionModalOptions({
                                                     open: true,
                                                     data: child,
                                                     parent: s,
                                                     new: false
                                                 })
                                                    updateCollectionForm(child)
                                             }}>
                                            {child.name}
                                        </Tag>
                                    ))}
                                    <AddFilled color="var(--cds-button-primary, #0f62fe)"
                                               size={"20"}
                                               style={{verticalAlign: "inherit", cursor: "pointer"}}
                                               onClick={() => {
                                                   setCollectionModalOptions({
                                                       open: true,
                                                       data: undefined,
                                                       parent: s,
                                                       new: true
                                                   })
                                                    updateCollectionForm()
                                               }}/>
                                </TableCell>
                                <TableCell className="actions">
                                    <Button kind="danger--ghost" size="sm" hasIconOnly
                                            renderIcon={TrashCan}
                                            iconDescription={'Delete the Land'}
                                            tooltipPosition={'left'}
                                            onClick={() => setDeleteModalOptions({
                                                open: true,
                                                kind: 'land',
                                                message: `Delete the land ${s.name} ?`,
                                                data: s
                                            })}/>
                                    <Button kind={"primary"} size="sm" hasIconOnly
                                            renderIcon={Edit}
                                            iconDescription={'Edit the Land'}
                                            tooltipPosition={'left'}
                                            onClick={() => {
                                                setLandModalOptions({
                                                    open: true,
                                                    new: false,
                                                    data: s,
                                                })
                                                updateLandForm(s)
                                            }}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={collectionModalOptions.open}
                onRequestClose={() => {
                    setCollectionModalOptions({open: false, data: undefined})
                    updateCollectionForm()
                }}
                onRequestSubmit={forms.collectionForm.handleSubmit(data => onCreateCollection(data))}
                modalHeading={collectionModalOptions.new ? 'Add new Collection' : `Edit Collection "${collectionModalOptions.data?.name}" (${collectionModalOptions.parent?.name})`}
                modalLabel="API Collections"
                primaryButtonText={collectionModalOptions.new ? 'Add' : 'Save'}
                secondaryButtonText="Cancel"
                primaryButtonDisabled={loading}>
                <TextInput
                    {...forms.collectionForm.register('name', {required: true})}
                    data-modal-primary-focus
                    required
                    id="text-input-1"
                    labelText="Name"
                    placeholder="Tracteurs"
                    style={{marginBottom: '1rem'}}
                />
                <TextInput
                    {...forms.collectionForm.register('path', {required: true})}
                    data-modal-primary-focus
                    required
                    id="text-input-1"
                    labelText="Path"
                    placeholder="tracteurs"
                    style={{marginBottom: '1rem'}}
                />
                <Editor
                    onChange={(value) => setEditorState(value)}
                    value={editorState}
                    height={300}
                    lang="json"
                />
                <br/>
                {!collectionModalOptions.new &&
                    <Button kind={'danger'} onClick={() => {
                        setCollectionModalOptions({
                            open: false,
                            data: undefined,
                            parent: undefined,
                            new: true
                        })
                        setDeleteModalOptions({
                            open: true,
                            kind: 'collection',
                            message: `Delete the collection "${collectionModalOptions.data?.name}" (${collectionModalOptions.parent?.name}) ?`,
                            data: collectionModalOptions.data,
                            parent: collectionModalOptions.parent
                        })
                    }}>
                      <TrashCan/>
                      Delete the collection
                    </Button>
                }
            </Modal>
            <Modal
                open={landModalOptions.open}
                onRequestClose={() => setLandModalOptions({
                    open: false,
                    data: undefined,
                    new: true
                })}
                onRequestSubmit={forms.landForm.handleSubmit(data => onCreateLand(data))}
                modalHeading={landModalOptions.new ? 'Add new Land' : `Edit Land "${landModalOptions.data?.name}"`}
                modalLabel="API Collections"
                primaryButtonText={collectionModalOptions.new ? 'Add' : 'Save'}
                secondaryButtonText="Cancel"
                primaryButtonDisabled={loading}>
                <TextInput
                    {...forms.landForm.register('name', {required: true})}
                    data-modal-primary-focus
                    required
                    id="text-input-1"
                    labelText="Name"
                    placeholder="Tracteurs"
                    style={{marginBottom: '1rem'}}
                />
                <TextInput
                    {...forms.landForm.register('path', {required: true})}
                    data-modal-primary-focus
                    required
                    id="text-input-1"
                    labelText="Path"
                    placeholder="tracteurs"
                    style={{marginBottom: '1rem'}}
                />
            </Modal>
            <Modal
                open={deleteModalOptions.open}
                onRequestClose={() => setDeleteModalOptions({open: false, message: ''})}
                onRequestSubmit={() => onDelete()}
                modalHeading={`Delete the ${deleteModalOptions.kind === 'land' ? 'land' : 'collection'}`}
                modalLabel="API Collections"
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
                primaryButtonDisabled={loading}>
                {deleteModalOptions.message}
            </Modal>
        </>
    )
}
