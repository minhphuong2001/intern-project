import React, { useCallback, useState } from 'react'
import { ITodo } from '../../../models/todo';
import moment from 'moment'

interface TodoProps {
    todo: ITodo;
    title: string;
    index: number;
    setTitle: (index: number, title: string) => void;
}

function TodoForm({ todo, title, index, setTitle }: TodoProps) {
    const [isLabel, setIsLabel] = useState(true);
    const hour = moment().format('MMMM Do YYYY, h:mm:ss a');

    const handleOnChange = (e: any) => {
        setTitle(index, e.target.value);
    };
    
    
    return (
        <div className={`${+todo.id%2 === 0 ? 'todo bgc1' : 'todo bgc2'}`}>
            <div className="thumbnail">
                <img src={todo.thumbnailUrl} alt="thumbnail" />
            </div>
            <div className="info">
                {
                    isLabel ? (
                        <label
                            className='label'
                            onClick={() => setIsLabel(false)}
                        >
                            {title}
                        </label>) :
                        (<input
                            type="text"
                            className='input'
                            name='text'
                            value={title}
                            onChange={handleOnChange}
                            onBlur={() => setIsLabel(true)}
                        />)
                }
                <div className="time">{hour}</div>
            </div>
        </div>
    )
}

export default React.memo(TodoForm);