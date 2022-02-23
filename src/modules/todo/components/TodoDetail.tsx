import React from 'react'
import { ITodo } from '../../../models/todo'

interface TodoDetailProps {
    todoItem: ITodo;
}

export default function TodoDetail({ todoItem }: TodoDetailProps) {

    return (
        <div className="todo-detail__info">
            <div className="left">
                <img src={todoItem?.thumbnailUrl} alt="todo-img" />
            </div>
            <div className="right">
                <p><span>Album Id:</span> {todoItem?.albumId}</p>
                <p><span>Id:</span> {todoItem?.id}</p>
                <p><span>Title:</span> {todoItem?.title}</p>
            </div>
        </div>
    )
}