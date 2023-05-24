import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { createTodo, updateTodo, getTodos, deleteTodo } from './api/todoApi';

export const TodoList = () => {
  const [newTodo, setNewTodo] = React.useState('');
  const queryClient = useQueryClient();
  //? fetching all todos query
  const {
    isLoading,
    isError,
    data: todos,
    error,
  } = useQuery('todos', getTodos, {
    select: (data) => data.sort((a, b) => b.id - a.id),
    //! disable cache if needed
    cacheTime: 0,
  });

  //? add single todo with mutation(change in todos / data)
  const addTodoMutation = useMutation(createTodo, {
    onSuccess: () => {
      //! invalidate the cache and refetch the todos
      queryClient.invalidateQueries('todos');
    },
  });

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      //! invalidate the cache and refetch the todos
      queryClient.invalidateQueries('todos');
    },
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      //! invalidate the cache and refetch the todos
      queryClient.invalidateQueries('todos');
    },
  });

  const newTodoHandler = (e) => {
    setNewTodo(e.target.value);
  };

  const handleCreateTodo = (e) => {
    e.preventDefault();
    addTodoMutation.mutate({ userID: 1, title: newTodo, completed: false });
    setNewTodo('');
  };

  //? create item component
  const NewItemSection = (
    <form onSubmit={handleCreateTodo}>
      <label htmlFor='new-todo'>enter new todo item</label>
      <div className='new-todo'>
        <input
          type='text'
          id='new-todo'
          value={newTodo}
          onChange={newTodoHandler}
          placeholder='Enter New Todo'
        />
      </div>
      <button>Add</button>
    </form>
  );

  if (isLoading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
  if (isError) return <p style={{ textAlign: 'center' }}>{error.message}</p>;

  return (
    <div>
      <h1>Todo List</h1>
      {NewItemSection}
      {todos.map((todo) => {
        return (
          <article key={todo.id}>
            <div className='todo'>
              <input
                type='checkbox'
                checked={todo.completed}
                id={todo.id}
                onChange={() => {
                  updateTodoMutation.mutate({
                    ...todo,
                    completed: !todo.completed,
                  });
                }}
              />
              <label htmlFor={todo.id}>{todo.title}</label>
            </div>
            <button
              onClick={() => {
                deleteTodoMutation.mutate({ id: todo.id });
              }}
            >
              Delete
            </button>
          </article>
        );
      })}
    </div>
  );
};
