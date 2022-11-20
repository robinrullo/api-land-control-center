import {FC, useCallback, useEffect, useState} from "react";
import {Checkbox, Modal, Tag, TextArea, TextInput} from "carbon-components-react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ELocation} from "../components/Sidebar";
import {useForm} from "react-hook-form";
import {HttpClient} from "../core/httpClient/HttpClient";
import {IScript} from "../interfaces/script.interface";
import {useToastContext} from "../hooks/useToastContext";
import {ScriptsDataTable} from "../components/ScriptsDataTable";
import {WORKER_URL} from "../config";

export enum EScriptForm {
    NAME = 'script_name',
    CONTENT = "script_content",
    IS_ACTIVATED = "script_isActivated",
}

const formDefaultValues = {
    [EScriptForm.NAME]: '',
    [EScriptForm.CONTENT]: '',
    [EScriptForm.IS_ACTIVATED]: true
}

export const Scripts: FC<{}> = () => {
    const {pathname} = useLocation()
    const params = useParams<'id'>();
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}, watch, reset} = useForm<Record<EScriptForm, unknown>>({
        defaultValues: formDefaultValues
    })
    const [scriptsLoading, setScriptsLoading] = useState<boolean>(true);
    const [scripts, setScripts] = useState<IScript[]>([]);
    const [script, setScript] = useState<IScript>();
    const addToast = useToastContext()

    const action: 'CREATE' | 'EDIT' | 'DELETE' | 'VIEW' =
        pathname.startsWith(ELocation.NEW_SCRIPT) ? 'CREATE' :
            pathname.startsWith(ELocation.EDIT_SCRIPT) ? 'EDIT' :
                pathname.startsWith(ELocation.DELETE_SCRIPT) ? 'DELETE' :
                    'VIEW'

    useEffect(() => {
        if (scriptsLoading) return
        const script = scripts.find(s => s.id === parseInt(params.id!))!
        setScript(script)

        if (action === "EDIT" && !script) {
            navigate(ELocation.SCRIPTS_LIST)
        } else {
            if (script) {
                reset({
                    [EScriptForm.NAME]: script.name,
                    [EScriptForm.CONTENT]: script.content,
                    [EScriptForm.IS_ACTIVATED]: script.isActivated
                })
            } else {
                reset(formDefaultValues)
            }
        }

        if (action === 'DELETE' && !script) {
            navigate(ELocation.SCRIPTS_LIST)
        }
    }, [scripts, pathname])
    const getScripts = async (): Promise<IScript[]> => {
        return await HttpClient.get<IScript[]>({url: `${WORKER_URL}/api/scripts`})
    }

    const updateScriptsList = useCallback(() => {
        setScriptsLoading(true)
        getScripts()
            .then((scripts) => setScripts(scripts))
            .catch(err => addToast({
                role: "status",
                title: "Failed to get scripts",
                caption: `: ${err.message}`,
            }))
            .finally(() => {
                setScriptsLoading(false)
            })
    }, [getScripts, setScripts, setScriptsLoading])

    useEffect(() => {
        updateScriptsList()
    }, [])

    const onCreateScript = async (formValues: Record<EScriptForm, unknown>) => {
        setScriptsLoading(true)
        const method = action === 'CREATE' ? 'post' : 'put'
        const url: string = action === 'CREATE' ? `${WORKER_URL}/api/scripts` : `${WORKER_URL}/api/scripts/${script?.id}`
        HttpClient[method]<IScript>({
            url,
            body: {
                name: formValues[EScriptForm.NAME],
                content: formValues[EScriptForm.CONTENT],
                isActivated: formValues[EScriptForm.IS_ACTIVATED]
            }
        })
            .then((res) => {
                addToast({
                    role: "status",
                    kind: 'success',
                    title: `${action === 'CREATE' ? 'Create' : 'Update'} script`,
                    subtitle: `Script "${res.name}" successfully ${action === 'CREATE' ? 'created' : 'updated'}`,
                })
                navigate(ELocation.SCRIPTS_LIST)
            })
            .catch((err) => addToast({
                role: "status",
                title: action === 'CREATE' ? 'Create script' : 'Update script',
                subtitle: action === 'CREATE' ? 'Failed to create script' : 'Failed to update script',
                caption: `: ${err.message}`,
            }))
            .finally(() => updateScriptsList())
    }

    const onDelete = (script: IScript) => {
        setScriptsLoading(true)
        HttpClient.delete<IScript>({url: `${WORKER_URL}/api/scripts/${script.id}`})
            .then((res) => {
                addToast({
                    role: "status",
                    kind: 'success',
                    title: 'Delete script',
                    subtitle: `Script "${res.name}" successfully deleted`,
                })
                navigate(ELocation.SCRIPTS_LIST)
            })
            .catch((err) => addToast({
                role: "status",
                title: 'Delete script',
                subtitle: 'Failed to delete script',
                caption: `: ${err.message}`,
            }))
            .finally(() => updateScriptsList())
    }

    return (
        <>
            <ScriptsDataTable scripts={scripts} loading={scriptsLoading}/>

            {(action === 'CREATE' || script) &&
                <>
                    <Modal
                        open={['EDIT', 'CREATE'].includes(action)}
                        onRequestClose={() => navigate(ELocation.SCRIPTS_LIST)}
                        onRequestSubmit={handleSubmit(data => onCreateScript(data))}
                        modalHeading={action === 'CREATE' ? 'Add new Script' : 'Edit Script'}
                        modalLabel="Scripts"
                        primaryButtonText={action === 'CREATE' ? 'Add' : 'Save'}
                        secondaryButtonText="Cancel"
                        primaryButtonDisabled={scriptsLoading}>
                        <TextInput
                            {...register(EScriptForm.NAME, {required: true})}
                            data-modal-primary-focus
                            required
                            id="text-input-1"
                            labelText="Name"
                            placeholder="e.g. Snake Florent"
                            style={{marginBottom: '1rem'}}
                        />

                        <TextArea
                            {...register(EScriptForm.CONTENT, {required: true})}
                            required
                            labelText="Injection JS script"
                            placeholder="alert('foo')"
                            style={{marginBottom: '1rem'}}
                        />
                        <Checkbox
                            {...register(EScriptForm.IS_ACTIVATED, {required: true})}
                            required
                            defaultChecked
                            id={EScriptForm.IS_ACTIVATED}
                            labelText={watch(EScriptForm.IS_ACTIVATED) ? "Available" : "Disabled"}
                        />
                    </Modal>
                    <Modal
                        open={['DELETE'].includes(action)}
                        onRequestClose={() => navigate(ELocation.SCRIPTS_LIST)}
                        onRequestSubmit={() => onDelete(script!)}
                        modalHeading="Delete Script"
                        modalLabel="Scripts"
                        primaryButtonText="Delete"
                        secondaryButtonText="Cancel"
                        primaryButtonDisabled={scriptsLoading}>
                        Are you sure you want to delete the script
                        <Tag
                            className="some-class"
                            type="red"
                            size="sm"
                            title="Clear Filter"
                        >
                            {script?.name}
                        </Tag>
                    </Modal>
                </>
            }
        </>
    )
}
