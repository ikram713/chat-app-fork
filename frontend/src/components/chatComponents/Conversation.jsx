import { useEffect, useState, useRef, useContext } from 'react'
import { AiOutlineSend } from 'react-icons/ai'
import useMessages from '../../hooks/useMessages'
import { AuthenticationContext } from '../../context/AuthContext'
import { GroupsContext } from '../../context/GroupsContext'
import { MessagesContext } from '../../context/MessagesContext'
import { formatRelative, subDays } from 'date-fns'
import { IconContext } from 'react-icons'

function Conversation() {
    const targeRef = useRef(null)
    const { auth } = useContext(AuthenticationContext)
    const { activeGroup, groups } = useContext(GroupsContext)
    const [selectedGroup, setSelectedGroup] = useState('')
    const [SubmitMessages, setSubmitMessage] = useState(false)
    const { messages } = useContext(MessagesContext)
    const [message, setMessage] = useState('')
    const { createMessage } = useMessages()
    const handleSubmit = (e) => {
        e.preventDefault()
        handleSendMsg()
    }
    const handleSendMsg = () => {
        setSubmitMessage(true)
        createMessage(auth.user.id, activeGroup, message)
        setMessage('')
    }
    useEffect(() => {
        if (targeRef.current) {
            targeRef.current.scrollTop = targeRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        groups.map(e => {
            if (e.group_id === activeGroup) setSelectedGroup(e.group_name)
        })
    }, [activeGroup, groups])
    return (
        <div id="Conversation" className='flex flex-col flex-grow md:flex-grow-0  w-2/3 p-5 '>
            <div id="chatInfo" className='flex p-3 pt-0 justify-between border-b border-b-solid border-b-white'>
                <div id="friendInfo" className='font-bold text-2xl pb-5'>
                    <p>{selectedGroup}</p>
                </div>
            </div>
            <div id="convo" ref={targeRef} className='flex flex-grow flex-col gap-5 py-5 px-2 overflow-y-scroll'>
                {messages && messages.map((e, i) => {
                    return (<div key={i} className={`${auth.user.id === e.sender_id ? "msgLeft p-3 rounded-2xl gap-2 break-words" : "msgRight p-3 rounded-2xl break-words gap-2"}`}>
                        <div className=' border-b'>{e.message}</div>
                        <span className='text-red text-xs self-end mt-5'>{formatRelative(subDays(new Date(e.created_at), 0), new Date())}</span>
                    </div>)
                })}
            </div>
            <form onSubmit={(e) => { handleSubmit(e) }} className='flex justify-between gap-1'>
                <input value={message} type="text" maxLength={255} onChange={(e) => { setMessage(e.target.value) }} placeholder='Type a message...' className='p-4 rounded-2xl w-3/4 flex-grow outline-0' />
                <button className='text-2xl' onClick={handleSendMsg}>
                    <IconContext.Provider value={{ className: 'text-4xl' }}>
                        <AiOutlineSend />
                    </IconContext.Provider>
                </button>
            </form>
        </div >
    )
}

export default Conversation