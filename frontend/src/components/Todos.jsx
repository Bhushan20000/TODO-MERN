import React, { useContext, useRef, useState } from 'react';
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdOutlineDownloadDone } from "react-icons/md";
import TodosContext from '../context/TodosContext';

function Todos({ todo:t }) {

    const [edit, setEdit] = useState(false);
    const [todo, setTodo] = useState("");

    const input = useRef("");
    const p = useRef("");

    const { dispatch } = useContext(TodosContext);

    const deleteTodo = async () => {
        const response = await fetch("http://localhost:4000/api/todos/"+ t._id, {
            method: "DELETE",
        });

        const json = await response.json();

        if (!response.ok) {
            console.log(json.error)
        }

        if (response.ok) {
            dispatch({type: "DELETE_TODO", payload: json});
        }
    }

    const handleDone = () => {
        p.current.classList.toggle("line")
    }

    const editTodo = async () => {
       const response = await fetch("http://localhost:4000/api/todos/"+ t._id);
       const json = await response.json();

       if (!response.ok) {
        console.log(json.error)
       }

       if (response.ok) {
            setEdit(true);
            setTodo(json.todo);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:4000/api/todos/" + t._id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({todo})
        });

        const json = await response.json();

        if (!response.ok) {
            console.log(json.error);
        }

        if (response.ok) {
            setEdit(false);
            dispatch({type: "UPDATE_TODO", payload: json, newTodo: todo});
        }
    }
    return (
        <div className='parent-todo'>
            { edit ? <form onSubmit={handleSubmit}>
                        <input ref={input} type="text" value={todo} onChange={e => setTodo(e.target.value)} />
                        <button>Done</button>
                    </form>
            
            : <div className='todo-container'>
                <div className='todos'>
                    <p ref={p}>{t.todo}</p>
                    <div>
                        <AiFillEdit size={25} cursor="pointer" title='Edit' onClick={editTodo} />
                        <AiFillDelete onClick={deleteTodo} size={25} cursor="pointer" title='Delete' />
                        <MdOutlineDownloadDone onClick={handleDone} size={25} cursor="pointer" title='Done' />
                    </div>
                </div>
                <span>{t.createdAt}</span>
            </div> }
        </div>
    );
}

export default Todos;